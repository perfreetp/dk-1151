import Taro from '@tarojs/taro';
import { Meal, Chat, User } from '../types';
import { mockMeals, mockChats, mockUsers } from '../data/mock';

const STORAGE_KEYS = {
  MEALS: 'fanda_meal',
  CHATS: 'fanda_chat',
  USER: 'fanda_user'
};

export const mealStore = {
  getAll: (): Meal[] => {
    try {
      const data = Taro.getStorageSync(STORAGE_KEYS.MEALS);
      if (data) {
        return JSON.parse(data);
      }
      const initialData = [...mockMeals];
      Taro.setStorageSync(STORAGE_KEYS.MEALS, JSON.stringify(initialData));
      return initialData;
    } catch (error) {
      console.error('[MealStore] Error getting meals:', error);
      return mockMeals;
    }
  },

  add: (meal: Meal): void => {
    try {
      const meals = mealStore.getAll();
      meals.unshift(meal);
      Taro.setStorageSync(STORAGE_KEYS.MEALS, JSON.stringify(meals));
    } catch (error) {
      console.error('[MealStore] Error adding meal:', error);
    }
  },

  update: (id: string, updates: Partial<Meal>): void => {
    try {
      const meals = mealStore.getAll();
      const index = meals.findIndex(m => m.id === id);
      if (index !== -1) {
        meals[index] = { ...meals[index], ...updates };
        Taro.setStorageSync(STORAGE_KEYS.MEALS, JSON.stringify(meals));
      }
    } catch (error) {
      console.error('[MealStore] Error updating meal:', error);
    }
  },

  getById: (id: string): Meal | undefined => {
    const meals = mealStore.getAll();
    return meals.find(m => m.id === id);
  },

  delete: (id: string): void => {
    try {
      const meals = mealStore.getAll();
      const filtered = meals.filter(m => m.id !== id);
      Taro.setStorageSync(STORAGE_KEYS.MEALS, JSON.stringify(filtered));
    } catch (error) {
      console.error('[MealStore] Error deleting meal:', error);
    }
  }
};

export const chatStore = {
  getAll: (): Chat[] => {
    try {
      const data = Taro.getStorageSync(STORAGE_KEYS.CHATS);
      if (data) {
        return JSON.parse(data);
      }
      const initialData = [...mockChats];
      Taro.setStorageSync(STORAGE_KEYS.CHATS, JSON.stringify(initialData));
      return initialData;
    } catch (error) {
      console.error('[ChatStore] Error getting chats:', error);
      return mockChats;
    }
  },

  add: (chat: Chat): void => {
    try {
      const chats = chatStore.getAll();
      chats.unshift(chat);
      Taro.setStorageSync(STORAGE_KEYS.CHATS, JSON.stringify(chats));
    } catch (error) {
      console.error('[ChatStore] Error adding chat:', error);
    }
  },

  update: (id: string, updates: Partial<Chat>): void => {
    try {
      const chats = chatStore.getAll();
      const index = chats.findIndex(c => c.id === id);
      if (index !== -1) {
        chats[index] = { ...chats[index], ...updates };
        Taro.setStorageSync(STORAGE_KEYS.CHATS, JSON.stringify(chats));
      }
    } catch (error) {
      console.error('[ChatStore] Error updating chat:', error);
    }
  },

  getById: (id: string): Chat | undefined => {
    const chats = chatStore.getAll();
    return chats.find(c => c.id === id);
  },

  addMessage: (chatId: string, message: any): void => {
    try {
      const chats = chatStore.getAll();
      const index = chats.findIndex(c => c.id === chatId);
      if (index !== -1) {
        chats[index].messages.push(message);
        chats[index].lastMessage = message;
        chats[index].updatedAt = new Date().toISOString();
        Taro.setStorageSync(STORAGE_KEYS.CHATS, JSON.stringify(chats));
      }
    } catch (error) {
      console.error('[ChatStore] Error adding message:', error);
    }
  }
};

export const userStore = {
  getCurrentUser: (): User => {
    try {
      const data = Taro.getStorageSync(STORAGE_KEYS.USER);
      if (data) {
        return JSON.parse(data);
      }
      const currentUser = mockUsers[0];
      Taro.setStorageSync(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      return currentUser;
    } catch (error) {
      console.error('[UserStore] Error getting current user:', error);
      return mockUsers[0];
    }
  },

  updateRating: (newRating: number): void => {
    try {
      const user = userStore.getCurrentUser();
      user.rating = newRating;
      Taro.setStorageSync(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('[UserStore] Error updating rating:', error);
    }
  },

  incrementCancelled: (): void => {
    console.log('[UserStore] Cancelled count incremented');
  }
};

export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
