import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtButton, AtAvatar, AtList, AtListItem } from 'taro-ui'

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
    <>
      {/* 头像和用户信息区域 */}
      <View className="home">
        <View className="user-info">
          <AtAvatar className="avatar" circle image={userInfo.avatar} />
          <View className="user-details">
            <View className="name">{userInfo.username}</View>
            <View className="family">手机号：{userInfo.mobile}</View>
          </View>
        </View>

        {/* 菜单列表 */}
        <AtList className="menu-list">
          {menuItems.map((item, index) => (
            <AtListItem
              key={index}
              title={item.name}
              arrow="right"
              onClick={() => Taro.navigateTo({ url: item.link })}
            />
          ))}
        </AtList>

        {/* 用户信息展示和退出登录按钮区域 */}
        <View className="my">
          {userInfo.id > 0 ? (
            <View>
              <AtButton onClick={handleLogout} className="logout-btn" type="secondary">
                退出登录
              </AtButton>
            </View>
          ) : (
            <AtButton onClick={handleClickLogin} type="primary">
              前往登录
            </AtButton>
          )}
        </View>
      </View>
    </>
  )
}
