import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { User } from '../../types';
import { mockUsers } from '../../data/mock';
import styles from './index.module.scss';

const UserPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { id } = Taro.getCurrentInstance().router?.params || {};
    if (id) {
      const foundUser = mockUsers.find(u => u.id === id);
      setUser(foundUser || null);
    } else {
      setUser(mockUsers[0]);
    }
    setLoading(false);
  }, []);

  const handleBack = () => {
    Taro.navigateBack();
  };

  const handleChat = () => {
    Taro.navigateTo({
      url: '/pages/chat/index'
    });
  };

  const mockReviews = [
    {
      id: '1',
      reviewer: mockUsers[1],
      rating: 5,
      content: '非常愉快的一次饭局！人很好，聊得很开心，已经约好下次再聚了～',
      tags: ['聊得来', '守时', '好相处'],
      time: '2026-06-10'
    },
    {
      id: '2',
      reviewer: mockUsers[2],
      rating: 4,
      content: '饭搭子很靠谱，推荐的餐厅也很不错，就是聊天话题稍微有点少',
      tags: ['好相处', '餐厅不错'],
      time: '2026-06-08'
    },
    {
      id: '3',
      reviewer: mockUsers[4],
      rating: 5,
      content: '超赞的饭搭子！特别会照顾人，还主动帮忙烤肉，推荐！',
      tags: ['会照顾人', '守时', '大方'],
      time: '2026-06-05'
    }
  ];

  if (loading) {
    return (
      <View className={styles.container}>
        <Text>加载中...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View className={styles.container}>
        <Text>用户不存在</Text>
      </View>
    );
  }

  return (
    <View className={styles.container}>
      <ScrollView scrollY enableFlex>
        <View className={styles.header}>
          <View className={styles.backButton} onClick={handleBack}>
            <Text className={styles.backIcon}>←</Text>
          </View>
          <Image
            src={user.avatar}
            className={styles.avatar}
            mode='aspectFill'
          />
          <View className={styles.nameRow}>
            <Text className={styles.name}>{user.name}</Text>
            {user.gender === 'female' && (
              <View className={styles.genderBadge}>
                <Text>♀</Text>
              </View>
            )}
          </View>
          <Text className={styles.meta}>{user.age}岁 · {user.isVerified ? '已认证' : '未认证'}</Text>
          <View className={styles.tags}>
            {user.tags.map((tag) => (
              <View key={tag} className={styles.tag}>
                <Text className={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.content}>
          <View className={styles.statsCard}>
            <View className={styles.statsGrid}>
              <View className={styles.statItem}>
                <Text className={styles.statValue}>{user.completedMeals}</Text>
                <Text className={styles.statLabel}>完成饭局</Text>
              </View>
              <View className={styles.statItem}>
                <Text className={styles.statValue}>★{user.rating}</Text>
                <Text className={styles.statLabel}>综合评分</Text>
              </View>
              <View className={styles.statItem}>
                <Text className={styles.statValue}>{user.punctuality}%</Text>
                <Text className={styles.statLabel}>守时率</Text>
              </View>
              <View className={styles.statItem}>
                <Text className={styles.statValue}>{user.isVerified ? '是' : '否'}</Text>
                <Text className={styles.statLabel}>已认证</Text>
              </View>
            </View>
          </View>

          <View className={styles.bioCard}>
            <Text className={styles.sectionTitle}>个人简介</Text>
            <Text className={styles.bio}>{user.bio}</Text>
          </View>

          <View className={styles.preferenceCard}>
            <Text className={styles.sectionTitle}>偏好设置</Text>
            <View className={styles.preferenceGrid}>
              <View className={styles.preferenceItem}>
                <Text className={styles.preferenceLabel}>饮食偏好</Text>
                <View className={styles.preferenceTags}>
                  {user.foodPreferences.map((pref) => (
                    <View key={pref} className={styles.preferenceTag}>
                      <Text className={styles.preferenceTagText}>{pref}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View className={styles.preferenceItem}>
                <Text className={styles.preferenceLabel}>禁忌话题</Text>
                <View className={styles.preferenceTags}>
                  {user.tabooTopics.length > 0 ? (
                    user.tabooTopics.map((topic) => (
                      <View key={topic} className={styles.preferenceTag}>
                        <Text className={styles.preferenceTagText}>{topic}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={{ fontSize: '24rpx', color: '#b2bec3' }}>暂无</Text>
                  )}
                </View>
              </View>
            </View>
          </View>

          <View className={styles.reviewsCard}>
            <Text className={styles.sectionTitle}>评价记录</Text>
            {mockReviews.map((review) => (
              <View key={review.id} className={styles.reviewItem}>
                <View className={styles.reviewHeader}>
                  <Image
                    src={review.reviewer.avatar}
                    className={styles.reviewerAvatar}
                    mode='aspectFill'
                  />
                  <View className={styles.reviewerInfo}>
                    <Text className={styles.reviewerName}>{review.reviewer.name}</Text>
                    <Text className={styles.reviewTime}>{review.time}</Text>
                  </View>
                  <View className={styles.reviewRating}>
                    <Text className={styles.ratingStars}>{'★'.repeat(review.rating)}</Text>
                  </View>
                </View>
                <Text className={styles.reviewContent}>{review.content}</Text>
                <View className={styles.reviewTags}>
                  {review.tags.map((tag) => (
                    <View key={tag} className={styles.reviewTag}>
                      <Text className={styles.reviewTagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View className={styles.footer}>
        <View className={styles.actionButton} onClick={handleChat}>
          <Text className={styles.actionText}>发起聊天</Text>
        </View>
      </View>
    </View>
  );
};

export default UserPage;
