import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Platform } from 'react-native';

const PLATFORM_CAMERA_PERMISSIONS = {
  ios: PERMISSIONS.IOS.CAMERA,
  android: PERMISSIONS.ANDROID.CAMERA,
};
const PLATFORM_STORAGE_PERMISSIONS = {
  ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
  android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
};
const REQUEST_PERMISSION_TYPE = {
  camera: PLATFORM_CAMERA_PERMISSIONS,
  storage:PLATFORM_STORAGE_PERMISSIONS
};

const PERMISSION_TYPE = {
  camera: 'camera',
  storage:'storage',
};

class AppPermission {
  checkPermission = async type => {
    console.log('AppPermission checkPermission type:', type);
    const permissions = REQUEST_PERMISSION_TYPE[type][Platform.OS];
    console.log('AppPermission checkPermission permissions:', permissions);
    if (!permissions) {
      return true;
    }
    try {
      const result = await check(permissions);
      console.log('AppPermission checkPermission result:', result);
      console.log('App Runing PLatform:', Platform.OS);
      if (result === RESULTS.DENIED) return false;
      if (result === RESULTS.GRANTED) return true;
      if (result === RESULTS.UNAVAILABLE) return false;
      if (result === RESULTS.LIMITED) return true;
      if (result === RESULTS.BLOCKED) return false;
      return false;
    } catch (error) {
      console.log('AppPermission checkPermission error:', error);
      return false;
    }
  };

  requestPermission = async type => {
    const permissions = REQUEST_PERMISSION_TYPE[type][Platform.OS];
    console.log('AppPermission requestPermission permissions:', permissions);
    try {
      const result = await request(permissions);
      console.log('AppPermission requestPermission result:', result);
      return result === RESULTS.GRANTED;
    } catch (error) {
      console.log('AppPermission requestPermission error:', error);

      return false;
    }
  };
}

const Permission = new AppPermission();
export { Permission, PERMISSION_TYPE };
