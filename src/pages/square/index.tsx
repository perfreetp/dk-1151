import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Input, PullToRefresh } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Meal, Filter } from '../../types';
import { mockMeals } from '../../data/mock';
import MealCard from '../../components/MealCard';
import FilterBar from '../../components/FilterBar';
import styles from './index.module.scss';

const SquarePage: React.FC = () => {
  const [filter, setFilter] = useState<Filter>({});
  const [meals, setMeals] = useState<Meal[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    loadMeals();
  }, [filter]);

  const loadMeals = () => {
    setLoading(true);
    setTimeout(() => {
      let filteredMeals = [...mockMeals];

      if (filter.businessDistrict) {
        filteredMeals = filteredMeals.filter(
          m => m.businessDistrict === filter.businessDistrict
        );
      }
      if (filter.cuisine) {
        filteredMeals = filteredMeals.filter(m => m.cuisine === filter.cuisine);
      }
      if (filter.paymentType) {
        filteredMeals = filteredMeals.filter(m => m.paymentType === filter.paymentType);
      }
      if (searchKeyword) {
        filteredMeals = filteredMeals.filter(m =>
          m.title.toLowerCase().includes(searchKeyword.toLowerCase())
        );
      }

      setMeals(filteredMeals);
      setLoading(false);
    }, 500);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadMeals();
      setRefreshing(false);
    }, 1000);
  };

  const handleMealClick = (meal: Meal) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${meal.id}`
    });
  };

  const quickFilters = [
    { label: '今晚有空', value: 'tonight' },
    { label: 'AA饭局', value: 'aa' },
    { label: '请客大方', value: 'treat' },
    { label: '仅限女生', value: 'female' }
  ];

  const handleQuickFilter = (value: string) => {
    if (value === 'aa') {
      setFilter({ ...filter, paymentType: 'aa' });
    } else if (value === 'treat') {
      setFilter({ ...filter, paymentType: 'treat' });
    } else if (value === 'female') {
      setMeals(mockMeals.filter(m => m.isFemaleOnly));
    } else {
      setMeals(mockMeals);
    }
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <View className={styles.greeting}>
          <Text className={styles.greetingIcon}>🍽️</Text>
          <Text className={styles.greetingText}>发现饭局</Text>
        </View>
        <Text className={styles.subtitle}>找到你的临时饭搭子</Text>

        <View className={styles.searchBox}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder='搜索饭局标题...'
            value={searchKeyword}
            onInput={(e) => setSearchKeyword(e.detail.value)}
            onConfirm={loadMeals}
          />
        </View>

        <ScrollView
          className={styles.quickFilters}
          scrollX
          enableFlex
        >
          {quickFilters.map((item) => (
            <View
              key={item.value}
              className={styles.quickFilter}
              onClick={() => handleQuickFilter(item.value)}
            >
              <Text className={styles.quickFilterText}>{item.label}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <FilterBar filter={filter} onFilterChange={setFilter} />

      <ScrollView
        className={styles.content}
        scrollY
        enableFlex
        onScrollToLower={loadMeals}
      >
        <PullToRefresh
          refreshing={refreshing}
          onRefresh={handleRefresh}
        >
          <View className={styles.listHeader}>
            <Text className={styles.listTitle}>推荐饭局</Text>
            <Text className={styles.listCount}>{meals.length} 个饭局</Text>
          </View>

          {meals.length > 0 ? (
            <View className={styles.mealList}>
              {meals.map((meal) => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  onClick={() => handleMealClick(meal)}
                />
              ))}
            </View>
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>🍜</Text>
              <Text className={styles.emptyText}>暂无符合条件的饭局</Text>
              <Text className={styles.emptySubtext}>试试调整筛选条件</Text>
            </View>
          )}

          {loading && (
            <View className={styles.loading}>
              <Text className={styles.loadingText}>加载中...</Text>
            </View>
          )}
        </PullToRefresh>
      </ScrollView>
    </View>
  );
};

export default SquarePage;
