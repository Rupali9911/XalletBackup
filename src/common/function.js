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

const alertWithSingleBtn = () => {
  store.dispatch(
    alertAction({
      status: true,
      title: translate('common.alertTitle'),
      description: translate('wallet.common.error.networkError'),
    }),
  );
};

const twitterLink = username => `https://twitter.com/${username}`;

const getFileType = uri => {
  let type = '';
  if (uri) {
    type = uri?.split('.')[uri?.split('.').length - 1];
  }
  return type;
};

export {confirmationAlert, alertWithSingleBtn, twitterLink, getFileType};
