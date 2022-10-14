import { Platform, StyleSheet } from 'react-native';
import { hp, RF, wp } from '../../constants/responsiveFunct';
import Colors from '../../constants/Colors';
import CommonStyles from '../../constants/styles';
import { SIZE } from '../../common/responsiveFunction';

const styles = StyleSheet.create({

    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    chatContainer: {
        flex: 2,
        width: '100%',
        backgroundColor: '#fff',
    },
    inputContainer: {
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: Platform.OS === 'ios' ? 0 : 5
    },
    input: {
        paddingHorizontal: 15,
        height: Platform.OS === 'ios' ? hp(5) : hp(5),
        borderColor: '#ced4da',
        borderWidth: 2,
        width: '80%',
        borderRightColor: '#3c7bde',
        borderRightWidth: 0,
    },
    sendBtn: {
        paddingHorizontal: 15,
        height: Platform.OS === 'ios' ? hp(5) : hp(5),
        backgroundColor: '#3c7bde',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#3c7bde',
        borderWidth: 2,
        borderBottomRightRadius: 3,
        borderTopRightRadius: 3
    },
    sendText: {
        fontSize: 30,
        color: 'black',
    },
    talkBubble: {
        justifyContent: 'flex-end',
        maxWidth: '80%',
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
        justifyContent: 'space-between',
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
        borderColor: '#e0e1e3',
        width: wp('95%'),
        height: hp('5%'),
        marginHorizontal: 10,
        paddingVertical: 10,
        flexDirection: 'row',
        shadowColor: '#fff'
    },
    searchInputStyle: {
        fontSize: 14,
        color: Colors.BLACK1,
        height: '100%',
        margin: 0,
        padding: 0
    },
    sorryMessageCont: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
    sorryMessage: {
        fontSize: 15,
        fontWeight: '500'
    },
    backIcon: {
        width: SIZE(16),
        height: SIZE(16),
        resizeMode: 'contain',
    },
    backButtonWrap: {
        left: SIZE(10),
        paddingVertical: SIZE(12),
        backgroundColor: 'white',
        width: SIZE(26),
        height: SIZE(26),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: SIZE(13),
    },
    separator: {
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
    cImageContainer: {
        height: 40,
        width: 40,
        borderRadius: 40 / 2,
    },
    headerNftName: {
        color: '#46446e',
        fontWeight: '700',
    },
    typingMessage: {
        color: '#888',
        fontWeight: 'bold',
        fontStyle: 'italic',
        fontSize: 11,
        paddingTop: 5
    },
    sendBtnTxt: {
        color: '#fff',
        fontWeight: 'bold'
    },
    nftName: {
        color: '#fff', fontWeight: '700'
    },
    bannerImage: {
        width: '100%', height: '100%', resizeMode: 'contain'
    },
    rcvReplyContainer: {
        padding: 10,
        backgroundColor: '#000000a1',
        width: '100%',
        bottom: 0,
        position: 'absolute',
        zIndex: 2,
    },
    nftItemContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        paddingVertical: 5
    },
    nftTextShow: {
        paddingVertical: 10,
        paddingStart: 10,
        marginLeft: 10,
        color: '#484848',
        fontWeight: '700'
    },
    centerViewStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
     // talkBubbleAbsoluteRight: {
    //     width: 30,
    //     height: 30,
    //     alignSelf: 'flex-end',
    //     position: 'absolute',
    //     backgroundColor: 'transparent',
    //     borderRadius: 50,
    //     borderTopColor: 'transparent',
    //     borderTopWidth: 12.5,
    //     borderLeftWidth: 6.5,
    //     borderLeftColor: '#fff',
    //     borderBottomWidth: 0,
    //     borderBottomColor: 'transparent',
    //     transform: [{ rotate: '-90deg' }],
    //     right: -5,
    //     top: -15,
    // },
    // talkBubbleAbsoluteLeft: {
    //     width: 30,
    //     height: 30,
    //     position: 'absolute',
    //     backgroundColor: 'transparent',
    //     borderRadius: 50,
    //     borderTopColor: 'transparent',
    //     borderTopWidth: 12.5,
    //     borderRightWidth: 6.5,
    //     borderRightColor: '#fff',
    //     borderBottomWidth: 0,
    //     borderBottomColor: 'transparent',
    //     transform: [{ rotate: '90deg' }],
    //     left: -5,
    //     top: -15,
    // },
})

export default styles;
