import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Button } from 'react-native-paper';
import NumberFormat from 'react-number-format';
import { useSelector } from 'react-redux';
import TextView from '../../../components/appText';
import Colors from '../../../constants/Colors';
import Fonts from '../../../constants/Fonts';
import ImagesSrc from '../../../constants/Images';
import { hp, RF, wp } from '../../../constants/responsiveFunct';
import CommonStyles from '../../../constants/styles';

import { environment, polRpc, translate } from '../../../walletUtils';
import { chain } from "lodash/seq";
import { networkType } from "../../../common/networkType";

var coinType = '';

const ListItems = props => {
    const { item, type } = props;

    return (
        <TouchableOpacity
            onPress={() => props.onPress && props.onPress(item)}
            style={styles.listCont}>
            <View style={styles.profileCont}>
                <Image
                    style={styles.profileImage}
                    source={item.direction == 'in' ? ImagesSrc.received : ImagesSrc.sent}
                />
            </View>
            <View style={styles.centerCont}>
                <View style={styles.firstRow}>
                    <Text style={styles.tokenName}>
                        {item.direction == 'in'
                            ? translate('wallet.common.received')
                            : translate('wallet.common.sent')}
                    </Text>
                </View>
                <View style={styles.detailsContainer}>
                    {/* <Text style={styles.townTxt} numberOfLines={1}>{item.direction == 'in'?`${translate("common.from")}: ${item.from}`:`${translate("common.to")}: ${item.to}`}</Text> */}
                    <Text style={styles.townTxt}>
                        {moment.unix(item.timeStamp).format('YYYY-MM-DD HH:mm:ss')}
                    </Text>
                </View>
            </View>
            <View style={{ flex: 1, ...CommonStyles.center, alignItems: 'flex-end' }}>
                {/* <Text style={styles.townTxt} >{item.type}</Text> */}
                <NumberFormat
                    value={coinType.coin.type == "USDC" || coinType.coin.type == "USDT" ? item.value * 1e9 : item.value}
                    displayType={'text'}
                    decimalScale={8}
                    thousandSeparator={true}
                    renderText={formattedValue => (
                        <Text
                            numberOfLines={1}
                            style={[
                                styles.priceTxt,
                                {
                                    color:
                                        item.direction == 'in'
                                            ? Colors.receiveColor
                                            : Colors.sendColor,
                                },
                            ]}>
                            {item.direction == 'in' ? '+' : '-'}
                            {formattedValue}
                        </Text>
                    )} // <--- Don't forget this!
                />
                {/* <Text style={[styles.priceTxt, {color: item.direction == 'in'? Colors.receiveColor : Colors.sendColor}]} >
                    {item.direction == 'in'?'+':'-'}{item.value}
                </Text> */}
            </View>
        </TouchableOpacity>
    );
};

const History = props => {
    coinType = props;
    const {
        ethTransactions,
        bnbTransactions,
        busdTransactions,
        maticTransactions,
        tnftTransactions,
        talTransactions,
        usdtTransactions,
        usdcTransactions,
        wethTransactions,
        aliaTransactions,
        xetaTransactions
    } = useSelector(state => state.WalletReducer);
    const [balance_Data, setBalanceData] = useState([]);
    const [isRefreshing, setRefreshing] = useState(false);
    const { coin } = props;

    useEffect(() => {
    }, []);
    const navigation = useNavigation();
    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            props.onRefresh &&
                props.onRefresh().then(() => {
                    setRefreshing(false);
                });
        }, 2000);
    };

    const getTransactions = () => {
        if (coin.type === 'ETH') {
            return ethTransactions;
        } else if (coin.type === 'BNB') {
            return bnbTransactions;
        } else if (coin.type === 'BUSD') {
            return busdTransactions;
        } else if (coin.type === 'Matic') {
            return maticTransactions;
        } else if (coin.type === 'TNFT') {
            return tnftTransactions;
        } else if (coin.type === 'USDC') {
            return usdcTransactions;
        } else if (coin.type === 'USDT') {
            return usdtTransactions;
        } else if (coin.type === 'TAL') {
            return talTransactions;
        } else if (coin.type === 'WETH') {
            return wethTransactions;
        } else if (coin.type === 'ALIA') {
            return aliaTransactions;
        } else if (coin.type === 'XETA') {
            return xetaTransactions;
        }
        return [];
    };
    return (
        <View style={[styles.scene]}>
            <FlatList
                data={getTransactions()}
                // contentContainerStyle={{flex: 1,backgroundColor:'white'}}
                renderItem={({ item }) => {
                    return (

                        <ListItems
                            item={item}
                            onPress={_item =>
                                navigation.navigate('transactionsDetail', {
                                    data: _item,
                                    coin: coin,
                                })
                            }
                        />
                    );
                }}
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
                            <Image source={ImagesSrc.transaction} style={styles.emptyImage} />
                            <TextView style={styles.noData}>
                                {translate('wallet.common.transactionsHint')}
                            </TextView>
                            {/* <Button
                                mode={'text'}
                                uppercase={false}
                                color={Colors.buttonTxtColor2}>
                                {translate('wallet.common.buy')} {coin.type}
                            </Button> */}
                        </View>
                    );
                }}
            />
        </View>
    );


};

