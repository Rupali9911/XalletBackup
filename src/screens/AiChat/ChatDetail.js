import { View, Text, SafeAreaView, TouchableOpacity, Image, FlatList } from 'react-native';
import React, { useEffect, useRef, useState, } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAiChat, chatLoadingSuccess, getChatBotHistory, ChatHistoryPageChange, chatHistoryLoading } from '../../store/actions/chatAction';
import { translate } from '../../walletUtils';
import ImageSrc from '../../constants/Images';
import styles from './style';
import { AppHeader, C_Image } from '../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MessageInput from './MessageInput';
import { SIZE, SVGS, IMAGES, COLORS } from '../../constants';
import moment from 'moment';
import Toast from 'react-native-toast-message'
import { ActivityIndicator, Button } from 'react-native-paper';

const { ChatDefaultProfile } = SVGS;

const ChatDetail = ({ route, navigation }) => {
  let { nftDetail, tokenId } = route.params;

  //================== Components State Declaration ===================
  const [message, setMessage] = useState('');
  const [chatBotData, setChatBotData] = useState([]);
  const [remainWordText, setRemainWordText] = useState(false);
  const flatList = React.useRef(null);
  const toastRef = useRef(null);

  // =============== Getting data from reducer ========================
  const dispatch = useDispatch();
  const { chatLoadSuccess, isChatLoading, chatHistoryPage, isHistoryLoading, isHistoryNextPage, remainCount } = useSelector(state => state.chatReducer);
  const { userData } = useSelector(state => state.UserReducer);
  const userAdd = userData?.userWallet?.address;
  const { selectedLanguageItem } = useSelector(state => state.LanguageReducer);

  useEffect(() => {
    dispatch(chatHistoryLoading());
    getHistoryData(chatHistoryPage);
    dispatch(ChatHistoryPageChange(1));
  }, []);

  const getHistoryData = (page) => {
    dispatch(getChatBotHistory(page, userAdd, tokenId))
      .then((response) => {
        if (response.length > 0) {
          // let history = []
          response.map((data) => {

            let second = data.date._seconds;
            let milisecond = Number(second) * 1000;
            let getDate = new Date(milisecond);
            let timeConversion = moment(getDate).format('h:mm A');

            let sender = {
              message: data?.question,
              type: 'sender',
              time: timeConversion,
              senderImage: userData.avatar,
              senderName: userData.userName != '' ? userData.userName : userData?.userWallet?.address.substring(0, 6)
            }

            let receiver = {
              message: data.reply,
              type: 'receiver',
              time: timeConversion,
              receiverImage: nftDetail.image,
              receiverName: nftDetail.name,
            }
            // history.push(receiver, sender);
            setChatBotData(chatBotData => [...chatBotData, receiver, sender]);
          })
        }
      })
  }

  const renderImage = () => {
    if (userData.avatar) {
      return <C_Image uri={userData.avatar} imageStyle={styles.bubbleImage} />;
    } else {
      return (
        <View style={styles.bubbleImage}>
          <ChatDefaultProfile width={SIZE(40)} height={SIZE(40)} />
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
                  <Text style={styles.msgHolderName}> {item?.receiverName} </Text>
                  <Text style={styles.bubbleText}> {item?.message} </Text>
                </View>
              </View>
            </View>
        }
      </View>
    );
  };

  //=========================Toast Message=================================
  const showToast = () => {
    toastRef.current.show({
      type: 'info',
      text1: translate('common.exceededToastWord'),
    });
  }

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
      setChatBotData(chatBotData => [sendObj, ...chatBotData]);

      dispatch(
        getAiChat(msg, userData.userWallet.address, selectedLanguageItem.language_name, nftDetail.name, tokenId),
      )
        .then(response => {
          if (response?.messageCode || response?.description) {
            showToast();
          }
          else {
            setRemainWordText(true);
            let receiveObj = {
              message: response.recvResp,
              type: 'receiver',
              time: timeConversion,
              receiverImage: nftDetail.image,
              receiverName: nftDetail.name,
              remainWords: response.remainWord
            };
            setChatBotData(chatBotData => [receiveObj, ...chatBotData]);
          }
        })
        .catch(err => {
          console.log('Error Chat : ', err);
        });
    }
    setMessage('');
  };

  //==================== On Scroll-to-Top ===========================
  const handleFlatListEndReached = () => {
    console.log('NextPage : ', isHistoryNextPage)
    let num = chatHistoryPage + 1;
    if (isHistoryNextPage) {
      dispatch(chatHistoryLoading());
      getHistoryData(num);
      dispatch(ChatHistoryPageChange(num));
    }
  };

  //========================Loader Call=================================
  const renderHeader = () => {
    if (!isHistoryLoading) return null;
    return (
      <ActivityIndicator size='small' color={COLORS.themeColor} />
    );
  }

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
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.typingContainer}>
                {isChatLoading && <Text style={styles.typingMessage}>{translate('common.typing')}</Text>}
              </View>
              {
                remainCount > 0 && <Text style={styles.remainWordText}>{translate('common.remainWordCount')}<Text style={styles.remainWordCount}> {remainCount}</Text></Text>
              }
            </View>
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

      <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }} scrollEnabled={false} keyboardShouldPersistTaps={'always'} >

        <View style={{ flex: 0.4 }}>
          <View style={styles.rcvReplyContainer}>
          <View style={styles.rcvContainerArrow}/>
            <Text style={styles.nftName}>
              {nftDetail.name.slice(nftDetail.name.lastIndexOf('#'))}
            </Text>
            <View style={[styles.separator, { width: '80%' }]} />
            {!chatBotData?.response ? (
              <View>
                <Text
                  style={[styles.nftName, { marginVertical: 3 }]}
                  numberOfLines={2}>
                  {chatLoadSuccess?.recvResp}
                </Text>
              </View>
            ) : null}
          </View>
          <View style={{ width: '100%', height: '100%', alignItems: 'center', padding: 10}}>
            <C_Image uri={nftDetail.image} imageStyle={styles.bannerImage} />
          </View>
        </View>

        <View style={{ flex: 0.6 }}>
          <ListHeader />
          <View style={styles.chatContainer}>
            <FlatList
              ref={flatList}
              data={chatBotData}
              renderItem={({ item }) => <ShowBubble item={item} />}
              keyExtractor={(item, index) => {
                return `_${index}`;
              }}
              onLayout={() => flatList.current.scrollToEnd({ animated: true })}
              showsVerticalScrollIndicator={false}
              inverted={true}
              onEndReached={handleFlatListEndReached}
              ListFooterComponent={renderHeader}
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
      <Toast
        position='bottom'
        visibilityTime={2000}
        autoHide={true}
        ref={toastRef}

      />
    </SafeAreaView>
  );
};

export default ChatDetail;
