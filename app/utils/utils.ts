import DeviceInfo from 'react-native-device-info';
import {NetworkInfo} from 'react-native-network-info';
import {isIos} from './constants';
import {pick, types} from '@react-native-documents/picker';

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

export const formatFileSize = (sizeInBytes: number): string => {
  if (sizeInBytes >= 1024 ** 3) {
    return (sizeInBytes / 1024 ** 3).toFixed(2) + ' GB';
  } else if (sizeInBytes >= 1024 ** 2) {
    return (sizeInBytes / 1024 ** 2).toFixed(2) + ' MB';
  } else if (sizeInBytes >= 1024) {
    return (sizeInBytes / 1024).toFixed(2) + ' KB';
  } else {
    return sizeInBytes + ' B';
  }
};

export const filePicker = async (type: string) => {
  let accType;
  switch (type) {
    case 'image':
      accType = types.images;
      break;
    case 'video':
      accType = types.video;
      break;
    case 'file':
      accType = types.allFiles;
      break;
    case 'audio':
      accType = types.audio;
      break;
    default:
      accType = types.allFiles;
      break;
  }

  try {
    const [result] = await pick({
      mode: 'open',
      type: accType,
    });
    return result;
  } catch (err) {
    console.error('error while picking up files', err);
    return null;
  }
};
