import { View, Text, SafeAreaView, TouchableOpacity, Image, FlatList } from 'react-native';
import React, { useState, } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAiChat, chatLoadingSuccess } from '../../store/actions/chatAction';
import { translate } from '../../walletUtils';
import ImageSrc from '../../constants/Images';
import styles from './style';
import { C_Image } from '../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ChatInput from './ChatInput';

const ChatNFT = ({ route, navigation }) => {
  let { chatNft, tokenId, is_Owned } = route.params;

  //================== Components State Declaration ===================
  const [message, setMessage] = useState('');
  const [chatMessage, setChatMessage] = useState([]);
  const flatList = React.useRef(null);

  // =============== Getting data from reducer ========================
  const dispatch = useDispatch();
  const { chatLoadSuccess, isChatLoading } = useSelector(state => state.chatReducer);
  const { userData } = useSelector(state => state.UserReducer);

  // ===================== Call RightSide View ===================================
  const RightBubble = props => {
    const { item } = props;
    return (
      <View style={styles.rightBubbleContainer}>
        <View style={styles.talkBubble}>
          <View style={styles.textContainer}>
            <Text style={[styles.nftName, { color: '#46446e', marginBottom: 5 }]}>
              {item.senderName}
            </Text>
            <Text style={styles.bubbleText}> {item.message} </Text>
          </View>
        </View>
        <View style={[styles.timeFormat, { marginRight: 10 }]}>
          <C_Image uri={item.senderImage} imageStyle={styles.bubbleImage} />
          <Text style={styles.statusText}>{item.time}</Text>
        </View>
      </View>
    );
  };

  // ===================== Call LeftSide View ===================================
  const LeftBubble = props => {
    const { item } = props;
    return (
      <View style={styles.leftBubbleContainer}>
        <View style={[styles.timeFormat, { marginLeft: 10 }]}>
          <C_Image uri={item.receiverImage} imageStyle={styles.bubbleImage} />
          <Text style={styles.statusText}>{item.time}</Text>
        </View>
        <View style={styles.talkBubble}>
          <View style={styles.textContainer}>
            <Text style={[styles.nftName, { color: '#46446e', marginBottom: 5 }]}>
              {item.receiverName.slice(item.receiverName.lastIndexOf('#'))}
            </Text>
            <Text style={styles.bubbleText}> {item.message} </Text>
          </View>
        </View>
      </View>
    );
  };

  // ===================== Render AIChat Flatlist ===================================
  const ShowChatMessage = props => {
    const { item } = props;

    return (
      <View style={{ marginVertical: 10 }}>
        {item.type == 'sender' ?
          <RightBubble item={props.item} />
          :
          <LeftBubble item={props.item} />
        }
      </View>
    );
  };

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
        senderImage: userData.avatar,
        senderName: userData.userName,
      };
      setChatMessage(chatMessage => [...chatMessage, sendObj]);

      dispatch(
        getAiChat(msg, userData.userWallet.address, chatNft.name, tokenId, is_Owned),
      )
        .then(response => {
          let receiveObj = {
            message: response,
            type: 'receiver',
            time: timeConversion,
            receiverImage: chatNft.image,
            receiverName: chatNft.name,
          };
          setChatMessage(chatMessage => [...chatMessage, receiveObj]);
        })
        .catch(err => {
          console.log('Error Chat : ', err);
        });
    }
    setMessage('');
  };

  // ===================== FlatList Header Call ===================================
  const ListHeader = () => {
    //View to set in Header
    return (
      <View>
        <View style={styles.chatHeaderContainer}>
          <View>
            <C_Image uri={chatNft.image} imageStyle={styles.cImageContainer} />
          </View>
          <View style={{ paddingStart: 10 }}>
            <Text style={styles.headerNftName}>
              {chatNft.name.slice(chatNft.name.lastIndexOf('#'))}
            </Text>
            {isChatLoading ? (
              <Text style={styles.typingMessage}>{translate('common.typing')}</Text>
            ) : null}
          </View>
        </View>
        <View style={styles.separator} />
      </View>
    );
  };

  //=====================(Main return Function)=============================
  return (
    <SafeAreaView style={styles.mainContainer}>

      <TouchableOpacity
        onPress={() => {
          dispatch(chatLoadingSuccess(''));
          navigation.goBack()
        }}
        style={styles.backButtonWrap}
      >
        <Image style={styles.backIcon} source={ImageSrc.backArrow} />
      </TouchableOpacity>

      <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }} scrollEnabled={false} automaticallyAdjustKeyboardInsets={true}>

        <View style={{ flex: 0.4 }}>
          <View style={styles.rcvReplyContainer}>
            <Text style={styles.nftName}>
              {chatNft.name.slice(chatNft.name.lastIndexOf('#'))}
            </Text>
            <View style={[styles.separator, { width: '80%' }]} />
            {!chatMessage?.response ? (
              <View>
                <Text
                  style={[styles.nftName, { marginVertical: 3 }]}
                  numberOfLines={2}>
                  {chatLoadSuccess}
                </Text>
              </View>
            ) : null}
          </View>
          <C_Image uri={chatNft.image} imageStyle={styles.bannerImage} />
        </View>

        <View style={{ flex: 0.6 }}>
          {/* =================Header======================== */}
          <ListHeader />

          {/* =================Flatlist======================== */}
          <View style={styles.chatContainer}>
            <FlatList
              ref={flatList}
              onContentSizeChange={(item, index) => {
                flatList.current.scrollToEnd({ animated: true });
                flatList.current.scrollToOffset({
                  animated: true,
                  offset: index,
                });
              }}
              data={chatMessage}
              renderItem={({ item }) => <ShowChatMessage item={item} />}
              keyExtractor={(item, index) => {
                return `_${index}`;
              }}
              onLayout={() => flatList.current.scrollToEnd({ animated: true })}
              showsVerticalScrollIndicator={false}
            />
          </View>

          {/* =================Footer======================== */}
          <ChatInput
            placeholder={translate('common.enterMessage')}
            value={message}
            onChangeText={text => setMessage(text)}
            onPress={() => sendMessage(message, new Date())}
          />
        </View>

      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default ChatNFT;
