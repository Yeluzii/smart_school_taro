import Taro from '@tarojs/taro'
import { View, Button, Input, Text } from '@tarojs/components'
import { useState } from 'react'
import { changePassword } from '@/service/user'
import './index.scss'

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  // 计算密码强度
  const calculatePasswordStrength = password => {
    if (!password) return 0

    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    return strength
  }

  const handlePasswordChange = value => {
    setNewPassword(value)
    setPasswordStrength(calculatePasswordStrength(value))
  }

  const handleChangePassword = async () => {
    if (newPassword.length < 8) {
      Taro.showToast({ title: '密码长度至少8位', icon: 'none' })
      return
    }

    if (newPassword !== confirmPassword) {
      Taro.showToast({ title: '两次输入的密码不一致', icon: 'none' })
      return
    }

    const response = await changePassword({ newPassword })
    if (response.code === 0) {
      Taro.showToast({ title: '密码修改成功', icon: 'success' })
      Taro.removeStorageSync('user')
      Taro.removeStorageSync('token')
      setTimeout(() => {
        Taro.redirectTo({
          url: '/pages/login/index',
        })
      }, 1500)
    } else {
      Taro.showToast({ title: response.msg || '更改失败', icon: 'none' })
    }
  }

  return (
    <View className="change-password-page">
      <View className="header">
        <Text className="title">重置密码</Text>
        <Text className="subtitle">请设置新的登录密码</Text>
      </View>

      <View className="password-card">
        <View className="input-group">
          <Text className="label">新密码</Text>
          <View className="input-container">
            <Input
              className="input-field"
              type={showPassword ? 'text' : 'password'}
              placeholder="请输入8位以上密码"
              value={newPassword}
              onInput={e => handlePasswordChange(e.detail.value)}
            />
            <View
              className={`eye-icon ${showPassword ? 'active' : ''}`}
              onClick={() => setShowPassword(!showPassword)}
            >
              <View className="eye"></View>
            </View>
          </View>

          {/* 密码强度指示器 */}
          <View className="password-strength">
            <Text className="strength-label">密码强度：</Text>
            <View className="strength-indicator">
              {[1, 2, 3, 4].map(level => (
                <View
                  key={level}
                  className={`indicator-bar ${passwordStrength >= level ? 'active' : ''}`}
                ></View>
              ))}
            </View>
            <Text className="strength-text">
              {passwordStrength === 0
                ? '弱'
                : passwordStrength === 1
                  ? '较弱'
                  : passwordStrength === 2
                    ? '中等'
                    : passwordStrength === 3
                      ? '强'
                      : '非常强'}
            </Text>
          </View>
        </View>

        <View className="input-group">
          <Text className="label">确认密码</Text>
          <Input
            className="input-field"
            type="password"
            placeholder="请再次输入新密码"
            value={confirmPassword}
            onInput={e => setConfirmPassword(e.detail.value)}
          />
        </View>

        <View className="password-tips">
          <Text className="tip-item">· 密码长度至少8位</Text>
          <Text className="tip-item">· 建议包含字母、数字和符号</Text>
          <Text className="tip-item">· 避免使用常见密码</Text>
        </View>

        <Button className="submit-btn" onClick={handleChangePassword} hoverClass="btn-hover">
          确认修改
        </Button>
      </View>

      <View className="security-tips">
        <Text className="icon">🔒</Text>
        <Text className="text">您的密码信息已加密保护</Text>
      </View>
    </View>
  )
}

export default ChangePassword
