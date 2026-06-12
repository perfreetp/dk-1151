import { Meal, User, Restaurant, Chat, Message } from '../types';

export const mockUsers: User[] = [
  {
    id: 'user1',
    name: '小美',
    avatar: 'https://picsum.photos/id/64/200/200',
    gender: 'female',
    age: 26,
    rating: 4.8,
    punctuality: 95,
    completedMeals: 23,
    foodPreferences: ['川菜', '火锅', '日料'],
    tabooTopics: ['相亲话题', '工作压力'],
    tags: ['吃货', '摄影爱好者', '文艺青年'],
    bio: '喜欢探索美食，偶尔下厨，期待有趣的饭局',
    isVerified: true
  },
  {
    id: 'user2',
    name: '阿杰',
    avatar: 'https://picsum.photos/id/91/200/200',
    gender: 'male',
    age: 28,
    rating: 4.6,
    punctuality: 88,
    completedMeals: 15,
    foodPreferences: ['烧烤', '火锅', '西餐'],
    tabooTopics: ['政治话题', '宗教话题'],
    tags: ['程序员', '周末双休', '不挑食'],
    bio: '周末无聊想找人一起吃顿好的',
    isVerified: true
  },
  {
    id: 'user3',
    name: 'Lisa',
    avatar: 'https://picsum.photos/id/177/200/200',
    gender: 'female',
    age: 24,
    rating: 4.9,
    punctuality: 100,
    completedMeals: 31,
    foodPreferences: ['日料', '东南亚菜', '西餐'],
    tabooTopics: ['减肥话题'],
    tags: ['留学生', '日语专业', '小酌一杯'],
    bio: '美食是治愈一切的良药☀️',
    isVerified: true
  },
  {
    id: 'user4',
    name: '老王',
    avatar: 'https://picsum.photos/id/338/200/200',
    gender: 'male',
    age: 32,
    rating: 4.5,
    punctuality: 82,
    completedMeals: 42,
    foodPreferences: ['川菜', '湘菜', '东北菜'],
    tabooTopics: ['投资理财'],
    tags: ['金融从业', '撸猫', '篮球迷'],
    bio: '能吃辣，爱喝酒，找饭搭子',
    isVerified: false
  },
  {
    id: 'user5',
    name: '小雨',
    avatar: 'https://picsum.photos/id/1027/200/200',
    gender: 'female',
    age: 25,
    rating: 4.7,
    punctuality: 92,
    completedMeals: 18,
    foodPreferences: ['火锅', '烧烤', '云南菜'],
    tabooTopics: ['吸烟话题'],
    tags: ['设计师', '健身', '追剧'],
    bio: '正在健身但还是想吃火锅...',
    isVerified: true
  }
];

export const mockRestaurants: Restaurant[] = [
  {
    id: 'rest1',
    name: '海底捞火锅',
    cover: 'https://picsum.photos/id/292/300/300',
    rating: 4.8,
    cuisine: '火锅',
    address: '朝阳区建国路88号',
    priceRange: '¥100-200/人',
    menu: [
      { id: 'm1', name: '招牌毛肚', price: 88, image: 'https://picsum.photos/id/292/200/200', votes: 12 },
      { id: 'm2', name: '鲜切牛肉', price: 68, image: 'https://picsum.photos/id/292/200/200', votes: 8 },
      { id: 'm3', name: '虾滑', price: 58, image: 'https://picsum.photos/id/292/200/200', votes: 15 }
    ]
  },
  {
    id: 'rest2',
    name: '鼎泰丰',
    cover: 'https://picsum.photos/id/326/300/300',
    rating: 4.6,
    cuisine: '粤菜',
    address: '朝阳区三里屯路19号',
    priceRange: '¥80-150/人',
    menu: [
      { id: 'm4', name: '小笼包', price: 48, image: 'https://picsum.photos/id/326/200/200', votes: 20 },
      { id: 'm5', name: '虾仁蒸饺', price: 52, image: 'https://picsum.photos/id/326/200/200', votes: 14 }
    ]
  },
  {
    id: 'rest3',
    name: '胡大饭馆',
    cover: 'https://picsum.photos/id/401/300/300',
    rating: 4.9,
    cuisine: '川菜',
    address: '东城区簋街48号',
    priceRange: '¥60-120/人',
    menu: [
      { id: 'm6', name: '麻辣小龙虾', price: 128, image: 'https://picsum.photos/id/401/200/200', votes: 25 },
      { id: 'm7', name: '馋嘴牛蛙', price: 78, image: 'https://picsum.photos/id/401/200/200', votes: 18 }
    ]
  }
];

