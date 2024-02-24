import React from 'react';
import Toast from '../../react-native-toast-message';
import ToastConfig from '../subComponents/ToastConfig';

const ToastComponent = () => {
  // if ($config.TOAST_NOTIFICATIONS) {
  //   return <Toast ref={(ref) => Toast.setRef(ref)} config={ToastConfig} />;
  // } else return <></>;
  return <Toast ref={(ref) => Toast.setRef(ref)} config={ToastConfig} />;
};
export default ToastComponent;
