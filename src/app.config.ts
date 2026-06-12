export default defineAppConfig({
  pages: [
    'pages/square/index',
    'pages/create/index',
    'pages/match/index',
    'pages/chat/index',
    'pages/mydates/index',
    'pages/detail/index',
    'pages/user/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff8f5',
    navigationBarTitleText: '饭搭子',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#636e72',
    selectedColor: '#ff6b6b',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/square/index',
        text: '饭局广场'
      },
      {
        pagePath: 'pages/create/index',
        text: '创建饭局'
      },
      {
        pagePath: 'pages/match/index',
        text: '匹配列表'
      },
      {
        pagePath: 'pages/chat/index',
        text: '聊天确认'
      },
      {
        pagePath: 'pages/mydates/index',
        text: '我的饭约'
      }
    ]
  }
})
