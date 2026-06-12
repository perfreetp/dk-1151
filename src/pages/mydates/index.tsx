import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Meal } from '../../types';
import { mealStore, userStore } from '../../utils/store';
import styles from './index.module.scss';

const MyDatesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'pending' | 'past'>('upcoming');
  const [myMeals, setMyMeals] = useState<Meal[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    cancelled: 0,
    noShow: 0,
    rating: 4.8
  });

  useEffect(() => {
    loadMyMeals();
  }, []);

  const loadMyMeals = () => {
    const currentUser = userStore.getCurrentUser();
    const allMeals = mealStore.getAll();
    
    const userMeals = allMeals.filter(meal => 
      meal.creator.id === currentUser.id || 
      meal.participants.some(p => p.id === currentUser.id)
    );
    
    setMyMeals(userMeals);

    const completedMeals = userMeals.filter(m => m.status === 'completed').length;
    const cancelledMeals = userMeals.filter(m => m.status === 'cancelled' && m.cancelledType === 'self').length;
    const noShowMeals = userMeals.filter(m => m.status === 'cancelled' && m.cancelledType === 'noShow').length;

    let totalRating = 0;
    let ratingCount = 0;
    userMeals.forEach(meal => {
      if (meal.ratings && meal.ratings.length > 0) {
        meal.ratings.forEach(r => {
          totalRating += r.rating;
          ratingCount++;
        });
      }
    });
    const avgRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : '4.8';

    setStats({
      total: userMeals.length,
      completed: completedMeals,
      cancelled: cancelledMeals,
      noShow: noShowMeals,
      rating: parseFloat(avgRating)
    });
  };

  const getFilteredMeals = () => {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (activeTab === 'upcoming') {
      return myMeals.filter(m => {
        if (m.status === 'cancelled' || m.status === 'completed') return false;
        const mealDate = new Date(m.dateTime);
        return mealDate >= today;
      }).sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    } else if (activeTab === 'pending') {
      return myMeals.filter(m => m.status === 'recruiting').sort((a, b) => 
        new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
      );
    } else {
      return myMeals.filter(m => m.status === 'completed' || m.status === 'cancelled').sort((a, b) => 
        new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
      );
    }
  };

  const getOtherParticipants = (meal: Meal) => {
    const currentUser = userStore.getCurrentUser();
    const others = meal.participants.filter(p => p.id !== currentUser.id);
    return others.length > 0 ? others : meal.participants;
  };

  const handleViewDetail = (meal: Meal) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${meal.id}`
    });
  };

  const handleCheckin = (meal: Meal) => {
    Taro.showModal({
      title: '到店打卡',
      content: '确认已到店打卡？',
      confirmText: '确认打卡',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '打卡成功', icon: 'success' });
        }
      }
    });
  };

  const handleRate = (meal: Meal) => {
    Taro.showModal({
      title: '评价饭局',
      content: '请输入评价（可写1-5数字评分）',
      editable: true,
      placeholderText: '写下你的评价...',
      success: (res) => {
        if (res.confirm && res.content) {
          const match = res.content.match(/^([1-5])/);
          const rating = match ? parseInt(match[1]) : 5;
          const comment = res.content.replace(/^[1-5]/, '').trim() || '好评';

          const newRating = {
            odinnerId: meal.creator.id,
            rating: Math.min(5, Math.max(1, rating)),
            comment,
            tags: ['聊得来', '守时']
          };

          const updatedRatings = [...(meal.ratings || []), newRating];
          mealStore.update(meal.id, { ratings: updatedRatings });

          loadMyMeals();
          Taro.showToast({ title: '评价成功', icon: 'success' });
        }
      }
    });
  };

  const handleCancel = (meal: Meal) => {
    const currentUser = userStore.getCurrentUser();
    const isCreator = meal.creator.id === currentUser.id;

    Taro.showModal({
      title: isCreator ? '取消饭局' : '退出饭局',
      content: isCreator ? '确定要取消这个饭局吗？' : '确定要退出这个饭局吗？',
      confirmText: '确定',
      cancelText: '再想想',
      success: (res) => {
        if (res.confirm) {
          if (isCreator) {
            mealStore.update(meal.id, { status: 'cancelled', cancelledType: 'self' });
          } else {
            const updatedParticipants = meal.participants.filter(p => p.id !== currentUser.id);
            mealStore.update(meal.id, { participants: updatedParticipants });
          }
          loadMyMeals();
          Taro.showToast({ title: '已取消', icon: 'success' });
        }
      }
    });
  };

  const handleMarkNoShow = (meal: Meal) => {
    Taro.showModal({
      title: '标记爽约',
      content: '确定对方爽约了吗？这将影响对方的信用评分',
      confirmText: '确认爽约',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          mealStore.update(meal.id, { status: 'cancelled', cancelledType: 'noShow' });
          loadMyMeals();
          Taro.showToast({ title: '已标记爽约', icon: 'success' });
        }
      }
    });
  };

  const getStatusText = (status: string, cancelledType?: string) => {
    switch (status) {
      case 'recruiting':
        return '待确认';
      case 'confirmed':
        return '已确认';
      case 'completed':
        return '已完成';
      case 'cancelled':
        return cancelledType === 'noShow' ? '已爽约' : '已取消';
      default:
        return status;
    }
  };

  const getStatusClass = (status: string, cancelledType?: string) => {
    switch (status) {
      case 'recruiting':
        return styles.statusPending;
      case 'confirmed':
        return styles.statusConfirmed;
      case 'completed':
        return styles.statusCompleted;
      case 'cancelled':
        return cancelledType === 'noShow' ? styles.statusNoShow : styles.statusCancelled;
      default:
        return '';
    }
  };

  const getPaymentTypeText = (type: string) => {
    switch (type) {
      case 'aa':
        return 'AA';
      case 'treat':
        return '请客';
      case 'split':
        return '拼单';
      default:
        return type;
    }
  };

  const upcomingCount = myMeals.filter(m => {
    if (m.status === 'cancelled' || m.status === 'completed') return false;
    const mealDate = new Date(m.dateTime);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return mealDate >= today;
  }).length;

  const pendingCount = myMeals.filter(m => m.status === 'recruiting').length;
  const pastCount = myMeals.filter(m => m.status === 'completed' || m.status === 'cancelled').length;

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>
          <Text className={styles.titleIcon}>📅</Text>
          我的饭约
        </Text>
        <Text className={styles.subtitle}>行程管理，美好聚餐</Text>

        <View className={styles.stats}>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{stats.total}</Text>
            <Text className={styles.statLabel}>参与总数</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{stats.completed}</Text>
            <Text className={styles.statLabel}>已完成</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{stats.noShow}</Text>
            <Text className={styles.statLabel}>爽约</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>★{stats.rating}</Text>
            <Text className={styles.statLabel}>评分</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.tabBar}>
          <View
            className={`${styles.tab} ${activeTab === 'upcoming' ? styles.active : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            <Text className={styles.tabText}>即将开始</Text>
            {upcomingCount > 0 && (
              <View className={styles.tabBadge}>
                <Text className={styles.tabBadgeText}>{upcomingCount}</Text>
              </View>
            )}
          </View>
          <View
            className={`${styles.tab} ${activeTab === 'pending' ? styles.active : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            <Text className={styles.tabText}>待确认</Text>
            {pendingCount > 0 && (
              <View className={styles.tabBadge}>
                <Text className={styles.tabBadgeText}>{pendingCount}</Text>
              </View>
            )}
          </View>
          <View
            className={`${styles.tab} ${activeTab === 'past' ? styles.active : ''}`}
            onClick={() => setActiveTab('past')}
          >
            <Text className={styles.tabText}>已结束</Text>
            {pastCount > 0 && (
              <View className={styles.tabBadge}>
                <Text className={styles.tabBadgeText}>{pastCount}</Text>
              </View>
            )}
          </View>
        </View>

        {getFilteredMeals().length > 0 ? (
          <View className={styles.mealList}>
            {getFilteredMeals().map((meal) => {
              const otherParticipants = getOtherParticipants(meal);
              const otherParticipant = otherParticipants[0];

              return (
                <View key={meal.id} className={styles.mealCard} onClick={() => handleViewDetail(meal)}>
                  <View className={styles.cardHeader}>
                    <Text className={styles.mealTitle}>{meal.title}</Text>
                    <View className={`${styles.statusBadge} ${getStatusClass(meal.status, meal.cancelledType)}`}>
                      <Text>{getStatusText(meal.status, meal.cancelledType)}</Text>
                    </View>
                  </View>

                  {otherParticipant && (
                    <View className={styles.otherUserRow}>
                      <Image
                        src={otherParticipant.avatar}
                        className={styles.otherAvatar}
                        mode='aspectFill'
                      />
                      <Text className={styles.otherName}>
                        {meal.creator.id === userStore.getCurrentUser().id ? otherParticipant.name : meal.creator.name}
                      </Text>
                    </View>
                  )}

                  <View className={styles.infoGrid}>
                    <View className={styles.infoItem}>
                      <Text className={styles.infoLabel}>🕐 时间</Text>
                      <Text className={styles.infoValue}>{meal.dateTime}</Text>
                    </View>
                    <View className={styles.infoItem}>
                      <Text className={styles.infoLabel}>📍 地点</Text>
                      <Text className={styles.infoValue}>{meal.businessDistrict}</Text>
                    </View>
                    <View className={styles.infoItem}>
                      <Text className={styles.infoLabel}>💰 预算</Text>
                      <Text className={styles.infoValue}>¥{meal.budget}/人</Text>
                    </View>
                    <View className={styles.infoItem}>
                      <Text className={styles.infoLabel}>💳 付费</Text>
                      <Text className={styles.infoValue}>{getPaymentTypeText(meal.paymentType)}</Text>
                    </View>
                  </View>

                  <View className={styles.preferenceRow}>
                    <View className={styles.preferenceTag}>
                      <Text className={styles.preferenceText}>{meal.cuisine}</Text>
                    </View>
                    <View className={styles.preferenceTag}>
                      <Text className={styles.preferenceText}>{meal.chatPreference}</Text>
                    </View>
                  </View>

                  <View className={styles.actions}>
                    {meal.status === 'confirmed' && (
                      <>
                        <View
                          className={`${styles.actionButton} ${styles.checkinButton}`}
                          onClick={(e) => { e.stopPropagation(); handleCheckin(meal); }}
                        >
                          <Text className={styles.checkinText}>到店打卡</Text>
                        </View>
                        <View
                          className={`${styles.actionButton} ${styles.rateButton}`}
                          onClick={(e) => { e.stopPropagation(); handleRate(meal); }}
                        >
                          <Text className={styles.rateText}>评价</Text>
                        </View>
                        <View
                          className={`${styles.actionButton} ${styles.noShowButton}`}
                          onClick={(e) => { e.stopPropagation(); handleMarkNoShow(meal); }}
                        >
                          <Text className={styles.noShowText}>标记爽约</Text>
                        </View>
                      </>
                    )}
                    {meal.status === 'recruiting' && (
                      <View
                        className={`${styles.actionButton} ${styles.cancelButton}`}
                        style={{ flex: 1 }}
                        onClick={(e) => { e.stopPropagation(); handleCancel(meal); }}
                      >
                        <Text className={styles.cancelText}>取消</Text>
                      </View>
                    )}
                    {meal.status === 'completed' && (
                      <View
                        className={`${styles.actionButton} ${styles.rateButton}`}
                        style={{ flex: 1 }}
                        onClick={(e) => { e.stopPropagation(); handleRate(meal); }}
                      >
                        <Text className={styles.rateText}>
                          {meal.ratings && meal.ratings.length > 0 ? '查看评价' : '去评价'}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>🍽️</Text>
            <Text className={styles.emptyText}>暂无饭局</Text>
            <Text className={styles.emptySubtext}>
              {activeTab === 'upcoming' ? '快去饭局广场找饭搭子吧' : activeTab === 'pending' ? '暂时没有待确认的饭局' : '还没有已结束的饭局'}
            </Text>
            {activeTab === 'upcoming' && (
              <View className={styles.createButton} onClick={() => Taro.switchTab({ url: '/pages/square/index' })}>
                <Text className={styles.createButtonText}>去发现饭局</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default MyDatesPage;
