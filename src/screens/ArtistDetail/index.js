import _ from 'lodash';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { BASE_URL } from '../../common/constants';
import {
    ActivityIndicator,
    View,
    TouchableOpacity,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    StatusBar, Linking
} from 'react-native';
import {
    Header,
    Container,
    RowBetweenWrap,
    CenterWrap,
    RowWrap,
    SpaceView,
} from 'src/styles/common.styles';
import {
    HeaderText,
    SmallBoldText,
    SmallNormalText,
    BoldText,
} from 'src/styles/text.styles';
import {
    COLORS,
    SIZE,
    IMAGES,
    SVGS,
    FONT,
    FONTS
} from 'src/constants';
import {
    UserImageView,
    EditButton,
    EditButtonText,
    DescriptionView,
    SmallText,
    WebsiteLink
} from './styled';
import {
    Loader,
    C_Image,
    AppHeader
} from "../../components";
import {
    myNFTList,
    myNftLoadStart,
    myPageChange,
    myNftListReset,
    myNftLoadFail,
} from '../../store/actions/myNFTaction';
import {
    myCollectionList,
    myCollectionLoadStart,
    myCollectionPageChange,
    myCollectionListReset,
    myCollectionLoadFail,
} from '../../store/actions/myCollection';
import { changeScreenName } from '../../store/actions/authAction';
import { handleFollow } from '../../store/actions/nftTrendList';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
    responsiveFontSize as RF
} from '../../common/responsiveFunction';
import { colors } from '../../res';
import { translate } from '../../walletUtils';
import axios from 'axios';
import AppBackground from '../../components/appBackground';
import Hyperlink from "react-native-hyperlink";
import NFTItem from '../../components/NFTItem';

const {
    GIRL,
} = IMAGES;

const {
    ConnectSmIcon,
    LeftArrowIcon,
} = SVGS;

const Created = ({ route }) => {
    const isFocusedHistory = useIsFocused();

    const { id } = route.params;
    const { MyNFTReducer } = useSelector(state => state);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    // const [modalData, setModalData] = useState();
    const [isFirstRender, setIsFirstRender] = useState(true);
    // const [isModalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (isFocusedHistory) {
            if (MyNFTReducer?.myList?.length === 0) {
                refreshFunc()
            } else {
                if (id && id.toLowerCase() === MyNFTReducer.nftUserAdd.toLowerCase()) {
                    dispatch(myNftLoadFail())
                } else {
                    dispatch(myNftListReset());
                    refreshFunc()
                }
            }
            setIsFirstRender(false)
        }
    }, [isFocusedHistory])

    const getNFTlist = useCallback((page) => {
        dispatch(myNFTList(page, id));
    }, []);

    const refreshFunc = () => {
        dispatch(myNftListReset());
        dispatch(myPageChange(1));
        getNFTlist(1);
    }

    const renderFooter = () => {
        if (!MyNFTReducer.myNftListLoading) return null;
        return (
            <ActivityIndicator size='small' color={colors.themeR} />
        )
    }

    const renderItem = ({ item }) => {
        let findIndex = MyNFTReducer.myList.findIndex(x => x.id === item.id);
        if (item && item.hasOwnProperty("metaData") && item.metaData) {
            let imageUri = item.thumbnailUrl !== undefined || item.thumbnailUrl ? item.thumbnailUrl : item.metaData.image;

            return (
                <NFTItem
                    item={item}
                    screenName="myNFT"
                    image={imageUri}
                    // onLongPress={() => {
                    //     setModalData(item);
                    //     setModalVisible(true);
                    // }}
                    onPress={() => {
                        // dispatch(changeScreenName("myNFT"));
                        navigation.push("DetailItem", { id: id, index: findIndex, sName: "myNFT" });
                    }}
                />
            )
        }
    }

    const handleFlatlistRefresh = () => {
        dispatch(myNftLoadStart())
        refreshFunc()
    }
    const handleFlastListEndReached = () => {
        if (!MyNFTReducer.myNftListLoading && MyNFTReducer.myList.length !== MyNFTReducer.myNftTotalCount) {
            let num = MyNFTReducer.myListPage + 1;
            getNFTlist(num);
            dispatch(myPageChange(num));
        }
    }
    const keyExtractor = (item, index) => { return 'item_' + index }

    return (
        <View style={styles.trendCont}>
            <StatusBar barStyle='dark-content' backgroundColor={COLORS.WHITE1} />
            {
                isFirstRender ? isFirstRender : MyNFTReducer.myListPage === 1 && MyNFTReducer.myNftListLoading ? (
                    <Loader />
                ) : MyNFTReducer.myNftTotalCount !== 0 ?
                    <FlatList
                        data={MyNFTReducer.myList}
                        horizontal={false}
                        numColumns={2}
                        initialNumToRender={14}
                        onRefresh={handleFlatlistRefresh}
                        refreshing={MyNFTReducer.myListPage === 1 && MyNFTReducer.myNftListLoading}
                        renderItem={renderItem}
                        onEndReached={handleFlastListEndReached}
                        ListFooterComponent={renderFooter}
                        onEndReachedThreshold={0.5}
                        keyExtractor={keyExtractor}
                    />
                    :
                    <View style={styles.sorryMessageCont} >
                        <Text style={styles.sorryMessage} >{translate("common.noNFT")}</Text>
                    </View>
            }
            {/*{*/}
            {/*modalData &&*/}
            {/*<DetailModal*/}
            {/*data={modalData}*/}
            {/*isModalVisible={isModalVisible}*/}
            {/*toggleModal={() => setModalVisible(false)}*/}
            {/*/>*/}
            {/*}*/}
        </View>
    )
}

