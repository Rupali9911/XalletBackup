import { View, Text, SafeAreaView, TouchableOpacity, Keyboard, Image, Platform, TextInput, FlatList, KeyboardAvoidingView } from 'react-native';
import React, { useState, } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAiChat, chatLoadingSuccess } from '../../store/actions/chatAction';
import { translate } from '../../walletUtils';
import ImageSrc from '../../constants/Images';
import styles from './style';
import { C_Image, AppHeader } from '../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { hp } from '../../constants/responsiveFunct';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { set } from 'lodash';
import ChatInput from './chatInput';

const chatNFT = ({route, navigation}) => {
  let {chatNft, tokenId} = route.params;

  //================== Components State Declaration ===================
  const [message, setMessage] = useState('');
  const [chatMessage, setChatMessage] = useState([]);
  const flatList = React.useRef(null);

  // =============== Getting data from reducer ========================
  const dispatch = useDispatch();
  const {chatLoadSuccess, isChatLoading} = useSelector(
    state => state.chatReducer,
  );
  const {userData} = useSelector(state => state.UserReducer);
  console.log('UserData : ', userData);

  // ===================== Call RightSide View ===================================
  const RightBubble = props => {
    const {item} = props;
    return (
      <View style={styles.rightBubbleContainer}>
        <View style={styles.talkBubble}>
          <View style={styles.textContainer}>
            <Text style={[styles.nftName, {color: '#46446e', marginBottom: 5}]}>
              {item.senderName}
            </Text>
            <Text style={styles.bubbleText}> {item.message} </Text>
          </View>
        </View>
        <View style={[styles.timeFormat, {marginRight: 10}]}>
          <Image source={{uri: item.senderImage}} style={styles.bubbleImage} />
          <Text style={styles.statusText}>{item.time}</Text>
        </View>
      </View>
    );
  };

  // ===================== Call LeftSide View ===================================
  const LeftBubble = props => {
    const {item} = props;
    return (
      <View style={styles.leftBubbleContainer}>
        <View style={[styles.timeFormat, {marginLeft: 10}]}>
          <Image
            source={{uri: item.receiverImage}}
            style={styles.bubbleImage}
          />
          <Text style={styles.statusText}>{item.time}</Text>
        </View>
        <View style={styles.talkBubble}>
          <View style={styles.textContainer}>
            <Text style={[styles.nftName, {color: '#46446e', marginBottom: 5}]}>
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
    const {item} = props;

    return (
      <View style={{marginVertical: 10}}>
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
        getAiChat(msg, userData.userWallet.address, chatNft.name, tokenId),
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

  const ListHeader = () => {
    //View to set in Header
    return (
      <View>
        <View style={styles.chatHeaderContainer}>
          <Image source={{uri: chatNft.image}} style={styles.chatHeaderImage} />
          <View style={{lineHeight: 2, paddingStart: 10}}>
            <Text style={styles.headerNftName}>
              {chatNft.name.slice(chatNft.name.lastIndexOf('#'))}
            </Text>
            {isChatLoading ? (
              <Text style={styles.typingMessage}>Typing...</Text>
            ) : null}
          </View>
        </View>
        <View style={styles.separator} />
      </View>
    );
  };


  const ListFooter = () => {
    //View to set in Footer
    return (
     
      <View >
        <View style={[styles.separator, { marginVertical: 10 }]} />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={translate('common.enterMessage')}
            value={message}
            // autoFocus={true}
            onChangeText={text => setMessage(text)}
            placeholderTextColor={'#212529'}
            // enableAutoAutomaticScroll={}
            // enableAutoAutomaticScroll={true}
            // autoCorrect={false}
          />
          <TouchableOpacity
            style={styles.sendBtn}
            onPress={() => sendMessage(message, new Date())}>
            <Text style={styles.sendBtnTxt}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  //=====================(Main return Function)=============================
  return (
    <SafeAreaView style={styles.mainContainer}>
       
          {/* <AppHeader
        showBackButton
      /> */}
      <TouchableOpacity
            onPress={() => {dispatch(chatLoadingSuccess('')), navigation.goBack()}}
            style={styles.backButtonWrap}
            >
            <Image style={styles.backIcon} source={ImageSrc.backArrow} />
          </TouchableOpacity>
      <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }} scrollEnabled={false} automaticallyAdjustKeyboardInsets={true}>
      {/* <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButtonWrap}>
            <Image style={styles.backIcon} source={ImageSrc.backArrow} />
          </TouchableOpacity> */}
        <View style={{ flex: 0.4 }}>
         
          <View style={styles.rcvReplyContainer}>
            <Text style={styles.nftName}>
              {chatNft.name.slice(chatNft.name.lastIndexOf('#'))}
            </Text>
            <View style={[styles.separator, {width: '80%'}]} />
            {!isChatLoading ? (
              <View>
                <Text
                  style={[styles.nftName, {marginVertical: 3}]}
                  numberOfLines={2}>
                  {chatLoadSuccess}
                </Text>
              </View>
            ) : null}
          </View>
          <C_Image uri={chatNft.image} imageStyle={styles.bannerImage} />
        </View>

        <View style={{flex: 0.6}}>
          <ListHeader />
          <View style={styles.chatContainer}>
            <FlatList
              ref={flatList}
              onContentSizeChange={(item, index) => {
                flatList.current.scrollToEnd({animated: true});
                flatList.current.scrollToOffset({
                  animated: true,
                  offset: index,
                });
              }}
              data={chatMessage}
              renderItem={({item}) => <ShowChatMessage item={item} />}
              keyExtractor={(item, index) => {
                return `_${index}`;
              }}
              onLayout={() => flatList.current.scrollToEnd({animated: true})}
              showsVerticalScrollIndicator={false}
            />
          </View>
          {/* <TextInput style={{height: 50, width: 300}}/> */}
          <ChatInput />
        </View>
      </KeyboardAwareScrollView>
      {/* <ListFooter /> */}

      {/* <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }} enabled>
<View style={{flex: 1}}>
      <View style={{ flex: 0.4 }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButtonWrap}>
          <Image style={styles.backIcon} source={ImageSrc.backArrow} />
        </TouchableOpacity>
        <View style={{ padding: 10, backgroundColor: '#000000a1', width: '100%', bottom: 0, position: 'absolute', zIndex: 1, }}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>{chatNft.name.slice(chatNft.name.lastIndexOf("#"))}</Text>
          {!isChatLoading ?
            <View>
              <View style={{ borderTopWidth: 1, borderTopColor: '#fff', width: '80%' }} />
              <Text style={{ color: '#fff', fontWeight: '700' }}>{chatLoadSuccess}</Text>
            </View>
            : null}
        </View>
        <Image source={{ uri: chatNft.image }} style={{ width: '100%', height: '100%', resizeMode: 'contain', position: 'relative' }} />
      </View>







      <View style={{ flex: 0.6 }}>
          <View style={{ flex: 0.1 }}>
            <ListHeader />
          </View>
          <View style={{ flex: 0.8 }}>
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
                // ListHeaderComponent={ListHeader}
                // ListFooterComponent={ListFooter}

                keyExtractor={(item, index) => { return `_${index}` }}
                onLayout={() => flatList.current.scrollToEnd({ animated: true })}
                showsVerticalScrollIndicator={false}
              />
            </View>
            
          </View>
          <View style={{ flex: 0.1 }}>
              <ListFooter />
            </View>
      </View>
      </View>
        </KeyboardAvoidingView> */}

      {/* 
      <FlatList
        data={[]}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={ItemSeparatorView}
        //Header to show above listview
        ListHeaderComponent={ListHeader}
        //Footer to show below listview
        // ListFooterComponent={ListFooter}
        renderItem={({ item }) => (
          <ShowChatMessage item={item} />
        )}
        ListEmptyComponent={EmptyListMessage}
        style={{backgroundColor : '#fff'}}
        // ListEmptyComponent={EmptyListMessage}
      /> */}
      {/* </View> */}

      {/* <View> */}

      {/* <View style={styles.chatHeaderContainer}>
          <Image source={{ uri: chatNft.image }} style={styles.chatHeaderImage} />
          <View style={{ lineHeight: 2, paddingStart: 10 }}>
            <Text style={styles.headerNftName}>{chatNft.name.slice(chatNft.name.lastIndexOf("#"))}</Text>
            {isChatLoading ?
              <Text style={styles.typingMessage}>Typing...</Text>
              : null}
          </View>
        </View> */}
      {/* </View> */}

      {/* <View style={styles.separator} /> */}

      {/* <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }} enabled> */}
      {/* <View style={styles.chatContainer}>
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
        </View> */}

      {/* <View style={styles.separator} /> */}

      {/* <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={translate("common.enterMessage")}
            value={message}
            onChangeText={text => setMessage(text)}
            placeholderTextColor={'#212529'}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={() => sendMessage(message, new Date())}>
            <Text style={styles.sendBtnTxt}>Send</Text>
          </TouchableOpacity>
        </View> */}
      {/* </KeyboardAvoidingView> */}
      {/* </View> */}
    </SafeAreaView>
  );
};

export default chatNFT;

//--------------------------------------------------------------------------------

// import { View, Text, SafeAreaView, TouchableOpacity, Image, Platform, TextInput, FlatList, KeyboardAvoidingView } from 'react-native';
// import { AppHeader } from '../../components';
// import Colors from '../../constants/Colors';
// import React, { useState, } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { getAiChat } from '../../store/reducer/chatReducer';
// import ImagesSrc from '../../constants/Images';
// import { translate } from '../../walletUtils';
// import styles from './style';

// const AiChat = ( {route} ) => {
//   console.log('Thats Route : ', route);
//   let {item} = route.params;
//   console.log('THis is item from another page : ', item);
//   const dispatch = useDispatch();

//   //================== Components State Declaration ===================
//   const [message, setMessage] = useState('');
//   const [chatMessage, setChatMessage] = useState([]);
//   const [disableButton, setDisableButton] = useState(false);
//   const flatList = React.useRef(null);

//   // =============== Getting data from reducer ========================
//   const { chatSuccess, isChatLoading, error } = useSelector(state => state.chatReducer);
//   const { selectedLanguageItem } = useSelector(state => state.LanguageReducer);

//   // ===================== Call RightSide View ===================================
//   const RightBubble = (props) => {
//     const { item } = props;
//     return (
//       <View style={styles.rightBubbleContainer}>
//         <View
//           style={styles.timeFormat}>
//           <Text style={styles.statusText}>{item.time}</Text>
//         </View>
//         <View style={[styles.talkBubble, { marginRight: 10, }]}>
//           <View
//             style={[
//               styles.talkBubbleAbsoluteRight,
//             ]}
//           />
//           <View
//             style={styles.textContainer}>
//             <Text
//               style={{
//                 color: Colors.black,
//                 fontSize: 14,
//                 // fontFamily: Fonts.extralight,
//               }}>
//               {item.message}
//             </Text>
//           </View>
//         </View>
//       </View>
//     );
//   }

//   // ===================== Call LeftSide View ===================================
//   const LeftBubble = (props) => {
//     const { item } = props;
//     return (
//       <View style={styles.leftBubbleContainer}>
//         <View style={[styles.talkBubble, { marginLeft: 10, }]}>
//           <View
//             style={[
//               styles.talkBubbleAbsoluteLeft,
//             ]}
//           />
//           <View
//             style={styles.textContainer}>
//             {item.type == 'Hold' && item.message == ''
//               ?
//               <Image source={ImagesSrc.typingLoading} style={styles.isLoading} alt="loading..." />
//               :
//               <Text
//                 style={{
//                   color: Colors.black,
//                   fontSize: 14,
//                 }}>
//                 {item.message}
//               </Text>
//             }
//           </View>
//         </View>
//         <View
//           style={styles.timeFormat}>
//           <Text style={styles.statusText}>{item.time}</Text>
//         </View>
//       </View>
//     );
//   }

//   // ===================== Render AIChat Flatlist ===================================
//   const ShowChatMessage = (props) => {
//     const { item } = props;
//     return (
//       <View>
//         {item.type == 'sender' ?
//           <RightBubble item={props.item} />
//           :
//           <LeftBubble item={props.item} />
//         }
//       </View>
//     );
//   }

//   // ===================== Send Message ===================================
//   const sendMessage = (msg, time) => {
//     let timeConversion = time.toLocaleTimeString('en-US', {
//       hour12: false,
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//     if (msg && msg != '') {
//       let sendObj = {
//         message: msg,
//         type: 'sender',
//         time: timeConversion,
//       };
//       let holdResp = {
//         message: '',
//         type: 'Hold',
//       }
//       setChatMessage(chatMessage => [...chatMessage, sendObj, holdResp]);
//       setDisableButton(true);
//       console.log('Before Slice : ', chatMessage);
//       dispatch(getAiChat(msg, selectedLanguageItem.language_display))
//         .then(chatResp => {
//           // chatMessage.pop();
//           setChatMessage((previousObj) => (previousObj.slice(0, -1)));
//           let receiveObj = {
//             message: chatResp,
//             type: 'receiver',
//             time: timeConversion
//           }
//           console.log('THis is Receiver Object : ', receiveObj);
//           console.log('chatMessage', chatMessage);
//           setChatMessage(chatMessage => [...chatMessage, receiveObj]);
//           setDisableButton(false);
//         })
//         .catch(err => {
//           console.log('Chat response error', err);
//           setChatMessage([]);
//         });
//     }
//     setMessage('');
//   }

//   //=====================(Main return Function)=============================

//   return (
//     <SafeAreaView style={styles.mainContainer}>
//       <AppHeader
//         title={translate("common.AIChat")}
//         showBackButton
//         isWhite
//         containerStyle={{ backgroundColor: Colors.themeColor, }}
//       />
//       <KeyboardAvoidingView behavior={ Platform.OS === "ios" ? "padding" : undefined } style={{ flex: 1,  }} enabled
//         // keyboardVerticalOffset={
//         //   Platform.select({
//         //     ios: () => 0,
//         //     android: () => -200
//         //   })()
//         // }
//         >
//         <View style={styles.chatContainer}>
//           <FlatList
//             ref={flatList}
//             onContentSizeChange={(item, index) => {
//               flatList.current.scrollToEnd({ animated: true });
//               flatList.current.scrollToOffset({ animated: true, offset: index });
//             }}
//             data={chatMessage}
//             renderItem={({ item }) => (
//               <ShowChatMessage item={item} />
//             )}
//             keyExtractor={(item, index) => { return `_${index}` }}
//             onLayout={() => flatList.current.scrollToEnd({ animated: true })}
//             showsVerticalScrollIndicator={false}
//           />
//         </View>
//           <View style={styles.inputContainer}>
//             <TextInput
//               style={styles.input}
//               placeholder={translate("common.enterMessage")}
//               value={message}
//               onChangeText={text => setMessage(text)}
//               placeholderTextColor={Colors.themeColor}
//               // autoCorrect={false}
//               // autoComplete="off"
//             />
//             <TouchableOpacity style={styles.sendBtn} onPress={() => sendMessage(message, new Date())} disabled={disableButton}>
//               <Image style={[styles.icon, { tintColor: Colors.themeColor }]} source={ImagesSrc.sendChatMessage} />
//             </TouchableOpacity>
//           </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>

//   )
// }

// export default AiChat;
