import React from 'react';
import { View, Text } from '@tarojs/components';
import { Filter } from '../../types';
import styles from './index.module.scss';

interface FilterBarProps {
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filter, onFilterChange }) => {
  const [activeFilter, setActiveFilter] = React.useState<string>('');

  const handleFilterClick = (type: string) => {
    if (activeFilter === type) {
      setActiveFilter('');
    } else {
      setActiveFilter(type);
    }
  };

  const handleOptionSelect = (type: string, value: string) => {
    onFilterChange({ ...filter, [type]: value });
    setActiveFilter('');
  };

  const clearFilter = (type: string) => {
    const newFilter = { ...filter };
    delete newFilter[type as keyof Filter];
    onFilterChange(newFilter);
  };

  const getDateOptions = () => {
    const options = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${date.getFullYear()}-${month}-${day}`;
      
      let label = '';
      if (i === 0) label = '今天';
      else if (i === 1) label = '明天';
      else if (i === 2) label = '后天';
      else label = `${month}月${day}日`;
      
      options.push({ value: dateStr, label });
    }
    
    return options;
  };

  const filters = [
    { key: 'dateTime', label: '用餐时间' },
    { key: 'businessDistrict', label: '商圈' },
    { key: 'cuisine', label: '菜系' },
    { key: 'paymentType', label: '付费' }
  ];

  return (
    <View className={styles.container}>
      <View className={styles.filterRow}>
        {filters.map((item) => (
          <View key={item.key} className={styles.filterItem}>
            <View
              className={`${styles.filterButton} ${filter[item.key as keyof Filter] ? styles.active : ''}`}
              onClick={() => handleFilterClick(item.key)}
            >
              <Text className={styles.filterText}>
                {filter[item.key as keyof Filter] || item.label}
              </Text>
              <Text className={styles.arrow}>▼</Text>
            </View>

            {activeFilter === item.key && (
              <View className={styles.dropdown}>
                {filter[item.key as keyof Filter] && (
                  <View
                    className={styles.clearOption}
                    onClick={() => clearFilter(item.key)}
                  >
                    <Text className={styles.clearText}>清除筛选</Text>
                  </View>
                )}
                <View
                  className={styles.option}
                  onClick={() => handleOptionSelect(item.key, '')}
                >
                  <Text className={styles.optionText}>不限</Text>
                </View>
                
                {item.key === 'dateTime' && (
                  <>
                    <View
                      className={styles.option}
                      onClick={() => handleOptionSelect(item.key, 'tonight')}
                    >
                      <Text className={styles.optionText}>今晚有空</Text>
                    </View>
                    {getDateOptions().map((option) => (
                      <View
                        key={option.value}
                        className={styles.option}
                        onClick={() => handleOptionSelect(item.key, option.value)}
                      >
                        <Text className={styles.optionText}>{option.label}</Text>
                      </View>
                    ))}
                  </>
                )}

                {item.key === 'businessDistrict' &&
                  ['国贸CBD', '三里屯', '中关村', '望京', '五道口', '西单', '王府井', '朝阳大悦城'].map((option) => (
                    <View
                      key={option}
                      className={styles.option}
                      onClick={() => handleOptionSelect(item.key, option)}
                    >
                      <Text className={styles.optionText}>{option}</Text>
                    </View>
                  ))
                }
                {item.key === 'cuisine' &&
                  ['川菜', '粤菜', '湘菜', '火锅', '烧烤', '日料', '韩料', '西餐', '其他'].map((option) => (
                    <View
                      key={option}
                      className={styles.option}
                      onClick={() => handleOptionSelect(item.key, option)}
                    >
                      <Text className={styles.optionText}>{option}</Text>
                    </View>
                  ))
                }
                {item.key === 'paymentType' &&
                  [
                    { value: 'aa', label: 'AA' },
                    { value: 'treat', label: '请客' },
                    { value: 'split', label: '拼单' }
                  ].map((option) => (
                    <View
                      key={option.value}
                      className={styles.option}
                      onClick={() => handleOptionSelect(item.key, option.value)}
                    >
                      <Text className={styles.optionText}>{option.label}</Text>
                    </View>
                  ))
                }
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

export default FilterBar;
