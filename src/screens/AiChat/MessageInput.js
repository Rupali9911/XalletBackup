import {View, Text, TouchableOpacity, TextInput, Keyboard} from 'react-native';
import styles from './style';
import React, {useState, useEffect, useRef} from 'react';
import {translate} from '../../walletUtils';
import {colors} from '../../res';
import VoiceRecognition from './VoiceRecognition';

const MessageInput = props => {
  const inputRef = useRef(null);
  const [message, setMessage] = useState('');

  const button_disabled = message?.length <= 0;

  useEffect(() => {
    if (props?.message) {
      setMessage(props?.message);
      inputRef.current.focus();
    }
  }, [props?.message]);

  const Button = props => {
    return (
      <TouchableOpacity
        disabled={props?.isDisabled}
        style={[styles.sendBtn(props?.isDisabled), props.style]}
        onPress={props.onPress}>
        <Text style={[styles.sendBtnTxt, props.labelStyle]}>{props.label}</Text>
      </TouchableOpacity>
    );
  };

  const setAudioToTextFunc = audio => {
    if (audio.length) {
      setMessage(audio[0]);
    } else {
      setMessage('');
    }
  };

  const onSendPress = () => {
    props.onPress(message);
    setMessage('');
    setTimeout(() => {
      Keyboard.dismiss();
    }, 1000);
  };

  const onCancelPress = () => {
    props?.onPressCancel('');
    setMessage('');
    Keyboard.dismiss();
  };

  const renderSaveLayout = () => {
    return (
      <View style={styles.editButtonView}>
        <Button
          style={styles.cancelButton}
          onPress={() => onCancelPress()}
          label={translate('common.Cancel')}
          labelStyle={styles.cancelLabel}
        />
        <Button
          isDisabled={button_disabled}
          style={styles.saveButton}
          onPress={() => onSendPress()}
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
          ref={inputRef}
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
            isDisabled={button_disabled}
            onPress={() => onSendPress()}
            label={translate('wallet.common.send')}
          />
        ) : null}
        <VoiceRecognition setAudioToTextFunc={setAudioToTextFunc} />
      </View>
      {props.message ? renderSaveLayout() : null}
    </View>
  );
};

export default MessageInput;
