import {View, Text, TouchableOpacity, TextInput, Platform} from 'react-native';
import styles from './style';
import React, {useState, useEffect} from 'react';
import {translate} from '../../walletUtils';
import {colors} from '../../res';

const MessageInput = props => {
  const [message, setMessage] = useState('');

  //=====================(Main return Function)=============================
  return (
    <View>
      <View style={styles.separator} />
      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          placeholder={
            props?.placeholder
              ? props.placeholder
              : translate('common.enterMessage')
          }
          onChangeText={text => setMessage(text)}
          style={styles.input}
          placeholderTextColor={colors.BLACK7}
          selectionColor={colors.BLACK7}
          onFocus={props.onFocus}
        />
        <TouchableOpacity
          style={styles.sendBtn}
          onPress={() => {
            props.onPress(message);
            setMessage('');
          }}>
          <Text style={styles.sendBtnTxt}>
            {translate('wallet.common.send')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MessageInput;
