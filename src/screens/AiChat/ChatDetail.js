import { View, Text, SafeAreaView, TouchableOpacity, Image, FlatList } from 'react-native';
import React, { useState, } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAiChat, chatLoadingSuccess } from '../../store/actions/chatAction';
import { translate } from '../../walletUtils';
import ImageSrc from '../../constants/Images';
import styles from './style';
import { C_Image } from '../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MessageInput from './MessageInput';
import { SIZE, SVGS, IMAGES} from '../../constants';
import moment from 'moment';

const { ChatDefaultProfile } = SVGS;

const ChatDetail = ({ route, navigation }) => {
  let { nftDetail, tokenId } = route.params;

  //================== Components State Declaration ===================
  const [message, setMessage] = useState('');
  const [chatBotData, setChatBotData] = useState([]);
  const flatList = React.useRef(null);

  // =============== Getting data from reducer ========================
  const dispatch = useDispatch();
  const { chatLoadSuccess, isChatLoading } = useSelector(state => state.chatReducer);
  const { userData } = useSelector(state => state.UserReducer);
  const { selectedLanguageItem } = useSelector(state => state.LanguageReducer);

  const renderImage = () => {
    if (userData.avatar) {
      return <C_Image uri={userData.avatar} imageStyle={styles.bubbleImage} />;
    } else {
      return (
        <View style={styles.bubbleImage}>
        <ChatDefaultProfile width={SIZE(40)} height={SIZE(40)}/>
        </View>
      );
    } 
  };

  const ShowBubble = props => {
    const { item } = props;
    return (
      <View style={{ marginVertical: 8 }}>
        {
          item?.type == 'sender'
            ?
            <View style={styles.rightBubbleContainer}>
              <View style={styles.talkBubble}>
                <View style={styles.textContainer}>
                  <Text style={styles.msgHolderName}> {item?.senderName} </Text>
                  <Text style={styles.bubbleText}> {item?.message} </Text>
                </View>
              </View>
              <View style={[styles.timeFormat, { marginRight: 10 }]}>
                {renderImage()}
                <Text style={styles.statusText}>{item?.time}</Text>
              </View>
            </View>
            :
            <View style={styles.leftBubbleContainer}>
              <View style={[styles.timeFormat, { marginLeft: 10 }]}>
                <C_Image uri={item?.receiverImage} imageStyle={styles.bubbleImage} />
                <Text style={styles.statusText}>{item?.time}</Text>
              </View>
              <View style={styles.talkBubble}>
                <View style={styles.textContainer}>
                  <Text style={styles.msgHolderName}> {item?.receiverName.slice(item?.receiverName.lastIndexOf('#'))} </Text>
                  <Text style={styles.bubbleText}> {item?.message} </Text>
                </View>
              </View>
            </View>
        }
      </View>
    );
  };

  // ===================== Send Message ===================================
  const sendMessage = (msg, time) => {
    let timeConversion = moment(time).format('h:mm A');
    if (msg && msg != '') {

      let sendObj = {
        message: msg,
        type: 'sender',
        time: timeConversion,
        senderImage: userData.avatar,
        senderName: userData.userName != '' ? userData.userName : userData?.userWallet?.address.substring(0, 6),
      };
      setChatBotData(chatBotData => [...chatBotData, sendObj]);

      dispatch(
        getAiChat(msg, userData.userWallet.address, selectedLanguageItem.language_name, nftDetail.name, tokenId),
      )
        .then(response => {
          let receiveObj = {
            message: response,
            type: 'receiver',
            time: timeConversion,
            receiverImage: nftDetail.image,
            receiverName: nftDetail.name,
          };
          setChatBotData(chatBotData => [...chatBotData, receiveObj]);
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
            <C_Image uri={nftDetail.image} imageStyle={styles.cImageContainer} />
          </View>
          <View style={{ paddingStart: 10 }}>
            <Text style={styles.headerNftName}>
              {nftDetail.name.slice(nftDetail.name.lastIndexOf('#'))}
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
          navigation.goBack();
          dispatch(chatLoadingSuccess(''));
        }}
        style={styles.backButtonWrap}
      >
        <Image style={styles.backIcon} source={ImageSrc.backArrow} />
      </TouchableOpacity>
      
      <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }} scrollEnabled={false} >

        <View style={{ flex: 0.4 }}>
          <View style={styles.rcvReplyContainer}>
            <Text style={styles.nftName}>
              {nftDetail.name.slice(nftDetail.name.lastIndexOf('#'))}
            </Text>
            <View style={[styles.separator, { width: '80%' }]} />
            {!chatBotData?.response ? (
              <View>
                <Text
                  style={[styles.nftName, { marginVertical: 3 }]}
                  numberOfLines={2}>
                  {chatLoadSuccess}
                </Text>
              </View>
            ) : null}
          </View>
          <C_Image uri={nftDetail.image} imageStyle={styles.bannerImage} />
        </View>
        
        <View style={{ flex: 0.6 }}>
          <ListHeader />
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
              data={chatBotData}
              renderItem={({ item }) => <ShowBubble item={item} />}
              keyExtractor={(item, index) => {
                return `_${index}`;
              }}
              onLayout={() => flatList.current.scrollToEnd({ animated: true })}
              showsVerticalScrollIndicator={false}
            />
          </View>

          <MessageInput
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

export default ChatDetail;
