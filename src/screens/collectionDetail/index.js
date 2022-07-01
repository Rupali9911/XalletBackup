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
import { C_Image, GroupButton, Loader } from '../../components';
import {
    getBoxes,
    getBlindBoxSeriesSum,
    getBoxStatsDetails,
    getHotCollectionDetail,
    getStoreCollectioDetail
} from '../../store/actions/hotCollectionAction';
import ImageSrc from '../../constants/Images';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Collections from './collections';
import { colors, fonts } from '../../res';
import { translate } from '../../walletUtils';
import { useSelector } from 'react-redux';
import { SVGS, FONTS, FONT } from 'src/constants';
import { COLORS, IMAGES, SIZE } from '../../constants';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import { alertWithSingleBtn } from '../../common/function';
import { convertValue, divideNo, numberWithCommas } from '../../utils';
import { basePriceTokens } from '../../web3/config/availableTokens';
import Web3 from 'web3';
import { blockChainConfig } from '../../web3/config/blockChainConfig';
import { networkType } from '../../common/networkType';
import { SvgUri } from 'react-native-svg';
import Video from 'react-native-fast-video';
import { currencyInDollar } from '../wallet/functions';
import Gallery from './gallery';
import Owned from './owned';
import OnSale from './onSale';
import NotOnSale from './notOnSale';
import { Verifiedcollections } from '../../components/verifiedCollection';
import CommonStyles from '../../constants/styles';
import Activity from './activity';
import { RF, wp } from '../../constants/responsiveFunct';

const { height } = Dimensions.get('window');

const { TwiiterIcon, FacebookIcon, InstagramIcon, ThreeDotsVerticalIcon, PolygonIcon, Ethereum, BitmapIcon } = SVGS;
const Tab = createMaterialTopTabNavigator();

let MarketPlaceAbi = "";
let MarketContractAddress = "";

