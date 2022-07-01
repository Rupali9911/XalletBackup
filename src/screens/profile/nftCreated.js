import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import _, { toFinite } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Linking,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
    responsiveFontSize as RF,
    widthPercentageToDP as wp,
} from '../../common/responsiveFunction';
import { Loader } from '../../components';
import NFTItem from '../../components/NFTItem';
import { colors, fonts } from '../../res';
import { changeScreenName } from '../../store/actions/authAction';
import { translate } from '../../walletUtils';

import { CardButton } from '../createNFTScreen/components';
import { BASE_URL } from '../../common/constants';
import { networkType } from '../../common/networkType';
import { alertWithSingleBtn } from '../../utils';
import axios from 'axios';
import {
    myNftListReset,
    myNFTList,
    myNftLoadStart,
    myPageChange,
    myNftLoadFail,
} from '../../store/actions/myNFTaction';

const NFTCreated = ({ route }) => {
    const isFocusedHistory = useIsFocused();

    const { id } = route?.params;
    const { MyNFTReducer } = useSelector(state => state);
    const { data, wallet } = useSelector(state => state.UserReducer);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [isFirstRender, setIsFirstRender] = useState(true);

    useEffect(() => {
        if (isFocusedHistory) {
            if (MyNFTReducer?.myList?.length === 0) {
                pressToggle()
            } else {
                if (id && id.toLowerCase() === MyNFTReducer.nftUserAdd.toLowerCase()) {
                    dispatch(myNftLoadFail())
                } else {
                    dispatch(myNftListReset());
                    pressToggle()
                }
            }
            setIsFirstRender(false)
        }

    }, [isFocusedHistory]);

    const renderFooter = () => {
        if (!MyNFTReducer.myNftListLoading) return null;
        return <ActivityIndicator size="small" color={colors.themeR} />;
    };

    const renderItem = ({ item }) => {
        let findIndex = MyNFTReducer.myList.findIndex(x => x._id === item._id);

        if (item && item.hasOwnProperty("metaData") && item.metaData) {
            const image = item?.metaData?.thumbnft || item?.thumbnailUrl;
            return (
                <NFTItem
                screenName="myNFT"
                item={item}
                    image={image}
                    // onLongPress={() => {
                    //     setModalData(item);
                    //     setModalVisible(true);
                    // }}
                    onPress={() => {
                        // dispatch(changeScreenName('myNFT'));
                        navigation.navigate('DetailItem', {id: id, index: findIndex, sName: "myNFT" });
                    }}
                />
            );
        }
    };

    const memoizedValue = useMemo(() => renderItem, [MyNFTReducer.myList]);

    const getNFTlist = useCallback(page => {
        console.log('getNFTlist, id', id)
        dispatch(myNFTList(page, id));
    }, []);

    const pressToggle = () => {
        dispatch(myNftListReset());
        dispatch(myPageChange(1));
        getNFTlist(1);
    };

    console.log("🚀 ~ file: nftCreated.js ~ line 118 ~ NFTCreated ~ MyNFTReducer?.myList", MyNFTReducer?.myList)

    return (
        <View style={styles.trendCont}>
            {/* {console.log("🚀 ~ file: nftCreated.js ~ line 135 ~ NFTCreated ~ MyNFTReducer", MyNFTReducer)} */}
            {
                isFirstRender ? isFirstRender : MyNFTReducer.myListPage === 1 && MyNFTReducer.myNftListLoading ? (
                    <Loader />
                ) : MyNFTReducer.myList?.length !== 0 ? (
                    <FlatList
                        data={MyNFTReducer?.myList}
                        horizontal={false}
                        numColumns={2}
                        initialNumToRender={15}
                        onRefresh={pressToggle}
                        refreshing={MyNFTReducer.myListPage === 1 &&
                            MyNFTReducer.myNftListLoading}
                        renderItem={memoizedValue}
                        onEndReached={() => {
                            if (
                                !MyNFTReducer.myNftListLoading &&
                                MyNFTReducer.myList.length !== MyNFTReducer.myNftTotalCount
                            ) {
                                let num = MyNFTReducer.myListPage + 1;
                                getNFTlist(num);
                                dispatch(myPageChange(num));
                            }
                        }}
                        ListFooterComponent={renderFooter}
                        onEndReachedThreshold={0.4}
                        keyExtractor={(v, i) => 'item_' + i}
                    />
                ) : (
                    <View style={styles.sorryMessageCont}>
                        <Text style={styles.sorryMessage}>{translate('common.noNFT')}</Text>
                    </View>
                )
            }
            {/*{modalData && (*/}
            {/*<DetailModal*/}
            {/*data={modalData}*/}
            {/*isModalVisible={isModalVisible}*/}
            {/*toggleModal={() => setModalVisible(false)}*/}
            {/*/>*/}
            {/*)}*/}
        </View>
    );
};

const styles = StyleSheet.create({
    sorryMessageCont: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sorryMessage: {
        fontSize: 15,
        fontFamily: fonts.SegoeUIRegular,
    },
    trendCont: {
        backgroundColor: 'white',
        flex: 1,
    },
    leftToggle: {
        width: '30%',
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
    },
    rightToggle: {
        width: '30%',
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
    },
    saveBtnGroup: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
});

export default NFTCreated;
