import { View, Text, SafeAreaView, TouchableOpacity, Image, Platform, TextInput, FlatList, KeyboardAvoidingView } from 'react-native';
import { AppHeader } from '../../components';
import Colors from '../../constants/Colors';
import React, { useState, } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAiChat } from '../../store/reducer/chatReducer';
import ImagesSrc from '../../constants/Images';
import { translate } from '../../walletUtils';
import styles from './style';

const AiChat = () => {
  const dispatch = useDispatch();

  //================== Components State Declaration ===================
  const [message, setMessage] = useState('');
  const [chatMessage, setChatMessage] = useState([]);
  const [disableButton, setDisableButton] = useState(false);
  const flatList = React.useRef(null);

  // =============== Getting data from reducer ========================
  const { chatSuccess, isChatLoading, error } = useSelector(state => state.chatReducer);
  const { selectedLanguageItem } = useSelector(state => state.LanguageReducer);

  // ===================== Call RightSide View ===================================
  const RightBubble = (props) => {
    const { item } = props;
    return (
      <View style={styles.rightBubbleContainer}>
        <View
          style={styles.timeFormat}>
          <Text style={styles.statusText}>{item.time}</Text>
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
      <View style={styles.leftBubbleContainer}>
        <View style={[styles.talkBubble, { marginLeft: 10, }]}>
          <View
            style={[
              styles.talkBubbleAbsoluteLeft,
            ]}
          />
          <View
            style={styles.textContainer}>
            {item.type == 'Hold' && item.message == ''
              ?
              <Image source={ImagesSrc.typingLoading} style={styles.isLoading} alt="loading..." />
              :
              <Text
                style={{
                  color: Colors.black,
                  fontSize: 14,
                }}>
                {item.message}
              </Text>
            }
          </View>
        </View>
        <View
          style={styles.timeFormat}>
          <Text style={styles.statusText}>{item.time}</Text>
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

  // ===================== Send Message ===================================
  const sendMessage = (msg, time) => {
    let timeConversion = time.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });
    if (msg && msg != '') {
      let sendObj = {
        message: msg,
        type: 'sender',
        time: timeConversion,
      };
      let holdResp = {
        message: '',
        type: 'Hold',
      }
      setChatMessage(chatMessage => [...chatMessage, sendObj, holdResp]);
      setDisableButton(true);
      console.log('Before Slice : ', chatMessage);
      dispatch(getAiChat(msg, selectedLanguageItem.language_display))
        .then(chatResp => {
          // chatMessage.pop();
          setChatMessage((previousObj) => (previousObj.slice(0, -1)));
          let receiveObj = {
            message: chatResp,
            type: 'receiver',
            time: timeConversion
          }
          console.log('THis is Receiver Object : ', receiveObj);
          console.log('chatMessage', chatMessage);
          setChatMessage(chatMessage => [...chatMessage, receiveObj]);
          setDisableButton(false);
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
        containerStyle={{ backgroundColor: Colors.themeColor, }}
      />
      <KeyboardAvoidingView behavior={ Platform.OS === "ios" ? "padding" : undefined } style={{ flex: 1,  }} enabled 
        // keyboardVerticalOffset={
        //   Platform.select({
        //     ios: () => 0,
        //     android: () => -200
        //   })()
        // }
        >
        <View style={styles.chatContainer}>
          <FlatList
            ref={flatList}
            onContentSizeChange={(item, index) => {
              flatList.current.scrollToEnd({ animated: true });
              flatList.current.scrollToOffset({ animated: true, offset: index });
            }}
            data={chatMessage}
            renderItem={({ item }) => (
              <ShowChatMessage item={item} />
            )}
            keyExtractor={(item, index) => { return `_${index}` }}
            onLayout={() => flatList.current.scrollToEnd({ animated: true })}
            showsVerticalScrollIndicator={false}
          />
        </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={translate("common.enterMessage")}
              value={message}
              onChangeText={text => setMessage(text)}
              placeholderTextColor={Colors.themeColor}
              // autoCorrect={false}
              // autoComplete="off"
            />
            <TouchableOpacity style={styles.sendBtn} onPress={() => sendMessage(message, new Date())} disabled={disableButton}>
              <Image style={[styles.icon, { tintColor: Colors.themeColor }]} source={ImagesSrc.sendChatMessage} />
            </TouchableOpacity>  
          </View>
      </KeyboardAvoidingView>
    </SafeAreaView>

  )
}

export default AiChat;

