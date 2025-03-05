import {Dimensions, Linking, Platform} from 'react-native';

export const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
  fontScale: Dimensions.get('window').fontScale,
};

export const isIos = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export const goToSettings = () => {
  if (isIos) {
    Linking.openURL('app-settings:');
  } else {
    Linking.openSettings();
  }
};

export enum EPermissionTypes {
  CAMERA = 'camera',
}