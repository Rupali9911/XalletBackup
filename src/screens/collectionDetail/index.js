import 'intl';
import 'intl/locale-data/jsonp/en';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Linking,
    Dimensions,
    BackHandler
} from 'react-native';
import AppBackground from '../../components/appBackground';
import { C_Image, Loader } from '../../components';
import {
    getHotCollectionDetail,
} from '../../store/actions/hotCollectionAction';
import ImageSrc from '../../constants/Images';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { colors, fonts } from '../../res';
import { translate } from '../../walletUtils';
import { useSelector } from 'react-redux';
import { SVGS, FONTS, FONT } from 'src/constants';
import { COLORS, IMAGES, SIZE } from '../../constants';
import { Verifiedcollections } from '../../components/verifiedCollection';

import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import { alertWithSingleBtn } from '../../common/function';
import { basePriceTokens } from '../../web3/config/availableTokens';
import Web3 from 'web3';
import { blockChainConfig } from '../../web3/config/blockChainConfig';
import { SvgUri } from 'react-native-svg';
import { currencyInDollar } from '../wallet/functions';
import tabOne from './tabOne';
import tabTwo from './tabTwo';
import tabThree from './tabThree';
import tabFour from './tabFour';
import Activity from './activity';
import { RF, wp } from '../../constants/responsiveFunct';
import sendRequest from '../../helpers/AxiosApiRequest';
import { NEW_BASE_URL } from '../../common/constants';

const { height } = Dimensions.get('window');

const { TwiiterIcon, FacebookIcon, InstagramIcon, ThreeDotsVerticalIcon, PolygonIcon, Ethereum, BitmapIcon } = SVGS;
const Tab = createMaterialTopTabNavigator();

const imageToChainKey = {
    polygon: {
        active: "_poly-A.svg",
        inactive: "_poly.svg",
    },
    binance: {
        active: "_binance-A.svg",
        inactive: "_binance.svg",
    },
    ethereum: {
        active: "_ETH-A.svg",
        inactive: "_ETH.svg",
    },
};

