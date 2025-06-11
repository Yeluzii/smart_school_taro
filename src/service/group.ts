import { http } from '@/utils/http'
export const getGroup = (userId: number) => {
  return http<GroupVO[]>({
    method: 'GET',
    url: `/new/iot/group/device/get/group?userId=${userId}`,
  })
}
export const getGroupDevices = (groupId: number) => {
  return http<GroupDeviceVO[]>({
    method: 'GET',
    url: `/new/iot/group/device/get/device?groupId=${groupId}`,
  })
}
export const getDeviceType = (deviceId: number) => http<number>({
  method: 'GET',
  url: `/new/iot/group/device/get/devicetype?deviceId=${deviceId}`,
})
export const sendCommand = (deviceId: number, command: string) => {
  return http({
    method: 'POST',
    url: `/app_iot/api/device/control?deviceId=${deviceId}&command=${command}`,
  })
}
