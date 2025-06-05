import { useState, useEffect } from 'react'
import { View, Text, Input, Button } from '@tarojs/components'
import { sendCode, mobileRegister, getUserInfo, getTopOrgList } from '@/service/user'
import { isPhoneAvailable, isCodeAvailable } from '../../utils/validate'

import Taro from '@tarojs/taro'
import { setUserInfo } from '@/store/user'
import './index.scss'
import { useAppDispatch } from '@/store'

const Register = () => {
  const [orgName, setOrgName] = useState('')
  const [orgSuggestions, setOrgSuggestions] = useState<TenantVO[]>([])
  // 倒计时
  const [count, setCount] = useState(60)
  const [timer, setTimer] = useState(false)
  // 登录表单
  const [form, setForm] = useState<MobileRegisterDTO>({
    mobile: '18168085379',
    code: '',
    tenantId: 0,
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
    if (res.code === 0) {
      dispatch(setUserInfo(res.data))
      console.log(res.data)
      Taro.setStorageSync('user', res.data)
    } else {
      Taro.showToast({
        title: res.msg,
        icon: 'none',
      })
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
    const res = await mobileRegister(form)
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
  const handleInputCode = e => {
    setForm({ ...form, code: e.detail.value })
  }
  const handleInputPhone = e => {
    setForm({ ...form, mobile: e.detail.value })
  }

  const handleSelectOrg = (tenantId: number, orgName: string) => {
    setForm({
      ...form,
      tenantId, // 直接绑定到 form.tenantId
    });
    setOrgName(orgName);
    setOrgSuggestions([]);
  };

  const handleOrgSearch = async (name: string) => {
    setOrgName(name);
    if (!name) {
      setOrgSuggestions([]);
      return;
    }

    try {
      const result = await getTopOrgList(name); // 调用接口传入 name 参数
      setOrgSuggestions(result.data); // 设置建议列表
    } catch (error) {
      console.error('组织搜索失败:', error);
      setOrgSuggestions([]);
    }
  };

  return (
    <View className="registerPage">
      <View className="top">
        <View className="title">注册</View>
      </View>
      <View className="form">
        <>
          <Input
            className="input"
            type="text"
            placeholder="请输入组织名称搜索"
            value={orgName}
            onInput={(e) => handleOrgSearch(e.detail.value)} // 输入时触发搜索
          />
          {
            orgSuggestions.length > 0 && (
              <View className="suggestions">
                {orgSuggestions.map(org => (
                  <View
                    key={org.id}
                    className="suggestion-item"
                    onClick={() => handleSelectOrg(org.id, org.tenantName)} // 选择组织
                  >
                    {org.tenantName}
                  </View>
                ))}
              </View>
            )
          }
          <Input
            className="input"
            type="text"
            placeholder="请输⼊⼿机号"
            value={form.mobile}
            onInput={e => handleInputPhone(e)}
          />
          <View className="code">
            <Input
              className="password"
              type="text"
              password
              placeholder="请输⼊验证码"
              value={form.code}
              onInput={e => handleInputCode(e)}
            />
            {!timer ? (
              <Text className="btn" onClick={sendMobileCode} hidden={timer}>
                获取验证码
              </Text>
            ) : (
              <Text className="btn" hidden={!timer}>
                {count}秒后重发
              </Text>
            )}
          </View>
          <Button className="button" onClick={handleLoginClick}>
            注册
          </Button>
        </>
        <View className="tips">登录/注册即视为同意《服务条款》和《隐私协议》</View>
      </View>
    </View>
  )
}
export default Register
