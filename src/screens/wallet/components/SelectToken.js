import React, { useState, useEffect } from 'react';
import { Modal, View, StyleSheet, Image, TextInput, TouchableOpacity, FlatList, Platform, SafeAreaView } from 'react-native';
import Colors from '../../../constants/Colors';
import { hp, wp, RF } from '../../../constants/responsiveFunct';
import ImagesSrc from '../../../constants/Images';
import CommonStyles from '../../../constants/styles';
import TextView from '../../../components/appText';
import Fonts from '../../../constants/Fonts';
import { tokens, translate } from '../../../walletUtils';
import Separator from '../../../components/separator';

const ListItems = (props) => {
    const { item } = props;
    return (
        <TouchableOpacity onPress={() => props.onPress && props.onPress(item)} style={styles.listCont} >
            <View style={styles.profileCont} >
                <Image style={styles.profileImage} source={item.icon} />
            </View>
            <View style={styles.centerCont} >
                <TextView style={styles.tokenName} >{item.tokenName}</TextView>
                {/* <View style={styles.detailsContainer}>
                    <TextView style={styles.townTxt} >{item.amount}</TextView>
                    <TextView style={styles.percentTxt} >{item.percent}</TextView>
                </View> */}

            </View>
            <View style={{ ...CommonStyles.center, alignItems: 'flex-end' }} >
                <TextView style={styles.priceTxt}>
                    {item.tokenValue} {item.type}
                </TextView>
            </View>
        </TouchableOpacity>
    )
}

const SelectToken = (props) => {
    const { visible, onRequestClose, network, isSend } = props;

    const [balance_Data, setBalanceData] = useState([]);
    const [searchTxt, setSearchTxt] = useState('');

    useEffect(() => {
        setBalanceData(tokens);
    }, []);

    useEffect(() => {
        if (props.values) {
            let array = tokens;
            array[0].tokenValue = `${props.values.BNB}`;
            array[1].tokenValue = `${props.values.ETH}`;
            array[2].tokenValue = `${props.values.Matic}`;
            // array[3].tokenValue = `${props.values.BUSD}`;
            // array[4].tokenValue = `${props.values.USDC}`;
            // array[5].tokenValue = `${props.values.USDT}`;
            // array[6].tokenValue = `${props.values.ALIA}`;
            setBalanceData(array);
        }
    }, [props.values]);

    return (
        <Modal
            visible={visible}
            transparent
            animationType={'slide'}
            onRequestClose={onRequestClose}>
            <SafeAreaView style={styles.container}>
                <View style={styles.contentContainer}>
                    <View style={styles.actionView}>
                        <TouchableOpacity hitSlop={{ top: 15, left: 15, right: 15, bottom: 15 }} onPress={onRequestClose}>
                            <Image source={ImagesSrc.backArrow} style={CommonStyles.whiteBackIcon} />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.inputStyle}
                            placeholder={`${translate("common.search")} - ${isSend ? translate('wallet.common.send') : translate('wallet.common.receive')}`}
                            placeholderTextColor={Colors.separatorLight}
                            value={searchTxt}
                            onChangeText={setSearchTxt}
                        />
                    </View>

                    <FlatList
                        contentContainerStyle={{ paddingVertical: hp("1.8%") }}
                        data={balance_Data.filter((_) => {
                            if (searchTxt !== '') {
                                console.log(searchTxt.toLowerCase(), _.tokenName.toLowerCase());
                                return (_.network == network.name && _.tokenName.includes(searchTxt))
                            } else {
                                return _.network == network.name
                            }
                        })}
                        renderItem={({ item }) => {
                            return (
                                <ListItems item={item} onPress={props.onTokenPress} />
                            )
                        }
                        }
                        keyExtractor={(item, index) => `_${index}`}
                        ItemSeparatorComponent={() => <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
                            <Separator style={styles.separator} />
                        </View>}
                        ListEmptyComponent={() => {
                            return (
                                <TextView style={styles.noData} >{translate("wallet.common.noData")}</TextView>
                            );
                        }} />

                </View>
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: Colors.transparentModal
    },
    contentContainer: {
        flex: 1,
        backgroundColor: Colors.white,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    actionView: {
        flexDirection: 'row',
        backgroundColor: Colors.themeColor,
        padding: wp("5%"),
        paddingVertical: Platform.OS == 'android' ? wp("3%") : wp("5%"),
        alignItems: 'center',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    inputStyle: {
        fontSize: RF(2.2),
        color: Colors.white,
        paddingHorizontal: wp("5%")
    },
    profileCont: {
        ...CommonStyles.circle("13")
    },
    profileImage: {
        ...CommonStyles.imageStyles(13),
    },
    listCont: {
        paddingHorizontal: wp("4%"),
        paddingVertical: hp('1%'),
        flexDirection: "row",
        alignItems: 'center',
    },
    priceTxt: {
        fontSize: RF(2.3),
        color: Colors.tokenLabel,
        fontWeight: "200"
    },
    townTxt: {
        fontSize: RF(1.4),
        color: Colors.townTxt,
        marginVertical: hp("0.5%")
    },
    percentTxt: {
        fontSize: RF(1.4),
        color: Colors.percentColor,
        marginVertical: hp("0.5%")
    },
    centerCont: {
        height: '100%',
        flex: 1,
        paddingHorizontal: wp("4%"),
        justifyContent: "center",
    },
    tokenName: {
        fontSize: RF(2.3),
        color: Colors.tokenLabel,
    },
    timerTitle: {
        fontSize: RF(1.8),
        color: Colors.timerTitle,
        textAlign: "center",
        marginTop: hp('1%')
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
    separator: {
        backgroundColor: Colors.separatorThird,
        width: wp('90%'),
    },
});

export default SelectToken;