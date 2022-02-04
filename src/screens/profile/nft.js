import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import _, { toFinite } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
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
import { DetailModal, Loader } from '../../components';
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
} from '../../store/actions/myNFTaction';

const NFT = ({ route }) => {
    const isFocusedHistory = useIsFocused();

    const { id } = route?.params;
    const { MyNFTReducer } = useSelector(state => state);
    const { data, wallet } = useSelector(state => state.UserReducer);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [modalData, setModalData] = useState();
    const [isModalVisible, setModalVisible] = useState(false);

    const [toggle, setToggle] = useState('created');

    const [mainLoader, setMainLoader] = useState(false);
    const [stopMoreLoading, setStopMoreLoading] = useState(false);

    const [nftCreatedPage, setNftCreatedPage] = useState(1);
    const [nftCreatedList, setNftCreatedList] = useState([]);
    const [nftOwnedPage, setNftOwnedPage] = useState(1);
    const [nftOwnedList, setNftOwnedList] = useState([]);

    useEffect(() => {
        if (isFocusedHistory) {
            pressToggle(toggle);
        }
    }, [isFocusedHistory]);

    const renderFooter = () => {
        if (!MyNFTReducer.myNftListLoading) return null;
        return <ActivityIndicator size="small" color={colors.themeR} />;
    };

    const renderItem = ({ item }) => {
        let findIndex = MyNFTReducer.myList.findIndex(x => x.id === item.id);

        if (item.metaData) {
            const image = item?.metaData?.thumbnft || item?.thumbnailUrl;
            return (
                <NFTItem
                    item={item}
                    image={image}
                    onLongPress={() => {
                        setModalData(item);
                        setModalVisible(true);
                    }}
                    onPress={() => {
                        dispatch(changeScreenName('myNFT'));
                        navigation.navigate('DetailItem', { index: findIndex, owner: id });
                    }}
                />
            );
        }
    };

    const getNFTlist = useCallback(page => {
        dispatch(myNFTList(page, id));
    }, []);

    const pressToggle = s => {
        setToggle(s);
        dispatch(myNftListReset());
        dispatch(myPageChange(1));
        dispatch(myNftLoadStart());
        // setNftOwnedPage(1);
        if (s == 'created') {
            getNFTlist(1);
        } else {
            getOwnedNftList(1, true);
        }
    };

    const getOwnedNftList = (page, refresh) => {
        let url = `${BASE_URL}/xanalia/mydata`;
        let obj = {
            limit: 50,
            networkType: networkType,
            nftType: 'mycollection',
            page: page,
        };

        if (id?.length > 24) {
            obj.owner = id.toUpperCase();
        } else {
            obj.userId = id;
        }

        if (data.user) {
            obj.loggedIn = wallet.address || data.user._id;
        }

        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.token}`,
        };

        axios
            .post(url, obj, { headers: headers })
            .then(res => {
                setMainLoader(false);
                console.log(res, 'res owned success');

                if (res.data.success) {
                    if (res.data.data.length !== 0 && Array.isArray(res.data.data)) {
                        setStopMoreLoading(false);
                        if (refresh) {
                            setNftOwnedList([...res.data.data]);
                        } else {
                            setNftOwnedList([...nftOwnedList, ...res.data.data]);
                        }
                    } else {
                        setStopMoreLoading(true);
                    }
                } else {
                    alertWithSingleBtn(translate('wallet.common.alert'), res.data.data);
                }
            })
            .catch(e => {
                setMainLoader(false);
                console.log(e.response, 'collection created list error');
                alertWithSingleBtn(
                    translate('wallet.common.alert'),
                    translate('wallet.common.error.networkFailed'),
                );
            });
    };

    let showNftList = toggle === 'created' ? MyNFTReducer.myList : nftOwnedList;

    return (
        <View style={styles.trendCont}>
            <View style={[styles.saveBtnGroup, { justifyContent: 'center' }]}>
                <CardButton
                    onPress={() => pressToggle('created')}
                    border={toggle !== 'created' ? colors.BLUE6 : null}
                    label={translate('wallet.common.created')}
                    buttonCont={styles.leftToggle}
                />
                <CardButton
                    onPress={() => pressToggle('Owned')}
                    border={toggle !== 'Owned' ? colors.BLUE6 : null}
                    buttonCont={styles.rightToggle}
                    label={translate('wallet.common.owned')}
                />
            </View>

            {MyNFTReducer.myNftListLoading ? (
                <Loader />
            ) : showNftList.length !== 0 ? (
                <FlatList
                    data={showNftList}
                    horizontal={false}
                    numColumns={3}
                    initialNumToRender={15}
                    onRefresh={() => pressToggle(toggle)}
                    refreshing={MyNFTReducer.myNftListLoading}
                    renderItem={renderItem}
                    onEndReached={() => {
                        if (toggle == 'created') {
                            if (
                                !MyNFTReducer.myNftListLoading &&
                                MyNFTReducer.myList.length !== MyNFTReducer.myNftTotalCount
                            ) {
                                let num = MyNFTReducer.myListPage + 1;
                                getNFTlist(num);
                                dispatch(myPageChange(num));
                            }
                        } else {
                            let num = nftOwnedPage + 1;
                            setNftOwnedPage(num);
                            getOwnedNftList(num);
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
            )}

            {modalData && (
                <DetailModal
                    data={modalData}
                    isModalVisible={isModalVisible}
                    toggleModal={() => setModalVisible(false)}
                />
            )}
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

export default NFT;
