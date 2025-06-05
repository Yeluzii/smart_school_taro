import { http } from '@/utils/http'

export const controlLed = (deviceId, command) => {
  return http({
    method: 'POST',
    url: `/iot/api/device/control?deviceId=${deviceId}&command=${command}`,
  })
}

export const getLedStatus = deviceId => {
  return http<LED>({
    method: 'GET',
    url: `/iot/api/device/${deviceId}`,
  })
}
