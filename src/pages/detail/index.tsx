import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Meal } from '../../types';
import { mealStore, chatStore, generateId } from '../../utils/store';
import styles from './index.module.scss';

const DetailPage: React.FC = () => {
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { id } = Taro.getCurrentInstance().router?.params || {};
    if (id) {
      const foundMeal = mealStore.getById(id);
      setMeal(foundMeal || null);
    }
    setLoading(false);
  }, []);

  const handleBack = () => {
    Taro.navigateBack();
  };

  const handleChat = () => {
    if (meal) {
      let existingChat = chatStore.getAll().find(c => c.mealId === meal.id);
      
      if (!existingChat) {
        const newChat = {
          id: generateId(),
          mealId: meal.id,
          participants: [meal.creator],
          messages: [],
          status: 'pending' as const,
          updatedAt: new Date().toISOString()
        };
        chatStore.add(newChat);
        existingChat = newChat;
      }
      
      Taro.navigateTo({
        url: `/pages/chatroom/index?chatId=${existingChat.id}`
      });
    }
  };

  const handleJoin = () => {
    if (meal) {
      Taro.showModal({
        title: '参与饭局',
        content: `确定要参与"${meal.title}"吗？`,
        confirmText: '确认参与',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            Taro.showToast({ title: '参与成功', icon: 'success' });
            setTimeout(() => {
              Taro.switchTab({ url: '/pages/mydates/index' });
            }, 1500);
          }
        }
      });
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'recruiting':
        return '招募中';
      case 'confirmed':
        return '已确认';
      case 'completed':
        return '已完成';
      default:
        return status;
    }
  };

  const getPaymentTypeText = (type: string) => {
    switch (type) {
      case 'aa':
        return 'AA制';
      case 'treat':
        return '请客';
      case 'split':
        return '拼单';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <View className={styles.container}>
        <Text>加载中...</Text>
      </View>
    );
  }

  if (!meal) {
    return (
      <View className={styles.container}>
        <Text>饭局不存在</Text>
      </View>
    );
  }

  return (
    <View className={styles.container}>
      <ScrollView scrollY enableFlex>
        <View className={styles.cover}>
          <Image
            src={meal.restaurant?.cover || 'https://picsum.photos/id/292/750/400'}
            className={styles.coverImage}
            mode='aspectFill'
          />
          <View className={styles.backButton} onClick={handleBack}>
            <Text className={styles.backIcon}>←</Text>
          </View>
        </View>

        <View className={styles.content}>
          <View className={styles.mainCard}>
            <View className={styles.titleRow}>
              <Text className={styles.title}>{meal.title}</Text>
              <View className={`${styles.statusBadge} ${meal.status === 'recruiting' ? styles.statusRecruiting : styles.statusConfirmed}`}>
                <Text className={styles.statusText}>{getStatusText(meal.status)}</Text>
              </View>
            </View>

            <View className={styles.infoGrid}>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>用餐时间</Text>
                <Text className={styles.infoValue}>{meal.dateTime}</Text>
              </View>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>用餐地点</Text>
                <Text className={styles.infoValue}>{meal.businessDistrict}</Text>
              </View>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>人均预算</Text>
                <Text className={styles.infoValue}>¥{meal.budget}</Text>
              </View>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>付费方式</Text>
                <Text className={styles.infoValue}>{getPaymentTypeText(meal.paymentType)}</Text>
              </View>
            </View>

            <View className={styles.tags}>
              <View className={styles.tag}>
                <Text className={styles.tagText}>{meal.cuisine}</Text>
              </View>
              <View className={styles.tag}>
                <Text className={styles.tagText}>{meal.chatPreference}</Text>
              </View>
              {meal.allow拼桌 && (
                <View className={styles.tag}>
                  <Text className={styles.tagText}>接受拼桌</Text>
                </View>
              )}
              {meal.isFemaleOnly && (
                <View className={styles.tag}>
                  <Text className={styles.tagText}>仅限女生</Text>
                </View>
              )}
            </View>
          </View>

          <View className={styles.creatorCard}>
            <Text className={styles.sectionTitle}>发起人</Text>
            <View className={styles.creatorInfo}>
              <Image
                src={meal.creator.avatar}
                className={styles.avatar}
                mode='aspectFill'
              />
              <View className={styles.creatorMeta}>
                <Text className={styles.creatorName}>{meal.creator.name}</Text>
                <View className={styles.creatorTags}>
                  {meal.creator.tags.slice(0, 3).map((tag) => (
                    <View key={tag} className={styles.tagSmall}>
                      <Text className={styles.tagTextSmall}>{tag}</Text>
                    </View>
                  ))}
                </View>
                <View className={styles.ratingRow}>
                  <View className={styles.ratingItem}>
                    <Text className={styles.ratingIcon}>★</Text>
                    <Text className={styles.ratingText}>{meal.creator.rating}</Text>
                  </View>
                  <View className={styles.ratingItem}>
                    <Text className={styles.ratingText}>守时 {meal.creator.punctuality}%</Text>
                  </View>
                </View>
              </View>
            </View>

            <View className={styles.statsGrid}>
              <View className={styles.statItem}>
                <Text className={styles.statNumber}>{meal.creator.completedMeals}</Text>
                <Text className={styles.statLabel}>完成饭局</Text>
              </View>
              <View className={styles.statItem}>
                <Text className={styles.statNumber}>★{meal.creator.rating}</Text>
                <Text className={styles.statLabel}>综合评分</Text>
              </View>
              <View className={styles.statItem}>
                <Text className={styles.statNumber}>{meal.creator.punctuality}%</Text>
                <Text className={styles.statLabel}>守时率</Text>
              </View>
            </View>
          </View>

          <View className={styles.participantsCard}>
            <View className={styles.participantsHeader}>
              <Text className={styles.sectionTitle}>已参与者</Text>
              <Text className={styles.participantsCount}>
                {meal.participants.length}/{meal.maxParticipants}人
              </Text>
            </View>
            <View className={styles.participantsList}>
              {meal.participants.map((participant) => (
                <View key={participant.id} className={styles.participantItem}>
                  <Image
                    src={participant.avatar}
                    className={styles.participantAvatar}
                    mode='aspectFill'
                  />
                  <Text className={styles.participantName}>{participant.name}</Text>
                </View>
              ))}
              {meal.participants.length < meal.maxParticipants && (
                <View className={styles.participantItem}>
                  <View
                    style={{
                      width: '96rpx',
                      height: '96rpx',
                      borderRadius: '999rpx',
                      background: '#f5f6f7',
                      border: '2rpx dashed #e5e6eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '8rpx'
                    }}
                  >
                    <Text style={{ fontSize: '40rpx', color: '#b2bec3' }}>+</Text>
                  </View>
                  <Text className={styles.participantName}>待加入</Text>
                </View>
              )}
            </View>
          </View>

          <View className={styles.preferenceCard}>
            <Text className={styles.sectionTitle}>偏好设置</Text>
            <View className={styles.preferenceGrid}>
              <View className={styles.preferenceItem}>
                <Text className={styles.preferenceLabel}>饮食偏好</Text>
                <Text className={styles.preferenceValue}>
                  {meal.creator.foodPreferences.join('、')}
                </Text>
              </View>
              <View className={styles.preferenceItem}>
                <Text className={styles.preferenceLabel}>聊天偏好</Text>
                <Text className={styles.preferenceValue}>{meal.chatPreference}</Text>
              </View>
              {meal.tabooTopics.length > 0 && (
                <View className={styles.preferenceItem} style={{ gridColumn: 'span 2' }}>
                  <Text className={styles.preferenceLabel}>禁忌话题</Text>
                  <Text className={styles.preferenceValue}>
                    {meal.tabooTopics.join('、')}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      <View className={styles.footer}>
        <View className={`${styles.actionButton} ${styles.chatButton}`} onClick={handleChat}>
          <Text className={styles.chatText}>发起聊天</Text>
        </View>
        <View className={`${styles.actionButton} ${styles.joinButton}`} onClick={handleJoin}>
          <Text className={styles.joinText}>参与饭局</Text>
        </View>
      </View>
    </View>
  );
};

export default DetailPage;
