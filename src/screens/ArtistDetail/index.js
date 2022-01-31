import _ from 'lodash';
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
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
    DetailModal,
    AppHeader
} from "../../components";
import {
    myNFTList,
    myNftLoadStart,
    myPageChange,
    myNftListReset,
} from '../../store/actions/myNFTaction';
import {
    myCollectionList,
    myCollectionLoadStart,
    myCollectionPageChange,
    myCollectionListReset,
} from '../../store/actions/myCollection';
import { changeScreenName } from '../../store/actions/authAction';
import { handleFollow } from '../../store/actions/nftTrendList';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
    responsiveFontSize as RF
} from '../../common/responsiveFunction';
import getLanguage from '../../utils/languageSupport';
import { colors } from '../../res';
import { translate } from '../../walletUtils';
import axios from 'axios';
import AppBackground from '../../components/appBackground';
import Hyperlink from "react-native-hyperlink";

const langObj = getLanguage();

const {
    GIRL,
} = IMAGES;

const {
    ConnectSmIcon,
    LeftArrowIcon,
} = SVGS;

const Created = ({ route }) => {

    const { id } = route.params;
    const { MyNFTReducer } = useSelector(state => state);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [modalData, setModalData] = useState();
    const [isModalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        dispatch(myNftLoadStart());
        dispatch(myNftListReset());
        getNFTlist(1);
        dispatch(myPageChange(1));
    }, [])

    const getNFTlist = useCallback((page) => {
        dispatch(myNFTList(page, id));
    }, []);

    const refreshFunc = () => {
        dispatch(myNftListReset());
        getNFTlist(1);
        dispatch(myPageChange(1));
    }

    const renderFooter = () => {
        if (!MyNFTReducer.myNftListLoading) return null;
        return (
            <ActivityIndicator size='small' color={colors.themeR} />
        )
    }

    const renderItem = ({ item }) => {
        let findIndex = MyNFTReducer.myList.findIndex(x => x.id === item.id);
        if (item.metaData) {
            const image = item.metaData.image || item.thumbnailUrl;
            const fileType = image ? image.split('.')[image.split('.').length - 1] : '';
            if (!image) {
                console.log(fileType, image, item.metaData.image, item.thumbnailUrl, item, "aaaaaaaaaaaaa")
                return (
                    <TouchableOpacity
                        onLongPress={() => {
                            setModalData(item);
                            setModalVisible(true);
                        }}
                        onPress={() => {
                            dispatch(changeScreenName("myNFT"));
                            navigation.push("DetailItem", { index: findIndex, owner: id });
                        }}
                        style={styles.listItem}>
                        <C_Image
                            uri={image}
                            type={fileType}
                            imageStyle={styles.listImage} />
                    </TouchableOpacity>
                )
            }
            return (
                <TouchableOpacity
                    onLongPress={() => {
                        setModalData(item);
                        setModalVisible(true);
                    }}
                    onPress={() => {
                        dispatch(changeScreenName("myNFT"));
                        navigation.push("DetailItem", { index: findIndex, owner: id });
                    }}
                    style={styles.listItem}>
                    <C_Image
                        uri={image}
                        type={fileType}
                        imageStyle={styles.listImage} />
                </TouchableOpacity>
            )

        }
    }

    return (
        <View style={styles.trendCont}>
            <StatusBar barStyle='dark-content' backgroundColor={COLORS.WHITE1} />
            {
                MyNFTReducer.myListPage === 1 && MyNFTReducer.myNftListLoading ?
                    <Loader /> :
                    MyNFTReducer.myNftTotalCount !== 0 ?
                        <FlatList
                            data={MyNFTReducer.myList}
                            horizontal={false}
                            numColumns={3}
                            initialNumToRender={15}
                            onRefresh={() => {
                                dispatch(myNftLoadStart())
                                refreshFunc()
                            }}
                            refreshing={MyNFTReducer.myListPage === 1 && MyNFTReducer.myNftListLoading}
                            renderItem={renderItem}
                            onEndReached={() => {
                                if (!MyNFTReducer.myNftListLoading && MyNFTReducer.myList.length !== MyNFTReducer.myNftTotalCount) {
                                    let num = MyNFTReducer.myListPage + 1;
                                    getNFTlist(num);
                                    dispatch(myPageChange(num));
                                }
                            }}
                            ListFooterComponent={renderFooter}
                            onEndReachedThreshold={0.5}
                            keyExtractor={(v, i) => "item_" + i}
                        />
                        :
                        <View style={styles.sorryMessageCont} >
                            <Text style={styles.sorryMessage} >{translate("common.noNFT")}</Text>
                        </View>
            }
            {
                modalData &&
                <DetailModal
                    data={modalData}
                    isModalVisible={isModalVisible}
                    toggleModal={() => setModalVisible(false)}
                />
            }
        </View>
    )
}

