type GroupVO = {
  id: number;
  name: string;
};
type GroupDeviceVO = {
  id: number;
  name: string;
  runningStatus: number;
};
type DeviceTypeVO = {
  type: number;
};
type DeviceStatusVO = {
  id: number;
  code: string;
  name: string;
  type: number;
  uid: string;
  temperature: number | null;
  humidity: number | null;
  door: boolean | null;
  fan: boolean | null;
  runningStatus: boolean;
};
