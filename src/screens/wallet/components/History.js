import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, FlatList, RefreshControl } from "react-native";
import { useNavigation } from '@react-navigation/native';
import NumberFormat from 'react-number-format';

import TextView from '../../../components/appText';
import ImagesSrc from '../../../constants/Images';
import CommonStyles from '../../../constants/styles';
import { wp, hp, RF } from '../../../constants/responsiveFunct';
import Fonts from '../../../constants/Fonts';
import Colors from '../../../constants/Colors';
import { translate } from '../../../walletUtils';
import { Button } from 'react-native-paper';
import { useSelector } from 'react-redux';
import moment from 'moment';

const ListItems = (props) => {
    const {item} = props;
    return (
        <TouchableOpacity disabled onPress={() => props.onPress && props.onPress(item)} style={styles.listCont} >
            <View style={styles.profileCont} >
                <Image style={styles.profileImage} source={item.direction == 'in'?ImagesSrc.received:ImagesSrc.sent} />
            </View>
            <View style={styles.centerCont} >
                <View style={styles.firstRow}>
                    <Text style={styles.tokenName} >{item.direction == 'in'? translate("wallet.common.received"):  translate("wallet.common.sent")}</Text>
                </View>
                <View style={styles.detailsContainer}>
                    {/* <Text style={styles.townTxt} numberOfLines={1}>{item.direction == 'in'?`${translate("common.from")}: ${item.from}`:`${translate("common.to")}: ${item.to}`}</Text> */}
                    <Text style={styles.townTxt} >{moment.unix(item.timeStamp).format("YYYY-MM-DD HH:mm:ss")}</Text>
                </View>
                
            </View>
            <View style={{ ...CommonStyles.center, alignItems: 'flex-end' }} >
                {/* <Text style={styles.townTxt} >{item.type}</Text> */}
                <NumberFormat
                    value={item.value}
                    displayType={'text'}
                    decimalScale={8}
                    thousandSeparator={true}
                    renderText={formattedValue => <Text style={[styles.priceTxt, {color: item.direction == 'in'? Colors.receiveColor : Colors.sendColor}]} >
                    {item.direction == 'in'?'+':'-'}{formattedValue}
                </Text>} // <--- Don't forget this!
                />
                {/* <Text style={[styles.priceTxt, {color: item.direction == 'in'? Colors.receiveColor : Colors.sendColor}]} >
                    {item.direction == 'in'?'+':'-'}{item.value}
                </Text> */}
            </View>
        </TouchableOpacity>
    )
}

const History = (props) => {

    const {ethTransactions, bnbTransactions, maticTransactions, tnftTransactions, talTransactions} = useSelector(state => state.WalletReducer);

    const [balance_Data, setBalanceData] = useState([]);
    const [isRefreshing, setRefreshing] = useState(false);

    const {coin} = props;

    useEffect(() => {
        // setBalanceData([]);
    }, []);

    const navigation = useNavigation();

    const onRefresh = () => {
        setRefreshing(true);
        props.onRefresh && props.onRefresh().then(()=>{
            setRefreshing(false);
        });
    }

    const getTransactions = () => {
        if(coin.type == "ETH"){
            return ethTransactions;
        } else if(coin.type == "BNB"){
            return bnbTransactions;
        } else if(coin.type == "Matic"){
            return maticTransactions;
        } else if(coin.type == "TNFT"){
            return tnftTransactions;
        } else if(coin.type == "TAL"){
            return talTransactions
        }
        return [];
    }

    return (
        <View style={[styles.scene]} >
            <FlatList
                data={getTransactions()}
                // contentContainerStyle={{flex: 1}}
                renderItem={({ item }) => {
                    return (
                        <ListItems item={item}/>
                    )
                }
                }
                keyExtractor={(item, index) => `_${index}`}
                // ItemSeparatorComponent={() => <Separator style={styles.separator} />}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                        tintColor={Colors.themeColor}
                    // colors={[Colors.primary]}
                    />
                }
                ListEmptyComponent={() => {
                    return (
                        <View style={styles.emptyView}>
                            <Image source={ImagesSrc.transaction} style={styles.emptyImage}/>
                            <TextView style={styles.noData} >{translate("wallet.common.transactionsHint")}</TextView>
                            <Button mode={'text'} uppercase={false} color={Colors.buttonTxtColor2}>{translate("wallet.common.buy")} {coin.type}</Button>
                        </View>
                    );
                }}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    scene: {
        flex: 1,
    },
    profileCont: {
        ...CommonStyles.circle("8")
    },
    profileImage: {
        ...CommonStyles.imageStyles(8),
        tintColor: Colors.borderColor
    },
    listCont: {
        paddingHorizontal: wp("4%"),
        paddingVertical: hp('1.8%'),
        flexDirection: "row",
        alignItems: 'center',
    },
    priceTxt: {
        fontSize: RF(2.3),
        fontFamily: Fonts.ARIAL,
        color: Colors.tokenLabel,
        fontWeight: "200"
    },
    townTxt: {
        fontSize: RF(1.7),
        fontFamily: Fonts.ARIAL,
        color: Colors.townTxt,
        marginVertical: hp("0.2%")
    },
    percentTxt: {
        fontSize: RF(1.4),
        fontFamily: Fonts.ARIAL,
        color: Colors.percentColor,
        marginVertical: hp("0.5%")
    },
    centerCont: {
        height: '100%',
        flex: 1,
        paddingHorizontal: wp("4%"),
        // justifyContent: "center",
    },
    tokenName: {
        fontFamily: Fonts.ARIAL,
        fontSize: RF(2.3),
        color: Colors.tokenLabel,
        marginRight: wp("3%"),
        // marginTop: hp('1%'),
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginTop: hp("0.7%")
    },
    emptyView: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: hp("5%")
    },
    emptyImage: {
        width: wp("25%"),
        height: wp("25%"),
        alignSelf: 'center',
        marginVertical: hp("4%")
    },
    firstRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        paddingTop: hp("1%")
    }
})

export default History;
