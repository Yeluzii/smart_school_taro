import { View, Text, ScrollView } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { AtIcon } from "taro-ui"
import { useEffect, useState } from "react"
import { getGroup, getGroupDevices } from "@/service/group"
import { useAppSelector } from '@/store'
import './index.scss'
const Scene = () => {
  const [groupData, setGroupData] = useState<GroupVO[]>([
    { id: 1, name: '客厅' },
    { id: 2, name: '厨房' },
    { id: 3, name: '卧室' },
    { id: 4, name: '书房' },
    { id: 5, name: '餐厅' },
  ])
  const [deviceData, setDeviceData] = useState<GroupDeviceVO[]>([
    { id: 1, name: '灯', runningStatus: 1 },
    { id: 2, name: '电视', runningStatus: 0 },
    { id: 3, name: '空调', runningStatus: 1 },
    { id: 4, name: '音响', runningStatus: 1 },
  ])
  const [activeGroup, setActiveGroup] = useState(1);
  const userId = useAppSelector(state => state.user.userInfo.id)
  const getGroups = async () => {
    const res = (await getGroup(userId)).data
    setGroupData(res)
  }
  const getDevices = async (groupId) => {
    const res = (await getGroupDevices(groupId)).data
    setDeviceData(res)
  }
  useEffect(() => {
    getGroups()
  }, []);
  useEffect(() => {
    getDevices(activeGroup)
  }, [activeGroup]);

  const navigateToDevice = (deviceId) => {
    Taro.navigateTo({
      url: `/pages/control/index?id=${deviceId}`
    });
  };
  return (
    <View>

      <View className='nav-container'>
        <View className='nav-tabs'>
          <ScrollView
            className='nav-scroll'
            scrollX
            scrollWithAnimation
            enableFlex
          >
            {groupData.map(group => (
              <View
                key={group.id}
                className={`nav-item ${activeGroup === group.id ? 'active' : ''}`}
                style={{ width: '25%' }}
                onClick={() => {
                  setActiveGroup(group.id)
                }}
              >
                <Text className='nav-text'>{group.name}</Text>
                <View className='nav-indicator' />
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
      <ScrollView scrollY
        style={{
          height: 'calc(100vh - 100px)'
        }}
        className='device-list'>
        {
          deviceData.map(device => (
            <View key={device.id} className='device-card' onClick={() => navigateToDevice(device.id)}>
              <View className="device-content">
                <Text className="device-name">{device.name}</Text>
                <View className="device-meta">
                  <AtIcon value="location" size={16} color="#666" />
                  <View className={`status-tag ${device.runningStatus}`}>
                    <View className="status-dot" />
                    <Text>{device.runningStatus === 1 ? '运转中' : '已离线'}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))
        }
      </ScrollView>

    </View>
  )
}

export default Scene
