import Taro from '@tarojs/taro';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import { AtNavBar, AtSearchBar, AtSegmentedControl, AtCard, AtList, AtListItem, AtFab, AtActionSheet, AtActionSheetItem } from 'taro-ui';
import { useState } from 'react';
import './index.scss';

const Scene = () => {
  // 状态管理
  const [searchValue, setSearchValue] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);

  // 设备分组数据
  const tabList = ['全部', '教室', '工作室', '未分组'];

  // 设备数据
  const deviceList = [
    { id: 1, name: '温湿度', type: 'sensor', status: 'offline', location: '客厅' },
    { id: 2, name: '智能灯', type: 'light', status: 'offline', location: '卧室' }
  ];

  // 处理搜索
  const handleSearch = (value) => {
    setSearchValue(value);
    // 这里实际业务中会有过滤逻辑
  };

  // 显示添加设备菜单
  const showAddMenu = () => {
    setActionSheetVisible(true);
  };

  // 添加设备操作
  const handleAddAction = (type) => {
    setActionSheetVisible(false);
    console.log('添加方式:', type);
    if (type === 'scan') {
      Taro.scanCode({
        success: (res) => {
          console.log('扫描结果:', res.result);
        }
      });
    } else {
      Taro.navigateTo({ url: '/pages/add-device/add-device' });
    }
  };

  // 渲染设备卡片
  const renderDeviceCard = (device) => (
    <AtCard
      key={device.id}
      title={device.name}
      extra={`状态: ${device.status === 'offline' ? '离线' : '在线'}`}
      className="device-card"
    >
      <View className="device-info">
        <Image
          className="device-icon"
          src={device.type === 'sensor'
            ? 'https://example.com/icon-sensor.png'
            : 'https://example.com/icon-light.png'}
        />
        <View className="device-meta">
          <Text className="device-status">{device.location}</Text>
          <Text className={`device-status ${device.status}`}>
            {device.status === 'offline' ? '离线' : '在线'}
          </Text>
        </View>
      </View>
    </AtCard>
  );

  return (
    <View className="device-page">
      {/* 导航栏 */}
      <AtNavBar
        title="我的设备"
        leftIconType="chevron-left"
        onClickLeftIcon={() => Taro.navigateBack()}
        rightFirstIconType="add"
        rightSecondIconType="bullet-list"
        onClickTitle={showAddMenu}
      />

      {/* 设备统计 */}
      <View className="stats-panel">
        <View className="stat-item">
          <Text className="stat-value">2</Text>
          <Text className="stat-label">设备总数</Text>
        </View>
        <View className="stat-item">
          <Text className="stat-value">0</Text>
          <Text className="stat-label">在线设备</Text>
        </View>
        <View className="stat-item">
          <Text className="stat-value">0</Text>
          <Text className="stat-label">活跃设备</Text>
        </View>
      </View>

      {/* 分组标签 */}
      <AtSegmentedControl
        values={tabList}
        current={currentTab}
        onClick={setCurrentTab}
        className="segment-control"
      />

      {/* 搜索框 */}
      <AtSearchBar
        value={searchValue}
        onChange={handleSearch}
        placeholder="搜索设备"
        className="search-bar"
      />

      {/* 设备列表 */}
      <ScrollView className="device-list">
        <Text className="section-title">最新添加</Text>
        {deviceList.map(renderDeviceCard)}

        {/* 无设备提示 */}
        {deviceList.length === 0 && (
          <View className="empty-device">
            <Image
              className="empty-icon"
              src="https://example.com/empty-device.png"
            />
            <Text className="empty-text">暂无设备，请添加设备</Text>
          </View>
        )}
      </ScrollView>

      {/* 添加设备弹窗 */}
      <AtActionSheet
        isOpened={actionSheetVisible}
        cancelText="取消"
        onClose={() => setActionSheetVisible(false)}
        title="添加设备方式"
      >
        <AtActionSheetItem onClick={() => handleAddAction('scan')}>
          扫一扫添加
        </AtActionSheetItem>
        <AtActionSheetItem onClick={() => handleAddAction('manual')}>
          手动添加
        </AtActionSheetItem>
      </AtActionSheet>

      {/* 添加按钮 (FAB) */}
      <AtFab className="fab-button" onClick={showAddMenu}>
        <Text className="at-fab__icon at-icon at-icon-add"></Text>
      </AtFab>
    </View>
  );
};

export default Scene;