const styles = StyleSheet.create({
    scene: {
        flex: 1,
    },
    profileCont: {
        ...CommonStyles.circle('8'),
    },
    profileImage: {
        ...CommonStyles.imageStyles(8),
        tintColor: Colors.borderColor,
    },
    listCont: {
        paddingHorizontal: wp('4%'),
        paddingVertical: hp('1.8%'),
        flexDirection: 'row',
        alignItems: 'center',
    },
    priceTxt: {
        fontSize: RF(2.3),
        fontFamily: Fonts.ARIAL,
        color: Colors.tokenLabel,
        fontWeight: '200',
    },
    townTxt: {
        fontSize: RF(1.7),
        fontFamily: Fonts.ARIAL,
        color: Colors.townTxt,
        // marginVertical: hp('0.2%'),
    },
    percentTxt: {
        fontSize: RF(1.4),
        fontFamily: Fonts.ARIAL,
        color: Colors.percentColor,
        marginVertical: hp('0.5%'),
    },
    centerCont: {
        height: '100%',
        // flex: 1,
        paddingHorizontal: wp('4%')

        // justifyContent: "center",
    },
    tokenName: {
        fontFamily: Fonts.ARIAL,
        fontSize: RF(2.3),
        color: Colors.tokenLabel,
        marginRight: wp('3%'),
        // marginTop: hp('1%'),
    },
    separator: {
        backgroundColor: Colors.separatorThird,
        width: wp('90%'),
    },
    timeIcon: {
        ...CommonStyles.imageStyles(20),
    },
    timeCont: {
        ...CommonStyles.center,
        paddingHorizontal: wp('5%'),
        paddingVertical: hp('3%'),
    },
    timerTitle: {
        fontFamily: Fonts.ARIAL,
        fontSize: RF(1.8),
        color: Colors.timerTitle,
        textAlign: 'center',
        marginTop: hp('1%'),
    },
    timerDes: {
        fontFamily: Fonts.ARIAL,
        fontSize: RF(1.6),
        color: Colors.timerTitle,
        textAlign: 'center',
        marginTop: hp('1%'),
    },
    timerBtn: {
        borderColor: Colors.timerButtonBorder,
        marginTop: hp('3%'),
        backgroundColor: Colors.white,
    },
    timerLabel: {
        fontSize: RF(1.8),
        color: Colors.timerButtonLabel,
    },
    noData: {
        ...CommonStyles.text(Fonts.ARIAL, Colors.tabLabel, RF(2)),
        textAlign: 'center',
        marginVertical: hp('2%'),
    },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginTop: hp("0.7%")
    },
    emptyView: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: hp('5%'),
    },
    emptyImage: {
        width: wp('25%'),
        height: wp('25%'),
        alignSelf: 'center',
        marginVertical: hp('4%'),
    },
    firstRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        // paddingTop: hp('1%'),
    },
});

export default History;
