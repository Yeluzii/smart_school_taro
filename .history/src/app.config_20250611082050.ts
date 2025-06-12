export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/my/index',
    'pages/login/index',
    'pages/userinfo/index',
    'pages/scene/index',
    'pages/concerning/index',
    'pages/individual/index',
    'pages/recording/index',
    'pages/revise/index',
    'pages/news/index',
    'pages/changepassword/index',
    'pages/control/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#2a94c2',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
  tabBar: {
    color: '#333',
    selectedColor: '#1296db',
    backgroundColor: '#fff',
    borderStyle: 'white',
    list: [
      {
        text: '首页',
        pagePath: 'pages/index/index',
        iconPath: 'static/tabs/home_default.png',
        selectedIconPath: 'static/tabs/home_selected.png',
      },
      {
        pagePath: 'pages/scene/index',
        text: '场景',
        iconPath: 'static/tabs/scene.png',
        selectedIconPath: 'static/tabs/scene-active.png',
      },
      {
        text: '我的',
        pagePath: 'pages/my/index',
        iconPath: 'static/tabs/my_default.png',
        selectedIconPath: 'static/tabs/my_selected.png',
      },
    ],
  },
})
