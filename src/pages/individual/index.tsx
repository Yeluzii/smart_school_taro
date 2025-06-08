import { View, Text, Image } from '@tarojs/components'
import { useEffect, useState } from 'react'
import { AtIcon } from 'taro-ui'
import Taro from '@tarojs/taro'
import { useAppSelector } from '@/store'
import { getUserInfo } from '@/service/user'
import './index.scss'

const Individual = () => {
  const userInfo = useAppSelector(state => state.user.userInfo)
  const [loading, setLoading] = useState(false)
  const [userDetail, setUserDetail] = useState<UserVO>({
    id: 0,
    mobile: '',
    realName: '',
    avatar: '',
    gender: 0,
    createTime: '',
    email: '',
  })

  useEffect(() => {
    fetchUserInfo()
  }, [])

  const fetchUserInfo = async () => {
    try {
      setLoading(true)
      const res = await getUserInfo()
      if (res.code === 0) {
        setUserDetail(res.data)
      } else {
        Taro.showToast({
          title: '获取用户信息失败',
          icon: 'error',
          duration: 2000,
        })
      }
    } catch (error) {
      console.error('获取用户信息失败', error)
      Taro.showToast({
        title: '获取用户信息失败',
        icon: 'error',
        duration: 2000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditInfo = () => {
    Taro.navigateTo({
      url: '/pages/userinfo/index',
    })
  }

  return (
    <View className="individual-page">
      <View className="user-header">
        <View className="avatar-container">
          <Image
            className="avatar"
            src={userDetail.avatar || 'https://joeschmoe.io/api/v1/random'}
            mode="aspectFill"
          />
        </View>
        <View className="username">{userDetail.realName || '未设置昵称'}</View>
      </View>

      <View className="info-card">
        <View className="card-title">个人信息</View>

        <View className="info-item">
          <View className="item-label">用户ID</View>
          <View className="item-value">{userDetail.id}</View>
        </View>

        <View className="info-item">
          <View className="item-label">手机号</View>
          <View className="item-value">{userDetail.mobile || '未设置'}</View>
        </View>

        <View className="info-item">
          <View className="item-label">昵称</View>
          <View className="item-value">{userDetail.realName || '未设置'}</View>
        </View>

        <View className="info-item">
          <View className="item-label">性别</View>
          <View className="item-value">{userDetail.gender === 0 ? '男' : '女'}</View>
        </View>

        <View className="info-item">
          <View className="item-label">邮箱</View>
          <View className="item-value">{userDetail.email || '未设置'}</View>
        </View>
      </View>

      <View className="edit-button" onClick={handleEditInfo}>
        <Text>编辑个人信息</Text>
        <AtIcon value="edit" size="18" color="#fff" />
      </View>
    </View>
  )
}

export default Individual
