import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Chat } from '../../types';
import { mockChats } from '../../data/mock';
import styles from './index.module.scss';

const ChatPage: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'confirmed'>('all');

  useEffect(() => {
    setChats(mockChats);
  }, []);

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
      url: `/pages/chat/index?chatId=${chat.id}`
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
          setChats(chats.map(c => 
            c.id === chat.id ? { ...c, status: 'confirmed' } : c
          ));
          Taro.showToast({ title: '已确认', icon: 'success' });
        }
      }
    });
  };

  const handleReschedule = (chat: Chat, e: any) => {
    e.stopPropagation();
    Taro.showToast({ title: '改期功能开发中', icon: 'none' });
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
            {filteredChats().map((chat) => (
              <View
                key={chat.id}
                className={styles.chatCard}
                onClick={() => handleChatClick(chat)}
              >
                <View className={styles.chatHeader}>
                  <View className={styles.avatarWrapper}>
                    <Image
                      src={chat.participants[0].avatar}
                      className={styles.avatar}
                      mode='aspectFill'
                    />
                    <View className={styles.statusDot} />
                  </View>
                  <View className={styles.userInfo}>
                    <Text className={styles.userName}>{chat.participants[0].name}</Text>
                    <Text className={styles.mealTitle}>日料控集合</Text>
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
                    <View
                      className={`${styles.actionButton} ${styles.confirmButton}`}
                      style={{ background: $color-info }}
                      onClick={() => handleChatClick(chat)}
                    >
                      <Text className={styles.confirmText}>进入聊天</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
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
