import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Message, User } from '../../types';
import { chatStore, mealStore, generateId } from '../../utils/store';
import styles from './index.module.scss';

const ChatRoomPage: React.FC = () => {
  const [chatId, setChatId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [inputText, setInputText] = useState('');
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [mealTitle, setMealTitle] = useState('');

  useEffect(() => {
    const { chatId: id } = Taro.getCurrentInstance().router?.params || {};
    if (id) {
      setChatId(id);
      loadChatData(id);
    }
  }, []);

  const loadChatData = (id: string) => {
    const chat = chatStore.getById(id);
    if (chat) {
      setMessages(chat.messages);
      setCurrentUser(chat.participants[0]);
      if (chat.participants.length > 1) {
        setOtherUser(chat.participants[1]);
      }

      const meal = mealStore.getById(chat.mealId);
      if (meal) {
        setMealTitle(meal.title);
      }
    }
  };

  const handleBack = () => {
    Taro.navigateBack();
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

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: generateId(),
      senderId: currentUser?.id || '',
      content: inputText.trim(),
      type: 'text',
      createdAt: new Date().toISOString()
    };

    chatStore.addMessage(chatId, newMessage);
    setMessages([...messages, newMessage]);
    setInputText('');
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <View className={styles.backButton} onClick={handleBack}>
          <Text className={styles.backIcon}>←</Text>
        </View>
        <View className={styles.headerInfo}>
          <Text className={styles.headerName}>{otherUser?.name || '聊天'}</Text>
          <Text className={styles.headerMeal}>{mealTitle}</Text>
        </View>
        <View className={styles.emergencyButton} onClick={handleEmergency}>
          <Text className={styles.emergencyIcon}>🆘</Text>
        </View>
      </View>

      <ScrollView scrollY className={styles.messageList}>
        {messages.map((msg, index) => {
          const isMy = msg.senderId === currentUser?.id;
          return (
            <View key={msg.id} className={styles.messageItem}>
              {index === 0 || (index > 0 && new Date(messages[index - 1].createdAt).getDate() !== new Date(msg.createdAt).getDate()) ? (
                <Text className={styles.messageTime}>{formatTime(msg.createdAt)}</Text>
              ) : null}
              <View className={`${styles.messageRow} ${isMy ? styles.my : styles.other}`}>
                {!isMy && (
                  <Image
                    src={otherUser?.avatar || 'https://picsum.photos/id/64/200/200'}
                    className={styles.avatar}
                    mode='aspectFill'
                  />
                )}
                <View className={styles.messageBubble}>
                  <Text className={styles.messageText}>{msg.content}</Text>
                </View>
                {isMy && (
                  <Image
                    src={currentUser?.avatar || 'https://picsum.photos/id/64/200/200'}
                    className={styles.avatar}
                    mode='aspectFill'
                  />
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View className={styles.footer}>
        <View className={styles.inputWrapper}>
          <Input
            className={styles.messageInput}
            placeholder='输入消息...'
            value={inputText}
            onInput={(e) => setInputText(e.detail.value)}
            onConfirm={handleSend}
          />
        </View>
        <View className={styles.sendButton} onClick={handleSend}>
          <Text className={styles.sendIcon}>➤</Text>
        </View>
      </View>
    </View>
  );
};

export default ChatRoomPage;
