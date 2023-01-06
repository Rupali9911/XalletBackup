import { StyleSheet } from 'react-native';
import { responsiveFontSize as RF, SIZE, widthPercentageToDP as wp, } from '../../common/responsiveFunction';
import Colors from '../../constants/Colors';

const styles = StyleSheet.create({
    modalImage: {
        position: 'relative',
        width: wp('100%'),
        height: wp('100%'),
        justifyContent: 'center',
        alignItems: 'center',
    },

    activity: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },

    videoError: {
        color: Colors.WHITE1,
        fontSize: SIZE(20),
        fontWeight: 'bold',
    },

    video: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },

    videoFullScreen: {
        position: 'absolute',
        top: wp('6.2%'),
        left: wp('6%'),
    },

});

export default styles;

