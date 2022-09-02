import { Platform, StyleSheet } from 'react-native';
import { hp, wp } from '../../constants/responsiveFunct';
import Colors from '../../constants/Colors';
import CommonStyles from '../../constants/styles';

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.themeColor
    },
    chatContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#efefef',
    },
    inputContainer: {
        paddingHorizontal: hp(0.1),
        width: '100%',
        height: Platform.OS === 'ios' ? hp(10) : hp(8),
        alignItems: 'center',
        backgroundColor:  Colors.themeColor,
        bottom: 0,
        //  position: 'absolute',
        // position: 'relative',
        // display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    input: {
        fontSize: 17,
        marginHorizontal: 3,
        paddingHorizontal: 15,
        borderColor: '#fff',
        borderWidth: 2,
        width: '80%',
        height: Platform.OS === 'ios' ? 50 : 40,
        borderRadius: 300 / 2,
        backgroundColor: '#fff',
    },
    sendBtn: {
        width: Platform.OS === 'ios' ? 50 : 40,
        height: Platform.OS === 'ios' ? 50 : 40,
        borderRadius: 60 / 2,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 3
    },
    sendText: {
        fontSize: 30,
        color: 'black',
    },
    talkBubble: {
        justifyContent: 'flex-end',
        marginVertical: 15,
        maxWidth: '80%',

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
        color: Colors.themeColor,
        fontSize: 12,
    },
    icon: {
        ...CommonStyles.imageStyles(5),
    },
    timeFormat: {
        marginHorizontal: '1.5%',
        alignItems: 'center',
        marginVertical: 15,
        alignSelf: 'flex-end',
        paddingBottom: 5,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        minHeight: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
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
        flexDirection: 'row'
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

})

export default styles;

