import {View, Text, TouchableOpacity, TextInput, Platform} from 'react-native';
import styles from './style';
import React, {useState, useEffect} from 'react';
import {translate} from '../../walletUtils';
import {colors} from '../../res';

const MessageInput = props => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    setMessage(props.message);
  }, [props.message]);

  const Button = props => {
    return (
      <TouchableOpacity
        style={[styles.sendBtn, props.style]}
        onPress={props.onPress}>
        <Text style={[styles.sendBtnTxt, props.labelStyle]}>{props.label}</Text>
      </TouchableOpacity>
    );
  };

  const renderSaveLayout = () => {
    return (
      <View style={styles.editButtonView}>
        <Button
          style={styles.cancelButton}
          onPress={() => {
            props?.onPressCancel('');
          }}
          label={translate('common.Cancel')}
          labelStyle={styles.cancelLabel}
        />
        <Button
          style={styles.saveButton}
          onPress={() => {
            props.onPress(message);
          }}
          label={translate('common.save')}
        />
      </View>
    );
  };
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
          style={styles.input(props?.message)}
          placeholderTextColor={colors.BLACK7}
          selectionColor={colors.BLACK7}
          onFocus={props.onFocus}
        />
        {!props.message ? (
          <Button
            onPress={() => {
              props.onPress(message);
              setMessage('');
            }}
            label={translate('wallet.common.send')}
          />
        ) : null}
      </View>
      {props.message ? renderSaveLayout() : null}
    </View>
  );
};

export default MessageInput;
