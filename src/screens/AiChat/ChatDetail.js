import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Linking,
  TextInput,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  getAiChat,
  chatLoadingSuccess,
  getChatBotHistory,
  ChatHistoryPageChange,
  chatHistoryLoading,
  getAIBgImage,
  getAIBackgroundImageReset,
  uploadAIBgImage,
  chatBotUpdate,
  aiMessageUpdate,
  animatedChatLoading,
} from '../../store/actions/chatAction';
import {translate} from '../../walletUtils';
import styles from './style';
import {C_Image, Loader} from '../../components';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import MessageInput from './MessageInput';
import {PLATFORM, SIZE, SVGS} from '../../constants';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import {Platform} from 'expo-modules-core';
import {ImagekitType} from '../../common/ImageConstant';
import ImagePicker from 'react-native-image-crop-picker';
import {confirmationAlert} from '../../common/function';
import {openSettings} from 'react-native-permissions';
import BackIcon from 'react-native-vector-icons/MaterialIcons';
import {colors} from '../../res';
import {checkEngJpLang} from '../../utils';
import AIAudio from '../../components/AIAudio';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import {hp} from '../../constants/responsiveFunct';
import HyperLink from 'react-native-hyperlink';
const {ThreeDotsVerticalIcon} = SVGS;

const {ChatDefaultProfile, ChangeBackground} = SVGS;

