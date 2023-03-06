import React from 'react';
import {View} from 'react-native';
import {useEffect, useState} from 'react';
import {translate} from '../../walletUtils';
import ShowModal from './modal';
import {getWallet} from '../../helpers/AxiosApiRequest';

const MultiActionModal = props => {
  const {isVisible, navigation, onBackdrop, closeModal} = props;
  const [wallet, setWallet] = useState(null);

  useEffect(async () => {
    let getData = await getWallet();
    setWallet(getData);
    if (route.params.isSetting) {
      setTimeout(() => {
        setBackupPhrasePopup(true);
      }, 500);
    }
  });

  const onBackUpNow = () => {
    closeModal(true);
    setTimeout(() => {
      navigation.navigate('recoveryPhrase', {wallet});
    }, 100);
  };

  return (
    <View>
      <ShowModal
        isVisible={isVisible}
        onBackdropPress={onBackdrop ? null : closeModal}
        backupPhraseWithLater={true}
        isDelete={true}
        backupPhrase={true}
        title={translate('common.PLEASE_SET_RECOVERY_PHRASE')}
        description={translate('common.UPDATED_RECOVERY_PHRASE')}
        closeModal={closeModal}
        onLaterPress={closeModal}
        onBackUpNowPress={() => onBackUpNow()}
      />
    </View>
  );
};

export default MultiActionModal;
