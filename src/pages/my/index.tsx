import { View, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtButton, AtAvatar } from 'taro-ui'
import { useAppSelector, useAppDispatch } from '@/store'
import './index.scss'
import { clearUserInfo } from '@/store/user'

export default function My() {
  const userInfo = useAppSelector(state => state.user.userInfo)
  const dispatch = useAppDispatch()

  const handleClickLogin = () => {
    Taro.redirectTo({
      url: '/pages/login/index',
    })
  }

  const handleLogout = () => {
    Taro.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: async res => {
        if (res.confirm) {
          dispatch(clearUserInfo({}))
          Taro.redirectTo({ url: '/pages/login/index' })
        }
      },
    })
  }

  const menuItems = [
    { name: '个人信息', link: '/pages/individual/index' },
    { name: '操作记录', link: '/pages/recording/index' },
    { name: '修改密码', link: '/pages/revise/index' },
    { name: '关于我们', link: '/pages/concerning/index' },
  ]

  return (
    <View className="profile-container">
      {/* 顶部背景 */}
      <View className="header-bg">
        <View className="decor-circle circle-1"></View>
        <View className="decor-circle circle-2"></View>
      </View>

      {/* 用户信息卡片 */}
      <View className="profile-card">
        <View className="user-info">
          <View className="avatar-container">
            <AtAvatar
              className="avatar"
              circle
              image={
                userInfo.avatar ||
                'https://pic1.zhimg.com/80/v2-6afa72220d29f045c15217aa6b275808_720w.webp'
              }
            />
          </View>
          <View className="user-details">
            <View className="name">{userInfo.realName || '未登录用户'}</View>
            <View className="phone">{userInfo.mobile || '请登录查看手机号'}</View>
          </View>
        </View>
      </View>

      {/* 菜单列表 */}
      <View className="menu-container">
        {menuItems.map((item, index) => (
          <View
            key={index}
            className="menu-item"
            onClick={() => Taro.navigateTo({ url: item.link })}
          >
            <View className="menu-content">
              <View className="menu-name">{item.name}</View>
              <View className="menu-arrow">›</View>
            </View>
          </View>
        ))}
      </View>

      {/* 登录/退出按钮 */}
      <View className="action-container">
        {userInfo.id > 0 ? (
          <AtButton onClick={handleLogout} className="logout-btn">
            退出登录
          </AtButton>
        ) : (
          <AtButton onClick={handleClickLogin} className="login-btn">
            前往登录
          </AtButton>
        )}
      </View>

      {/* 底部装饰 */}
      <View className="footer-decor">
        <View className="decor-line"></View>
        <View className="decor-text">个人中心</View>
      </View>
    </View>
  )
}
