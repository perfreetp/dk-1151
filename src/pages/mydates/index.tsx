import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Meal } from '../../types';
import { mealStore } from '../../utils/store';
import styles from './index.module.scss';

const MyDatesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'recruiting' | 'confirmed' | 'completed'>('recruiting');
  const [myMeals, setMyMeals] = useState<Meal[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    cancelled: 0,
    rating: 4.8
  });

  useEffect(() => {
    loadMyMeals();
  }, []);

  const loadMyMeals = () => {
    const meals = mealStore.getAll();
    setMyMeals(meals);

    const completedMeals = meals.filter(m => m.status === 'completed').length;
    const cancelledMeals = meals.filter(m => m.status === 'cancelled').length;

    let totalRating = 0;
    let ratingCount = 0;
    meals.forEach(meal => {
      if (meal.ratings && meal.ratings.length > 0) {
        meal.ratings.forEach(r => {
          totalRating += r.rating;
          ratingCount++;
        });
      }
    });
    const avgRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : '4.8';

    setStats({
      total: meals.length,
      completed: completedMeals,
      cancelled: cancelledMeals,
      rating: parseFloat(avgRating)
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
      content: '请选择评分（1-5星）',
      editable: true,
      placeholderText: '写下你的评价...',
      success: (res) => {
        if (res.confirm && res.content) {
          const rating = parseInt(res.content.split('星')[0]) || 5;
          const comment = res.content.replace(/^[1-5]星/, '').trim() || '好评';

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
    Taro.showModal({
      title: '取消饭局',
      content: '确定要取消这个饭局吗？',
      confirmText: '确定取消',
      cancelText: '再想想',
      success: (res) => {
        if (res.confirm) {
          mealStore.update(meal.id, { status: 'cancelled' });
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
          mealStore.update(meal.id, { status: 'cancelled' });
          loadMyMeals();
          Taro.showToast({ title: '已标记爽约', icon: 'success' });
        }
      }
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'recruiting':
        return '招募中';
      case 'confirmed':
        return '已确认';
      case 'completed':
        return '已完成';
      case 'cancelled':
        return '已取消';
      default:
        return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'recruiting':
        return styles.statusRecruiting;
      case 'confirmed':
        return styles.statusConfirmed;
      case 'completed':
        return styles.statusCompleted;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return '';
    }
  };

  const getFilteredMeals = () => {
    if (activeTab === 'recruiting') {
      return myMeals.filter(m => m.status === 'recruiting');
    } else if (activeTab === 'confirmed') {
      return myMeals.filter(m => m.status === 'confirmed');
    } else {
      return myMeals.filter(m => m.status === 'completed');
    }
  };

  const recruitingCount = myMeals.filter(m => m.status === 'recruiting').length;
  const confirmedCount = myMeals.filter(m => m.status === 'confirmed').length;
  const completedCount = myMeals.filter(m => m.status === 'completed').length;

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>
          <Text className={styles.titleIcon}>📅</Text>
          我的饭约
        </Text>
        <Text className={styles.subtitle}>管理你的饭局，参与美好聚餐</Text>

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
            <Text className={styles.statNumber}>{stats.cancelled}</Text>
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
            className={`${styles.tab} ${activeTab === 'recruiting' ? styles.active : ''}`}
            onClick={() => setActiveTab('recruiting')}
          >
            <Text className={styles.tabText}>待参与</Text>
            {recruitingCount > 0 && (
              <View className={styles.tabBadge}>
                <Text className={styles.tabBadgeText}>{recruitingCount}</Text>
              </View>
            )}
          </View>
          <View
            className={`${styles.tab} ${activeTab === 'confirmed' ? styles.active : ''}`}
            onClick={() => setActiveTab('confirmed')}
          >
            <Text className={styles.tabText}>已确认</Text>
            {confirmedCount > 0 && (
              <View className={styles.tabBadge}>
                <Text className={styles.tabBadgeText}>{confirmedCount}</Text>
              </View>
            )}
          </View>
          <View
            className={`${styles.tab} ${activeTab === 'completed' ? styles.active : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            <Text className={styles.tabText}>已完成</Text>
            {completedCount > 0 && (
              <View className={styles.tabBadge}>
                <Text className={styles.tabBadgeText}>{completedCount}</Text>
              </View>
            )}
          </View>
        </View>

        {getFilteredMeals().length > 0 ? (
          <View className={styles.mealList}>
            {getFilteredMeals().map((meal) => (
              <View key={meal.id} className={styles.mealCard}>
                <View className={styles.cardHeader}>
                  <Text className={styles.mealTitle}>{meal.title}</Text>
                  <View className={`${styles.statusBadge} ${getStatusClass(meal.status)}`}>
                    <Text>{getStatusText(meal.status)}</Text>
                  </View>
                </View>

                <View className={styles.mealInfo}>
                  <View className={styles.infoTag}>
                    <Text className={styles.infoText}>{meal.cuisine}</Text>
                  </View>
                  <View className={styles.infoTag}>
                    <Text className={styles.infoText}>{meal.dateTime}</Text>
                  </View>
                  <View className={styles.infoTag}>
                    <Text className={styles.infoText}>{meal.businessDistrict}</Text>
                  </View>
                  <View className={styles.infoTag}>
                    <Text className={styles.infoText}>¥{meal.budget}/人</Text>
                  </View>
                </View>

                <View className={styles.participants}>
                  <Text className={styles.participantsLabel}>参与者</Text>
                  <View className={styles.avatarStack}>
                    {meal.participants.slice(0, 3).map((p, index) => (
                      <Image
                        key={p.id}
                        src={p.avatar}
                        className={styles.avatar}
                        style={{ left: `${index * 40}rpx` }}
                        mode='aspectFill'
                      />
                    ))}
                  </View>
                  <Text className={styles.participantsText}>
                    {meal.participants.length}/{meal.maxParticipants}人
                  </Text>
                </View>

                <View className={styles.actions}>
                  {meal.status === 'confirmed' && (
                    <>
                      <View
                        className={`${styles.actionButton} ${styles.checkinButton}`}
                        onClick={() => handleCheckin(meal)}
                      >
                        <Text className={styles.checkinText}>到店打卡</Text>
                      </View>
                      <View
                        className={`${styles.actionButton} ${styles.rateButton}`}
                        onClick={() => handleRate(meal)}
                      >
                        <Text className={styles.rateText}>评价</Text>
                      </View>
                    </>
                  )}
                  {meal.status === 'completed' && (
                    <View
                      className={`${styles.actionButton} ${styles.rateButton}`}
                      style={{ flex: 1 }}
                      onClick={() => handleRate(meal)}
                    >
                      <Text className={styles.rateText}>
                        {meal.ratings && meal.ratings.length > 0 ? '查看评价' : '去评价'}
                      </Text>
                    </View>
                  )}
                  {meal.status === 'recruiting' && (
                    <>
                      <View
                        className={`${styles.actionButton} ${styles.cancelButton}`}
                        onClick={() => handleCancel(meal)}
                      >
                        <Text className={styles.cancelText}>取消</Text>
                      </View>
                    </>
                  )}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>🍽️</Text>
            <Text className={styles.emptyText}>暂无饭局</Text>
            <Text className={styles.emptySubtext}>快去饭局广场找饭搭子吧</Text>
            <View className={styles.createButton} onClick={() => Taro.switchTab({ url: '/pages/square/index' })}>
              <Text className={styles.createButtonText}>去发现饭局</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default MyDatesPage;