export const mockMeals: Meal[] = [
  {
    id: 'meal1',
    title: '周末火锅约起来',
    creator: mockUsers[0],
    participants: [mockUsers[0], mockUsers[2]],
    maxParticipants: 4,
    cuisine: '火锅',
    businessDistrict: '三里屯',
    dateTime: '2026-06-15 18:00',
    deadline: '2026-06-14 20:00',
    budget: 150,
    paymentType: 'aa',
    allow拼桌: true,
    chatPreference: '轻松聊天',
    tabooTopics: ['政治话题', '宗教话题'],
    isFemaleOnly: false,
    status: 'recruiting',
    restaurant: mockRestaurants[0],
    createdAt: '2026-06-10 10:00'
  },
  {
    id: 'meal2',
    title: '寻找吃辣小伙伴',
    creator: mockUsers[3],
    participants: [mockUsers[3]],
    maxParticipants: 3,
    cuisine: '川菜',
    businessDistrict: '簋街',
    dateTime: '2026-06-16 19:00',
    deadline: '2026-06-15 18:00',
    budget: 100,
    paymentType: 'aa',
    allow拼桌: false,
    chatPreference: '深度交流',
    tabooTopics: ['工作压力'],
    isFemaleOnly: false,
    status: 'recruiting',
    restaurant: mockRestaurants[2],
    createdAt: '2026-06-11 14:00'
  },
  {
    id: 'meal3',
    title: '精致下午茶时光',
    creator: mockUsers[2],
    participants: [mockUsers[2]],
    maxParticipants: 2,
    cuisine: '东南亚菜',
    businessDistrict: '国贸CBD',
    dateTime: '2026-06-17 15:00',
    deadline: '2026-06-16 12:00',
    budget: 200,
    paymentType: 'treat',
    allow拼桌: false,
    chatPreference: '轻松聊天',
    tabooTopics: [],
    isFemaleOnly: true,
    status: 'recruiting',
    createdAt: '2026-06-12 09:00'
  },
  {
    id: 'meal4',
    title: '日料控集合',
    creator: mockUsers[4],
    participants: [mockUsers[4], mockUsers[0]],
    maxParticipants: 4,
    cuisine: '日料',
    businessDistrict: '三里屯',
    dateTime: '2026-06-18 12:00',
    deadline: '2026-06-17 20:00',
    budget: 300,
    paymentType: 'split',
    allow拼桌: true,
    chatPreference: '都可以',
    tabooTopics: ['吸烟话题'],
    isFemaleOnly: false,
    status: 'confirmed',
    restaurant: mockRestaurants[1],
    createdAt: '2026-06-09 16:00'
  },
  {
    id: 'meal5',
    title: '深夜烧烤局',
    creator: mockUsers[1],
    participants: [mockUsers[1], mockUsers[3]],
    maxParticipants: 6,
    cuisine: '烧烤',
    businessDistrict: '望京',
    dateTime: '2026-06-19 21:00',
    deadline: '2026-06-19 18:00',
    budget: 80,
    paymentType: 'aa',
    allow拼桌: true,
    chatPreference: '轻松聊天',
    tabooTopics: ['相亲话题'],
    isFemaleOnly: false,
    status: 'recruiting',
    createdAt: '2026-06-13 08:00'
  }
];

export const mockChats: Chat[] = [
  {
    id: 'chat1',
    mealId: 'meal4',
    participants: [mockUsers[4], mockUsers[0]],
    messages: [
      {
        id: 'msg1',
        senderId: 'user5',
        content: '你好呀！看到你的日料局，很感兴趣～',
        type: 'text',
        createdAt: '2026-06-13 10:00'
      },
      {
        id: 'msg2',
        senderId: 'user1',
        content: '太好了！我也很期待，终于有人一起了',
        type: 'text',
        createdAt: '2026-06-13 10:05'
      },
      {
        id: 'msg3',
        senderId: 'user5',
        content: '对了，你有什么必点的推荐吗？',
        type: 'text',
        createdAt: '2026-06-13 10:08'
      },
      {
        id: 'msg4',
        senderId: 'user1',
        content: '他们家的三文鱼刺身超新鲜！还有鹅肝手握',
        type: 'text',
        createdAt: '2026-06-13 10:10'
      }
    ],
    status: 'confirmed',
    lastMessage: {
      id: 'msg4',
      senderId: 'user1',
      content: '他们家的三文鱼刺身超新鲜！还有鹅肝手握',
      type: 'text',
      createdAt: '2026-06-13 10:10'
    },
    updatedAt: '2026-06-13 10:10'
  },
  {
    id: 'chat2',
    mealId: 'meal1',
    participants: [mockUsers[0], mockUsers[2]],
    messages: [
      {
        id: 'msg5',
        senderId: 'user3',
        content: '你好！想问一下你的火锅局还加人吗？',
        type: 'text',
        createdAt: '2026-06-13 11:00'
      }
    ],
    status: 'pending',
    lastMessage: {
      id: 'msg5',
      senderId: 'user3',
      content: '你好！想问一下你的火锅局还加人吗？',
      type: 'text',
      createdAt: '2026-06-13 11:00'
    },
    updatedAt: '2026-06-13 11:00'
  }
];
