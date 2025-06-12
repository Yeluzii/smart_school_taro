import { useState, useEffect } from 'react'
import { View, Text, Input, Button } from '@tarojs/components'
import { sendCode, mobileLogin } from '@/service/user'
import { isCodeAvailable, isPhoneAvailable } from '../../utils/validate'
import Taro from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import './index.scss'

const PhoneVerifyPage = () => {
  const dispatch = useDispatch()
  const userInfo = useSelector(state => state.user.userInfo)

  const [mobile, setMobile] = useState('')
  const [code, setCode] = useState('')
  const [count, setCount] = useState(60)
  const [timer, setTimer] = useState(false)

  useEffect(() => {
    if (userInfo && userInfo.mobile) {
      setMobile(userInfo.mobile)
    }
  }, [userInfo])

  useEffect(() => {
    let interval
    if (timer) {
      interval = setInterval(() => {
        setCount(prev => {
          if (prev === 1) {
            clearInterval(interval)
            setTimer(false)
            return 60
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timer])

  // 发送验证码
  const sendCodeToMobile = async () => {
    if (userInfo && isPhoneAvailable(userInfo.mobile)) {
      setTimer(true)
      const res = await sendCode(userInfo.mobile)
      if (res.code === 0) {
        Taro.showToast({ title: '验证码已发送', icon: 'success' })
      } else {
        Taro.showToast({ title: res.msg || '发送失败', icon: 'error' })
      }
    } else {
      Taro.showToast({ title: '手机号无效', icon: 'none' })
    }
  }

  // 确认验证
  const confirmVerify = async () => {
    if (!code || !isCodeAvailable(code)) {
      Taro.showToast({ title: '请输入正确的验证码', icon: 'none' })
      return
    }
    const res = await mobileLogin({ mobile: userInfo.mobile, code })
    if (res.code === 0) {
      Taro.showModal({
        title: '验证成功',
        content: '手机号验证通过',
        showCancel: false,
        success: () => {
          Taro.navigateTo({ url: '/pages/changepassword/index' })
        },
      })
    } else {
      Taro.showToast({ title: '验证失败', icon: 'none' })
    }
  }

  return (
    <View className="phone-verify-container">
      {/* 顶部安全提示 */}
      <View className="security-header">
        <View className="security-icon">
          <View className="shield-icon">🔒</View>
        </View>
        <Text className="security-title">身份安全验证</Text>
        <Text className="security-subtitle">为保障您的账户安全，请完成手机验证</Text>
      </View>

      {/* 安全提示卡片 */}
      <View className="security-tip-card">
        <Text className="tip-text">验证通过后才能进行密码更改操作</Text>
        <Text className="tip-text">系统将向您的绑定手机号发送验证码</Text>
      </View>

      {/* 手机号输入区域 */}
      <View className="input-group">
        <Text className="input-label">手机号</Text>
        <View className="phone-input-container">
          <Input className="phone-input" type="text" disabled value={mobile} placeholder="手机号" />
          <Text className="country-code">+86</Text>
        </View>
      </View>

      {/* 验证码输入区域 */}
      <View className="input-group">
        <Text className="input-label">短信验证码</Text>
        <View className="code-input-container">
          <Input
            className="code-input"
            type="number"
            placeholder="请输入4位验证码"
            value={code}
            onInput={e => setCode(e.detail.value)}
            maxlength={6}
          />
          <Button
            className={`code-button ${timer ? 'disabled' : ''}`}
            onClick={sendCodeToMobile}
            disabled={timer}
          >
            {timer ? `${count}秒后重发` : '获取验证码'}
          </Button>
        </View>
      </View>

      {/* 验证码提示 */}
      <View className="code-tips">
        <Text className="tip">• 验证码已发送至您的手机，请查收</Text>
        <Text className="tip">• 短信验证码有效期为5分钟</Text>
        <Text className="tip">• 请勿泄露验证码给他人</Text>
      </View>

      {/* 验证按钮 */}
      <Button
        className={`verify-button ${!code ? 'disabled' : ''}`}
        onClick={confirmVerify}
        disabled={!code}
      >
        立即验证
      </Button>

      {/* 底部客服信息 */}
      <View className="footer-note">
        <Text className="note">遇到问题？</Text>
        <Text className="contact">联系客服: 400-888-8888</Text>
      </View>
    </View>
  )
}

export default PhoneVerifyPage
