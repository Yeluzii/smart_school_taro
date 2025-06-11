import { useState, useEffect } from 'react'
import { View, Text, Input, Button } from '@tarojs/components'
import { sendCode, mobileLogin, getUserInfo, accountLogin } from '@/service/user'
import { isPhoneAvailable, isCodeAvailable } from '../../utils/validate'

import Taro from '@tarojs/taro'
import { setUserInfo } from '@/store/user'
import './index.scss'
import { useAppDispatch } from '@/store'
const Login = () => {
  const [loginType, setLoginType] = useState('mobile') // mobile | account
  // 倒计时
  const [count, setCount] = useState(60)
  const [timer, setTimer] = useState(false)
  // 登录表单
  const [form, setForm] = useState<MobileLoginDTO>({
    mobile: '18168085379',
    code: '',
  })

  const [accountForm, setAccountForm] = useState<AccountLoginDTO>({
    username: '1',
    password: '1',
  })
  useEffect(() => {
    let interval
    if (timer) {
      interval = setInterval(() => {
        setCount(prevCount => {
          if (prevCount === 1) {
            clearInterval(interval)
            setTimer(false)
            return 60
          }
          return prevCount - 1
        })
      }, 1000)
    }
  }, [timer])
  // 发送⼿机验证码
  const sendMobileCode = async () => {
    if (form.mobile && isPhoneAvailable(form.mobile)) {
      setTimer(true)
      const res = await sendCode(form.mobile)
      if (res.code === 0) {
        Taro.showToast({
          title: '验证码发送成功',
          icon: 'success',
        })
      } else {
        Taro.showToast({
          title: '验证码发送失败',
          icon: 'error',
        })
      }
    } else {
      Taro.showToast({
        title: '请输⼊正确的⼿机号',
        icon: 'none',
      })
    }
  }
  const dispatch = useAppDispatch()
  const getLoginUserInfo = async () => {
    const res = await getUserInfo()
    console.log('Get user info response:', res)
    if (res.code === 0) {
      console.log('User info data:', res.data)
      dispatch(setUserInfo(res.data))
      Taro.setStorageSync('user', res.data)
    } else {
      console.error('Failed to get user info:', res.msg)
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
    }
  }
  // ⼿机号验证码登录
  const handleAccountLogin = async () => {
    if (!accountForm.username || !accountForm.password) {
      Taro.showToast({
        title: '请输入用户名和密码',
        icon: 'none',
      })
      return
    }

    const res = await accountLogin(accountForm)
    if (res.code === 0) {
      Taro.setStorageSync('token', res.data.accessToken)
      getLoginUserInfo()
      Taro.showModal({
        title: '登录成功',
        success: () => {
          Taro.switchTab({
            url: '/pages/index/index',
          })
        },
      })
    } else {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
      return
    }
  }

  const handleLoginClick = async () => {
    // 短信登录逻辑
    if (!form.mobile || !isPhoneAvailable(form.mobile)) {
      Taro.showToast({
        title: '请输⼊正确的⼿机号',
        icon: 'none',
      })
      return
    }
    if (!form.code || !isCodeAvailable(form.code)) {
      Taro.showToast({
        title: '请输⼊正确的验证码',
        icon: 'none',
      })
      return
    }
    const res = await mobileLogin(form)
    if (res.code === 0) {
      Taro.setStorageSync('token', res.data.accessToken)
      await getLoginUserInfo()
      Taro.showModal({
        title: '登录成功',
        success: () => {
          Taro.switchTab({
            url: '/pages/index/index',
          })
        },
      })
    } else {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
    }
  }
  const handleInputCode = e => {
    setForm({ ...form, code: e.detail.value })
  }
  const handleInputPhone = e => {
    setForm({ ...form, mobile: e.detail.value })
  }
  return (
    <View className="login-container">
      <View className="login-header">
        <view style={{ marginBottom: '30rpx' }}>
          <Text className="login-title">欢迎登录</Text>
        </view>
        <Text className="login-subtitle">请选择您的登录方式</Text>
      </View>

      <View className="login-tabs">
        <View
          className={`login-tab ${loginType === 'mobile' ? 'active' : ''}`}
          onClick={() => setLoginType('mobile')}
        >
          短信登录
        </View>
        <View
          className={`login-tab ${loginType === 'account' ? 'active' : ''}`}
          onClick={() => setLoginType('account')}
        >
          账号登录
        </View>
      </View>

      <View className="login-form">
        {loginType === 'mobile' ? (
          <View className="mobile-login">
            <View className="input-group">
              <Text className="input-label">手机号</Text>
              <Input
                className="login-input"
                type="text"
                placeholder="请输入手机号"
                value={form.mobile}
                onInput={e => handleInputPhone(e)}
              />
            </View>

            <View className="input-group">
              <Text className="input-label">验证码</Text>
              <View className="code-input-container">
                <Input
                  className="login-input code-input"
                  type="text"
                  placeholder="请输入验证码"
                  value={form.code}
                  onInput={e => handleInputCode(e)}
                />
                {!timer ? (
                  <Button
                    className="send-code-btn"
                    onClick={sendMobileCode}
                    disabled={!form.mobile || !isPhoneAvailable(form.mobile)}
                  >
                    获取验证码
                  </Button>
                ) : (
                  <Button className="send-code-btn countdown" disabled>
                    {count}秒后重发
                  </Button>
                )}
              </View>
            </View>

            <Button className="login-btn" onClick={handleLoginClick}>
              登录
            </Button>
          </View>
        ) : (
          <View className="account-login">
            <View className="input-group">
              <Text className="input-label">用户名</Text>
              <Input
                className="login-input"
                type="text"
                placeholder="请输入用户名"
                value={accountForm.username}
                onInput={e => setAccountForm({ ...accountForm, username: e.detail.value })}
              />
            </View>

            <View className="input-group">
              <Text className="input-label">密码</Text>
              <Input
                className="login-input"
                type="password"
                placeholder="请输入密码"
                value={accountForm.password}
                onInput={e => setAccountForm({ ...accountForm, password: e.detail.value })}
              />
            </View>

            <Button className="login-btn" onClick={handleAccountLogin}>
              登录
            </Button>
          </View>
        )}

        <View className="agreement">
          <Text className="agreement-text">登录即视为同意</Text>
          <Text className="agreement-link">《服务条款》</Text>
          <Text className="agreement-text">和</Text>
          <Text className="agreement-link">《隐私协议》</Text>
        </View>
      </View>
    </View>
  )
}
export default Login
