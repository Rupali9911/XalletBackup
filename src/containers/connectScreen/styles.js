import { StyleSheet } from 'react-native';

import { colors } from '../../res';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../common/responsiveFunction';

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    header: {
        height: hp('6%'),
        width: '100%',
    },
    backIcon: {
        width: wp('10%'),
        height: "100%",
        paddingLeft: wp('3%'),
        justifyContent: 'center',
    },
    headerIcon: {
        height: wp('4%'),
        width: wp('4%')
    },
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777'
      },
      textBold: {
        fontWeight: '500',
        color: '#000'
      },
      buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)'
      },
      buttonTouchable: {
        padding: 16
      }
})

export default styles;