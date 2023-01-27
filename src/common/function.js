import {translate} from '../walletUtils';
import {Alert} from 'react-native';
import {alertAction} from '../store/actions/alertAction';
import store from '../store/index';

const confirmationAlert = (
  title,
  message,
  leftText,
  rightText,
  onOkPress,
  onCancelPress,
) => {
  Alert.alert(title, message, [
    onCancelPress && {
      text: leftText ? leftText : 'Cancel',
      onPress: () => onCancelPress,
    },
    {
      text: rightText ? rightText : 'Ok',
      onPress: onOkPress,
    },
  ]);
};
const modalAlert = (title, description, onOkPress, btnTxt) => {
  store.dispatch(
    alertAction({
      status: true,
      title,
      description,
      text: btnTxt ? btnTxt : 'OK',
      onPress: onOkPress,
    }),
  );
};

const twitterLink = username => `https://twitter.com/${username}`;
const instagramLink = username => `https://www.instagram.com/${username}`;

const getFileType = uri => {
  let type = '';
  if (uri) {
    type = uri?.split('.')[uri?.split('.').length - 1];
  }
  return type;
};

export {confirmationAlert, modalAlert, twitterLink, instagramLink,getFileType};
