import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Meal } from '../../types';
import { mealStore } from '../../utils/store';
import styles from './index.module.scss';

const MatchPage: React.FC = () => {
  const [matches, setMatches] = useState<(Meal & { matchScore: number })[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    new: 0
  });

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = () => {
    const allMeals = mealStore.getAll();
    const matchData = allMeals.map(meal => ({
      ...meal,
      matchScore: Math.floor(Math.random() * 20) + 80
    })).sort((a, b) => b.matchScore - a.matchScore);

    setMatches(matchData);
    setStats({
      total: matchData.length,
      today: Math.floor(Math.random() * 3) + 1,
      new: Math.floor(Math.random() * 5) + 2
    });
  };

  const handleChat = (meal: Meal) => {
    Taro.navigateTo({
      url: `/pages/chatroom/index?mealId=${meal.id}`
    });
  };

  const handleView = (meal: Meal) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${meal.id}`
    });
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>
          <Text className={styles.titleIcon}>🤝</Text>
          匹配列表
        </Text>
        <Text className={styles.subtitle}>基于你的偏好为你匹配饭局</Text>

        <View className={styles.stats}>
          <View className={styles.statCard}>
            <Text className={styles.statValue}>{stats.total}</Text>
            <Text className={styles.statLabel}>匹配总数</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statValue}>{stats.today}</Text>
            <Text className={styles.statLabel}>今日新增</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statValue}>{stats.new}</Text>
            <Text className={styles.statLabel}>新匹配</Text>
          </View>
        </View>
      </View>

      <ScrollView scrollY enableFlex className={styles.content}>
        <Text className={styles.sectionTitle}>为你推荐</Text>

        {matches.length > 0 ? (
          <View className={styles.matchList}>
            {matches.map((meal) => (
              <View key={meal.id} className={styles.matchCard}>
                <View className={styles.matchHeader}>
                  <View className={styles.avatarWrapper}>
                    <Image
                      src={meal.creator.avatar}
                      className={styles.avatar}
                      mode='aspectFill'
                    />
                    {meal.creator.gender === 'female' && (
                      <View className={styles.femaleBadge}>♀</View>
                    )}
                  </View>
                  <View className={styles.userInfo}>
                    <Text className={styles.userName}>{meal.creator.name}</Text>
                    <Text className={styles.userMeta}>
                      {meal.creator.age}岁 · {meal.businessDistrict}
                    </Text>
                    <View className={styles.userTags}>
                      {meal.creator.tags.slice(0, 2).map((tag) => (
                        <View key={tag} className={styles.tag}>
                          <Text className={styles.tagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <View className={styles.matchBadge}>
                    <Text className={styles.matchText}>{meal.matchScore}%匹配</Text>
                  </View>
                </View>

                <View className={styles.mealInfo}>
                  <Text className={styles.mealTitle}>{meal.title}</Text>
                  <View className={styles.mealDetails}>
                    <View className={styles.mealTag}>
                      <Text className={styles.mealTagText}>{meal.cuisine}</Text>
                    </View>
                    <View className={styles.mealTag}>
                      <Text className={styles.mealTagText}>{meal.dateTime}</Text>
                    </View>
                    <View className={styles.mealTag}>
                      <Text className={styles.mealTagText}>¥{meal.budget}/人</Text>
                    </View>
                    <View className={styles.mealTag}>
                      <Text className={styles.mealTagText}>
                        {meal.paymentType === 'aa' ? 'AA' : meal.paymentType === 'treat' ? '请客' : '拼单'}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className={styles.matchStats}>
                  <View className={styles.stat}>
                    <Text className={styles.statNumber}>★{meal.creator.rating}</Text>
                    <Text className={styles.statDesc}>评分</Text>
                  </View>
                  <View className={styles.stat}>
                    <Text className={styles.statNumber}>{meal.creator.punctuality}%</Text>
                    <Text className={styles.statDesc}>守时率</Text>
                  </View>
                  <View className={styles.stat}>
                    <Text className={styles.statNumber}>{meal.creator.completedMeals}</Text>
                    <Text className={styles.statDesc}>完成饭局</Text>
                  </View>
                </View>

                <View className={styles.actions}>
                  <View className={styles.actionButton} onClick={() => handleChat(meal)}>
                    <Text className={styles.chatButtonText}>发起聊天</Text>
                  </View>
                  <View className={styles.actionButton} onClick={() => handleView(meal)}>
                    <Text className={styles.viewButtonText}>查看详情</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>🔍</Text>
            <Text className={styles.emptyText}>暂无匹配</Text>
            <Text className={styles.emptySubtext}>完善你的偏好设置，获得更精准的匹配</Text>
            <View className={styles.createButton} onClick={() => Taro.switchTab({ url: '/pages/create/index' })}>
              <Text className={styles.createButtonText}>去创建饭局</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default MatchPage;
