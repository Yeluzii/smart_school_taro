import Taro from "@tarojs/taro";
import { View, Text, Button } from "@tarojs/components";
import { AtIcon } from "taro-ui";
import { useEffect, useState } from "react";
import { getDeviceType, sendCommand } from "@/service/group";
import "./index.scss";

const Control = () => {
  const deviceId = parseInt(Taro.getCurrentInstance().router?.params.id || '0', 10)
  const [deviceType, setDeviceType] = useState<number>(0)
  console.log("deviceId", deviceId)
  console.log("type", deviceType)
  const getDevice = async () => {
    const res = (await getDeviceType(deviceId)).data
    setDeviceType(res)
  }
  useEffect(() => {
    getDevice()
  }, [deviceId]);
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleControl = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const command = status ? 'on' : 'off'
      await sendCommand(deviceId, command);
      setStatus(!status);
      Taro.showToast({ title: '操作成功', icon: 'success' });
    } catch (e) {
      Taro.showToast({ title: '操作失败', icon: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="control-container">
      {deviceType === 3 && (
        <View className="access-control">
          <AtIcon
            value={status ? 'lock-open' : 'lock'}
            size={80}
            color={status ? '#52c41a' : '#ff4d4f'}
          />
          <Text className="status-text">
            当前状态：{status ? '已开启' : '已关闭'}
          </Text>
          <Button
            className="control-btn"
            loading={loading}
            onClick={handleControl}
          >
            {status ? '关闭门禁' : '开启门禁'}
          </Button>
        </View>
      )}
      {deviceType === 4 && (
        <View className="fan-control"
        >
          <AtIcon
            value={status ? 'fan-on' : 'fan-off'}
            size={80}
            color={status ? '#52c41a' : '#ff4d4f'}
          />
          <Text className="status-text">
            当前状态：{status ? '已开启' : '已关闭'}
          </Text>
          <Button
            className="control-btn"
            loading={loading}
            onClick={handleControl}
          >
            {status ? '关闭风扇' : '开启风扇'}
          </Button>
        </View>
      )}
    </View>
  );
};

export default Control;
