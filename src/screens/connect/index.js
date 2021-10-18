import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image
} from 'react-native';
import AppBackground from '../../components/appBackground';
import TextView from '../../components/appText';
import AppHeader from '../../components/appHeader';
import { RF, hp, wp } from '../../constants/responsiveFunct';
import Colors from '../../constants/Colors';
import CommonStyles from '../../constants/styles';
import AppButton from '../../components/appButton';
import Fonts from '../../constants/Fonts';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ImagesSrc from '../../constants/Images';
import { translate } from '../../walletUtils';

const listData = [
    {
        text: "App A",
        icon: ImagesSrc.group1
    },
    {
        text: "App B",
        icon: ImagesSrc.group3
    },
    {
        text: "App C",
        icon: ImagesSrc.group2
    }
];

const ListItems = (props) => {
    const {item} = props;
    return (
        <TouchableOpacity onPress={()=>props.onPress && props.onPress(item)} style={styles.listCont} >
            <View style={styles.profileCont} >
                <Image style={styles.profileImage} source={item.icon} />
            </View>
            <View style={styles.centerCont} >
                <Text style={styles.tokenName} >{item.text}</Text>
            </View>
            <View style={{ ...CommonStyles.center }} >
                <Image style={styles.actionIcon} source={ImagesSrc.deleteIcon} />
            </View>
        </TouchableOpacity>
    )
}

const Connect = ({route, navigation}) => {
    return (
        <AppBackground>
            <AppHeader 
                title={translate("wallet.common.connect")}
                titleStyle={styles.screenTitle}/>
            <View style={styles.container}>
                <TextView style={styles.heading}>{translate("wallet.common.connectInfo")}</TextView>
                
                <View style={styles.list}>
                    <FlatList 
                        data={listData}
                        renderItem={({item, index})=>{
                            return <ListItems item={item}/>
                        }}
                        keyExtractor={(v, i) => "item_" + i}
                        />
                </View>

                <AppButton label={translate("wallet.common.newConnection")} containerStyle={CommonStyles.button} labelStyle={[CommonStyles.buttonLabel]}
                    onPress={() => {
                        navigation.navigate("scanToConnect");
                    }} />
            </View>
        </AppBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: wp("5%"),
        paddingVertical: hp("2%"),
        paddingBottom: hp("4%")
    },
    screenTitle: {
        fontWeight: 'normal'
    },
    heading: {
        maxWidth: "80%",
        alignSelf: 'center',
        textAlign: 'center',
        marginVertical: hp("1.5%"),
        fontSize: RF(2),
        color: Colors.headingColor
    },
    list: {
        flex: 1,
        marginTop: hp("6%")
    },
    profileCont: {
        ...CommonStyles.circle("13")
    },
    profileImage: {
        ...CommonStyles.imageStyles(13),
    },
    listCont: {
        // paddingHorizontal: wp("4%"),
        paddingVertical: hp('1.8%'),
        flexDirection: "row",
        alignItems: 'center',
    },
    priceTxt: {
        fontSize: RF(2.4),
        fontFamily: Fonts.ARIAL,
        color: Colors.black
    },
    townTxt: {
        fontSize: RF(1.4),
        fontFamily: Fonts.ARIAL,
        color: Colors.townTxt,
        marginVertical: hp("0.5%")
    },
    percentTxt: {
        fontSize: RF(1.4),
        fontFamily: Fonts.ARIAL,
        color: Colors.percentColor,
        marginVertical: hp("0.5%")
    },
    centerCont: {
        flex: 1,
        paddingHorizontal: wp("4.1%"),
        // justifyContent: "center",
    },
    tokenName: {
        fontFamily: Fonts.ARIAL,
        fontSize: RF(2.3),
        color: Colors.townName,
    },
    separator: {
        backgroundColor: Colors.separatorThird,
        width: wp('90%'),
    },
    timeIcon: {
        ...CommonStyles.imageStyles(20)
    },
    timeCont: {
        ...CommonStyles.center,
        paddingHorizontal: wp('5%'),
        paddingVertical: hp('3%')
    },
    timerTitle: {
        fontFamily: Fonts.ARIAL,
        fontSize: RF(1.8),
        color: Colors.timerTitle,
        textAlign: "center",
        marginTop: hp('1%')
    },
    timerDes: {
        fontFamily: Fonts.ARIAL,
        fontSize: RF(1.6),
        color: Colors.timerTitle,
        textAlign: "center",
        marginTop: hp('1%')
    },
    timerBtn: {
        borderColor: Colors.timerButtonBorder,
        marginTop: hp('3%'),
        backgroundColor: Colors.white
    },
    timerLabel: {
        fontSize: RF(1.8),
        color: Colors.timerButtonLabel,
    },
    noData: {
        ...CommonStyles.text(Fonts.ARIAL, Colors.tabLabel, RF(2)),
        textAlign: "center",
        marginVertical: hp('2%')
    },
    detailsContainer: {
        width: "60%",
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    actionIcon: {
        ...CommonStyles.imageStyles(6)
    },
    button: {
        backgroundColor: Colors.buttonBackground,
        borderRadius: 10
    }
});

export default Connect;