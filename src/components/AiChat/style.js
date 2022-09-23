import { Platform, StyleSheet } from 'react-native';
import { hp, wp } from '../../constants/responsiveFunct';
import Colors from '../../constants/Colors';
import CommonStyles from '../../constants/styles';
import { SIZE } from '../../common/responsiveFunction';
import { screenHeight } from '../../constants/responsiveFunct';



const styles = StyleSheet.create({

    container: {
        flex: 1,
      },
      inner: {
        padding: 24,
        flex: 1,
        justifyContent: 'space-around',
      },
      header: {
        fontSize: 36,
        marginBottom: 48,
      },
      textInput: {
        height: 40,
        borderColor: '#000000',
        borderBottomWidth: 1,
        marginBottom: 36,
      },
      btnContainer: {
        backgroundColor: 'white',
        marginTop: 12,
      },





    mainContainer: {
        flex: 1,
        // backgroundColor: Colors.themeColor
        backgroundColor: '#fff',
        // height: screenHeight
        // height: hp(100),
        // height: '100%'
    },
    chatContainer: {
        flex: 2,
        width: '100%',
        // height: hp(40),
        backgroundColor: '#fff',
    },
    inputContainer: {
        // paddingHorizontal: hp(0.1),
        // flex: 1,
        width: '100%',
        // height: Platform.OS === 'ios' ? hp(8) : hp(6),
        alignItems: 'center',
        // backgroundColor:  Colors.themeColor,
        // bottom: 0,
        //  position: 'absolute',
        // position: 'relative',
        // display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
        // justifyContent: 'space-evenly',
    },
    input: {
        // fontSize: 17,
        // marginHorizontal: 3,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderColor: '#ced4da',
        borderWidth: 2,
        width: '80%',
        borderRightColor: '#3c7bde',
        borderRightWidth: 0
        // height: Platform.OS === 'ios' ? 50 : 40,
        // borderRadius: 300 / 2,
        // backgroundColor: '#fff',
    },
    sendBtn: {
        // width: Platform.OS === 'ios' ? 50 : 40,
        // width: '100%',
        // height:  Platform.OS === 'ios' ? hp(10) : hp(8),
        // borderRadius: 60 / 2,
        // marginHorizontal: 3,
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#3c7bde',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#3c7bde',
        borderWidth: 2,
        borderBottomRightRadius: 3,
        borderTopRightRadius: 3

        // marginLeft: 3
    },
    sendText: {
        fontSize: 30,
        color: 'black',
    },
    talkBubble: {
        justifyContent: 'flex-end',
        // marginVertical: 10,
        maxWidth: '80%',
        // backgroundColor: 'red'

    },
    talkBubbleAbsoluteRight: {
        width: 30,
        height: 30,
        alignSelf: 'flex-end',
        position: 'absolute',
        backgroundColor: 'transparent',
        borderRadius: 50,
        borderTopColor: 'transparent',
        borderTopWidth: 12.5,
        borderLeftWidth: 6.5,
        borderLeftColor: '#fff',
        borderBottomWidth: 0,
        borderBottomColor: 'transparent',
        transform: [{ rotate: '-90deg' }],
        right: -5,
        top: -15,
    },
    talkBubbleAbsoluteLeft: {
        width: 30,
        height: 30,
        position: 'absolute',
        backgroundColor: 'transparent',
        borderRadius: 50,
        borderTopColor: 'transparent',
        borderTopWidth: 12.5,
        borderRightWidth: 6.5,
        borderRightColor: '#fff',
        borderBottomWidth: 0,
        borderBottomColor: 'transparent',
        transform: [{ rotate: '90deg' }],
        left: -5,
        top: -15,
    },
    statusText: {
        color: '#888',
        fontSize: 10,
        fontWeight: '500'
    },
    icon: {
        ...CommonStyles.imageStyles(5),
    },
    timeFormat: {
        marginHorizontal: '2.5%',
        alignItems: 'center',
        // marginVertical: 10,
        // alignSelf: 'flex-end',
        // backgroundColor: 'red',
        justifyContent: 'space-between',
        // flexDirection: 'column',
        // flex: 1
        // paddingTop: 5,

    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        minHeight: 50,
        borderRadius: 5,
        backgroundColor: '#ebecf0',
    },
    scrollContent: {
        flexGrow: 1,
    },
    keyboardShift: {
        flex: 1,
    },
    rightBubbleContainer: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        flexDirection: 'row',
        // marginVertical: 20
    },
    leftBubbleContainer: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flexDirection: 'row'
    },
    isLoading: {
        ...CommonStyles.imageStyles(6),
        flex: 1,
        justifyContent: 'center',
    },
    searchBar: {
        borderWidth: 1,
        borderColor: Colors.borderLightColor3,
        // borderRadius: hp('3%'),
        width: wp('95%'),
        height: hp('5%'),
        paddingVertical: 0,
        alignSelf: 'center',
        marginBottom: SIZE(10)
    },
    inputStyle: {
        fontSize: 14,
        // fontFamily: Fonts.PINGfANG,
        color: Colors.BLACK1,
        height: '100%',
        margin: 0,
        padding: 0
    },
    sorryMessageCont: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
        // backgroundColor: '#efefef',

    },
    sorryMessage: {
        fontSize: 15,
        fontWeight: '500'

        // fontFamily: fonts.SegoeUIRegular,
    },
    backIcon: {
        width: SIZE(16),
        height: SIZE(16),
        resizeMode: 'contain',
    },
    backButtonWrap: {
        // position: 'absolute',
        left: SIZE(10),
        paddingVertical: SIZE(12),
        // zIndex: 1,
        backgroundColor: 'white',
        width: SIZE(26),
        height: SIZE(26),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: SIZE(13),
    },
    separator: {
        // backgroundColor: Colors.separatorThird,
        // height: 1,
        // alignSelf: "flex-end",
        width: wp('100%'),
        borderBottomColor: '#ced4da',
        borderBottomWidth: 2,
    },
    bubbleImage: {
        height: 40,
        width: 40,
        borderRadius: 40 / 2,
        marginBottom: 5,
    },
    bubbleText: {
        color: Colors.black,
        fontSize: 14,
    },
    chatHeaderContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        paddingVertical: 5,
        marginLeft: 10,
    },
    chatHeaderImage: {
        height: 40,
        width: 40,
        borderRadius: 40 / 2,
    },
    headerNftName: {
        color: '#46446e',
        fontWeight: '700'
    },
    typingMessage: {
        color: '#888',
        fontWeight: 'bold',
        fontStyle: 'italic',
        fontSize: 11
    },
    sendBtnTxt: {
        color: '#fff',
        fontWeight: 'bold'
    },
    viewAllBtn: {
        marginVertical: SIZE(12),
        width: wp(40),
        alignSelf: 'center'
      },
      viewAllBtnInner: {
        backgroundColor: 'transparent',
        borderColor: Colors.BLUE4,
        borderWidth: 2
      },
      nftName: {
        color: '#fff', fontWeight: '700'
      },
      bannerImage: {
        width: '100%', height: '100%', resizeMode: 'contain'
      },
      rcvReplyContainer: {
        padding: 10, backgroundColor: '#000000a1', width: '100%', bottom: 0, position: 'absolute', zIndex: 2,
      }


})

