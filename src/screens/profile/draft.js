import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Loader } from '../../components';
import NFTItem from '../../components/NFTItem';
import { colors, fonts } from '../../res';
import { translate } from '../../walletUtils';

import { CardButton } from "../createNFTScreen/components";
import { BASE_URL } from '../../common/constants';
import { networkType } from '../../common/networkType';
import { alertWithSingleBtn } from '../../utils';
import axios from 'axios';

const Draft = ({ route }) => {
    const isFocusedHistory = useIsFocused();

    const { data } = useSelector(
        state => state.UserReducer
    );
    const navigation = useNavigation();

    const [toggle, setToggle] = useState("draft");

    const [mainLoader, setMainLoader] = useState(false);
    const [childLoader, setChildLoader] = useState(false);
    const [stopMoreLoading, setStopMoreLoading] = useState(false);

    const [collectCreatedPage, setCollectCreatedPage] = useState(1);
    const [collectionCreatedList, setCollectionCreatedList] = useState([]);
    const [collectDraftPage, setCollectDraftPage] = useState(1);
    const [collectionDraftList, setCollectionDraftList] = useState([]);

    useEffect(() => {
        pressToggle(toggle)
    }, []);
    // useEffect(() => {
    //     // if (isFocusedHistory) {
    //     //     pressToggle(toggle)
    //     // }
    // }, [isFocusedHistory]);

    const renderFooter = () => {
        if (!childLoader) return null;
        return <ActivityIndicator size="small" color={colors.themeR} />;
    };

    const renderItem = ({ item }) => {
        return (
            <NFTItem
                item={item}
                image={item.iconImage}
                onPress={() => navigation.navigate("Create", { name: "collection", data: item, status: toggle })}
                isMeCollection
            />
        );
    };

    const pressToggle = (s) => {
        setToggle(s);
        setMainLoader(true);
        setCollectCreatedPage(1);
        setCollectDraftPage(1);
        getDraftCollectionList(1, true)
    }

    const getDraftCollectionList = (page, refresh) => {

        let url = `${BASE_URL}/user/listing-draft-collection`;
        let obj = {
            limit: 50,
            page: page
        };

        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.token}`,
        };

        axios.post(url, obj, { headers: headers })
            .then(res => {
                setMainLoader(false);
                setChildLoader(false);
                console.log(res, "res collection draft success")

                if (res.data.success) {

                    if (Array.isArray(res.data.data)) {
                        setStopMoreLoading(false);
                        if (res.data.data.length !== 0) {
                            if (refresh) {
                                setCollectionDraftList([...res.data.data])
                            } else {
                                setCollectionDraftList([...collectionDraftList, ...res.data.data])
                            }
                        } else {
                            if(page == 1){
                                setCollectionDraftList([])
                            }
                            setStopMoreLoading(true);
                        }
                    } else {
                        setStopMoreLoading(true);
                    }

                } else {
                    alertWithSingleBtn(
                        translate("wallet.common.alert"),
                        res.data.data
                    );
                }

            })
            .catch(e => {
                setMainLoader(false);
                setChildLoader(false)
                console.log(e.response, "collection created list error");
                alertWithSingleBtn(
                    translate("wallet.common.alert"),
                    translate("wallet.common.error.networkFailed")
                );
            })
    }

    return (
        <View style={styles.trendCont}>
            {
                mainLoader ?
                    <Loader /> :
                    collectionDraftList.length !== 0 ?
                        <FlatList
                            data={collectionDraftList}
                            horizontal={false}
                            numColumns={3}
                            initialNumToRender={15}
                            onRefresh={() => pressToggle(toggle)}
                            refreshing={mainLoader}
                            renderItem={renderItem}
                            onEndReached={() => {
                                if (!stopMoreLoading) {
                                    setChildLoader(true);
                                    let num = collectDraftPage + 1;
                                    setCollectDraftPage(num)
                                    getDraftCollectionList(num)
                                }

                            }}
                            ListFooterComponent={renderFooter}
                            onEndReachedThreshold={0.4}
                            keyExtractor={(v, i) => 'item_' + i}
                        />
                        :
                        <View style={styles.sorryMessageCont}>
                            <Text style={styles.sorryMessage}>{translate("wallet.common.noCollection")}</Text>
                        </View>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    trendCont: {
        backgroundColor: 'white',
        flex: 1,
    },
    sorryMessageCont: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sorryMessage: {
        fontSize: 15,
        fontFamily: fonts.SegoeUIRegular,
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

export default Draft;
