import { logout } from '@/service/user'
import { createSlice } from '@reduxjs/toolkit'
import Taro from '@tarojs/taro'
// 初始化⽤户
const userInfo: UserVO = Taro.getStorageSync('user') || {
  id: 0,
  mobile: '',
  username: '',
  realName: '',
  avatar: '',
  gender: 0,
  createTime: '',
  email: '',
}
export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo,
  },
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload
    },
    clearUserInfo: (state, _) => {
      state.userInfo = {
        id: 0,
        mobile: '',
        username: '',
        realName: '',
        avatar: '',
        gender: 0,
        createTime: '',
        email: '',
      }
      logout()
      Taro.removeStorageSync('token')
      Taro.removeStorageSync('user')
    },
  },
})
export const { setUserInfo, clearUserInfo } = userSlice.actions
export default userSlice.reducer