export default styles;









// import { Platform, StyleSheet } from 'react-native';
// import { hp, wp } from '../../constants/responsiveFunct';
// import Colors from '../../constants/Colors';
// import CommonStyles from '../../constants/styles';

// const styles = StyleSheet.create({
//     mainContainer: {
//         flex: 1,
//         backgroundColor: Colors.themeColor
//     },
//     chatContainer: {
//         flex: 1,
//         width: '100%',
//         height: '100%',
//         backgroundColor: '#efefef',
//     },
//     inputContainer: {
//         paddingHorizontal: hp(0.1),
//         width: '100%',
//         height: Platform.OS === 'ios' ? hp(10) : hp(8),
//         alignItems: 'center',
//         backgroundColor:  Colors.themeColor,
//         bottom: 0,
//         //  position: 'absolute',
//         // position: 'relative',
//         // display: 'flex',
//         flexDirection: 'row',
//         justifyContent: 'space-evenly',
//     },
//     input: {
//         fontSize: 17,
//         marginHorizontal: 3,
//         paddingHorizontal: 15,
//         borderColor: '#fff',
//         borderWidth: 2,
//         width: '80%',
//         height: Platform.OS === 'ios' ? 50 : 40,
//         borderRadius: 300 / 2,
//         backgroundColor: '#fff',
//     },
//     sendBtn: {
//         width: Platform.OS === 'ios' ? 50 : 40,
//         height: Platform.OS === 'ios' ? 50 : 40,
//         borderRadius: 60 / 2,
//         backgroundColor: '#fff',
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginLeft: 3
//     },
//     sendText: {
//         fontSize: 30,
//         color: 'black',
//     },
//     talkBubble: {
//         justifyContent: 'flex-end',
//         marginVertical: 15,
//         maxWidth: '80%',

