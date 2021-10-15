import { StyleSheet } from "react-native";

import { colors, fonts } from '../../res';
import { SIZE, heightPercentageToDP as hp, widthPercentageToDP as wp, responsiveFontSize as RF } from "../../common/responsiveFunction";

const styles = StyleSheet.create({
    header: {
        height: SIZE(50),
        backgroundColor: colors.white,
        flexDirection: 'row',
        width: "100%"
    },
    backIcon: {
        flex: 0.4,
        paddingLeft: wp('3%'),
        justifyContent: 'center',
    },
    headerIcon: {
        height: wp('4%'),
        width: wp('4%'),
        resizeMode: "contain"
    },
    headerTitle: {
        fontSize: RF(2),
        height: SIZE(30),
        textAlignVertical: "center",
        textAlign: "center",
        fontFamily: fonts.PINGfANG_SBOLD
    },
    headerChild: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    button: {
        backgroundColor: colors.BLUE2,
        borderWidth: 0,
        borderColor: colors.BLUE2,
        marginTop: hp("1.5%")
    },
    buttonLabel: {
        color: colors.white,
        fontWeight: "bold"
    },
    formCont: {
        width: wp("85%"),
        alignSelf: "center"
    },
    labelInputContainer: {
        marginTop: hp("1.5%")
    },
    placeholderStyle: {
        width: wp('85%'),
        fontSize: RF(1.6),
        alignSelf: "center"
    }
})

export default styles;