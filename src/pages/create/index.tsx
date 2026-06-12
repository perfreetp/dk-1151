import React, { useState } from 'react';
import { View, Text, Input, ScrollView, Switch } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { BUSINESS_DISTRICTS, CUISINES, TABOO_TOPICS, CHAT_PREFERENCES } from '../../types';
import styles from './index.module.scss';

const CreatePage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-06-15');
  const [time, setTime] = useState('18:00');
  const [district, setDistrict] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('4');
  const [budget, setBudget] = useState('');
  const [paymentType, setPaymentType] = useState<'aa' | 'treat' | 'split'>('aa');
  const [chatPreference, setChatPreference] = useState('');
  const [allow拼桌, setAllow拼桌] = useState(true);
  const [isFemaleOnly, setIsFemaleOnly] = useState(false);
  const [tabooTopics, setTabooTopics] = useState<string[]>([]);

  const handleSubmit = () => {
    if (!title) {
      Taro.showToast({ title: '请输入饭局标题', icon: 'none' });
      return;
    }
    if (!date || !time) {
      Taro.showToast({ title: '请选择用餐时间', icon: 'none' });
      return;
    }
    if (!district) {
      Taro.showToast({ title: '请选择商圈', icon: 'none' });
      return;
    }
    if (!cuisine) {
      Taro.showToast({ title: '请选择菜系', icon: 'none' });
      return;
    }
    if (!budget) {
      Taro.showToast({ title: '请输入预算', icon: 'none' });
      return;
    }

    Taro.showLoading({ title: '发布中...' });
    setTimeout(() => {
      Taro.hideLoading();
      Taro.showToast({ title: '发布成功！', icon: 'success' });
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/match/index' });
      }, 1500);
    }, 1000);
  };

  const toggleTabooTopic = (topic: string) => {
    if (tabooTopics.includes(topic)) {
      setTabooTopics(tabooTopics.filter(t => t !== topic));
    } else {
      setTabooTopics([...tabooTopics, topic]);
    }
  };

  return (
    <View className={styles.container}>
      <ScrollView scrollY enableFlex>
        <View className={styles.header}>
          <Text className={styles.title}>创建饭局</Text>
          <Text className={styles.subtitle}>发布你的饭局邀请，找到合适的临时饭搭子</Text>
        </View>

        <View className={styles.form}>
          <View className={styles.formCard}>
            <Text className={styles.formTitle}>基本信息</Text>
            
            <View className={styles.inputGroup}>
              <Text className={styles.inputLabel}>饭局标题</Text>
              <Input
                className={styles.input}
                placeholder='给你的饭局起个吸引人的名字'
                value={title}
                onInput={(e) => setTitle(e.detail.value)}
              />
            </View>

            <View className={styles.inputGroup}>
              <Text className={styles.inputLabel}>用餐时间</Text>
              <View className={styles.inputRow}>
                <Input
                  className={styles.input}
                  type='date'
                  value={date}
                  onInput={(e) => setDate(e.detail.value)}
                />
                <Input
                  className={styles.input}
                  type='time'
                  value={time}
                  onInput={(e) => setTime(e.detail.value)}
                />
              </View>
            </View>

            <View className={styles.inputGroup}>
              <Text className={styles.inputLabel}>商圈</Text>
              <View className={styles.optionGroup}>
                {BUSINESS_DISTRICTS.slice(0, 6).map((item) => (
                  <View
                    key={item}
                    className={`${styles.option} ${district === item ? styles.active : ''}`}
                    onClick={() => setDistrict(item)}
                  >
                    <Text className={styles.optionText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.inputGroup}>
              <Text className={styles.inputLabel}>菜系</Text>
              <View className={styles.optionGroup}>
                {CUISINES.slice(0, 8).map((item) => (
                  <View
                    key={item}
                    className={`${styles.option} ${cuisine === item ? styles.active : ''}`}
                    onClick={() => setCuisine(item)}
                  >
                    <Text className={styles.optionText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View className={styles.formCard}>
            <Text className={styles.formTitle}>人数与预算</Text>

            <View className={styles.inputGroup}>
              <Text className={styles.inputLabel}>人数</Text>
              <View className={styles.inputRow}>
                <Input
                  className={styles.input}
                  type='number'
                  placeholder='2'
                  value={maxParticipants}
                  onInput={(e) => setMaxParticipants(e.detail.value)}
                />
                <Text className={styles.inputSuffix}>人</Text>
              </View>
            </View>

            <View className={styles.inputGroup}>
              <Text className={styles.inputLabel}>人均预算</Text>
              <View className={styles.inputRow}>
                <Text className={styles.inputSuffix}>¥</Text>
                <Input
                  className={styles.input}
                  type='number'
                  placeholder='100'
                  value={budget}
                  onInput={(e) => setBudget(e.detail.value)}
                />
                <Text className={styles.inputSuffix}>/人</Text>
              </View>
            </View>

            <View className={styles.inputGroup}>
              <Text className={styles.inputLabel}>付费方式</Text>
              <View className={styles.optionGroup}>
                <View
                  className={`${styles.option} ${paymentType === 'aa' ? styles.active : ''}`}
                  onClick={() => setPaymentType('aa')}
                >
                  <Text className={styles.optionText}>AA</Text>
                </View>
                <View
                  className={`${styles.option} ${paymentType === 'treat' ? styles.active : ''}`}
                  onClick={() => setPaymentType('treat')}
                >
                  <Text className={styles.optionText}>请客</Text>
                </View>
                <View
                  className={`${styles.option} ${paymentType === 'split' ? styles.active : ''}`}
                  onClick={() => setPaymentType('split')}
                >
                  <Text className={styles.optionText}>拼单</Text>
                </View>
              </View>
            </View>
          </View>

          <View className={styles.formCard}>
            <Text className={styles.formTitle}>偏好设置</Text>

            <View className={styles.inputGroup}>
              <Text className={styles.inputLabel}>聊天偏好</Text>
              <View className={styles.optionGroup}>
                {CHAT_PREFERENCES.map((item) => (
                  <View
                    key={item}
                    className={`${styles.option} ${chatPreference === item ? styles.active : ''}`}
                    onClick={() => setChatPreference(item)}
                  >
                    <Text className={styles.optionText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.inputGroup}>
              <Text className={styles.inputLabel}>禁忌话题（可选）</Text>
              <View className={styles.tagGroup}>
                {TABOO_TOPICS.map((topic) => (
                  <View
                    key={topic}
                    className={`${styles.tag} ${tabooTopics.includes(topic) ? styles.active : ''}`}
                    onClick={() => toggleTabooTopic(topic)}
                  >
                    <Text className={styles.tagText}>{topic}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.switchRow}>
              <View>
                <Text className={styles.switchLabel}>接受拼桌</Text>
                <Text className={styles.switchDescription}>允许与陌生人拼桌</Text>
              </View>
              <Switch
                checked={allow拼桌}
                onChange={(e) => setAllow拼桌(e.detail.value)}
                color='#ff6b6b'
              />
            </View>

            <View className={styles.switchRow}>
              <View>
                <Text className={styles.switchLabel}>仅女生可见</Text>
                <Text className={styles.switchDescription}>仅限女性参与</Text>
              </View>
              <Switch
                checked={isFemaleOnly}
                onChange={(e) => setIsFemaleOnly(e.detail.value)}
                color='#e84393'
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View className={styles.footer}>
        <View className={styles.submitButton} onClick={handleSubmit}>
          <Text className={styles.submitText}>发布饭局</Text>
        </View>
      </View>
    </View>
  );
};

export default CreatePage;
