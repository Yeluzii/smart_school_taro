import { View, Text, ScrollView } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { AtSearchBar, AtIcon } from "taro-ui" // 添加搜索组件
import { useEffect, useState } from "react"
import { getGroup, getGroupDevices } from "@/service/group"
import { useAppSelector } from '@/store'
import './index.scss'
import { AtButton } from 'taro-ui';

const DeviceManager = () => {
  const [groupData, setGroupData] = useState<GroupVO[]>([
    { id: 0, name: '全部' },
    { id: 1, name: '教室' },
    { id: 2, name: '工作室' },
    { id: 3, name: '未分组' },
  ]);
  const [deviceData, setDeviceData] = useState<GroupDeviceVO[]>([
    { id: 1, name: '温湿度', runningStatus: 0 },
    { id: 2, name: '智能灯', runningStatus: 0 },
  ]);
  const [activeGroup, setActiveGroup] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  // 统计数据
  type Stats = {
    total: number,
    online: number,
    active: number
  };
  const [stats, setStats] = useState<Stats>({
    total: 0,
    online: 0,
    active: 0
  });
  const userId = useAppSelector(state => state.user.userInfo.id)
  const getGroups = async () => {
    const res = (await getGroup(userId)).data
    setGroupData(res)
  }
  const getDevices = async (groupId) => {
    const res = (await getGroupDevices(groupId)).data
    setDeviceData(res)
  }
  // 新增刷新方法
  const handleRefresh = async () => {
    setActiveGroup(0);
    setSearchValue('');
    await getGroups();
    await getDevices(0);
  };
  useEffect(() => {
    getGroups()
  }, []);
  useEffect(() => {
    getDevices(activeGroup)
  }, [activeGroup]);
  useEffect(() => {
    const total = deviceData.length;
    const online = deviceData.filter(device => device.runningStatus === 1).length;
    const active = deviceData.filter(device => device.runningStatus === 1).length;
    setStats({ total, online, active });
  }, [deviceData]);
  const navigateToDevice = (deviceId) => {
    Taro.navigateTo({
      url: `/pages/control/index?id=${deviceId}`
    });
  };

  const [filteredDeviceList, setFilteredDeviceList] = useState(deviceData);

  const handleSearch = (value) => {
    setSearchValue(value);
    const filtered = deviceData.filter(device =>
      device.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredDeviceList(filtered);
  };

  return (
    <View className="device-manager-container">
      <View
        className="float-refresh-btn"
        onClick={handleRefresh}
      >
        <AtIcon value="reload" size={24} color="#fff" className="refresh-icon" />
      </View>
      {/* 顶部统计卡片 */}
      <View className="stats-container">
        <View className="stat-card">
          <Text className="stat-value">{stats.total}</Text>
          <Text className="stat-label">设备总数</Text>
        </View>
        <View className="stat-card">
          <Text className="stat-value">{stats.online}</Text>
          <Text className="stat-label">在线设备</Text>
        </View>
        <View className="stat-card">
          <Text className="stat-value">{stats.active}</Text>
          <Text className="stat-label">活跃设备</Text>
        </View>
      </View>

      {/* 分组标签栏 */}
      <View className='nav-container'>
        <ScrollView
          className='nav-scroll'
          scrollX
          scrollWithAnimation
          enableFlex
        >
          {groupData.map(group => (
            // 替换原View组件为可点击组件
            <AtButton
              key={group.id}
              className={`nav-item ${activeGroup === group.id ? 'active' : ''}`}
              onClick={() => setActiveGroup(group.id)}
              customStyle={{ padding: '0', background: 'transparent' }}
            >
              <Text className='nav-text'>{group.name}</Text>
              <View className='nav-indicator' />
            </AtButton>
          ))}
        </ScrollView>
      </View>

      {/* 搜索栏 */}
      <View className="search-container">
        <AtSearchBar
          value={searchValue}
          onChange={handleSearch}
          placeholder="搜索设备"
        />
      </View>

      {/* 设备列表区域 */}
      <View className="section-container">
        <Text className="section-title">最新添加</Text>
        <View className='device-container'>
          {(searchValue === '' ? deviceData : filteredDeviceList).map(device => (
            <View
              key={device.id}
              className='device-card'
              onClick={() => navigateToDevice(device.id)}
            >
              <View className="device-info">
                <Text className="device-name">{device.name}</Text>
                <View className={`status-tag ${device.runningStatus === 1 ? 'online' : 'offline'}`}>
                  <View className="status-dot" />
                  <Text>{device.runningStatus === 0 ? '离线' : '在线'}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

export default DeviceManager