//     },
//     talkBubbleAbsoluteRight: {
//         width: 30,
//         height: 30,
//         alignSelf: 'flex-end',
//         position: 'absolute',
//         backgroundColor: 'transparent',
//         borderRadius: 50,
//         borderTopColor: 'transparent',
//         borderTopWidth: 12.5,
//         borderLeftWidth: 6.5,
//         borderLeftColor: '#fff',
//         borderBottomWidth: 0,
//         borderBottomColor: 'transparent',
//         transform: [{ rotate: '-90deg' }],
//         right: -5,
//         top: -15,
//     },
//     talkBubbleAbsoluteLeft: {
//         width: 30,
//         height: 30,
//         position: 'absolute',
//         backgroundColor: 'transparent',
//         borderRadius: 50,
//         borderTopColor: 'transparent',
//         borderTopWidth: 12.5,
//         borderRightWidth: 6.5,
//         borderRightColor: '#fff',
//         borderBottomWidth: 0,
//         borderBottomColor: 'transparent',
//         transform: [{ rotate: '90deg' }],
//         left: -5,
//         top: -15,
//     },
//     statusText: {
//         color: Colors.themeColor,
//         fontSize: 12,
//     },
//     icon: {
//         ...CommonStyles.imageStyles(5),
//     },
//     timeFormat: {
//         marginHorizontal: '1.5%',
//         alignItems: 'center',
//         marginVertical: 15,
//         alignSelf: 'flex-end',
//         paddingBottom: 5,
//     },
//     textContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         paddingHorizontal: 10,
//         paddingVertical: 10,
//         minHeight: 40,
//         borderRadius: 20,
//         backgroundColor: '#fff',
//     },
//     scrollContent: {
//         flexGrow: 1,
//     },
//     keyboardShift: {
//         flex: 1,
//     },
//     rightBubbleContainer: {
//         alignItems: 'flex-end',
//         justifyContent: 'flex-end',
//         flexDirection: 'row'
//     },
//     leftBubbleContainer: {
//         alignItems: 'flex-start',
//         justifyContent: 'flex-start',
//         flexDirection: 'row'
//     },
//     isLoading: {
//         ...CommonStyles.imageStyles(6),
//         flex: 1,
//         justifyContent: 'center',
//     },
//     searchBar: {
//         borderWidth: 1,
//         borderColor: Colors.borderLightColor3,
//         borderRadius: hp('3%'),
//         width: wp('95%'),
//         height: hp('5%'),
//         paddingVertical: 0,
//       },
//       inputStyle: {
//         fontSize: 14,
//         // fontFamily: Fonts.PINGfANG,
//         color: Colors.BLACK1,
//         height: '100%',
//         margin: 0,
//         padding: 0
//       },
//       sorryMessageCont: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//       },
//       sorryMessage: {
//         fontSize: 15,
//         // fontFamily: fonts.SegoeUIRegular,
//       },


// })

// export default styles;

