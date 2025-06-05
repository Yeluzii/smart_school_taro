import { http } from '@/utils/http'
import Taro from '@tarojs/taro'
export const sendCode = (mobile: string) => {
  return http<null>({
    method: 'POST',
    url: `/app/auth/send/code?mobile=${mobile}`,
  })
}
export const mobileLogin = (data: MobileLoginDTO) => {
  return http<MobileLoginVO>({
    method: 'POST',
    url: `/app/auth/mobile/login`,
    data,
  })
}

export const mobileRegister = (data: MobileLoginDTO) => {
  return http<MobileLoginVO>({
    method: 'POST',
    url: `/app/auth/mobile/register`,
    data,
  })
}
export const getUserInfo = () => {
  return http<UserVO>({
    method: 'GET',
    url: `/app/user/info`,
  })
}

export const accountLogin = (data: AccountLoginDTO) => {
  return http<AccountLoginVO>({
    method: 'POST',
    url: `/app/auth/login`,
    data,
  })
}

export const logout = () => {
  return http({
    method: 'POST',
    url: `/app/auth/logout`,
    header: {
      Authorization: Taro.getStorageSync('token'),
    },
  })
}

export const updateUser = (data: UserDTO) => {
  return http<string>({
    method: 'PUT',
    url: `/app/user/update`,
    data,
    header: {
      Authorization: Taro.getStorageSync('token'),
    },
  })
}

export const getTopOrgList = (name: string) => {
  return http<TenantVO[]>({
    method: 'GET',
    url: `/sys/tenant/list?name=${name}`,
  })
}