const Collection = ({ route }) => {
    const isFocusedHistory = useIsFocused();

    const { id } = route.params;
    const { MyCollectionReducer } = useSelector(state => state);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [isFirstRender, setIsFirstRender] = useState(true);
    // const [modalData, setModalData] = useState();
    // const [isModalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (isFocusedHistory) {
            if (MyCollectionReducer?.myCollection?.length === 0) {
                refreshFunc()
            } else {
                if (id && id.toLowerCase() === MyCollectionReducer.collectionUserAdd.toLowerCase()) {
                    dispatch(myCollectionLoadFail())
                } else {
                    dispatch(myCollectionListReset());
                    refreshFunc()
                }
            }
            setIsFirstRender(false)
        }
    }, [isFocusedHistory])

    const getNFTlist = useCallback((page) => {
        dispatch(myCollectionList(page, id));
    }, []);

    const refreshFunc = () => {
        dispatch(myCollectionListReset());
        dispatch(myCollectionPageChange(1));
        getNFTlist(1);
    }

    const renderFooter = () => {
        if (!MyCollectionReducer.myCollectionListLoading) return null;
        return (
            <ActivityIndicator size='small' color={colors.themeR} />
        )
    }

    const renderItem = ({ item }) => {
        let findIndex = MyCollectionReducer.myCollection.findIndex(x => x.id === item.id);
        if (item && item.hasOwnProperty("metaData") && item.metaData) {
            let imageUri = item.thumbnailUrl !== undefined || item.thumbnailUrl ? item.thumbnailUrl : item.metaData.image;

            return (
                <NFTItem
                    screenName="myCollection"
                    item={item}
                    image={imageUri}
                    // onLongPress={() => {
                    //     setModalData(item);
                    //     setModalVisible(true);
                    // }}
                    onPress={() => {
                        // dispatch(changeScreenName("myCollection"));
                        navigation.push("DetailItem", { id: id, index: findIndex, sName: "myCollection" });
                    }}
                />
            )
        }
    }
    const handleFlatlistRefresh = () => {
        dispatch(myNftLoadStart())
        refreshFunc()
    }
    const handleFlastListEndReached = () => {
        if (!MyCollectionReducer.myCollectionListLoading && MyCollectionReducer.myCollection.length !== MyCollectionReducer.myCollectionTotalCount) {
            let num = MyCollectionReducer.myCollectionPage + 1;
            getNFTlist(num);
            dispatch(myCollectionPageChange(num));
        }
    }
    const keyExtractor = (item, index) => { return 'item_' + index }


    return (
        <View style={styles.trendCont}>
            <StatusBar barStyle='dark-content' backgroundColor={COLORS.WHITE1} />
            {
                isFirstRender ? isFirstRender : MyCollectionReducer.myCollectionPage === 1 && MyCollectionReducer.myCollectionListLoading ?
                    <Loader /> :
                    MyCollectionReducer.myCollectionTotalCount !== 0 ?
                        <FlatList
                            data={MyCollectionReducer.myCollection}
                            horizontal={false}
                            numColumns={2}
                            initialNumToRender={14}
                            onRefresh={handleFlatlistRefresh}
                            refreshing={MyCollectionReducer.myCollectionPage === 1 && MyCollectionReducer.myCollectionListLoading}
                            renderItem={renderItem}
                            onEndReached={handleFlastListEndReached}
                            ListFooterComponent={renderFooter}
                            onEndReachedThreshold={1}
                            keyExtractor={keyExtractor}
                        />
                        :
                        <View style={styles.sorryMessageCont} >
                            <Text style={styles.sorryMessage} >{translate("common.noNFT")}</Text>
                        </View>
            }
            {/*{*/}
            {/*modalData &&*/}
            {/*<DetailModal*/}
            {/*data={modalData}*/}
            {/*isModalVisible={isModalVisible}*/}
            {/*toggleModal={() => setModalVisible(false)}*/}
            {/*/>*/}
            {/*}*/}
        </View>
    )
}