const ChatDetail = ({route, navigation}) => {
  const {chatDetailData} = route.params;

  //================== Components State Declaration ===================
  const [chatBotData, setChatBotData] = useState([]);
  const [bannerImage, setBannerImage] = useState(false);
  const [chatResponseMsg, setChatResponseMsg] = useState();

  const [editMessage, setEditMessage] = useState({});
  const flatList = React.useRef(null);
  const toastRef = useRef(null);

  // =============== Getting data from reducer ========================
  const dispatch = useDispatch();
  const {
    isChatLoading,
    chatHistoryPage,
    isHistoryLoading,
    isHistoryNextPage,
    remainCount,
    aiBgImageData,
    aiBgImageLoading,
    updateMesaage,
    isAnimatedLoading,
  } = useSelector(state => state.chatReducer);
  const {userData} = useSelector(state => state.UserReducer);
  const userAdd = userData?.userWallet?.address;
  const {reducerTabTitle} = useSelector(state => state.chatReducer);

  const isOwnedTab = reducerTabTitle === 'Owned' ? true : false;

  //====================== UseEffect Call ===============================
  useEffect(() => {
    if (reducerTabTitle != 'Animated') {
      dispatch(chatHistoryLoading());
      getHistoryData(1);
      dispatch(ChatHistoryPageChange(1));
    }
    return () => {
      dispatch(getAIBackgroundImageReset());
    };
  }, []);

  // useEffect(() => {
  //   console.log(
  //     aiBgImageLoading,
  //     bannerImage,
  //     '🚀 ~ file: ChatDetail.js:78 ~ ChatDetail ~ aiBgImageData',
  //   );
  //   if (!aiBgImageLoading) {
  //     setBannerImage(!bannerImage);
  //   }
  // }, [aiBgImageLoading]);

  useEffect(() => {
    if (isOwnedTab) {
      dispatch(
        getAIBgImage(
          userAdd,
          chatDetailData?.collectionAddress,
          chatDetailData?.tokenId,
        ),
      );
    }
  }, [reducerTabTitle]);

  useEffect(() => {
    console.log(
      updateMesaage?.bg_message,
      '🚀 ~ file: ChatDetail.js:78 ~ ChatDetail ~',
      updateMesaage?.msg_update,
    );
    if (updateMesaage?.bg_message) {
      setBannerImage(!bannerImage);
      showToast(updateMesaage?.bg_message);
      dispatch(
        aiMessageUpdate({
          bg_message: '',
        }),
      );
    } else if (updateMesaage?.msg_update) {
      showToast(updateMesaage?.msg_update);
      dispatch(
        aiMessageUpdate({
          msg_update: '',
        }),
      );
    }
  }, [updateMesaage]);

  //================== Get History Data =================================
  const getHistoryData = page => {
    dispatch(getChatBotHistory(page, userAdd, chatDetailData?.tokenId)).then(
      response => {
        if (response.length > 0) {
          let history = [...chatBotData];
          response.map(data => {
            let second = data.date._seconds;
            let milisecond = Number(second) * 1000;
            let getDate = new Date(milisecond);
            let timeConversion = moment(getDate).format('h:mm A');

            let sender = {
              message: data?.question,
              type: 'sender',
              time: timeConversion,
              senderImage: userData?.avatar,
              name:
                userData?.userName != ''
                  ? userData?.userName
                  : userData?.userWallet?.address.substring(0, 6),
            };

            let receiver = {
              message: data.reply,
              question: data?.question,
              type: 'receiver',
              time: timeConversion,
              receiverImage: chatDetailData?.nftImage,
              name: chatDetailData?.bot_name,
            };
            history.push(receiver, sender);
          });
          setChatBotData(history);
        }
      },
    );
  };

  //====================== Chat Sender Image =========================
  const renderImage = useCallback(item => {
    if (item?.type === 'receiver') {
      return (
        <C_Image
          imageType={'profile'}
          uri={item?.receiverImage}
          size={ImagekitType.AVATAR}
          imageStyle={styles.bubbleImage}
        />
      );
    } else {
      if (userData.avatar) {
        return (
          <C_Image
            imageType={'profile'}
            uri={userData.avatar}
            size={ImagekitType.AVATAR}
            imageStyle={styles.bubbleImage}
          />
        );
      } else {
        return (
          <View style={styles.bubbleImage}>
            <ChatDefaultProfile width={SIZE(40)} height={SIZE(40)} />
          </View>
        );
      }
    }
  }, []);

  const onEditMessage = update_msg => {
    let msg_question = editMessage?.question;
    dispatch(
      chatBotUpdate(
        chatDetailData?.bot_name,
        chatDetailData?.tokenId,
        msg_question,
        update_msg,
      ),
    );
    setEditMessage({});
  };

  const renderEdit = item => {
    return (
      <View style={styles.threeDotView}>
        <Menu onSelect={() => setEditMessage(item)}>
          <MenuTrigger children={<ThreeDotsVerticalIcon />} />
          <MenuOptions optionsContainerStyle={styles.editPopupContainer}>
            <MenuOption value={1}>
              <Text>{translate('wallet.common.edit')}</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </View>
    );
  };

  //==========================Messages Show Here=============================
  const renderBubbleMessages = item => {
    return (
      <View
        style={styles.talkBubble(item?.type === 'sender' ? false : isOwnedTab)}>
        <View style={styles.chatView}>
          <Text style={styles.chatAuthorName}>{item?.name}</Text>
          {Platform.OS === 'ios' ? (
            <TextInput
              value={item?.message}
              editable={false}
              multiline={true}
              dataDetectorTypes={'all'}
            />
          ) : (
            <HyperLink
              onPress={(url, text) => {
                Linking.openURL(url);
              }}
              linkStyle={styles.hyperLinkText}
              linkText={item?.message}>
              <Text selectable={true}>{item?.message}</Text>
            </HyperLink>
          )}
        </View>
      </View>
    );
  };

  //==================== Show Chatting time here=========================
  const renderBubbleTime = item => {
    return (
      <View style={[styles.timeView]}>
        {renderImage(item)}
        <Text style={styles.chatingTime}>{item?.time}</Text>
      </View>
    );
  };

  //======================== Flatlist Render Tim ( Show Bubbles )=============================
  const renderItem = ({item, index}) => {
    return (
      <View style={{marginVertical: SIZE(8)}}>
        {item?.type === 'sender' ? (
          <View
            style={styles.bubbleContainer(item?.type)}
            pointerEvents={'box-none'}>
            {renderBubbleMessages(item)}
            {renderBubbleTime(item)}
          </View>
        ) : (
          <View
            style={styles.bubbleContainer(item?.type)}
            pointerEvents={'box-none'}>
            {renderBubbleTime(item)}
            {renderBubbleMessages(item)}

            {isOwnedTab && renderEdit(item)}
          </View>
        )}
      </View>
    );
  };

  const openImagePicker = async () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
    })
      .then(image => {
        let filename =
          Platform.OS === 'android'
            ? image.path.substring(image.path.lastIndexOf('/') + 1)
            : image.filename;

        let uri = Platform.OS === 'android' ? image.path : image.sourceURL;
        let temp = {
          path: image.path,
          uri: uri,
          type: image.mime,
          fileName: filename,
          image: image,
        };
        dispatch(
          uploadAIBgImage(
            temp,
            chatDetailData?.collectionAddress,
            chatDetailData?.tokenId,
          ),
        );
      })
      .catch(async e => {
        if (e.code && e.code === 'E_NO_LIBRARY_PERMISSION') {
          confirmationAlert(
            translate('wallet.common.storagePermissionHeader'),
            translate('wallet.common.storagePermissionMessage'),
            translate('common.Cancel'),
            translate('wallet.common.settings'),
            () => openSettings(),
            () => null,
          );
        }
      });
  };

  //=========================Toast Message=================================
  const showToast = msg => {
    toastRef.current.show({
      type: 'info',
      text1: msg ? msg : translate('common.exceededToastWord'),
    });
  };

  const ChatBotApiCall = (message, msgLanguage) => {
    return dispatch(
      getAiChat(
        userData?.userWallet?.address,
        chatDetailData?.bot_name,
        chatDetailData?.collectionAddress,
        msgLanguage,
        chatDetailData?.nftId,
        message,
        chatDetailData?.tokenId,
        chatDetailData?.isFreeModal,
      ),
    );
  };

  const getVoiceCallback = receiverData => {
    dispatch(animatedChatLoading(false));
    setChatResponseMsg(receiverData?.message);
    setChatBotData(chatBotData => [receiverData, ...chatBotData]);
  };

  // ===================== Send Message ===================================
  const sendMessage = (msg, time) => {
    const msgLanguage = checkEngJpLang(msg);

    if (msgLanguage === 'en' || msgLanguage === 'ja') {
      let timeConversion = moment(time).format('h:mm A');
      if (msg && msg != '') {
        let sendObj = {
          message: msg,
          type: 'sender',
          time: timeConversion,
          senderImage: userData?.avatar,
          name:
            userData.userName != ''
              ? userData.userName
              : userData?.userWallet?.address.substring(0, 6),
        };
        setChatBotData(chatBotData => [sendObj, ...chatBotData]);

        ChatBotApiCall(msg, msgLanguage)
          .then(response => {
            if (response?.messageCode || response?.description) {
              showToast();
            } else {
              let receiveObj = {
                message: response?.response
                  ? response?.response
                  : response?.message,
                type: 'receiver',
                time: timeConversion,
                receiverImage: chatDetailData?.nftImage,
                name: chatDetailData?.bot_name,
                question: response?.question,
              };
              if (
                reducerTabTitle === 'Animated' &&
                chatDetailData.listItems?.iNFT &&
                chatDetailData?.listItems?.voiceAllowed
              ) {
                AIAudio(receiveObj, msgLanguage, getVoiceCallback);
              } else {
                setChatResponseMsg(response?.response);
                setChatBotData(chatBotData => [receiveObj, ...chatBotData]);
              }
            }
          })
          .catch(err => {});
      }
    } else {
      showToast(translate('common.INVALID_LANGUAGE'));
    }
  };

  //==================== On Scroll-to-Top ===========================
  const handleFlatListEndReached = () => {
    let num = chatHistoryPage + 1;
    if (isHistoryNextPage && reducerTabTitle != 'Animated') {
      dispatch(chatHistoryLoading());
      getHistoryData(num);
      dispatch(ChatHistoryPageChange(num));
    }
  };

  //========================Loader Call=================================
  const renderHeader = () => {
    if (!isHistoryLoading) return null;
    return <Loader />;
  };

  const renderBGImg = () => {
    return (
      <ImageBackground
        key={bannerImage}
        source={{uri: aiBgImageData?.background_image + '?' + Date.now()}}
        style={styles.bannerImgContainer}>
        <C_Image
          uri={
            reducerTabTitle === 'Animated'
              ? chatDetailData?.nftImage
              : chatDetailData?.listItems?.smallImage
          }
          size={ImagekitType.FULLIMAGE}
          imageStyle={styles.bannerImage}
        />
      </ImageBackground>
    );
  };

  // ===================== FlatList Header Call ===================================
  const ListHeader = () => {
    //View to set in Header
    return (
      <View>
        <View style={styles.chatHeaderContainer}>
          <View>
            <C_Image
              imageType={'profile'}
              size={ImagekitType.AVATAR}
              uri={chatDetailData?.nftImage}
              imageStyle={styles.cImageContainer}
            />
          </View>
          <View style={styles.mainView}>
            <Text style={styles.headerNftName}>{chatDetailData?.bot_name}</Text>
            <View style={styles.remainWordCountView}>
              <View style={styles.typingContainer}>
                {(reducerTabTitle === 'Animated'
                  ? isAnimatedLoading
                  : isChatLoading) && (
                  <Text style={styles.typingMessage}>
                    {translate('common.typing')}
                  </Text>
                )}
              </View>
              {reducerTabTitle != 'Animated' && remainCount > 0 && (
                <Text style={styles.remainWordText}>
                  {translate('common.remainWordCount')} {parseInt(remainCount)}
                </Text>
              )}
            </View>
          </View>
        </View>
        <View style={styles.separator} />
      </View>
    );
  };

  const memoizedValue = useMemo(() => renderItem, [chatBotData]);

  //=====================(Main return Function)=============================
  return (
    <SafeAreaView style={styles.mainContainer}>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flex: 1,
        }}
        scrollEnabled={false}
        extraScrollHeight={Platform.OS === 'ios' ? SIZE(25) : 0}
        extraHeight={editMessage?.message ? hp(9) : hp(4)}
        keyboardShouldPersistTaps={'always'}
        keyboardOpeningTime={0}>
        <View style={{flex: 0.4}}>
          <View style={styles.rcvReplyContainer}>
            <View style={styles.rcvContainerArrow} />
            <Text style={styles.nftName}>{chatDetailData?.bot_name}</Text>
            <View style={[styles.separator, {width: '80%'}]} />

            <Text
              style={[styles.nftName, {marginVertical: 3}]}
              numberOfLines={2}>
              {chatResponseMsg}
            </Text>
          </View>

          {renderBGImg()}

          <View style={styles.backBtnContainer}>
            <TouchableOpacity
              style={styles.backButtonWrap}
              onPress={() => {
                navigation.goBack();
                dispatch(chatLoadingSuccess(''));
              }}>
              <BackIcon
                name={'keyboard-backspace'}
                color={colors.white}
                size={SIZE(22)}
              />
            </TouchableOpacity>

            {isOwnedTab && (
              <TouchableOpacity
                style={styles.imageViewWrap}
                onPress={() => openImagePicker()}>
                <ChangeBackground width={SIZE(24)} height={SIZE(24)} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={{flex: 0.6}}>
          <ListHeader />
          <View style={styles.chatContainer}>
            <FlatList
              ref={flatList}
              data={chatBotData}
              renderItem={memoizedValue}
              keyExtractor={(item, index) => {
                return `_${index}`;
              }}
              showsVerticalScrollIndicator={false}
              inverted={true}
              onEndReached={handleFlatListEndReached}
              onEndReachedThreshold={1}
              ListFooterComponent={renderHeader}
              removeClippedSubviews={false}
              pointerEvents={'box-none'}
            />
          </View>

          <MessageInput
            message={editMessage?.message ? editMessage?.message : ''}
            onPressCancel={() => {
              setEditMessage({});
            }}
            onPress={message => {
              if (editMessage?.message) {
                onEditMessage(message);
              } else {
                sendMessage(message, new Date());
                chatBotData.length > 0 &&
                  flatList.current.scrollToIndex({animated: true, index: 0});
              }
            }}
          />
        </View>
      </KeyboardAwareScrollView>
      <Toast
        position="bottom"
        visibilityTime={2000}
        autoHide={true}
        ref={toastRef}
      />
    </SafeAreaView>
  );
};

export default ChatDetail;