function CollectionDetail(props) {
    const { route } = props;
    const { networkName, contractAddress, launchpadId, isLaunchPad } = route.params;
    // console.log("🚀 ~ file: index.js ~ line 75 ~ CollectionDetail ~ ", item);
    const [collection, setCollection] = useState({});
    const [loading, setLoading] = useState(true);
    const [descTab, setDescTab] = useState(true);
    const [nftChain, setNftChain] = useState('ethereum');
    const [baseCurrency, setBaseCurrency] = useState();
    const [priceOnChain, setPriceOnChain] = useState();
    const [availableChains, setAvailableChains] = useState([]);
    const [selectedBlindBox, setSelectedBlindBox] = useState([]);
    const navigation = useNavigation();
    const { data, wallet } = useSelector(state => state.UserReducer);

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButton)
        getCollection();
    }, [BackHandler.removeEventListener('hardwareBackPress', handleBackButton)]);

    const handleBackButton = () => {
        navigation.goBack();
        return true;
    }

    const chainIcon = type => {
        if (type === 'polygon') {
            return <PolygonIcon />;
        }
        if (type === 'ethereum') {
            return <Ethereum />;
        }
        if (type === 'binance') {
            return <BitmapIcon />;
        }
    };

    const getCollection = async () => {
        try {
            
            if (isLaunchPad) {
                const url = `${NEW_BASE_URL}/launchpad/detail`;
                sendRequest({
                    url,
                    params: {
                        launchpadId: launchpadId 
                    },
                }).then((res) => {
                    setCollection(res);
                    setLoading(false)
                }).catch((err) => console.log('err : ', err))
            }
            else {
                const collectionArray = await getHotCollectionDetail(
                    networkName,
                    contractAddress
                );
                setCollection(collectionArray);
                setLoading(false);
            }
            
        } catch (err) {
            console.error(err.message);
            setCollection([]);
            setLoading(false);
        }
    };

    useEffect(() => {
        getCurrencyPrice(priceOnChain);
    }, [priceOnChain]);

    const getCurrencyPrice = async (price) => {
        let finalPrice = '';
        let i;
        switch (nftChain) {
            case 'Binance':
                i = 0
                break;
            case 'polygon':
                i = 1
                break;
            case 'ethereum':
                i = 2
                break;
        }

        let currencyPrices = await priceInDollars(data?.user?.role === 'crypto' ? wallet?.address : blockChainConfig[i]?.walletAddressForNonCrypto)
        switch (baseCurrency?.key) {
            case "BNB":
                finalPrice = price * currencyPrices?.BNB;
                break;

            case "ALIA":
                finalPrice = price * currencyPrices?.ALIA;
                break;

            case "ETH":
                finalPrice = price * currencyPrices?.ETH;
                break;

            case "MATIC":
                finalPrice = price * currencyPrices?.MATIC;
                break;

            default:
                finalPrice = price * 1;
                break;
        }
        setPriceOnDollar(finalPrice);
    };

    const priceInDollars = (pubKey) => {
        return new Promise((resolve, reject) => {
            let balanceRequests = [
                currencyInDollar(pubKey, 'BSC'),
                currencyInDollar(pubKey, 'ETH'),
                currencyInDollar(pubKey, 'Polygon'),
                currencyInDollar(pubKey, 'ALIA'),
            ];

            Promise.all(balanceRequests)
                .then(responses => {
                    let balances = {
                        BNB: responses[0],
                        ETH: responses[1],
                        MATIC: responses[2],
                        ALIA: parseFloat(responses[0]) / parseFloat(responses[3]),
                    };
                    resolve(balances);
                })
                .catch(err => {
                    console.log('err', err);
                    reject();
                });
        });
    };

    const renderBanner = () => {
        let bannerUrl = collection?.bannerImage;
        
        return (
            <View style={styles.bannerView}>
                <C_Image
                    uri={bannerUrl}
                    type={'jpg'}
                    imageStyle={styles.bannerImage}
                />
            </View>
        )
    }

    const renderSubBanner = () => {
       
        let bannerUrl = collection?.iconImage;
        
        return (
            <View style={styles.bannerIconWrap}>
                <Image
                    source={{ uri: bannerUrl }}
                    style={styles.bannerIcon}
                />
                {/* {Verifiedcollections.find((id) => id === collectionId) && (
                    <View>
                        <Image
                            style={styles.verifyIcon}
                            source={IMAGES.tweetPng}
                        />
                    </View>
                )} */}
            </View>
        )
    }

    const renderSocialLinks = () => {
        return (
            <View style={styles.socialLinksWrap}>
                {collection?.userInfo?.links?.twitter ? (
                    <TouchableOpacity
                        style={{ marginRight: 10 }}
                        hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                        onPress={() => Linking.openURL(collection?.userInfo?.links?.twitter)}>
                        <TwiiterIcon />
                    </TouchableOpacity>
                ) : null}
                {collection?.userInfo?.links?.instagram ? (
                    <TouchableOpacity
                        hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                        style={{ marginRight: 6 }}
                        onPress={() => Linking.openURL(collection?.userInfo?.links?.instagram)}>
                        <InstagramIcon />
                    </TouchableOpacity>
                ) : null}
                {collection?.userInfo?.links?.facebook ? (
                    <TouchableOpacity
                        hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                        onPress={() => Linking.openURL(collection?.userInfo?.links?.facebook)}>
                        <FacebookIcon />
                    </TouchableOpacity>
                ) : null}
            </View>
        );
    };

    const renderDescription = () => {
     
        return (
            <>
               
                <View style={styles.descriptionTabWrapper}>
                    <TouchableOpacity
                        onPress={() => setDescTab(true)}
                        style={descTab ? styles.descriptionTab : styles.selectedDescriptionTab}>
                        <Text style={styles.descriptionTabText}>
                            {translate('common.collected')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setDescTab(false)}
                        style={!descTab ? styles.descriptionTab : styles.selectedDescriptionTab}>
                        <Text style={styles.descriptionTabText}>
                            {translate('common.creator')}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.description}>
                    <ScrollView nestedScrollEnabled={true}>
                        {descTab ?
                           
                            <View>
                                <Text
                                    style={[
                                        styles.descriptionText,
                                        styles.descriptionTabData
                                    ]}>
                                    {collection.name}
                                </Text>
                                <Text style={styles.descriptionText}>
                                    {collection?.description}
                                </Text>
                            </View>
                            : (
                                <View>
                                    <Text
                                        style={[
                                            styles.descriptionText,
                                            styles.descriptionTabData,
                                        ]}>
                                        {collection?.user?.name}
                                    </Text>
                                    <Text style={styles.descriptionText}>
                                        {collection?.user?.description}
                                    </Text>
                                </View>
                            )}
                    </ScrollView>
                </View>
            </>
        )
    }

    const renderDetailList = () => {

        let items = Number(collection?.totalNft);
        let owners = Number(collection?.totalOwner);
        let floorPrice = Number(collection?.floorPrice).toFixed(3);
        let volTraded = Number(collection?.volumeTraded).toFixed(3);

        return (
            <View style={styles.collectionTable}>
                <View style={styles.collectionTableRow}>
                    <Text style={styles.collectionTableRowText}>
                        {items === undefined ? '--' : items}
                    </Text>
                    <Text style={styles.collectionTableRowDec}>
                        {translate('common.itemsCollection')}
                    </Text>
                </View>
                <View style={styles.collectionTableRow}>
                    <Text style={styles.collectionTableRowText}>
                        {owners === undefined ? '--' : owners}
                    </Text>
                    <Text style={styles.collectionTableRowDec}>
                        {translate('common.owners')}
                    </Text>
                </View>
                <View style={styles.collectionTableRow}>
                    <View style={styles.floorPriceVw}>
                        <Image source={ImageSrc.etherium1} style={styles.cryptoIcon} />
                        <Text style={styles.collectionTableRowText} numberOfLines={1}>
                            {floorPrice}
                        </Text>
                    </View>
                    <Text style={styles.collectionTableRowDec} numberOfLines={1}>
                        {translate('common.floorPrice')}
                    </Text>
                </View>
                <View style={styles.collectionTableRow}>
                    <View style={styles.floorPriceVw}>
                        <Image source={ImageSrc.etherium1} style={styles.cryptoIcon} />
                        <Text style={styles.collectionTableRowText} numberOfLines={1}>
                            {volTraded}
                        </Text>
                    </View>
                    <Text style={styles.collectionTableRowDec} numberOfLines={1}>
                        {translate('common.volumeTraded')}
                    </Text>
                </View>
            </View>
        )
    }

    const renderChainList = () => {
        
        let chainLabel = availableChains?.length > 0 ? availableChains : ["ethereum", "polygon"]

        return (
            <View style={styles.chainListWrap}>
                {chainLabel.map((item) => {
                    const isSelected = String(item).toLowerCase() === String(nftChain).toLowerCase();
                    const chainTypeImage = isSelected
                        ? `https://ik.imagekit.io/xanalia/Images/${imageToChainKey[item].active}`
                        : `https://ik.imagekit.io/xanalia/Images/${imageToChainKey[item].inactive}`;

                    return (
                        <TouchableOpacity
                            style={[styles.chainListButton, { backgroundColor: isSelected ? 'black' : 'white' }]}
                            key={item}
                            onPress={() => setNftChain(item)}>
                            <SvgUri
                                width={SIZE(12)}
                                height={SIZE(12)}
                                uri={chainTypeImage}
                            />
                            <Text style={[styles.chainListButtonText, { color: !isSelected ? 'black' : 'white' }]}>
                                {item.substr(0, 1).toUpperCase() + item.substr(1, item.length)}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
        // }
    }

    const renderTitle = () => {
       
        return (
            <Text style={styles.collectionName}>
                {collection?.name}
            </Text>
        );
    }

    const renderTabView = (tab) => {
        // console.log("🚀 ~ file: index.js ~ line 1008 ~ renderTabView ~ ", isBlind, nftId, isBlind && nftId)
        return (
            <Tab.Navigator
                screenOptions={{
                    tabBarScrollEnabled: true,
                    tabBarActiveTintColor: COLORS.BLUE2,
                    tabBarInactiveTintColor: COLORS.BLACK5,
                    tabBarStyle: {
                        boxShadow: 'none',
                        elevation: 0,
                        borderBottomColor: '#EFEFEF',
                        borderBottomWidth: 1,
                    },
                    tabBarItemStyle: {
                        height: SIZE(42),
                        marginTop: SIZE(-10),
                        width:  wp('25%'),
                        paddingHorizontal: wp('1%'),
                        justifyContent: 'center',
                        fontFamily: fonts.SegoeUIRegular,
                        textTransform: 'capitalize',
                    },
                    tabBarLabelStyle: {
                        fontSize: FONT(12),
                        textTransform: 'none',
                    },
                    tabBarIndicatorStyle: {
                        backgroundColor: COLORS.BLUE4,
                        height: 2,
                    }
                }}>
                    
                {tab && <Tab.Screen
                    name={translate('common.onSale')}
                    component={tabOne}
                    initialParams={{
                        tabTitle: translate('common.onSale'),
                        collection: collection,
                        tabStatus: 1,
                        isLaunchPad: isLaunchPad
                    }}
                />}
                {tab && <Tab.Screen
                    name={translate('common.notOnSell')}
                    component={tabTwo}
                    initialParams={{
                        tabTitle: translate('common.notOnSell'),
                        collection: collection,
                        tabStatus: 2,
                        isLaunchPad: isLaunchPad
                    }}
                />}
                {tab && <Tab.Screen
                    name={translate('wallet.common.owned')}
                    component={tabThree}
                    initialParams={{
                        tabTitle: translate('wallet.common.owned'),
                        collection: collection,
                        isLaunchPad: isLaunchPad
                    }}
                />}
                {<Tab.Screen
                    name={translate('common.gallery')}
                    component={tabFour}
                    initialParams={{
                        tabTitle: translate('common.gallery'),
                        collection: collection,
                        tabStatus: 3,
                        isLaunchPad: isLaunchPad
                    }}
                />}
                {tab && <Tab.Screen
                    name={translate('common.activity')}
                    component={Activity}
                    initialParams={{
                        tabTitle: translate('common.activity'),
                        collection: collection,
                    }}
                />}
            </Tab.Navigator>
        );
    };

    return (
        <AppBackground isBusy={loading}>
            <ScrollView
                nestedScrollEnabled={true}
                contentContainerStyle={{
                    flexGrow: 1,
                }}
                style={{ flex: 1 }} 
            >
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButtonWrap}>
                    <Image style={styles.backIcon} source={ImageSrc.backArrow} />
                </TouchableOpacity>
                <View
                    style={styles.headerContent}>
                    <Menu
                        onSelect={value => {
                            alertWithSingleBtn(
                                translate('common.Confirm'),
                                value === 1
                                    ? translate('common.collectionReported')
                                    : translate('common.userBlocked'),
                            );
                        }}>
                        <MenuTrigger children={<ThreeDotsVerticalIcon />} />
                        <MenuOptions>
                            <MenuOption value={1}>
                                <Text style={{ marginVertical: 10 }}>
                                    {translate('common.reportCollection')}
                                </Text>
                            </MenuOption>
                            <MenuOption value={2}>
                                <Text style={{ marginVertical: 10 }}>
                                    {translate('common.blockUser')}
                                </Text>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                </View>
                {renderBanner()}
                {renderSocialLinks()}
                {renderSubBanner()}

                {renderTitle()}
                {renderDetailList()}

                {renderChainList()}
                {renderDescription()}

                <View style={{ height: height / 1.5 }}>
                    {!loading && !isLaunchPad ? 
                        renderTabView(true)
                        : isLaunchPad && !loading ? renderTabView(false) : <Loader/>
                    }
                </View>

            </ScrollView>
        </AppBackground>
    );
}

export default CollectionDetail;

