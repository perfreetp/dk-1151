import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Meal } from '../../types';
import styles from './index.module.scss';

interface MealCardProps {
  meal: Meal;
  onClick?: () => void;
}

const MealCard: React.FC<MealCardProps> = ({ meal, onClick }) => {
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

  const getPaymentTypeColor = (type: string) => {
    switch (type) {
      case 'aa':
        return '#00b894';
      case 'treat':
        return '#fdcb6e';
      case 'split':
        return '#74b9ff';
      default:
        return '#636e72';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recruiting':
        return '#ff6b6b';
      case 'confirmed':
        return '#00b894';
      case 'completed':
        return '#636e72';
      default:
        return '#636e72';
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

  return (
    <View className={styles.card} onClick={onClick}>
      <View className={styles.header}>
        <View className={styles.titleRow}>
          <Text className={styles.title}>{meal.title}</Text>
          <View
            className={styles.statusBadge}
            style={{ backgroundColor: getStatusColor(meal.status) }}
          >
            <Text className={styles.statusText}>{getStatusText(meal.status)}</Text>
          </View>
        </View>
        <View className={styles.creatorRow}>
          <Image
            src={meal.creator.avatar}
            className={styles.creatorAvatar}
            mode='aspectFill'
          />
          <View className={styles.creatorInfo}>
            <Text className={styles.creatorName}>{meal.creator.name}</Text>
            <View className={styles.ratingRow}>
              <Text className={styles.rating}>★ {meal.creator.rating}</Text>
              <Text className={styles.dot}>·</Text>
              <Text className={styles.punctuality}>守时 {meal.creator.punctuality}%</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.tags}>
        <View className={styles.tag}>
          <Text className={styles.tagText}>{meal.cuisine}</Text>
        </View>
        <View className={styles.tag}>
          <Text className={styles.tagText}>{meal.businessDistrict}</Text>
        </View>
        <View
          className={styles.paymentTag}
          style={{ backgroundColor: getPaymentTypeColor(meal.paymentType) }}
        >
          <Text className={styles.paymentText}>
            {getPaymentTypeText(meal.paymentType)}
          </Text>
        </View>
        {meal.isFemaleOnly && (
          <View className={styles.femaleTag}>
            <Text className={styles.femaleText}>仅女生</Text>
          </View>
        )}
      </View>

      <View className={styles.info}>
        <View className={styles.infoItem}>
          <Text className={styles.infoLabel}>时间</Text>
          <Text className={styles.infoValue}>{meal.dateTime}</Text>
        </View>
        <View className={styles.infoItem}>
          <Text className={styles.infoLabel}>预算</Text>
          <Text className={styles.infoValue}>¥{meal.budget}/人</Text>
        </View>
      </View>

      <View className={styles.footer}>
        <View className={styles.participants}>
          <View className={styles.avatarStack}>
            {meal.participants.slice(0, 3).map((p, index) => (
              <Image
                key={p.id}
                src={p.avatar}
                className={styles.participantAvatar}
                style={{ left: `${index * 40}rpx` }}
                mode='aspectFill'
              />
            ))}
            {meal.participants.length > 3 && (
              <View className={styles.moreCount}>
                <Text className={styles.moreCountText}>
                  +{meal.participants.length - 3}
                </Text>
              </View>
            )}
          </View>
          <Text className={styles.participantText}>
            {meal.participants.length}/{meal.maxParticipants}人
          </Text>
        </View>
        {meal.allow拼桌 && (
          <View className={styles.拼桌Badge}>
            <Text className={styles.拼桌Text}>可拼桌</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default MealCard;