const Collection = ({ route }) => {

    const { id } = route.params;
    const { MyCollectionReducer } = useSelector(state => state);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [modalData, setModalData] = useState();
    const [isModalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        dispatch(myCollectionLoadStart());
        dispatch(myCollectionListReset());
        getNFTlist(1);
        dispatch(myCollectionPageChange(1));
    }, [])

    const getNFTlist = useCallback((page) => {
        dispatch(myCollectionList(page, id));
    }, []);

    const refreshFunc = () => {
        dispatch(myCollectionListReset());
        getNFTlist(1);
        dispatch(myCollectionPageChange(1));
    }

    const renderFooter = () => {
        if (!MyCollectionReducer.myCollectionListLoading) return null;
        return (
            <ActivityIndicator size='small' color={colors.themeR} />
        )
    }

    const renderItem = ({ item }) => {
        let findIndex = MyCollectionReducer.myCollection.findIndex(x => x.id === item.id);
        if (item.metaData) {
            const image = item.metaData.image || item.thumbnailUrl;
            const fileType = image ? image.split('.')[image.split('.').length - 1] : '';
            return (
                <TouchableOpacity
                    onLongPress={() => {
                        setModalData(item);
                        setModalVisible(true);
                    }}
                    onPress={() => {
                        dispatch(changeScreenName("myCollection"));
                        navigation.push("DetailItem", { index: findIndex, owner: id });
                    }}
                    style={styles.listItem}>
                    <C_Image
                        uri={image}
                        type={fileType}
                        imageStyle={styles.listImage} />

                </TouchableOpacity>
            )
        }
    }

    return (
        <View style={styles.trendCont}>
            <StatusBar barStyle='dark-content' backgroundColor={COLORS.WHITE1} />
            {
                MyCollectionReducer.myCollectionPage === 1 && MyCollectionReducer.myCollectionListLoading ?
                    <Loader /> :
                    MyCollectionReducer.myCollectionTotalCount !== 0 ?
                        <FlatList
                            data={MyCollectionReducer.myCollection}
                            horizontal={false}
                            numColumns={3}
                            initialNumToRender={15}
                            onRefresh={() => {
                                dispatch(myNftLoadStart())
                                refreshFunc()
                            }}
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
            {
                modalData &&
                <DetailModal
                    data={modalData}
                    isModalVisible={isModalVisible}
                    toggleModal={() => setModalVisible(false)}
                />
            }
        </View>
    )
}

const Tab = createMaterialTopTabNavigator();

function ArtistDetail({
    navigation,
    route
}) {

    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [isFollowing, setFollowing] = useState(false);
    const { UserReducer } = useSelector(state => state);
    const dispatch = useDispatch();

    useEffect(() => {
        getProfile();
    }, []);

    const getProfile = () => {
        let req_data = {
            owner: route.params.id,
            token: 'HubyJ*%qcqR0'
        };

        let body = {
            method: 'POST',
            body: JSON.stringify(req_data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }
        fetch(`${BASE_URL}/xanalia/getProfile`, body)
            .then(response => response.json())
            .then(res => {
                if (res.data) {
                    console.log('======', res.data)
                    setData(res.data);
                }
                getIsFollowing(route.params.id);
            })
            .catch(err => {
                getIsFollowing(route.params.id);
            });
    }

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
            <Tab.Navigator tabBarOptions={{
                activeTintColor: COLORS.BLUE4,
                inactiveTintColor: COLORS.GREY1,
                style: {
                    boxShadow: 'none',
                    elevation: 0,
                    borderBottomColor: '#EFEFEF',
                    borderBottomWidth: 1,
                },
                tabStyle: {
                    height: SIZE(42),
                    marginTop: SIZE(-10)
                },
                labelStyle: {
                    fontSize: FONT(12),
                    textTransform: 'none'
                },
                indicatorStyle: {
                    backgroundColor: COLORS.BLUE4,
                    height: 2
                }
            }}>
                <Tab.Screen
                    name='Created'
                    component={Created}
                    options={{ tabBarLabel: translate("wallet.common.created") }}
                    initialParams={{ id: data.role === 'crypto' ? data.username : data._id }}
                />
                <Tab.Screen
                    name='Collection'
                    component={Collection}
                    options={{ tabBarLabel: translate("common.collected") }}
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
                <EditButton isFollowing={isFollowing} onPress={onFollow}>
                    <EditButtonText isFollowing={isFollowing}>
                        {isFollowing ? translate("common.unfollow") : translate("common.follow")}
                    </EditButtonText>
                </EditButton>
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
