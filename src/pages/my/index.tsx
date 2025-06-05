import { View, Image, Navigator } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtButton, AtCard } from 'taro-ui'
import { useAppSelector, useAppDispatch } from '@/store'

import './index.scss'
import { clearUserInfo } from '@/store/user'

export default function My() {
  const userInfo = useAppSelector(state => state.user.userInfo)
  const handleClickLogin = () => {
    Taro.redirectTo({
      url: '/pages/login/index',
    })
  }

  const dispatch = useAppDispatch();
  const handleLogout = () => {
    Taro.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: async (res) => {
        if (res.confirm) {
          dispatch(clearUserInfo({}))
          Taro.redirectTo({
            url: '/pages/login/index',
          })
        }
      }
    })
  }

  return (
    <>
      <View className="my">
        {userInfo.id > 0 ? (
          <View>
            <Navigator url="/pages/userinfo/index">
              <AtCard title={userInfo.nickname}>
                <Image src={userInfo.avatar} className="avatar" />
              </AtCard>
            </Navigator>
            <AtButton
              onClick={handleLogout}
              className="logout-btn"
              type="secondary"
            >
              退出登录
            </AtButton>
          </View>
        ) : null}
        {userInfo.id > 0 ? null : (
          <AtButton onClick={handleClickLogin} type="primary">
            前往登录
          </AtButton>
        )}
      </View >
    </>
  )
}
