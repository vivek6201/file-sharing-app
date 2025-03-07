import DeviceInfo from 'react-native-device-info';
import {NetworkInfo} from 'react-native-network-info';
import {isIos} from './constants';

export const getLocalIPAddress = async () => {
  try {
    const gateway = await NetworkInfo.getIPV4Address();
    console.log('ip address', gateway);
    return gateway || '0.0.0.0';
  } catch (error) {
    return '0.0.0.0';
  }
};

function setLastBlockTo255(ip: string) {
  const parts = ip.split('.').map(Number);
  parts[3] = 255;
  return parts.join('.');
}

export const getBroadcastIPAddress = async () => {
  try {
    const ip1 = await DeviceInfo.getIpAddress();
    const iosIP = await NetworkInfo.getBroadcast();
    const broadcastAddress = setLastBlockTo255(
      (isIos ? iosIP : ip1) || '255.255.255.255',
    );

    console.log('broadcast address', broadcastAddress);
    return broadcastAddress;
  } catch (error) {
    console.error('error while getting broadcast address', error);
    return null;
  }
};
