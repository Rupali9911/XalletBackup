import { View, Text, SafeAreaView, TouchableOpacity, Image, TextInput, FlatList, } from 'react-native';
import { AppHeader } from '../../components';
import Colors from '../../constants/Colors';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AIChatResponse } from '../../store/reducer/chatReducer';
import ImagesSrc from '../../constants/Images';
import { translate } from '../../walletUtils';
import styles from './style';
import { ScrollView } from 'react-native-gesture-handler';
import KeyboardAwareScrollView from '../../components/keyboardAwareScrollView';


const AiChat = () => {
  const dispatch = useDispatch();

  //================== Components State Declaration ===================
  const [message, setMessage] = useState('');
  const [chatMessage, setChatMessage] = useState([]);

  // =============== Getting data from reducer ========================
  const { chatSuccess, isChatLoading, error } = useSelector(state => state.chatReducer);
  const { selectedLanguageItem } = useSelector(state => state.LanguageReducer);

  // ===================== Call RightSide View ===================================
  const RightBubble = (props) => {
    const { item } = props;
    return (
      <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end', flexDirection: 'row' }}>
        <View
          style={styles.timeFormat}>
          <Text style={styles.statusText}>
            {`${item.time.getHours()}:${item.time.getMinutes() < 10
              ? '0' + item.time.getMinutes()
              : item.time.getMinutes()
              }`}
          </Text>
        </View>
        <View style={[styles.talkBubble, { marginRight: 10, }]}>
          <View
            style={[
              styles.talkBubbleAbsoluteRight,
            ]}
          />
          <View
            style={styles.textContainer}>
            <Text
              style={{
                color: Colors.black,
                fontSize: 14,
                // fontFamily: Fonts.extralight,
              }}>
              {item.message}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // ===================== Call LeftSide View ===================================
  const LeftBubble = (props) => {
    const { item } = props;
    return (
      <View style={{ alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'row' }}>
        <View style={[styles.talkBubble, { marginLeft: 10, }]}>
          <View
            style={[
              styles.talkBubbleAbsoluteLeft,
            ]}
          />
          <View
            style={styles.textContainer}>
            <Text
              style={{
                color: Colors.black,
                fontSize: 14,
                // fontFamily: Fonts.extralight,
              }}>
              {item.message}
            </Text>
          </View>
        </View>
        <View
          style={styles.timeFormat}>
          <Text style={styles.statusText}>
            {`${item.time.getHours()}:${item.time.getMinutes() < 10
              ? '0' + item.time.getMinutes()
              : item.time.getMinutes()
              }`}
          </Text>
        </View>
      </View>
    );
  }

  // ===================== Render AIChat Flatlist ===================================
  const ShowChatMessage = (props) => {
    const { item } = props;
    return (
      <View>
        {item.type == 'sender' ?
          <RightBubble item={props.item} />
          :
          <LeftBubble item={props.item} />
        }
      </View>
    );
  }

  // ===================== Time Conversion ===================================
  const convertTime = (time) => {
    var date, hour, minutes, fullTime;
    date = time;
    hour = date.getHours();
    if (hour > 12)
      hour = hour - 12;
    if (hour == 0)
      hour = 12;
    minutes = date.getMinutes();
    if (minutes < 10)
      minutes = '0' + minutes.toString();
    fullTime = hour.toString() + ':' + minutes.toString();
    return fullTime;
  }

  // ===================== Send Message ===================================
  const sendMessage = (msg, time) => {
    // let Time = convertTime(time)
    if (msg && msg != '') {
      let sendObj = {
        message: msg,
        type: 'sender',
        time: time
      };
      setChatMessage([...chatMessage, sendObj]);
      dispatch(AIChatResponse(msg, selectedLanguageItem.language_display))
        .then(chatResp => {
          let receiveObj = {
            message: chatResp,
            type: 'receiver',
            time: time
          }
          setChatMessage([...chatMessage, sendObj, receiveObj]);
        })
        .catch(err => {
          console.log('Chat response error', err);
          setChatMessage([]);
        });
    }
    setMessage('');
  }

  //=====================(Main return Function)=============================
  return (
    <SafeAreaView style={styles.mainContainer}>

      <AppHeader
        title={translate("common.AIChat")}
        showBackButton
        isWhite
        containerStyle={{ backgroundColor: Colors.themeColor }}
      />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        KeyboardShiftStyle={styles.keyboardShift}>
        <View style={styles.chatContainer}>
          <FlatList
            data={chatMessage}
            renderItem={({ item }) => (
              <ShowChatMessage item={item} />
            )}
            keyExtractor={(item, index) => { return `_${index}` }}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={translate("common.enterMessage")}
            value={message}
            onChangeText={text => setMessage(text)}
            placeholderTextColor={Colors.themeColor}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={() => sendMessage(message, new Date())} >
            <Image style={[styles.icon, { tintColor: Colors.themeColor }]} source={ImagesSrc.sendChatMessage} />
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>

    </SafeAreaView>
  )
}

export default AiChat;

