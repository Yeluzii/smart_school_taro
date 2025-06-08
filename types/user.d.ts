type MobileRegisterDTO = {
  mobile: string
  code: string
  tenantId: number
}
type MobileLoginDTO = {
  mobile: string
  code: string
}
type MobileLoginVO = {
  id: number
  mobile: string
  accessToken: string
}
type UserVO = {
  id: number
  realName: string
  mobile: string
  username: string
  avatar: string
  gender: number
  createTime: string
  email: string
}

type AccountLoginDTO = {
  username: string
  realName: string
  password: string
  mobile: string
  avatar: string
  gender: number
  email: string
}
type AccountLoginVO = {
  id: number
  mobile: string
  accessToken: string
}

type UserDTO = {
  id: number
  realName: string
  avatar: string
  gender: number
}

type TenantVO = {
  id: number
  tenantName: string
}
