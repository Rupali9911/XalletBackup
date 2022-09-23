import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Platform,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
} from 'react-native';
import {AppHeader} from '../../components';
import Colors from '../../constants/Colors';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getAiChat} from '../../store/reducer/chatReducer';
import ImagesSrc from '../../constants/Images';
import {translate} from '../../walletUtils';
import styles from './style';

const ChatInput = () => {
  const dispatch = useDispatch();

  //================== Components State Declaration ===================
  const [message, setMessage] = useState('');
  const [chatMessage, setChatMessage] = useState([]);
  const [disableButton, setDisableButton] = useState(false);

  //=====================(Main return Function)=============================

  return (
    <View>
      <View style={[styles.separator, {marginVertical: 5}]} />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={translate('common.enterMessage')}
          value={message}
          onChangeText={text => setMessage(text)}
          placeholderTextColor={'#212529'}
        />
        {/* <TouchableOpacity style={styles.sendBtn} onPress={() => sendMessage(message, new Date())}>
        <Text style={styles.sendBtnTxt}>Send</Text>
      </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default ChatInput;
