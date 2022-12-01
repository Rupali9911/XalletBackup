import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import styles from './style';
import React, {useState, useEffect} from 'react';
import {translate} from '../../walletUtils';

const MessageInput = props => {
  //=====================(Main return Function)=============================
  return (
    <View>
      <View style={[styles.separator]} />
      <View style={styles.inputContainer}>
        <TextInput
          value={props.value}
          placeholder={props.placeholder}
          onChangeText={props.onChangeText}
          style={styles.input}
          placeholderTextColor={'#212529'}
          selectionColor={'#212529'}
          onFocus={props.onFocus}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={props.onPress}>
          <Text style={styles.sendBtnTxt}>
            {translate('wallet.common.send')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MessageInput;
