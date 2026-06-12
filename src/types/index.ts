export interface Meal {
  id: string;
  title: string;
  creator: User;
  participants: User[];
  maxParticipants: number;
  cuisine: string;
  businessDistrict: string;
  dateTime: string;
  originalDateTime?: string;
  deadline: string;
  budget: number;
  paymentType: 'aa' | 'treat' | 'split';
  allow拼桌: boolean;
  chatPreference: string;
  tabooTopics: string[];
  isFemaleOnly: boolean;
  status: 'recruiting' | 'confirmed' | 'completed' | 'cancelled';
  restaurant?: Restaurant;
  menuVotes?: MenuVote[];
  checkIns?: CheckIn[];
  comments?: Comment[];
  ratings?: { odinnerId: string; rating: number; comment: string; tags: string[] }[];
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  gender: 'male' | 'female';
  age: number;
  rating: number;
  punctuality: number;
  completedMeals: number;
  foodPreferences: string[];
  tabooTopics: string[];
  tags: string[];
  bio: string;
  isVerified: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  cover: string;
  rating: number;
  cuisine: string;
  address: string;
  priceRange: string;
  menu: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  votes: number;
}

export interface MenuVote {
  odinnerId: string;
  voterId: string;
  menuItemId: string;
  createdAt: string;
}

export interface CheckIn {
  userId: string;
  location: string;
  photo: string;
  createdAt: string;
}

export interface Comment {
  odinnerId: string;
  commenterId: string;
  rating: number;
  content: string;
  tags: string[];
  createdAt: string;
}

export interface Chat {
  id: string;
  mealId: string;
  participants: User[];
  messages: Message[];
  status: 'pending' | 'confirmed' | 'rejected' | 'completed';
  lastMessage?: Message;
  updatedAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'system';
  createdAt: string;
}

export interface Filter {
  businessDistrict?: string;
  cuisine?: string;
  dateTime?: string;
  paymentType?: 'aa' | 'treat' | 'all';
  budget?: number;
}

export const BUSINESS_DISTRICTS = [
  '国贸CBD',
  '三里屯',
  '中关村',
  '望京',
  '五道口',
  '西单',
  '王府井',
  '朝阳大悦城',
  '北京apm',
  '新中关'
];

export const CUISINES = [
  '川菜',
  '粤菜',
  '湘菜',
  '东北菜',
  '火锅',
  '烧烤',
  '日料',
  '韩料',
  '西餐',
  '东南亚菜',
  '新疆菜',
  '云南菜',
  '其他'
];

export const TABOO_TOPICS = [
  '政治话题',
  '宗教话题',
  '前任话题',
  '工作压力',
  '相亲话题',
  '投资理财',
  '减肥话题',
  '吸烟话题'
];

export const CHAT_PREFERENCES = [
  '安静用餐',
  '轻松聊天',
  '深度交流',
  '都可以'
];
