import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from '../../components';
import NFTItem from '../../components/NFTItem';
import { colors, fonts } from '../../res';
import { changeScreenName } from '../../store/actions/authAction';
import { translate } from '../../walletUtils';
import { myCollectionList, myCollectionLoadFail, myCollectionPageChange, myCollectionListReset } from '../../store/actions/myCollection';

const NFTOwned = ({ route, navigation }) => {
    const isFocusedHistory = useIsFocused();

    const { id } = route?.params;
    const { MyCollectionReducer } = useSelector(state => state);
    const dispatch = useDispatch();
    const [isFirstRender, setIsFirstRender] = useState(true);

    useEffect(() => {
        if (isFocusedHistory) {
            if (MyCollectionReducer?.myCollection?.length === 0) {
                pressToggle()
            } else {
                if (id && id.toLowerCase() === MyCollectionReducer.collectionUserAdd.toLowerCase()) {
                    dispatch(myCollectionLoadFail())
                } else {
                    dispatch(myCollectionListReset());
                    pressToggle()
                }
            }
            setIsFirstRender(false)
        }
    }, [isFocusedHistory]);

    const renderFooter = () => {
        if (!MyCollectionReducer.myCollectionListLoading) return null;
        return (
            <ActivityIndicator size='small' color={colors.themeR} />
        )
    }

    const renderItem = ({ item }) => {
        let findIndex = MyCollectionReducer.myCollection.findIndex(x => x.id === item.id);

        if (item && item.hasOwnProperty("metaData") && item.metaData) {
            const image = item?.metaData?.thumbnft || item?.thumbnailUrl;
            return (
                <NFTItem
                screenName="myCollection"
                item={item}
                    image={image}
                    // onLongPress={() => {
                    //     setModalData(item);
                    //     setModalVisible(true);
                    // }}
                    onPress={() => {
                        // dispatch(changeScreenName('myCollection'));
                        navigation.navigate('DetailItem', { index: findIndex, sName: "myCollection" });
                    }}
                />
            );
        }
    };

    const pressToggle = () => {
        dispatch(myCollectionListReset());
        dispatch(myCollectionPageChange(1));
        getNFTlist(1);
    };
    const getNFTlist = useCallback((page) => {
        dispatch(myCollectionList(page, id));
    }, []);

    return (
        <View style={styles.trendCont}>

            {/* { isFocusedHistory &&console.log("🚀 ~ file: nftOwned.js ~ line 85 ~ NFTOwned ~ MyCollectionReducer", MyCollectionReducer)} */}
            {
                isFirstRender ? isFirstRender : MyCollectionReducer.myCollectionPage === 1 && MyCollectionReducer.myCollectionListLoading ?
                    <Loader /> :
                    MyCollectionReducer?.myCollection.length !== 0 ?
                        <FlatList
                            data={MyCollectionReducer?.myCollection}
                            horizontal={false}
                            numColumns={2}
                            initialNumToRender={14}
                            onRefresh={pressToggle}
                            refreshing={MyCollectionReducer.myCollectionPage === 1 && MyCollectionReducer.myCollectionListLoading}
                            renderItem={renderItem}
                            onEndReached={() => {
                                if (!MyCollectionReducer.myCollectionListLoading && MyCollectionReducer.myCollection.length !== MyCollectionReducer.myCollectionTotalCount) {
                                    let num = MyCollectionReducer.myCollectionPage + 1;
                                    getNFTlist(num);
                                    dispatch(myCollectionPageChange(num));
                                }
                            }}
                            ListFooterComponent={renderFooter}
                            onEndReachedThreshold={1}
                            keyExtractor={(v, i) => "item_" + i}
                        />
                        :
                        <View style={styles.sorryMessageCont} >
                            <Text style={styles.sorryMessage} >{translate("common.noNFT")}</Text>
                        </View>
            }

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

export default NFTOwned;
