import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    Image,
    Text,
    ScrollView,
    TextInput,
    Switch
} from 'react-native';
import styles from './styles';
import { images, colors } from '../../res';

import { divideNo } from '../../utils';
import { C_Image, GroupButton } from '../../components';
import {
    SVGS,
    SIZE,
    IMAGES
} from 'src/constants';
import Video from 'react-native-fast-video';
// import Video from 'react-native-video';

import { translate } from '../../walletUtils';
import { blockChainConfig } from '../../web3/config/blockChainConfig';
import PaymentMethod from '../../components/PaymentMethod';
import PaymentNow from '../../components/PaymentMethod/payNowModal';
import { useSelector, useDispatch } from 'react-redux';
import { getAllCards, setPaymentObject } from '../../store/reducer/paymentReducer';
import { networkType } from '../../common/networkType';
import AppModal from '../../components/appModal';
import SuccessModalContent from '../../components/successModal';

const {
    PlayButtonIcon,
    GIRL
} = SVGS;

const Web3 = require("web3");

let walletAddressForNonCrypto = "";

const DetailScreen = ({ route, navigation }) => {

    const dispatch = useDispatch();
    const { paymentObject } = useSelector(state => state.PaymentReducer);
    const { data, wallet } = useSelector(state => state.UserReducer);

    const refVideo = useRef(null);
    const [isPlay, setPlay] = useState(false);
    const {
        id,
        name,
        description,
        owner,
        ownerImage,
        creator,
        creatorImage,
        thumbnailUrl,
        video,
        fileType,
        price,
        chain,
        ownerId,
        tokenId,
        artistId
    } = route.params;
    const [showPaymentMethod, setShowPaymentMethod] = useState(false);
    const [showPaymentNow, setShowPaymentNow] = useState(false);
    const [isContractOwner, setIsContractOwner] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [isNFTOnAuction, setIsNFTOnAuction] = useState(false);
    const [singleNFT, setSingleNFT] = useState({});
    const [nonCryptoOwnerId, setNonCryptoOwnerId] = useState('');
    const [nonCryptoOwner, setNonCryptoOwner] = useState(false);
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [lastBidAmount, setLastBidAmount] = useState("");
    const [priceNFT, setPriceNFT] = useState("");
    const [auctionInitiatorAdd, setAuctionInitiatorAdd] = useState("");
    const [auctionETime, setAuctionETime] = useState('');
    const [connectedWithTo, setConnectedWithTo] = useState('');
    const [buyLoading, setBuyLoading] = useState(false);

    //#region SmartContract
    let MarketPlaceAbi = "";
    let MarketContractAddress = "";

    let AwardAbi = "";
    let AwardContractAddress = "";
    let ApproveAbi = "";
    let ApproveAdd = "";
    let providerUrl = "";

    walletAddressForNonCrypto =
        networkType === "testnet"
            ? chain === "binance"
                ? "0x61598488ccD8cb5114Df579e3E0c5F19Fdd6b3Af"
                : "0x9b6D7b08460e3c2a1f4DFF3B2881a854b4f3b859"
            : "0xac940124f5f3b56b0c298cca8e9e098c2cccae2e";

    let params = tokenId.toString().split('-');
    let _tokenId = params.length > 1 ? params[1] : params[0];
    let chainType = params.length > 1 ? params[0] : 'binance';
    if (chainType === 'polygon') {
        MarketPlaceAbi = blockChainConfig[1].marketConConfig.abi;
        MarketContractAddress = blockChainConfig[1].marketConConfig.add;
        AwardAbi = blockChainConfig[1].awardConConfig.abi;
        AwardContractAddress = blockChainConfig[1].awardConConfig.add;
        ApproveAbi = blockChainConfig[1].marketApproveConConfig.abi;
        ApproveAdd = blockChainConfig[1].marketApproveConConfig.add;
        providerUrl = blockChainConfig[1].providerUrl;
    } else if (chainType === 'binance') {
        MarketPlaceAbi = blockChainConfig[0].marketConConfig.abi;
        MarketContractAddress = blockChainConfig[0].marketConConfig.add;
        AwardAbi = blockChainConfig[0].awardConConfig.abi;
        AwardContractAddress = blockChainConfig[0].awardConConfig.add;
        ApproveAbi = blockChainConfig[0].marketApproveConConfig.abi;
        ApproveAdd = blockChainConfig[0].marketApproveConConfig.add;
        providerUrl = blockChainConfig[0].providerUrl;
    }
    //#endregion

    useEffect(() => {
        console.log('tokenId', tokenId);
        if (MarketPlaceAbi && MarketContractAddress) {
            setBuyLoading(true);
            checkNFTOnAuction();
            getNonCryptoNFTOwner();
        }

        if (data.token) {
            dispatch(getAllCards(data.token));
        }
    }, []);

    useEffect(() => {
        if (paymentObject) {
            setShowPaymentNow(true);
        }
    }, [paymentObject]);

    const checkNFTOnAuction = () => {
        const setAuctionVariables = (
            auctionInitiatorAdd = "",
            auctionETime = "",
            lastBidAmount = "",
            isNFTOnAuction = false
        ) => {
            setIsNFTOnAuction(isNFTOnAuction);
            setAuctionInitiatorAdd(auctionInitiatorAdd);
            setAuctionETime(auctionETime);
            setLastBidAmount(lastBidAmount);
        };

        let web3 = new Web3(providerUrl);
        let MarketPlaceContract = new web3.eth.Contract(
            MarketPlaceAbi,
            MarketContractAddress
        );
        MarketPlaceContract.methods
            .getSellDetail(_tokenId)
            .call((err, res) => {
                console.log('checkNFTOnAuction_res', res);
                if (!err) {
                    if (parseInt(res[5]) * 1000 > 0) {
                        setAuctionVariables(
                            res[0],
                            parseInt(res[2]) * 1000,
                            divideNo(res[1]),
                            true
                        );
                    } else {
                        setAuctionVariables();
                    }
                } else {
                    setAuctionVariables();
                }
            });
    }

    const getNonCryptoNFTOwner = () => {
        // let tokenId = "317";
        let web3 = new Web3(providerUrl);
        let MarketPlaceContract = new web3.eth.Contract(
            MarketPlaceAbi,
            MarketContractAddress
        );
        MarketPlaceContract.methods
            .getNonCryptoOwner(_tokenId)
            .call(async (err, res) => {
                console.log('getNonCryptoOwner_res', res);
                if (res) {
                    setNonCryptoOwnerId(res);
                    lastOwnerOfNFTNonCrypto();
                } else if (!res) {
                    lastOwnerOfNFT();
                } else if (err) {
                }
            });
    }

    const lastOwnerOfNFTNonCrypto = () => {
        let _data = singleNFT;
        let web3 = new Web3(providerUrl);
        let MarketPlaceContract = new web3.eth.Contract(
            MarketPlaceAbi,
            MarketContractAddress
        );
        MarketPlaceContract.methods.ownerOf(_tokenId).call((err, res) => {
            if (!err) {
                _data.owner_address = res;
                console.log('owner_address', res, _tokenId);
                MarketPlaceContract.methods.getSellDetail(_tokenId).call((err, res) => {
                    console.log('MarketPlaceContract_res', res, err, _tokenId, MarketContractAddress);
                    // return ;
                    if (!err) {
                        let priceOfNft = res[1] / 1e18;
                        if (wallet.address) {
                            // if (priceOfNft === 0) {
                            if (res[0] === "0x0000000000000000000000000000000000000000") {
                                setPriceNFT(priceOfNft);
                                setIsContractOwner(res[0].toLowerCase() ===
                                    wallet.address.toLowerCase() ||
                                    (res[0].toLowerCase() ===
                                        walletAddressForNonCrypto.toLowerCase() &&
                                        nonCryptoOwnerId.toLowerCase() ===
                                        data.user._id)
                                    ? true
                                    : false);
                                setIsOwner((_data.owner_address.toLowerCase() ===
                                    data.user._id.toLowerCase() &&
                                    res[1] !== "") ||
                                    (data &&
                                        _data.owner_address.toLowerCase() ===
                                        walletAddressForNonCrypto.toLowerCase() &&
                                        res[1] !== "" &&
                                        nonCryptoOwnerId.toLowerCase() ===
                                        data.user._id)
                                    ? true
                                    : false);
                            } else if (
                                res[0] !== "0x0000000000000000000000000000000000000000"
                            ) {
                                setIsOwner((res[0].toLowerCase() ===
                                    wallet.address.toLowerCase() &&
                                    res[1] !== "") ||
                                    (data &&
                                        res[0].toLowerCase() ===
                                        walletAddressForNonCrypto.toLowerCase() &&
                                        res[1] !== "" &&
                                        nonCryptoOwnerId.toLowerCase() ===
                                        data.user._id)
                                    ? true
                                    : false);
                                setIsContractOwner(res[0].toLowerCase() ===
                                    wallet.address.toLowerCase() ||
                                    (res[0].toLowerCase() ===
                                        walletAddressForNonCrypto.toLowerCase() &&
                                        data &&
                                        nonCryptoOwnerId.toLowerCase() ===
                                        data.user._id)
                                    ? true
                                    : false);
                                setPriceNFT(priceOfNft);
                            }
                        } else {
                            if (res[0] === "0x0000000000000000000000000000000000000000") {
                                setIsContractOwner(false);
                                setPriceNFT(priceOfNft);
                            } else if (
                                res[0] !== "0x0000000000000000000000000000000000000000"
                            ) {
                                setPriceNFT(priceOfNft);
                                setIsContractOwner(false);
                            }
                        }
                    }
                    setBuyLoading(false);
                });
            } else {
                //console.log("err getAuthor", err);
                setBuyLoading(false);
            }
        });
    }

    const lastOwnerOfNFT = () => {
        let _data = singleNFT;
        let web3 = new Web3(providerUrl);
        let MarketPlaceContract = new web3.eth.Contract(
            MarketPlaceAbi,
            MarketContractAddress
        );
        MarketPlaceContract.methods.ownerOf(_tokenId).call((err, res) => {
            if (!err) {
                _data.owner_address = res;
                console.log('owner_address', res);
                MarketPlaceContract.methods.getSellDetail(_tokenId).call((err, res) => {
                    console.log('MarketPlaceContract_res', res, err, _tokenId);
                    if (!err) {
                        let priceOfNft = res[1] / 1e18;
                        if (wallet.address) {
                            if (res[0] === "0x0000000000000000000000000000000000000000") {
                                setPriceNFT(priceOfNft);
                                setIsContractOwner(res[0].toLowerCase() ===
                                    wallet.address.toLowerCase()
                                    ? true
                                    : false);
                                setIsOwner(_data.owner_address.toLowerCase() ===
                                    wallet.address.toLowerCase() && res[1] !== ""
                                    ? true
                                    : false);
                            } else if (
                                res[0] !== "0x0000000000000000000000000000000000000000"
                            ) {
                                setIsOwner(res[0].toLowerCase() ===
                                    wallet.address.toLowerCase() && res[1] !== ""
                                    ? true
                                    : false);
                                setIsContractOwner(res[0].toLowerCase() ===
                                    wallet.address.toLowerCase()
                                    ? true
                                    : false);
                                setPriceNFT(priceOfNft);
                            }
                        } else {
                            // if (priceOfNft === 0) {
                            if (res[0] === "0x0000000000000000000000000000000000000000") {
                                setIsContractOwner(false);
                                setPriceNFT(priceOfNft);
                            } else if (
                                res[0] !== "0x0000000000000000000000000000000000000000"
                            ) {
                                setIsContractOwner(false);
                                setPriceNFT(priceOfNft);
                            }
                        }
                    }
                    setBuyLoading(false);
                });
            } else {
                //console.log("err getAuthor", err);
                setBuyLoading(false);
            }
        });
    }

    const bidingTimeEnded = () => {
        return new Date().getTime() > new Date(auctionETime).getTime();
    }

    const setNFTStatus = () => {
        let _nftStatus = '';
        if (isContractOwner) {
            if (isNFTOnAuction && lastBidAmount !== "0.000000000000000000") {
                // setNftStatus(undefined);
                console.log('set NftStatus 1');
                _nftStatus = undefined;
            } else {
                // setNftStatus('onSell')
                console.log('set NftStatus 2');
                _nftStatus = 'onSell';
            }
        } else if (isOwner) {
            // setNftStatus('sell')
            console.log('set NftStatus 3');
            _nftStatus = 'sell';
        } else if (priceNFT || (isNFTOnAuction && auctionInitiatorAdd.toLowerCase() !== wallet.address.toLowerCase())) {
            if (isNFTOnAuction && auctionInitiatorAdd.toLowerCase() !== wallet.address.toLowerCase() && bidingTimeEnded() !== true) {
                // setNftStatus(undefined);
                console.log('set NftStatus 4');
                _nftStatus = undefined;
            } else if (priceNFT && !isNFTOnAuction) {
                if (wallet.address) {
                    // setNftStatus('buy')
                    console.log('set NftStatus 5');
                    _nftStatus = 'buy';
                } else if (connectedWithTo === "paymentCard") {

                } else {
                    // setNftStatus('buy');
                    console.log('set NftStatus 6');
                    _nftStatus = 'buy';
                }
            } else {
                // setNftStatus(undefined);
                console.log('set NftStatus 7');
                _nftStatus = undefined;
            }
        } else {
            // setNftStatus('notOnSell');
            console.log('set NftStatus 8');
            _nftStatus = 'notOnSell';
        }
        console.log('_nftStatus', _nftStatus, priceNFT, isContractOwner, isOwner, isNFTOnAuction);
        return _nftStatus;
    }

    const onProfile = () => {
        if (isOwner) {
            navigation.push('ArtistDetail', { id: ownerId });
        } else {
            navigation.push('ArtistDetail', { id: artistId });
        }
    }
    return (
        <>
            <SafeAreaView style={styles.mainContainer}>
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image style={styles.headerIcon} source={images.icons.back} resizeMode="contain" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.headerText}>
                        {translate("wallet.common.detail")}
                    </Text>
                </View>
                <ScrollView>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => setPlay(!isPlay)}>
                        {
                            fileType === 'mp4' || fileType === 'MP4' || fileType === 'mov' || fileType === 'MOV' ?
                                <View style={{ ...styles.modalImage }}>
                                    {/* <C_Image uri={thumbnailUrl} imageStyle={styles.modalImage} isContain /> */}
                                    <Video
                                        ref={refVideo}
                                        source={{ uri: video }}
                                        repeat
                                        playInBackground={false}
                                        paused={!isPlay}
                                        resizeMode={'cover'}
                                        onLoad={() => refVideo.current.seek(0)}
                                        style={{
                                            flex: 1,
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                        }} />
                                    {
                                        !isPlay &&
                                        <View style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <View style={{
                                                width: SIZE(100),
                                                height: SIZE(100),
                                                backgroundColor: '#00000030',
                                                borderRadius: SIZE(100),
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <PlayButtonIcon width={SIZE(100)} height={SIZE(100)} />
                                            </View>
                                        </View>
                                    }
                                </View>
                                :
                                <C_Image uri={thumbnailUrl} imageStyle={styles.modalImage} isContain />
                        }
                    </TouchableOpacity>
                    <Text style={styles.nftName}>
                        {name}
                    </Text>
                    <View style={styles.person}>
                        <TouchableOpacity
                            onPress={() => onProfile(true)}
                            style={styles.personType}>
                            <Image style={styles.iconsImage} source={!ownerImage ? IMAGES.DEFAULTPROFILE : { uri: ownerImage }} />
                            <View>
                                <Text style={styles.personTypeText}>
                                    {translate("common.owner")}
                                </Text>
                                <Text numberOfLines={1} style={styles.personName}>
                                    {owner}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => onProfile(false)}
                            style={styles.personType}>
                            <Image style={styles.iconsImage} source={!creatorImage ? IMAGES.DEFAULTPROFILE : { uri: creatorImage }} />
                            <View>
                                <Text style={styles.personTypeText}>
                                    {translate("common.creator")}
                                </Text>
                                <Text numberOfLines={1} style={styles.personName}>
                                    {creator}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.description}>
                        {description}
                    </Text>
                    {/* <View style={styles.moreView}>
                        <Text style={styles.moreTitle}>
                            {translate("wallet.common.creatorHint")}
                        </Text>
                        <View style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between'
                        }}>
                            <View style={styles.moreItem}>
                                <Image source={GIRL} style={{ width: '100%', height: '100%' }} />
                            </View>
                            <View style={styles.moreItem}>
                                <Image source={GIRL} style={{ width: '100%', height: '100%' }} />
                            </View>
                            <View style={styles.moreItem}>
                                <Image source={GIRL} style={{ width: '100%', height: '100%' }} />
                            </View>
                            <View style={styles.moreItem}>
                                <Image source={GIRL} style={{ width: '100%', height: '100%' }} />
                            </View>
                        </View>
                    </View> */}
                </ScrollView>
                <View style={styles.bottomView}>
                    <Text style={styles.count}>
                        {'# 1 / 1'}
                    </Text>
                    <View style={styles.row}>
                        <Text style={styles.priceUnit}>
                            {'￥'}
                        </Text>
                        <Text style={styles.price}>
                            {price ? price : 0}
                        </Text>
                    </View>
                    {
                        setNFTStatus() !== undefined &&
                        <GroupButton
                            leftText={
                                setNFTStatus() === 'onSell' ? translate("common.cancelSell")
                                    : setNFTStatus() === 'sell' ? translate("common.sell")
                                        : setNFTStatus() === 'buy' ? translate("common.buy")
                                            : setNFTStatus() === 'notOnSell' ? translate("common.soonOnSell")
                                                : translate("common.buy")
                            }
                            rightText={translate("wallet.common.offerPrice")}
                            leftDisabled={setNFTStatus() === ''}
                            leftLoading={buyLoading}
                            onLeftPress={() => {
                                console.log('priceOfNft', priceNFT);
                                if (buyLoading) return;
                                // navigation.navigate('WalletConnect')
                                // if(price && price > 0){
                                // if (setNFTStatus() === 'buy') {
                                    setShowPaymentMethod(true);
                                // }
                                // }
                            }}
                            leftHide={setNFTStatus() === undefined}
                            rightHide
                            onRightPress={() => navigation.navigate('MakeBid')}
                        />
                    }
                </View>
            </SafeAreaView>
            <PaymentMethod visible={showPaymentMethod} price={price ? price : 0} chain={chain} onRequestClose={() => setShowPaymentMethod(false)} />
            <PaymentNow
                visible={showPaymentNow}
                price={price ? price : 0}
                chain={chain}
                NftId={_tokenId}
                ownerId={nonCryptoOwnerId}
                lastBidAmount={priceNFT}
                onRequestClose={() => {
                    dispatch(setPaymentObject(null));
                    setShowPaymentNow(false)
                }}
                onPaymentDone={() => {
                    dispatch(setPaymentObject(null));
                    setBuyLoading(true);
                    getNonCryptoNFTOwner();
                    setShowPaymentNow(false);
                    setSuccessModalVisible(true);
                }} />

            <AppModal
                visible={successModalVisible}
                onRequestClose={() => setSuccessModalVisible(false)}>
                <SuccessModalContent
                    onClose={() => setSuccessModalVisible(false)}
                    onDonePress={() => {
                        setSuccessModalVisible(false);
                    }}
                    sucessMsg={translate("wallet.common.purchasedSuccess")}
                />
            </AppModal>

        </>
    )
}

export default DetailScreen;