let OffChainBlindBoxAbi = "";
let OffChainBlindBoxAddress = ""
let ApproveAbi = "";
let providerUrl = "";
let walletAddressForNonCrypto = "";

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
    const { collectionId, nftId, isBlind, isHotCollection, isStore } = route.params;
    //  console.log("🚀 ~ file: index.js ~ line 75 ~ CollectionDetail ~ ", collectionId, nftId, isBlind, isHotCollection, isStore)
    //  console.log("🚀 ~ file: index.js ~ line 75 ~ CollectionDetail### ~ ",collectionId, isBlind, isHotCollection)
    const [collection, setCollection] = useState({});
    const [loading, setLoading] = useState(true);
    const [descTab, setDescTab] = useState(true);
    const [collectionType, setCollectionType] = useState(0);
    const [collectionAddress, setCollectionAddress] = useState(null);
    const [storeCollection, setStoreCollection] = useState({});
    const [sumBlindBox, setSumBlindBox] = useState({});
    const [blindboxList, setBlindboxList] = useState([]);
    const [statsDetails, setStatsDetails] = useState([]);
    const [nftChain, setNftChain] = useState('ethereum');
    const [baseCurrency, setBaseCurrency] = useState();
    const [priceOnChain, setPriceOnChain] = useState();
    const [availableTokens, setAvailableTokens] = useState();
    const [availableChains, setAvailableChains] = useState([]);
    const [selectedBlindBox, setSelectedBlindBox] = useState([]);
    const [userIsWhiteListed, setUserIsWhiteListed] = useState(false);
    const [whiteListId, setWhiteListId] = useState();
    const [priceOnDollar, setPriceOnDollar] = useState(0);
    const [selectedPack, setSelectedPack] = useState();
    const navigation = useNavigation();
    const { selectedLanguageItem } = useSelector(state => state.LanguageReducer);
    const { data, wallet } = useSelector(state => state.UserReducer);
    const { NftDataCollectionReducer } = useSelector(state => state);
    const [loadImage, setLoadImage] = useState([]);

    const isLoading = isBlind && nftId
        ? NftDataCollectionReducer.nftBlindSeriesCollectionLoading
        : NftDataCollectionReducer.nftDataCollectionLoading;

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

    const setSelectedPackInfo = (userInfoData, nftData) => {
        setSelectedPack({
            artistDescription: userInfoData?.artistDescription,
            en_artistDescription: userInfoData?.en_artistDescription,
            ja_artistDescription: userInfoData?.ja_artistDescription,
            ko_artistDescription: userInfoData?.ko_artistDescription,
            zh_artistDescription: userInfoData?.zh_artistDescription,
            zh_ch_artistDescription: userInfoData?.zh_ch_artistDescription,

            artistName: userInfoData?.artistName,
            en_artistName: userInfoData?.en_artistName,
            ja_artistName: userInfoData?.ja_artistName,
            ko_artistName: userInfoData?.ko_artistName,
            zh_artistName: userInfoData?.zh_artistName,
            zh_ch_artistName: userInfoData?.zh_ch_artistName,

            bannerImage: userInfoData?.seriesURIMetaInfo?.banner_image,
            nftChain: userInfoData?.nftChain,
            countNFT: userInfoData?.boxInfo.length,

            description: userInfoData?.seriesURIMetaInfo.description,
            en_description: userInfoData?.en_description,
            ja_description: userInfoData?.ja_description,
            ko_description: userInfoData?.ko_description,
            zh_description: userInfoData?.zh_description,
            zh_ch_description: userInfoData?.zh_ch_description,

            image: userInfoData?.seriesURIMetaInfo.image,
            like_count: userInfoData?.like_count,
            name: userInfoData?.name,
            packVideo: userInfoData?.packVideo,

            title: userInfoData?.title,
            en_title: userInfoData?.en_title,
            ja_title: userInfoData?.ja_title,
            ko_title: userInfoData?.ko_title,
            zh_title: userInfoData?.zh_title,
            zh_ch_title: userInfoData?.zh_ch_title,

            price: userInfoData?.price.toString(),

            tokenUri: nftData,

            en_creator: userInfoData?.en_creator,
            ja_creator: userInfoData?.ja_creator,
            ko_creator: userInfoData?.ko_creator,
            zh_creator: userInfoData?.zh_creator,
            zh_ch_creator: userInfoData?.zh_ch_creator,

            en_creatorName: userInfoData?.en_creatorName,
            ja_creatorName: userInfoData?.ja_creatorName,
            ko_creatorName: userInfoData?.ko_creatorName,
            zh_creatorName: userInfoData?.zh_creatorName,
            zh_ch_creatorName: userInfoData?.zh_ch_creatorName,

            en_creatorDescription: userInfoData?.en_creatorDescription,
            ja_creatorDescription: userInfoData?.ja_creatorDescription,
            ko_creatorDescription: userInfoData?.ko_creatorDescription,
            zh_creatorDescription: userInfoData?.zh_creatorDescription,
            zh_ch_creatorDescription: userInfoData?.zh_ch_creatorDescription,
        });
    }

    const getSeriesAsOfChain = () => {
        let selectedSeriesId;
        for (let i = 0; i < selectedBlindBox?.seriesChain?.length; i++) {
            if (
                selectedBlindBox.seriesChain[i].hasOwnProperty(nftChain)
            ) {
                selectedSeriesId = selectedBlindBox.seriesChain[i][nftChain];
            }
        }

        return selectedSeriesId;
    };

    const getCollection = async () => {
        // console.log("isStore==",isStore,"isBlind===",isBlind)
        try {
            if (isStore) {
                // console.log("index.js line collectionDetail 186 isStore", isStore)
                const collectionArray = await getStoreCollectioDetail();
                const filterId = '614faf6668449e8d13a1f1b0';
                const storeCollectionDetail = _.filter(collectionArray.data.data, item => item._id === filterId);
                setStoreCollection(storeCollectionDetail[0] || {});
                setLoading(false);
            } else if (isBlind) {
                // console.log("index.js line 192 collectionDetail else if ", collectionId)
                const collectionArray = await getHotCollectionDetail(
                    collectionId,
                    isBlind);
                setCollectionAddress(collectionArray?.data?.data?._id);
                setCollection(collectionArray?.data?.data);

                // console.log("🚀 ~ file: index.js ~ line 195 ~  collectionDetail ~ isBlind", isBlind, nftId, collectionArray?.data?.data)
                if (isBlind) {
                    nftId ? setBlindBoxes(collectionArray) : getSeriesSum(collectionArray?.data?.data?._id)
                    // nftId ? getSeriesSum(collectionArray?.data?.data?._id) : setBlindBoxes(collectionArray)
                    // setBlindBoxes(collectionArray)
                    //  getSeriesSum(collectionArray?.data?.data?._id)
                } else {
                    setLoading(false);
                }
            } else {
                // console.log("index.js line 208 else")
                const collectionArray = await getHotCollectionDetail(
                    collectionId,
                    isBlind,
                );
                // console.log('collectionArray', collectionArray?.data?.data[0]?.collectionAddress, collectionArray?.data?.data[0])
                setCollectionAddress(collectionArray?.data?.data[0]?.collectionAddress);
                setCollection(collectionArray?.data?.data[0]);
                setLoading(false);
            }
        } catch (err) {
            console.error(err.message);
            setLoading(false);
        }
    };
    const setBlindBoxes = async (collectionArray) => {
        let boxes;
        if (collectionArray?.data?.data?._id === '61aa04803035bdb9917871cf') {
            boxes = await getBoxes(collectionArray?.data.data?.collectionAddress, true);
            // console.log("🚀 ~ file: index.js ~ line 232 ~ setBlindBoxes ~", boxes)
        }
        else {
            boxes = await getBoxes(collectionArray?.data.data?._id);
        }

        // const boxes = await getBoxes(collectionArray?.data.data?.collectionAddress);
        if (!_.isEmpty(boxes)) {
            const filteredBlindBoxCollection = _.filter(boxes.data.data, item => item._id === nftId);

            setBlindboxList(boxes.data.data);
            // console.log("🚀 ~ file: index.js ~ line 242 ~ setBlindBoxes ~ boxes.data.data", boxes.data.data[0])
            if (boxes.data.data) {
                let baseCurrency = basePriceTokens.filter(
                    (token) =>
                        token.chain === boxes.data.data[0]?.nftChain &&
                        token.order === boxes.data.data[0]?.baseCurrency
                );
                // console.log("🚀 ~ file: index.js ~ line 249 ~ setBlindBoxes ~ baseCurrency", baseCurrency)
                setBaseCurrency(baseCurrency[0]);
            }

            // console.log("🚀 ~ file: index.js ~ line 220 ~ ~ boxes.data.data", boxes.data.data, filteredBlindBoxCollection)

            if (filteredBlindBoxCollection && filteredBlindBoxCollection[0]) {
                setSelectedBlindBox(filteredBlindBoxCollection[0]);
                setSelectedPackInfo(filteredBlindBoxCollection[0], '');
                try {
                    const boxStats = await getBoxStatsDetails(filteredBlindBoxCollection[0]._id, collectionArray?.data.data._id);
                    if (boxStats && boxStats.data.data.length > 0) {
                        setStatsDetails(boxStats.data.data[0]);
                    }

                    chainInfo(filteredBlindBoxCollection[0]);
                } catch (err) {
                    console.log('=== Error 238', err);
                    setLoading(false);
                }
            }
            setLoading(false);
        } else {
            setLoading(false);
        }
    }

    const getSeriesSum = (collectionAddress) => {
        getBlindBoxSeriesSum(collectionAddress)
            .then(sumData => {
                // console.log("🚀 ~ file: index.js ~ line 255 ~ collectionDetail ~ sumData", sumData)
                setSumBlindBox(sumData)
                setLoading(false);
            })
            .catch(err => {
                console.log('=== Error 295', err);
                setLoading(false);
            })
    }

    useEffect(() => {
        if (!_.isEmpty(selectedBlindBox) && !_.isEmpty(nftChain) && !_.isEmpty(basePriceTokens)) {
            let index = '';
            for (let i = 0; i < selectedBlindBox.seriesChain.length; i++) {
                if (selectedBlindBox.seriesChain[i][nftChain]) {
                    index = i;
                }
            }
            const _priceOnChain =
                selectedBlindBox.seriesChain[index][nftChain]?.price || "";
            setPriceOnChain(_priceOnChain);

            let baseCurrencyBB = index !== "" && selectedBlindBox.seriesChain[index][nftChain].baseCurrency;
            let baseCurrency = basePriceTokens.filter(
                (token) =>
                    token.chain === nftChain &&
                    token.order === baseCurrencyBB
            );
            setBaseCurrency(baseCurrency[0]);
        }
    }, [nftChain, wallet]);

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

    const chainInfo = async (blindBox) => {
        // console.log("🚀 ~ file: index.js ~ line 394 ~ chainInfo ~ chainInfo", blindBox)

        let index = "";
        let _availableChains = [];
        for (let i = 0; i < blindBox.seriesChain.length; i++) {
            if (blindBox.seriesChain[i].hasOwnProperty("polygon")) {
                _availableChains.push("polygon");
            } else if (blindBox.seriesChain[i].hasOwnProperty("ethereum")) {
                _availableChains.push("ethereum");
            } else if (blindBox.seriesChain[i].hasOwnProperty("binance")) {
                _availableChains.push("binance");
            }
        }

        const indexEth = _availableChains.indexOf("ethereum")
        const _nftChain = _availableChains[indexEth];
        setNftChain(_nftChain);

        for (let i = 0; i < blindBox.seriesChain.length; i++) {
            if (blindBox.seriesChain[i][_nftChain]) {
                index = i;
            }
        }

        let baseCurrencyBB = index !== "" && blindBox.seriesChain[index][_nftChain].baseCurrency;
        let baseCurrency = basePriceTokens.filter(
            (token) =>
                token.chain === _nftChain &&
                token.order === baseCurrencyBB
        );

        let currArrayHex = index !== "" && blindBox.seriesChain[index][_nftChain].allowedCurrencies;
        let currArray = currArrayHex && currArrayHex.length > 0 && currArrayHex
            .map((item) => parseInt(item._hex, 16))
            .toString();

        let _availableTokens = basePriceTokens.filter(
            (token) =>
                token.chain === _nftChain && currArray &&
                currArray.includes(token.order.toString())
        );
        const _priceOnChain =
            blindBox.seriesChain[index][_nftChain]?.price || "";

        setBaseCurrency(baseCurrency[0]);
        setPriceOnChain(_priceOnChain);
        setAvailableTokens(_availableTokens);
        // console.log('==========1111111', _availableChains.sort());
        setAvailableChains(_availableChains.sort());
        // console.log('==========_availableChains.sort()', _availableChains.sort());

        // let w = new Web3(providerUrl);
        // const calculatedPrice = await calculatePrice(
        //   w.utils.toWei(_priceOnChain.toString(), 'ether'),
        //   _nftChain === "ethereum" ? 0 : 1,
        //   "0x0000000000000000000000000000000000000000",
        // );
        // setPriceOnDollar(divideNo(calculatedPrice));
        setLoading(false);
    }

    const calculatePrice = async (price, tradeCurr, owner) => {
        let collectionAddress = selectedBlindBox.collectionAddr[nftChain];
        let web3 = new Web3(providerUrl);
        let MarketPlaceContract = new web3.eth.Contract(
            MarketPlaceAbi,
            MarketContractAddress
        );

        let selectedSeriesId = getSeriesAsOfChain();
        let res = await MarketPlaceContract.methods
            .calculatePrice(
                price,
                baseCurrency.order,
                tradeCurr,
                selectedSeriesId.seriesId,
                owner,
                collectionAddress
            )
            .call();
        if (res) return res;
        else return "";
    }

    const renderBanner = () => {
        let bannerUrl = '';
        if (isStore) {
            // console.log("🚀 ~ file: index.js ~ line 449 ~ renderBanner ~ isStore")
            bannerUrl = 'https://ik.imagekit.io/xanalia/nftData/1632151483313.jpg';
        } else if (isBlind && nftId) {
            // console.log('selectedBlindBox 452', selectedBlindBox)
            bannerUrl = selectedBlindBox
                ? selectedBlindBox.seriesURIMetaInfo?.banner_image
                : "https://ik.imagekit.io/xanalia/Images/Underground_castle_xanalia.jpg";
        } else {
            bannerUrl = collection?.bannerImage;
            // console.log("🚀 ~ file: index.js ~ line 457 ~ renderBanner ~ collection", collection)
        }

        // console.log("🚀 ~ file: index.js ~ line 454 ~ renderBanner ~ bannerUrl", bannerUrl, collection?.bannerImage)
        return (
            <View style={styles.bannerView}>
                <C_Image
                    uri={bannerUrl ? bannerUrl : collection?.bannerImage}
                    type={'jpg'}
                    imageStyle={styles.bannerImage}
                />
            </View>
        )
    }

    const renderSubBanner = () => {
        if (String(isStore).includes('MONKEY_KING')) {
            return (
                <View style={{ paddingHorizontal: SIZE(15), marginTop: SIZE(5) }}>
                    <C_Image
                        uri={storeCollection.image}
                        type={'jpg'}
                        imageStyle={{ width: '100%', height: SIZE(300) }}
                    />
                </View>
            )
        }
        let bannerUrl = '';
        if (isBlind && nftId) {
            bannerUrl = selectedBlindBox
                ? selectedBlindBox.image
                : "https://ik.imagekit.io/xanalia/Images/Underground_castle_xanalia.jpg";
            // } else if (collection?.iconImage) {
            //     bannerUrl = collection?.iconImage;
        } else {
            bannerUrl = collection?.iconImage;
        }

        return (
            <View style={styles.bannerIconWrap}>
                <Image
                    source={{ uri: bannerUrl ? bannerUrl : collection?.iconImage }}
                    style={styles.bannerIcon}
                />
                {Verifiedcollections.find((id) => id === collectionId) && (
                    <View>
                        <Image
                            style={styles.verifyIcon}
                            source={IMAGES.tweetPng}
                        />
                    </View>
                )}
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

    const blindBoxInfo = () => {
        // console.log('selectedBlindBox1', selectedBlindBox)
        if (isStore) return null;
        if (isBlind && nftId) {
            return (
                <>
                    <View style={{ padding: SIZE(10) }}>
                        {!selectedBlindBox?.packVideo ? null :
                            selectedBlindBox?.packVideo && !selectedBlindBox?.packVideo.match(/\.(jpg|jpeg|png|gif)$/) ? (
                                <View style={CommonStyles.center}>
                                    {loadImage &&
                                        <Loader style={styles.blindBoxLoader} />
                                    }
                                    <Video
                                        source={{ uri: selectedBlindBox?.packVideo }}
                                        repeat={true}
                                        resizeMode={'cover'}
                                        style={styles.selectBlindBoxVideo}
                                        onLoadStart={() => setLoadImage(true)}
                                        onReadyForDisplay={() => setLoadImage(false)}
                                    />
                                </View>
                            ) : (
                                <View>
                                    {loadImage &&
                                        <Loader style={styles.blindBoxLoader} />
                                    }
                                    <Image
                                        source={{ uri: selectedBlindBox?.packVideo ? selectedBlindBox?.packVideo : collection?.iconImage }}
                                        style={styles.selectBlindBoxVideo}
                                        onLoadStart={() => setLoadImage(true)}
                                        onLoadEnd={() => setLoadImage(false)}
                                    />
                                </View>
                            )}
                        <Text style={styles.selectBlindBoxName}>
                            {selectedBlindBox?.name ? selectedBlindBox?.name : blindboxList[0]?.name}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: SIZE(5) }}>
                            <Text style={{
                                fontSize: SIZE(22),
                                fontWeight: 'bold',
                                marginRight: SIZE(10),
                                lineHeight: SIZE(22)
                            }}>
                                {priceOnChain ? priceOnChain : blindboxList[0]?.price}
                            </Text>
                            <Text style={{
                                fontSize: SIZE(22),
                                fontWeight: 'bold',
                                color: '#9D9D9D',
                                lineHeight: SIZE(22)
                            }}>
                                {baseCurrency ? baseCurrency.key : ""}
                            </Text>
                            {priceOnDollar ?
                                <>
                                    <Text style={{
                                        fontSize: SIZE(15),
                                        color: '#9D9D9D',
                                        marginLeft: SIZE(10),
                                        lineHeight: SIZE(22)
                                    }}>
                                        {`($${numberWithCommas(parseFloat(priceOnDollar).toFixed(2))})`}
                                    </Text>
                                </> :
                                <View style={{ marginBottom: 5, marginLeft: 10 }}>
                                    {chainIcon(blindboxList[0]?.nftChain)}
                                </View>
                            }
                        </View>
                        {/* <View style={{ paddingTop: SIZE(10) }}>
                            <GroupButton
                                leftDisabled={false}
                                leftText={
                                    parseInt(selectedBlindBox?.startTime) * 1000 <= new Date().getTime() ?
                                        parseInt(selectedBlindBox?.endTime) * 1000 <= new Date().getTime() ?
                                            // selectedBlindBox?. 
                                            'The sale has ended'
                                            : selectedBlindBox?.buyBoxCount &&
                                                parseInt(selectedBlindBox?.buyBoxCount[nftChain]) <
                                                parseInt(selectedBlindBox?.maxBoxesChain[nftChain]) ?
                                                null
                                                : 'Sold Out'
                                        : 'CountDown'
                                }
                                // onLeftPress={() => { alert('okay') }}
                                rightHide
                            />
                        </View> */}
                    </View>
                </>
            )
        }
    }

    const renderDescription = () => {
        if (isBlind && nftId && !isStore) {
            return (
                <>
                    {!isBlind ?
                        <>
                            <View style={styles.descriptionTabWrapper}>
                                <TouchableOpacity
                                    onPress={() => setDescTab(true)}
                                    style={descTab ? styles.descriptionTab : styles.selectedDescriptionTab}>
                                    <Text style={styles.descriptionTabText}>
                                        {translate('wallet.common.description')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </> :
                        <>
                            <View style={styles.descriptionTabWrapper}>
                                <TouchableOpacity
                                    onPress={() => setDescTab(false)}
                                    style={!descTab ? styles.descriptionTab : styles.selectedDescriptionTab}>
                                    <Text style={styles.descriptionTabText}>
                                        {translate('common.creator')}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setDescTab(true)}
                                    style={descTab ? styles.descriptionTab : styles.selectedDescriptionTab}>
                                    <Text style={styles.descriptionTabText}>
                                        {translate('common.collected')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    }

                    <View style={styles.description}>
                        <ScrollView nestedScrollEnabled={true}>
                            {descTab ? (
                                <View>
                                    {isBlind ? (
                                        <Text
                                            style={[
                                                styles.descriptionText,
                                                { fontSize: SIZE(16), fontWeight: 'bold', },
                                            ]}>
                                            {collection.collectionName}
                                        </Text>
                                    ) : null}
                                    <Text style={styles.descriptionText}>
                                        {collection?.collectionDesc}
                                    </Text>
                                </View>
                            ) : (
                                <View>
                                    <Text
                                        style={[
                                            styles.descriptionText,
                                            { fontSize: SIZE(16), fontWeight: 'bold' },
                                        ]}>
                                        {blindboxList[0]?.creator_name}
                                    </Text>
                                    <Text style={styles.descriptionText}>
                                        {blindboxList[0]?.creator_description}
                                    </Text>
                                </View>
                            )}
                        </ScrollView>
                        {/* <ScrollView>
                            <Text style={styles.descriptionText}>
                                {selectedBlindBox.seriesURIMetaInfo
                                    ? selectedBlindBox.seriesURIMetaInfo.description
                                    : collection.collectionDesc}
                            </Text>
                        </ScrollView> */}
                    </View>
                </>
            )
        }

        if (isStore) {
            return (
                <>
                    <View style={[styles.description, { marginTop: SIZE(-15) }]}>
                        <ScrollView>
                            <Text style={styles.descriptionText}>
                                {storeCollection[`${selectedLanguageItem.language_name}_description`]}
                            </Text>
                        </ScrollView>
                    </View>
                    <View style={{ padding: SIZE(15), paddingTop: 0 }}>
                        <View style={styles.sellButton}>
                            <Text style={{ color: 'white' }}>{'Sold Out'}</Text>
                        </View>
                        <Text style={styles.storeCollectionName}>
                            {storeCollection[`${selectedLanguageItem.language_name}_artistName`]}
                        </Text>
                        <Text style={styles.descriptionText}>
                            {storeCollection[`${selectedLanguageItem.language_name}_artistDescription`]}
                        </Text>
                        <Text style={[styles.descriptionText, { marginVertical: SIZE(15) }]}>
                            {translate('common.creator')}
                        </Text>
                        <Text style={styles.storeCollectionName}>
                            {storeCollection[`${selectedLanguageItem.language_name}_creatorName`]}
                        </Text>
                        <Text style={styles.descriptionText}>
                            {storeCollection[`${selectedLanguageItem.language_name}_creatorDescription`]}
                        </Text>
                    </View>
                </>
            );
        }

        return (
            <>
                {isBlind ? (
                    <View style={styles.descriptionTabWrapper}>
                        <TouchableOpacity
                            onPress={() => setDescTab(false)}
                            style={!descTab ? styles.descriptionTab : styles.selectedDescriptionTab}>
                            <Text style={styles.descriptionTabText}>
                                {translate('common.creator')}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setDescTab(true)}
                            style={descTab ? styles.descriptionTab : styles.selectedDescriptionTab}>
                            <Text style={styles.descriptionTabText}>
                                {translate('common.collected')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
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
                )}
                <View style={styles.description}>
                    <ScrollView nestedScrollEnabled={true}>
                        {descTab ? (
                            <View>
                                {isBlind ? (
                                    <Text
                                        style={[
                                            styles.descriptionText,
                                            styles.descriptionTabData
                                        ]}>
                                        {collection.collectionName}
                                    </Text>
                                ) : null}
                                <Text style={styles.descriptionText}>
                                    {collection?.collectionDesc}
                                </Text>
                            </View>
                        ) : !isBlind && isHotCollection && collection?.userInfo ? (
                            <Text style={styles.descriptionText}>
                                {collection.userInfo[
                                    `${selectedLanguageItem.language_name}_about`
                                ] || collection.userInfo.about}
                            </Text>
                        ) : (
                            <View>
                                <Text
                                    style={[
                                        styles.descriptionText,
                                        styles.descriptionTabData,
                                    ]}>
                                    {collection?.creatorName}
                                </Text>
                                <Text style={styles.descriptionText}>
                                    {collection?.creatorDescription}
                                </Text>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </>
        )
    }

    var formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 3,
    });
    var formatter = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 3,
    });

    const renderDetailList = () => {
        // console.log("🚀 ~ file: index.js ~ line 711 ~ ~ isStore", isBlind, nftId, isStore)
        // console.log("🚀 ~ file: index.js ~ line 711 ~ ~ isStore", collection, statsDetails)
        if (isStore) return null;
        let items = ''
        let owners = ''
        let floorPrice = ''
        let volTraded = ''

        if (!isBlind || isBlind && nftId) {
            // console.log("🚀 ~ file: index.js ~ line 858 ~~ IF", !isBlind, collection?.nftCount, blindboxList[0]?.boxInfo?.length, selectedBlindBox.boxInfo?.length, collection, blindboxList, selectedBlindBox)

            items = !isBlind ? collection?.nftCount : selectedBlindBox.boxInfo?.length || blindboxList[0]?.boxInfo.length;
            owners = !isBlind ? collection?.owners : statsDetails?.OwnerCount ? convertValue(statsDetails?.OwnerCount) : blindboxList[0]?.owners || '--';
            floorPrice = !isBlind ? (collection?.floorPrice ? Number(collection?.floorPrice).toFixed(3) : '0.00') : statsDetails?.floorPriceInDollar <= 40
                ? (statsDetails?.floorPrice ? formatter.format(statsDetails?.floorPrice) : '0.00')
                : (statsDetails?.floorPrice ? statsDetails?.floorPrice?.toFixed(3) : '0.00') || (blindboxList && blindboxList[0]?.floorPrice ? blindboxList[0]?.floorPrice?.toFixed(blindboxList[0]?.floorPrice == 0 ? 2 : 3) : '--');
            volTraded = !isBlind ? (collection?.volTraded ? Number(collection?.volTraded).toFixed(3) : '0') : statsDetails?.volumeTradeInETH
                ? convertValue(statsDetails?.volumeTradeInETH)
                : (blindboxList && blindboxList[0]?.volTraded ? Number(blindboxList[0]?.volTraded).toFixed(3) : '0') || '--'
        } else if (isBlind && !nftId && sumBlindBox) {
            // console.log("🚀 ~ file: index.js ~ line 858 ~~ Else")
            items = sumBlindBox?.itemsCount
            owners = sumBlindBox?.OwnerCount
            floorPrice = sumBlindBox?.floorPrice?.toFixed(3)
            volTraded = sumBlindBox?.volumeTradeInETH?.toFixed(3)
        }

        return (
            (items && owners && floorPrice && volTraded &&
                <View style={styles.collectionTable}>
                    <View style={styles.collectionTableRow}>
                        <Text style={styles.collectionTableRowText}>
                            {items}
                        </Text>
                        <Text style={styles.collectionTableRowDec}>
                            {translate('common.itemsCollection')}
                        </Text>
                    </View>
                    <View style={styles.collectionTableRow}>
                        <Text style={styles.collectionTableRowText}>
                            {owners}
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
        )
    }

    const renderChainList = () => {
        if (isStore) return null;
        if (!isBlind || isBlind && nftId) {
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
        }
    }

    const renderTitle = () => {
        if (isStore) {
            return (
                <View style={{ padding: SIZE(15) }}>
                    <Text style={[styles.storeCollectionName, { color: '#636363' }]}>
                        {storeCollection[`${selectedLanguageItem.language_name}_title`]}
                        <View style={{ paddingLeft: 5 }}>
                            <Image
                                style={styles.verifyIcon1}
                                source={IMAGES.tweetPng}
                            />
                        </View>
                    </Text>
                    <Text style={[styles.storeCollectionName, { color: 'red' }]}>
                        {'Blindbox'}
                    </Text>
                    <Text style={styles.storeCollectionName}>
                        {`$${storeCollection.usdPrice || 0}`}
                    </Text>
                </View>
            )
        }
        return (
            <Text style={styles.collectionName}>
                {collection?.collectionName}
            </Text>
        );
    }

    const renderTabView = (tab) => {
        let tabProps = {
            collectionAddress: (isBlind && nftId) ? nftId : collectionAddress ? collectionAddress : collectionId,
            collectionType: collectionType,
            isHotCollection: isHotCollection,
            collectionId: collectionId,
            isBlind: isBlind,
            isSeries: isBlind && nftId,
            nftChain: nftChain,
            isStore: isStore,
            userCollection: collection?.userCollection,
            manualColl: collection.manualColl,
            seriesInfoId: blindboxList?.length > 0 ? blindboxList[0]?._id : false
        }
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
                        width: tab ? wp('25%') : wp('50%'),
                        paddingHorizontal: wp('1%'),
                        justifyContent: 'center',
                        // // fontSize: RF(1.4),
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
                        // marginBottom: SIZE(39),
                    }
                }}
            >
                <Tab.Screen
                    name={tab ? isBlind && nftId ? translate('common.gallery') : translate('common.onSale') : translate('wallet.common.collection')}
                    component={Gallery}
                    initialParams={{
                        collectionAddress: (isBlind && nftId) ? nftId : collectionAddress ? collectionAddress : collectionId,
                        collectionType: 0,
                        isHotCollection: isHotCollection,
                        collectionId: collectionId,
                        isBlind: isBlind,
                        isSeries: isBlind && nftId,
                        nftChain: nftChain,
                        isStore: isStore,
                        userCollection: collection?.userCollection,
                        manualColl: collection.manualColl,
                        seriesInfoId: blindboxList?.length > 0 ? blindboxList[0]?._id : false,
                        tabTitle: tab ? isBlind && nftId ? translate('common.gallery') : translate('common.onSale') : translate('wallet.common.collection')
                    }}
                />
                <Tab.Screen
                    name={tab ? isBlind && nftId ? translate('common.onSale') : translate('common.notforsale') : translate('common.blindboxCollections')}
                    component={Owned}
                    initialParams={{
                        collectionAddress: (isBlind && nftId) ? nftId : collectionAddress ? collectionAddress : collectionId,
                        collectionType: 1,
                        isHotCollection: isHotCollection,
                        collectionId: collectionId,
                        isBlind: isBlind,
                        isSeries: isBlind && nftId,
                        nftChain: nftChain,
                        isStore: isStore,
                        userCollection: collection?.userCollection,
                        manualColl: collection.manualColl,
                        seriesInfoId: blindboxList?.length > 0 ? blindboxList[0]?._id : false,
                        tabTitle: tab ? isBlind && nftId ? translate('common.onSale') : translate('common.notforsale') : translate('common.blindboxCollections')
                    }}
                />
                {tab && <Tab.Screen
                    name={isBlind && nftId ? translate('common.notforsale') : translate('wallet.common.owned')}
                    component={OnSale}
                    initialParams={{
                        collectionAddress: (isBlind && nftId) ? nftId : collectionAddress ? collectionAddress : collectionId,
                        collectionType: 2,
                        isHotCollection: isHotCollection,
                        collectionId: collectionId,
                        isBlind: isBlind,
                        isSeries: isBlind && nftId,
                        nftChain: nftChain,
                        isStore: isStore,
                        userCollection: collection?.userCollection,
                        manualColl: collection.manualColl,
                        seriesInfoId: blindboxList?.length > 0 ? blindboxList[0]?._id : false,
                        tabTitle: isBlind && nftId ? translate('common.notforsale') : translate('wallet.common.owned')
                    }}
                />}
                {tab && <Tab.Screen
                    name={isBlind && nftId ? translate('wallet.common.owned') : translate('common.gallery')}
                    component={NotOnSale}
                    initialParams={{
                        collectionAddress: (isBlind && nftId) ? nftId : collectionAddress ? collectionAddress : collectionId,
                        collectionType: 3,
                        isHotCollection: isHotCollection,
                        collectionId: collectionId,
                        isBlind: isBlind,
                        isSeries: isBlind && nftId,
                        nftChain: nftChain,
                        isStore: isStore,
                        userCollection: collection?.userCollection,
                        manualColl: collection.manualColl,
                        seriesInfoId: blindboxList?.length > 0 ? blindboxList[0]?._id : false,
                        tabTitle: isBlind && nftId ? translate('wallet.common.owned') : translate('common.gallery')
                    }}
                />}
                {/* {tab && !isBlind && <Tab.Screen
                    name={translate('common.activity')}
                    component={Activity}
                    initialParams={{
                        collectionAddress: (isBlind && nftId) ? nftId : collectionAddress ? collectionAddress : collectionId,
                        collectionType: 4,
                        isHotCollection: isHotCollection,
                        collectionId: collectionId,
                        isBlind: isBlind,
                        isSeries: isBlind && nftId,
                        nftChain: nftChain,
                        isStore: isStore,
                        userCollection: collection?.userCollection,
                        manualColl: collection.manualColl,
                        seriesInfoId: blindboxList?.length > 0 ? blindboxList[0]?._id : false,
                        tabTitle: translate('common.activity')
                    }}
                />} */}
            </Tab.Navigator>
        );
    };

    return (
        <AppBackground isBusy={loading}>
            <ScrollView
                nestedScrollEnabled={true}
                contentContainerStyle={{
                    flexGrow: 1,
                    // paddingBottom:height/4
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
                {blindBoxInfo()}
                {renderDescription()}


                {/* <TouchableOpacity style={{ flex: 1, height: 40 }}>
                    <Text>{'Buy'}</Text>
                </TouchableOpacity> */}

                {/* <View style={{ flex: 1 }}>
                    {!isBlind || (isBlind && nftId) ? (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity
                                    disabled={isLoading}
                                    onPress={() => setCollectionType(0)}
                                    style={[
                                        styles.tabBarItem,
                                        {
                                            borderTopColor: collectionType === 0 ? colors.BLUE4 : 'white',
                                        },
                                    ]}>
                                    <Text
                                        style={[
                                            styles.tabBarLabel,
                                            {
                                                color: collectionType === 0 ? colors.BLUE4 : colors.GREY1,
                                            },
                                        ]}>
                                        {isBlind && nftId ? translate('common.gallery') : translate('common.onSale')}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    disabled={isLoading}
                                    onPress={() => setCollectionType(1)}
                                    style={[
                                        styles.tabBarItem,
                                        {
                                            borderTopColor: collectionType === 1 ? colors.BLUE4 : 'white',
                                        },
                                    ]}>
                                    <Text
                                        style={[
                                            styles.tabBarLabel,
                                            {
                                                color: collectionType === 1 ? colors.BLUE4 : colors.GREY1,
                                            },
                                        ]}>
                                        {isBlind && nftId ? translate('common.onSale') : translate('common.notforsale')}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    disabled={isLoading}
                                    onPress={() => setCollectionType(2)}
                                    style={[
                                        styles.tabBarItem,
                                        {
                                            borderTopColor: collectionType === 2 ? colors.BLUE4 : 'white',
                                        },
                                    ]}>
                                    <Text
                                        style={[
                                            styles.tabBarLabel,
                                            {
                                                color: collectionType === 2 ? colors.BLUE4 : colors.GREY1,
                                            },
                                        ]}>
                                        {isBlind && nftId ? translate('common.notforsale') : translate('wallet.common.owned')}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    disabled={isLoading}
                                    onPress={() => setCollectionType(3)}
                                    style={[
                                        styles.tabBarItem,
                                        {
                                            borderTopColor: collectionType === 3 ? colors.BLUE4 : 'white',
                                        },
                                    ]}>
                                    <Text
                                        style={[
                                            styles.tabBarLabel,
                                            {
                                                color: collectionType === 3 ? colors.BLUE4 : colors.GREY1,
                                            },
                                        ]}>
                                        {isBlind && nftId ? translate('wallet.common.owned') : translate('common.gallery')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    ) : isBlind && !nftId ?
                        <View style={{ flexDirection: 'row' }}>

                           
                            <View style={styles.intoMystery}>

                                <TouchableOpacity
                                    disabled={isLoading}
                                    onPress={() => setCollectionType(0)}
                                    style={[
                                        styles.tabBarItem,
                                        {
                                            borderTopColor: collectionType === 0 ? colors.BLUE4 : 'white',
                                        },
                                    ]}>
                                    <Text
                                        style={[
                                            styles.tabBarLabel,
                                            {
                                                color: collectionType === 0 ? colors.BLUE4 : colors.GREY1,
                                            },
                                        ]}>
                                        {isBlind && nftId ? translate('common.owned') : translate('common.gallery')}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    disabled={isLoading}
                                    onPress={() => setCollectionType(1)}
                                    style={[
                                        styles.tabBarItem,
                                        {
                                            borderTopColor: collectionType === 1 ? colors.BLUE4 : 'white',
                                        },
                                    ]}>
                                    <Text
                                        style={[
                                            styles.tabBarLabel,
                                            {
                                                color: collectionType === 1 ? colors.BLUE4 : colors.BLACK8,
                                            },
                                        ]}>
                                        {translate('common.blindboxCollections')}
                                    </Text>
                                </TouchableOpacity>

                            </View>

                        </View>
                        : null}

                    {(collectionAddress || isStore) && !loading && (
                        <Collections
                            collectionAddress={(isBlind && nftId) ? nftId : collectionAddress}
                            collectionType={collectionType}
                            isHotCollection={isHotCollection}
                            collectionId={collectionId}
                            isBlind={isBlind}
                            isSeries={isBlind && nftId}
                            nftChain={nftChain}
                            isStore={isStore}
                            userCollection={collection?.userCollection}
                            manualColl={collection.manualColl}
                            seriesInfoId={blindboxList?.length > 0 ? blindboxList[0]?._id : false}
                        />
                    )}
                </View> */}

                <View style={{ height: height / 1.5 }}>
                    {(!isBlind || (isBlind && nftId)) && !loading ?
                        renderTabView(true)
                        : isBlind && !nftId && !loading ?
                            renderTabView(false)
                            : <Loader />
                    }
                </View>

            </ScrollView>
        </AppBackground>
    );
}

export default CollectionDetail;
