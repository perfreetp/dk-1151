import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Chat, Meal } from '../../types';
import { chatStore, mealStore } from '../../utils/store';
import styles from './index.module.scss';

const ChatPage: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'confirmed'>('all');
  const [mealTitles, setMealTitles] = useState<Record<string, string>>({});

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = () => {
    const allChats = chatStore.getAll();
    setChats(allChats);

    const titles: Record<string, string> = {};
    allChats.forEach(chat => {
      const meal = mealStore.getById(chat.mealId);
      if (meal) {
        titles[chat.id] = meal.title;
      }
    });
    setMealTitles(titles);
  };

  const handleEmergency = () => {
    Taro.showModal({
      title: '紧急求助',
      content: '是否需要紧急求助？\n\n如果您遇到紧急情况或危险，请立即拨打报警电话：110',
      confirmText: '拨打110',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          Taro.makePhoneCall({
            phoneNumber: '110'
          });
        }
      }
    });
  };

  const handleChatClick = (chat: Chat) => {
    Taro.navigateTo({
      url: `/pages/chatroom/index?chatId=${chat.id}`
    });
  };

  const handleConfirm = (chat: Chat, e: any) => {
    e.stopPropagation();
    Taro.showModal({
      title: '确认饭局',
      content: '确认参加这个饭局吗？',
      confirmText: '确认',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          chatStore.update(chat.id, { status: 'confirmed' });
          mealStore.update(chat.mealId, { status: 'confirmed' });
          loadChats();
          Taro.showToast({ title: '已确认', icon: 'success' });
        }
      }
    });
  };

  const handleReschedule = (chat: Chat, e: any) => {
    e.stopPropagation();

    Taro.showModal({
      title: '改期',
      content: '请选择新的用餐日期',
      editable: true,
      placeholderText: '格式: 2026-06-20',
      success: (res) => {
        if (res.confirm && res.content) {
          const newDate = res.content;
          if (!/^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
            Taro.showToast({ title: '日期格式不正确，请使用 YYYY-MM-DD 格式', icon: 'none' });
            return;
          }

          const meal = mealStore.getById(chat.mealId);
          if (meal) {
            const originalDateTime = meal.originalDateTime || meal.dateTime;
            const newDateTime = `${newDate} 18:00`;

            mealStore.update(chat.mealId, {
              originalDateTime,
              dateTime: newDateTime
            });

            chatStore.update(chat.id, {
              lastMessage: {
                id: `sys_${Date.now()}`,
                senderId: 'system',
                content: `已将饭局改期至 ${newDateTime}`,
                type: 'system',
                createdAt: new Date().toISOString()
              }
            });

            loadChats();
            Taro.showToast({ title: '改期成功', icon: 'success' });
          }
        }
      }
    });
  };

  const handleCancelReschedule = (chat: Chat, e: any) => {
    e.stopPropagation();

    Taro.showModal({
      title: '取消改期',
      content: '确定要取消改期，恢复原定时间吗？',
      confirmText: '确定',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          const meal = mealStore.getById(chat.mealId);
          if (meal && meal.originalDateTime) {
            mealStore.update(chat.mealId, {
              dateTime: meal.originalDateTime,
              originalDateTime: undefined
            });

            chatStore.update(chat.id, {
              lastMessage: {
                id: `sys_${Date.now()}`,
                senderId: 'system',
                content: `已取消改期，恢复原定时间 ${meal.originalDateTime}`,
                type: 'system',
                createdAt: new Date().toISOString()
              }
            });

            loadChats();
            Taro.showToast({ title: '已恢复原定时间', icon: 'success' });
          }
        }
      }
    });
  };

  const filteredChats = () => {
    if (activeTab === 'all') return chats;
    if (activeTab === 'pending') return chats.filter(c => c.status === 'pending');
    if (activeTab === 'confirmed') return chats.filter(c => c.status === 'confirmed');
    return chats;
  };

  const pendingCount = chats.filter(c => c.status === 'pending').length;
  const confirmedCount = chats.filter(c => c.status === 'confirmed').length;

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <View className={styles.titleSection}>
          <Text className={styles.title}>聊天确认</Text>
          <Text className={styles.subtitle}>确认饭局细节，开启美好聚餐</Text>
        </View>
        <View className={styles.emergencyButton} onClick={handleEmergency}>
          <Text className={styles.emergencyIcon}>🆘</Text>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.tabBar}>
          <View
            className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <Text className={styles.tabText}>全部</Text>
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
        </View>

        {filteredChats().length > 0 ? (
          <View className={styles.chatList}>
            {filteredChats().map((chat) => {
              const meal = mealStore.getById(chat.mealId);
              const hasRescheduled = meal?.originalDateTime !== undefined;

              return (
                <View
                  key={chat.id}
                  className={styles.chatCard}
                  onClick={() => handleChatClick(chat)}
                >
                  <View className={styles.chatHeader}>
                    <View className={styles.avatarWrapper}>
                      <Image
                        src={chat.participants[1]?.avatar || chat.participants[0].avatar}
                        className={styles.avatar}
                        mode='aspectFill'
                      />
                      <View className={styles.statusDot} />
                    </View>
                    <View className={styles.userInfo}>
                      <Text className={styles.userName}>
                        {chat.participants[1]?.name || chat.participants[0].name}
                      </Text>
                      <Text className={styles.mealTitle}>{mealTitles[chat.id] || '饭局'}</Text>
                    </View>
                    <View
                      className={`${styles.statusTag} ${
                        chat.status === 'pending' ? styles.statusPending : styles.statusConfirmed
                      }`}
                    >
                      <Text>{chat.status === 'pending' ? '待确认' : '已确认'}</Text>
                    </View>
                  </View>

                  <View className={styles.chatContent}>
                    <Text className={styles.lastMessage}>
                      {chat.lastMessage?.content}
                    </Text>
                    <View className={styles.messageMeta}>
                      <Text className={styles.time}>{chat.lastMessage?.createdAt}</Text>
                      <View className={styles.unreadBadge}>
                        <Text className={styles.unreadText}>2</Text>
                      </View>
                    </View>
                  </View>

                  {hasRescheduled && meal && (
                    <View className={styles.rescheduleNotice}>
                      <Text className={styles.rescheduleText}>
                        已改期至: {meal.dateTime}
                      </Text>
                    </View>
                  )}

                  <View className={styles.chatFooter}>
                    {chat.status === 'pending' && (
                      <>
                        <View
                          className={`${styles.actionButton} ${styles.confirmButton}`}
                          onClick={(e) => handleConfirm(chat, e)}
                        >
                          <Text className={styles.confirmText}>确认参加</Text>
                        </View>
                        <View
                          className={`${styles.actionButton} ${styles.rescheduleButton}`}
                          onClick={(e) => handleReschedule(chat, e)}
                        >
                          <Text className={styles.rescheduleText}>改期</Text>
                        </View>
                      </>
                    )}
                    {chat.status === 'confirmed' && (
                      <>
                        {hasRescheduled && (
                          <View
                            className={`${styles.actionButton} ${styles.cancelRescheduleButton}`}
                            onClick={(e) => handleCancelReschedule(chat, e)}
                          >
                            <Text className={styles.cancelRescheduleText}>取消改期</Text>
                          </View>
                        )}
                        <View
                          className={`${styles.actionButton} ${styles.confirmButton}`}
                          style={{ background: '#74b9ff', flex: hasRescheduled ? 1 : 2 }}
                          onClick={() => handleChatClick(chat)}
                        >
                          <Text className={styles.confirmText}>进入聊天</Text>
                        </View>
                      </>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>💬</Text>
            <Text className={styles.emptyText}>暂无聊天</Text>
            <Text className={styles.emptySubtext}>去匹配列表发起聊天吧</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default ChatPage;