const Tab = createMaterialTopTabNavigator();

export function useIsMounted() {
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;
        return () => isMounted.current = false;
    }, []);

    return isMounted;
}

function ArtistDetail({
    navigation,
    route
}) {

    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [isFollowing, setFollowing] = useState(false);
    const { UserReducer } = useSelector(state => state);
    const dispatch = useDispatch();
    const isMounted = useIsMounted();

    useEffect(() => {
        const url = route?.params?.id.includes('0x') ?
            `${BASE_URL}/user/get-public-profile?publicAddress=${route?.params?.id}` :
            `${BASE_URL}/user/get-public-profile?userId=${route?.params?.id}`

        let body = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }
        fetch(url, body)
            .then(response => response.json())
            .then(res => {
                if (isMounted.current) {
                    if (res.data) {
                        setData(res.data);
                    }
                    getIsFollowing(route.params.id);
                }
            })
            .catch(err => {
                if (err.name === 'AbortError') return;
                getIsFollowing(route.params.id);
            });
    }, []);

    const getIsFollowing = (id) => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${UserReducer.data.token}`;
        axios.get(`${BASE_URL}/user/get-is-following?userId=${id}`)
            .then(res => {
                setFollowing(res.data.isFollowing);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
            });
    }

    const renderTabView = () => {
        if (_.isEmpty(data)) return null;
        return (
            <Tab.Navigator
                screenOptions={{
                    tabBarActiveTintColor: COLORS.BLUE4,
                    tabBarInactiveTintColor: COLORS.GREY1,
                    tabBarLabelStyle: {
                        fontSize: FONT(12),
                        textTransform: 'none'
                    },
                    tabBarIndicatorStyle: {
                        backgroundColor: COLORS.BLUE4,
                        height: 2
                    },
                    tabBarItemStyle: {
                        height: SIZE(42),
                        marginTop: SIZE(-10)
                    },
                    tabBarStyle: {
                        boxShadow: 'none',
                        elevation: 0,
                        borderBottomColor: '#EFEFEF',
                        borderBottomWidth: 1,
                    }
                }}
            >
                <Tab.Screen
                    name='Created'
                    component={Created}
                    options={{ tabBarLabel: translate("wallet.common.created") }}
                    initialParams={{ id: data.role === 'crypto' ? data.username : data._id }}
                />
                <Tab.Screen
                    name='Collection'
                    component={Collection}
                    options={{ tabBarLabel: translate("wallet.common.owned") }}
                    initialParams={{ id: data.role === 'crypto' ? data.username : data._id }}
                />
            </Tab.Navigator>
        )
    }

    const onFollow = async () => {
        await dispatch(handleFollow(data._id, isFollowing));
        if (!isFollowing) {
            data.followers = data.followers + 1;
        } else {
            data.followers = data.followers - 1;
        }
        setFollowing(!isFollowing);
    }

    return (
        <AppBackground isBusy={loading}>

            <AppHeader
                title={data.title || data.username}
                showBackButton
            />

            <View style={{ width: "100%", paddingHorizontal: SIZE(14), flexDirection: "row" }} >
                <UserImageView>
                    <C_Image
                        uri={data.profile_image}
                        imageStyle={{
                            width: '100%',
                            height: '100%'
                        }}
                        imageType="profile"
                    />
                </UserImageView>
                <View style={{ flex: 1, alignItems: "flex-end" }} >
                    <View style={{ flexDirection: "row", width: wp("50"), justifyContent: "space-around" }} >
                        <View style={{ alignItems: "center" }} >
                            <Text style={styles.countLabel1} >{'0'}</Text>
                            <SmallText>{translate("wallet.common.post")}</SmallText>
                        </View>
                        <View style={{ alignItems: "center" }} >
                            <Text style={styles.countLabel1} >{data.followers || 0}</Text>
                            <SmallText>{translate("common.followers")}</SmallText>
                        </View>
                        <View style={{ alignItems: "center" }} >
                            <Text style={styles.countLabel1} >{data.following || 0}</Text>
                            <SmallText>{translate("common.following")}</SmallText>
                        </View>
                    </View>
                </View>
            </View>

            <DescriptionView>
                <SpaceView mTop={SIZE(12)} />
                <SmallBoldText>
                    {data.title || data.username}
                </SmallBoldText>
                <SpaceView mTop={SIZE(8)} />
                {
                    data.about !== "" ?
                        <ScrollView style={{ maxHeight: SIZE(70) }}>
                            <SmallNormalText>
                                {data.about}
                            </SmallNormalText>
                        </ScrollView>
                        : null
                }
                <SpaceView mTop={SIZE(8)} />
                {
                    !_.isEmpty(data.links) && !_.isEmpty(data.links.website) &&
                    <RowWrap>
                        <ConnectSmIcon />
                        <WebsiteLink>
                            <Hyperlink
                                onPress={(url, text) => Linking.openURL(url)}
                                linkStyle={{ color: COLORS.BLUE2 }}>
                                {data.links.website}
                            </Hyperlink>
                        </WebsiteLink>
                    </RowWrap>
                }
            </DescriptionView>
            <SpaceView mTop={SIZE(14)} />
            <RowWrap>
                <SpaceView mLeft={SIZE(15)} />
                <SpaceView mRight={SIZE(15)} />
            </RowWrap>
            <SpaceView mTop={SIZE(16)} />
            {renderTabView()}
        </AppBackground>
    )
}

export default ArtistDetail;

const styles = StyleSheet.create({
    listItem: {
        height: (wp('100%') / 3) - wp('0.5%'),
        marginVertical: wp("0.3"),
        marginHorizontal: wp("0.3"),
        width: (wp('100%') / 3) - wp('0.5%'),
    },
    listImage: {
        height: '100%',
        position: "absolute",
        top: 0,
        width: "100%"
    },
    sorryMessageCont: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    trendCont: {
        backgroundColor: 'white',
        flex: 1,
    },
    countLabel1: {
        fontSize: FONT(16),
        color: COLORS.BLACK1,
        fontFamily: FONTS.PINGfANG_SBOLD
    }
})
