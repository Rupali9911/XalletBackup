import styled from 'styled-components';
import { StyleSheet } from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from '../../common/responsiveFunction';
import {
    COLORS,
    SIZE,
    FONT,
    FONTS
} from 'src/constants';
import { colors, fonts } from '../../res';

const MainContainer = styled.ScrollView`
    flex: 1;
    background-color: ${COLORS.WHITE1};
`;

const MainContent = styled.View`
    padding-horizontal: ${SIZE(24)}px;
`;

const UserText = styled.Text`
    font-size: ${FONT(12)}px;
    color: ${COLORS.GREY3};
    font-weight: 400;
    text-align: center;
`;

const TimeLeftText = styled.Text`
    font-size: ${FONT(20)}px;
    color: ${COLORS.BLACK5};
    font-weight: 400;
    text-align: center;
    line-height: ${SIZE(23.44)}px;
`;

const UserCircleView = styled.View`
    width: ${SIZE(67)}px;
    height: ${SIZE(67)}px;
    background-color: ${COLORS.GREY1};
    border-radius: ${SIZE(67)}px;
`;

const PriceLabel = styled.Text`
    font-size: ${FONT(10)}px;
    color: #BBBBBB;
    font-weight: 400;
`;

const PriceTextInput = styled.TextInput`
    font-size: ${FONT(35)}px;
    padding-vertical: ${SIZE(7)}px;
    padding-right: ${SIZE(14)}px;
    text-align: right;
    flex: 1;
    font-family: ${FONTS.ARIAL_BOLD};
    color: ${COLORS.BLUE2};
`;

const DescriptionText = styled.Text`
    font-size: ${FONT(14)}px;
    color: #696969;
    font-weight: 400;
    text-align: right;
`;

const GroupButtonView = styled.View`
    width: 100%;
    height: ${SIZE(39)}px;
    flex-direction: row;
    border-radius: ${SIZE(3.5)}px;
    overflow: hidden;
`;

const GrouponButton = styled.TouchableOpacity`
    flex: 1;
    align-Items: center;
    justify-content: center;
    background-color: ${props => props.color || COLORS.BLUE2};
`;

const GroupText = styled.Text`
    font-size: ${FONT(12)}px;
    color: ${COLORS.WHITE1};
    font-weight: 700;
`;

const styles = StyleSheet.create({
    videoContainer: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    playBtnCont: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    playBtnChild: {
        width: SIZE(100),
        height: SIZE(100),
        backgroundColor: '#00000030',
        borderRadius: SIZE(100),
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalImage: {
        width: wp('100%'),
        height: wp('80%'),
        resizeMode: 'cover',
    },
    threeDot: {
        fontSize: SIZE(13),
        fontFamily: fonts.PINGfANG,
        color: '#909090',
    },
    readLessWrap: {
        marginBottom: -3
    },
    readMore: {
        fontSize: SIZE(13),
        color: colors.BLUE2,
        fontFamily: fonts.PINGfANG,
    },
    readMoreWrap: {
        flexDirection: 'row',
        backgroundColor: 'white'
    },
    description: {
        fontSize: SIZE(13),
        fontFamily: fonts.PINGfANG,
        color: '#909090',
        paddingTop: 5,
        paddingBottom: 5,
      },
})

export {
    styles,
    MainContainer,
    MainContent,
    UserText,
    TimeLeftText,
    UserCircleView,
    PriceLabel,
    PriceTextInput,
    DescriptionText,
    GroupButtonView,
    GrouponButton,
    GroupText,
};