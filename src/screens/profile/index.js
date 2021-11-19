import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import { translate } from '../../walletUtils';
import {
    ActivityIndicator,
    View,
    TouchableOpacity,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    StatusBar,
    Linking
} from 'react-native';
import {
    Header,
    HeaderRight,
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
    FONT
} from 'src/constants';
import {
    UserImageView,
    EditButton,
    EditButtonText,
    DescriptionView,
    SmallText,
    WebsiteLink
    // styles
} from './styled';
import {
    Loader,
    C_Image,
    DetailModal,
    AppHeader
} from '../../components';
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
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
    responsiveFontSize as RF
} from '../../common/responsiveFunction';
import getLanguage from '../../utils/languageSupport';
import { colors, fonts } from '../../res';
const langObj = getLanguage();

const {
    ConnectSmIcon,
    SettingIcon
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
            const image = item.metaData.thumbnft || item.thumbnailUrl
            return (
                <TouchableOpacity
                    onLongPress={() => {
                        setModalData(item);
                        setModalVisible(true);
                    }}
                    onPress={() => {
                        dispatch(changeScreenName("myNFT"));
                        navigation.navigate("DetailItem", { index: findIndex, owner: id });
                    }}
                    style={styles.listItem}>
                    {
                        image ?
                            <C_Image
                                uri={image}
                                type={item.metaData.image.split('.')[item.metaData.image.split('.').length - 1]}
                                imageStyle={styles.listImage} />
                            : <View style={styles.sorryMessageCont}>
                                <Text style={{ textAlign: "center" }} >
                                    {translate("wallet.common.error.noImage")}
                                </Text>
                            </View>
                    }
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
                    MyNFTReducer.myList.length !== 0 ?
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
            const image = item.metaData.thumbnft || item.thumbnailUrl;
            return (
                <TouchableOpacity
                    onLongPress={() => {
                        setModalData(item);
                        setModalVisible(true);
                    }}
                    onPress={() => {
                        dispatch(changeScreenName("myCollection"));
                        navigation.navigate("DetailItem", { index: findIndex, owner: id });
                    }}
                    style={styles.listItem}>
                    {
                        image ?
                            <C_Image
                                uri={image}
                                type={item.metaData.image.split('.')[item.metaData.image.split('.').length - 1]}
                                imageStyle={styles.listImage} />
                            : <View style={styles.sorryMessageCont}>
                                <Text style={{ textAlign: "center" }} >
                                    {translate("wallet.common.error.noImage")}
                                </Text>
                            </View>
                    }
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
                    MyCollectionReducer.myCollection.length !== 0 ?
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
                                if (!MyCollectionReducer.myCollectionListLoading && MyCollectionReducer.myCollectionTotalCount !== MyCollectionReducer.myCollection.length) {
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

function Profile({
    navigation,
    connector
}) {

    const { UserReducer } = useSelector(state => state);

    const id = UserReducer.data.user.name || UserReducer.wallet.address;
    const {
        about,
        title,
        firstName,
        lastName,
        links
    } = UserReducer.data.user;

    const renderTabView = () => {
        return (
            <Tab.Navigator tabBarOptions={{
                activeTintColor: COLORS.BLUE2,
                inactiveTintColor: COLORS.BLACK5,
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
                <Tab.Screen name='My NFTs'
                    options={{ tabBarLabel: translate("wallet.common.myNFTs") }}
                    component={Created}
                    initialParams={{ id: id }} />
                <Tab.Screen name='My Collection'
                    options={{ tabBarLabel: translate("common.myCollection") }}
                    component={Collection}
                    initialParams={{ id: id }} />
            </Tab.Navigator >
        )
    }

    return (
        <Container>
            <AppHeader
                title={translate("wallet.common.myPage")}
                showRightButton
                showBackButton
                rightButtonComponent={<SettingIcon width={SIZE(23)} height={SIZE(23)} />}
                onPressRight={() => navigation.navigate('Setting', { connector: connector })}
            />
            {/* <Header>
                <HeaderText numberOfLines={1}>
                    {translate("wallet.common.myPage")}
                </HeaderText>
                <HeaderRight>
                    <RowWrap>
                        <SpaceView mRight={SIZE(15)} />
                        <TouchableOpacity onPress={() => navigation.navigate('Setting', { connector: connector })}>
                          <Text style={styles.headerTitle} >Others/Settings</Text>
                            <SettingIcon width={SIZE(23)} height={SIZE(23)} />
                        </TouchableOpacity>
                    </RowWrap>
                </HeaderRight>
            </Header> */}
            <RowWrap>
                <SpaceView mLeft={SIZE(14)} />
                <RowBetweenWrap flex={1}>
                    <UserImageView>
                        <C_Image
                            uri={UserReducer.data.user.profile_image}
                            imageStyle={{
                                width: '100%',
                                height: '100%'
                            }}
                            imageType="profile"
                        />
                    </UserImageView>
                    <CenterWrap>
                        <SpaceView mTop={SIZE(-14)} />
                        <RowBetweenWrap>
                            <RowWrap>
                                <CenterWrap>
                                    <BoldText>
                                        {'0'}
                                    </BoldText>
                                    <SmallText>
                                        {translate("wallet.common.post")}
                                    </SmallText>
                                </CenterWrap>
                                <SpaceView mLeft={SIZE(41)} />
                            </RowWrap>
                            <CenterWrap>
                                <BoldText>
                                    {'0'}
                                </BoldText>
                                <SmallText>
                                    {translate("common.followers")}
                                </SmallText>
                            </CenterWrap>
                            <RowWrap>
                                <SpaceView mLeft={SIZE(27)} />
                                <CenterWrap>
                                    <BoldText>
                                        {'0'}
                                    </BoldText>
                                    <SmallText>
                                        {translate("common.following")}
                                    </SmallText>
                                </CenterWrap>
                            </RowWrap>
                        </RowBetweenWrap>
                        <SpaceView mTop={SIZE(32)} />
                    </CenterWrap>
                </RowBetweenWrap>
                <SpaceView mRight={SIZE(7)} />
            </RowWrap>
            <DescriptionView>
                <SpaceView mTop={SIZE(12)} />
                <SmallBoldText>
                    {title || firstName + ' ' + lastName}
                </SmallBoldText>
                <SpaceView mTop={SIZE(8)} />
                {
                    about &&
                    <ScrollView style={{ maxHeight: SIZE(70) }}>
                        <SmallNormalText>
                            {about}
                        </SmallNormalText>
                    </ScrollView>
                }
                <SpaceView mTop={SIZE(8)} />
                {
                    links &&
                    <TouchableOpacity onPress={() => {
                        Linking.openURL(links.website);
                    }}>
                        <RowWrap>
                            <ConnectSmIcon />
                            <WebsiteLink>
                                {links.website.split('/')[2]}
                            </WebsiteLink>
                        </RowWrap>
                    </TouchableOpacity>
                }
            </DescriptionView>
            <SpaceView mTop={SIZE(14)} />
            <RowWrap>
                <SpaceView mLeft={SIZE(15)} />
                <EditButton onPress={() => navigation.navigate('EditProfile')}>
                    <EditButtonText>
                        {translate("wallet.common.edit")}
                    </EditButtonText>
                </EditButton>
                <SpaceView mRight={SIZE(15)} />
            </RowWrap>
            <SpaceView mTop={SIZE(16)} />
            {renderTabView()}
        </Container >
    )
}

export default Profile;

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
    headerTitle: {
        fontSize: RF(2),
        fontFamily: fonts.PINGfANG_SBOLD,
        lineHeight: RF(2.1)
    },
})
