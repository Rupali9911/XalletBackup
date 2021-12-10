import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Video from 'react-native-fast-video';
import {Row, Rows, Table} from 'react-native-table-component';
import {useDispatch, useSelector} from 'react-redux';
import {IMAGES, SIZE, SVGS} from 'src/constants';
import details from '../../../assets/images/details.png';
import grid from '../../../assets/images/grid.png';
import history from '../../../assets/images/history.png';
import trading from '../../../assets/images/trading.png';
import {networkType} from '../../common/networkType';
import {AppHeader, C_Image, GroupButton} from '../../components';
import AppModal from '../../components/appModal';
import TextView from '../../components/appText';
import NFTDetailDropdown from '../../components/NFTDetailDropdown';
import PaymentMethod from '../../components/PaymentMethod';
import PaymentNow from '../../components/PaymentMethod/payNowModal';
import SuccessModalContent from '../../components/successModal';
import Colors from '../../constants/Colors';
import {hp} from '../../constants/responsiveFunct';
import {
  getAllCards,
  setPaymentObject,
} from '../../store/reducer/paymentReducer';
import {divideNo} from '../../utils';
import {translate} from '../../walletUtils';
import {blockChainConfig} from '../../web3/config/blockChainConfig';
import styles from './styles';

const {PlayButtonIcon, GIRL} = SVGS;

const Web3 = require('web3');

let walletAddressForNonCrypto = '';

const DetailScreen = ({route, navigation}) => {
  const dispatch = useDispatch();
  const {paymentObject} = useSelector(state => state.PaymentReducer);
  const {data, wallet} = useSelector(state => state.UserReducer);

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
    artistId,
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
  const [lastBidAmount, setLastBidAmount] = useState('');
  const [priceNFT, setPriceNFT] = useState('');
  const [auctionInitiatorAdd, setAuctionInitiatorAdd] = useState('');
  const [auctionETime, setAuctionETime] = useState('');
  const [connectedWithTo, setConnectedWithTo] = useState('');
  const [buyLoading, setBuyLoading] = useState(false);
  const [tableHead, setTableHead] = useState([
    'Price',
    'From',
    'To',
    'Date (DD/MM/YYYY)',
  ]);
  const [tradingTableHead, setTradingTableHead] = useState([
    'Event',
    'Price',
    'From',
    'To',
    'Date (DD/MM/YYYY)',
  ]);
  const [tableData, setTableData] = useState([
    ['1', '2', '3', '4'],
    ['a', 'b', 'c', 'd'],
    ['1', '2', '3', '4'],
    ['a', 'b', 'c', 'd'],
  ]);
  const [tradingTableData, setTradingTableData] = useState([
    ['1', '2', '3', '4', '5'],
    ['a', 'b', 'c', 'd', 'e'],
    ['1', '2', '3', '4', '5'],
    ['a', 'b', 'c', 'd', 'e'],
  ]);
  //#region SmartContract
  let MarketPlaceAbi = '';
  let MarketContractAddress = '';

  let AwardAbi = '';
  let AwardContractAddress = '';
  let ApproveAbi = '';
  let ApproveAdd = '';
  let providerUrl = '';

  walletAddressForNonCrypto =
    networkType === 'testnet'
      ? chain === 'binance'
        ? '0x61598488ccD8cb5114Df579e3E0c5F19Fdd6b3Af'
        : '0x9b6D7b08460e3c2a1f4DFF3B2881a854b4f3b859'
      : '0xac940124f5f3b56b0c298cca8e9e098c2cccae2e';

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
      auctionInitiatorAdd = '',
      auctionETime = '',
      lastBidAmount = '',
      isNFTOnAuction = false,
    ) => {
      setIsNFTOnAuction(isNFTOnAuction);
      setAuctionInitiatorAdd(auctionInitiatorAdd);
      setAuctionETime(auctionETime);
      setLastBidAmount(lastBidAmount);
    };

    let web3 = new Web3(providerUrl);
    let MarketPlaceContract = new web3.eth.Contract(
      MarketPlaceAbi,
      MarketContractAddress,
    );
    MarketPlaceContract.methods.getSellDetail(_tokenId).call((err, res) => {
      console.log('checkNFTOnAuction_res', res);
      if (!err) {
        if (parseInt(res[5]) * 1000 > 0) {
          setAuctionVariables(
            res[0],
            parseInt(res[2]) * 1000,
            divideNo(res[1]),
            true,
          );
        } else {
          setAuctionVariables();
        }
      } else {
        setAuctionVariables();
      }
    });
  };

  const getNonCryptoNFTOwner = () => {
    // let tokenId = "317";
    let web3 = new Web3(providerUrl);
    let MarketPlaceContract = new web3.eth.Contract(
      MarketPlaceAbi,
      MarketContractAddress,
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
  };

  const lastOwnerOfNFTNonCrypto = () => {
    let _data = singleNFT;
    let web3 = new Web3(providerUrl);
    let MarketPlaceContract = new web3.eth.Contract(
      MarketPlaceAbi,
      MarketContractAddress,
    );
    MarketPlaceContract.methods.ownerOf(_tokenId).call((err, res) => {
      if (!err) {
        _data.owner_address = res;
        console.log('owner_address', res, _tokenId);
        MarketPlaceContract.methods.getSellDetail(_tokenId).call((err, res) => {
          console.log(
            'MarketPlaceContract_res',
            res,
            err,
            _tokenId,
            MarketContractAddress,
          );
          // return ;
          if (!err) {
            let priceOfNft = res[1] / 1e18;
            if (wallet.address) {
              // if (priceOfNft === 0) {
              if (res[0] === '0x0000000000000000000000000000000000000000') {
                setPriceNFT(priceOfNft);
                setIsContractOwner(
                  res[0].toLowerCase() === wallet.address.toLowerCase() ||
                    (res[0].toLowerCase() ===
                      walletAddressForNonCrypto.toLowerCase() &&
                      nonCryptoOwnerId.toLowerCase() === data.user._id)
                    ? true
                    : false,
                );
                setIsOwner(
                  (_data.owner_address.toLowerCase() ===
                    data.user._id.toLowerCase() &&
                    res[1] !== '') ||
                    (data &&
                      _data.owner_address.toLowerCase() ===
                        walletAddressForNonCrypto.toLowerCase() &&
                      res[1] !== '' &&
                      nonCryptoOwnerId.toLowerCase() === data.user._id)
                    ? true
                    : false,
                );
              } else if (
                res[0] !== '0x0000000000000000000000000000000000000000'
              ) {
                setIsOwner(
                  (res[0].toLowerCase() === wallet.address.toLowerCase() &&
                    res[1] !== '') ||
                    (data &&
                      res[0].toLowerCase() ===
                        walletAddressForNonCrypto.toLowerCase() &&
                      res[1] !== '' &&
                      nonCryptoOwnerId.toLowerCase() === data.user._id)
                    ? true
                    : false,
                );
                setIsContractOwner(
                  res[0].toLowerCase() === wallet.address.toLowerCase() ||
                    (res[0].toLowerCase() ===
                      walletAddressForNonCrypto.toLowerCase() &&
                      data &&
                      nonCryptoOwnerId.toLowerCase() === data.user._id)
                    ? true
                    : false,
                );
                setPriceNFT(priceOfNft);
              }
            } else {
              if (res[0] === '0x0000000000000000000000000000000000000000') {
                setIsContractOwner(false);
                setPriceNFT(priceOfNft);
              } else if (
                res[0] !== '0x0000000000000000000000000000000000000000'
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
  };

  const lastOwnerOfNFT = () => {
    let _data = singleNFT;
    let web3 = new Web3(providerUrl);
    let MarketPlaceContract = new web3.eth.Contract(
      MarketPlaceAbi,
      MarketContractAddress,
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
              if (res[0] === '0x0000000000000000000000000000000000000000') {
                setPriceNFT(priceOfNft);
                setIsContractOwner(
                  res[0].toLowerCase() === wallet.address.toLowerCase()
                    ? true
                    : false,
                );
                setIsOwner(
                  _data.owner_address.toLowerCase() ===
                    wallet.address.toLowerCase() && res[1] !== ''
                    ? true
                    : false,
                );
              } else if (
                res[0] !== '0x0000000000000000000000000000000000000000'
              ) {
                setIsOwner(
                  res[0].toLowerCase() === wallet.address.toLowerCase() &&
                    res[1] !== ''
                    ? true
                    : false,
                );
                setIsContractOwner(
                  res[0].toLowerCase() === wallet.address.toLowerCase()
                    ? true
                    : false,
                );
                setPriceNFT(priceOfNft);
              }
            } else {
              // if (priceOfNft === 0) {
              if (res[0] === '0x0000000000000000000000000000000000000000') {
                setIsContractOwner(false);
                setPriceNFT(priceOfNft);
              } else if (
                res[0] !== '0x0000000000000000000000000000000000000000'
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
  };

  const bidingTimeEnded = () => {
    return new Date().getTime() > new Date(auctionETime).getTime();
  };

  const setNFTStatus = () => {
    let _nftStatus = '';
    if (isContractOwner) {
      if (isNFTOnAuction && lastBidAmount !== '0.000000000000000000') {
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
    } else if (
      priceNFT ||
      (isNFTOnAuction &&
        auctionInitiatorAdd.toLowerCase() !== wallet.address.toLowerCase())
    ) {
      if (
        isNFTOnAuction &&
        auctionInitiatorAdd.toLowerCase() !== wallet.address.toLowerCase() &&
        bidingTimeEnded() !== true
      ) {
        // setNftStatus(undefined);
        console.log('set NftStatus 4');
        _nftStatus = undefined;
      } else if (priceNFT && !isNFTOnAuction) {
        if (wallet.address) {
          // setNftStatus('buy')
          console.log('set NftStatus 5');
          _nftStatus = 'buy';
        } else if (connectedWithTo === 'paymentCard') {
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
    console.log(
      '_nftStatus',
      _nftStatus,
      priceNFT,
      isContractOwner,
      isOwner,
      isNFTOnAuction,
    );
    return _nftStatus;
  };

  const onProfile = () => {
    if (isOwner) {
      navigation.push('ArtistDetail', {id: ownerId});
    } else {
      navigation.push('ArtistDetail', {id: artistId});
    }
  };
  const PayableIn = props => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState([]);
    const [items, setItems] = useState([
      {label: 'Minted', value: 'Minted'},
      {label: 'Listing (Fixed Price)', value: 'Listing (Fixed Price)'},
      {label: 'Bid', value: 'Bid'},
      {label: 'Sale', value: 'Sale'},
      {label: 'Claim', value: 'Claim'},
      {label: 'Listing (Auction)', value: 'Listing (Auction)'},
      {label: 'Cancel Sell', value: 'Cancel Sell'},
    ]);

    return (
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        multiple={true}
        min={0}
        mode={'BADGE'}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        closeAfterSelecting={true}
        style={styles.tokenPicker}
        dropDownContainerStyle={styles.dropDownContainer}
        placeholder={'Filter'}
      />
    );
  };
  return (
    <>
      <SafeAreaView style={styles.mainContainer}>
        <AppHeader showBackButton title={translate('wallet.common.detail')} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity activeOpacity={1} onPress={() => setPlay(!isPlay)}>
            {fileType === 'mp4' ||
            fileType === 'MP4' ||
            fileType === 'mov' ||
            fileType === 'MOV' ? (
              <View style={{...styles.modalImage}}>
                {/* <C_Image uri={thumbnailUrl} imageStyle={styles.modalImage} isContain /> */}
                <Video
                  ref={refVideo}
                  source={{uri: video}}
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
                  }}
                />
                {!isPlay && (
                  <View
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        width: SIZE(100),
                        height: SIZE(100),
                        backgroundColor: '#00000030',
                        borderRadius: SIZE(100),
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <PlayButtonIcon width={SIZE(100)} height={SIZE(100)} />
                    </View>
                  </View>
                )}
              </View>
            ) : (
              <C_Image
                uri={thumbnailUrl}
                imageStyle={styles.modalImage}
                isContain
              />
            )}
          </TouchableOpacity>
          <View style={styles.person}>
            <TouchableOpacity
              onPress={() => onProfile(false)}
              style={styles.personType}>
              <Image
                style={styles.iconsImage}
                source={
                  !creatorImage ? IMAGES.DEFAULTPROFILE : {uri: creatorImage}
                }
              />
              <View>
                <Text style={styles.personTypeText}>
                  {translate('common.creator')}
                </Text>
                <Text numberOfLines={1} style={styles.personName}>
                  {creator}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onProfile(false)}
              style={styles.personType}>
              <Image
                style={styles.iconsImage}
                source={
                  !creatorImage ? IMAGES.DEFAULTPROFILE : {uri: creatorImage}
                }
              />
              <View>
                <Text style={styles.personTypeText}>
                  {translate('common.collected')}
                </Text>
                <Text numberOfLines={1} style={styles.personName}>
                  {creator}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onProfile(true)}
              style={styles.personType}>
              <Image
                style={styles.iconsImage}
                source={!ownerImage ? IMAGES.DEFAULTPROFILE : {uri: ownerImage}}
              />
              <View>
                <Text style={styles.personTypeText}>
                  {translate('common.owner')}
                </Text>
                <Text numberOfLines={1} style={styles.personName}>
                  {owner}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.nftTitle}>KANON</Text>
          <Text style={styles.nftName}>{name}</Text>
          <Text style={styles.description}>{description}</Text>
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
          <View style={styles.bottomView}>
            <Text style={styles.count}>{'# 1 / 1'}</Text>
            <View style={styles.row}>
              <Text style={styles.priceUnit}>{'￥'}</Text>
              <Text style={styles.price}>{price ? price : 0}</Text>
            </View>
            {setNFTStatus() !== undefined && (
              <GroupButton
                leftText={
                  setNFTStatus() === 'onSell'
                    ? translate('common.cancelSell')
                    : setNFTStatus() === 'sell'
                    ? translate('common.sell')
                    : setNFTStatus() === 'buy'
                    ? translate('common.buy')
                    : setNFTStatus() === 'notOnSell'
                    ? translate('common.soonOnSell')
                    : translate('common.buy')
                }
                rightText={translate('wallet.common.offerPrice')}
                leftDisabled={setNFTStatus() === ''}
                leftLoading={buyLoading}
                onLeftPress={() => {
                  console.log('priceOfNft', priceNFT);
                  if (buyLoading) return;
                  // navigation.navigate('WalletConnect')
                  // if(price && price > 0){
                  if (setNFTStatus() === 'buy') {
                    setShowPaymentMethod(true);
                  } else if (setNFTStatus() === 'sell') {
                    navigation.navigate('sellNft');
                  }
                  // }
                }}
                leftHide={setNFTStatus() === undefined}
                rightHide
                onRightPress={() => navigation.navigate('MakeBid')}
              />
            )}
          </View>
          <NFTDetailDropdown
            title={translate('common.creator')}
            icon={details}
            containerStyles={{marginTop: hp(2)}}>
            <TouchableOpacity
              onPress={() => onProfile(false)}
              style={styles.personType}>
              <Image
                style={styles.creatorImage}
                source={
                  !creatorImage ? IMAGES.DEFAULTPROFILE : {uri: creatorImage}
                }
              />
              <View>
                <Text numberOfLines={1} style={styles.creatorName}>
                  {creator}
                </Text>
              </View>
            </TouchableOpacity>
          </NFTDetailDropdown>
          <NFTDetailDropdown title={translate('wallet.common.detail')} icon={details}>
            <View style={styles.rowContainer}>
              <TextView style={styles.rowText}>Contract Address</TextView>
              <TextView
                style={[styles.rowText, {color: Colors.themeColor}]}
                ellipsizeMode="middle"
                numberOfLines={1}>
                bsjabdJSddakdssddhsd135
              </TextView>
            </View>
            <View style={styles.rowContainer}>
              <TextView style={styles.rowText}>NFT ID</TextView>
              <TextView style={styles.rowText}>2568</TextView>
            </View>
            <View style={styles.rowContainer}>
              <TextView style={styles.rowText}>Token Standard</TextView>
              <TextView style={styles.rowText}>ERC721</TextView>
            </View>
            <View style={styles.rowContainer}>
              <TextView style={styles.rowText}>BlockChain Type</TextView>
              <TextView style={styles.rowText}>BINANCE</TextView>
            </View>
          </NFTDetailDropdown>
          <NFTDetailDropdown title="Bid History" icon={history}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <Table borderStyle={{borderWidth: 1, borderColor: Colors.GREY9}}>
                <Row
                  data={tableHead}
                  style={styles.head}
                  textStyle={styles.text}
                  widthArr={[75, 75, 75, 150]}
                />
                <Rows
                  data={tableData}
                  textStyle={styles.text}
                  widthArr={[75, 75, 75, 150]}
                />
              </Table>
            </ScrollView>
          </NFTDetailDropdown>
          <NFTDetailDropdown title={translate('common.tradingHistory')} icon={trading}>
            <PayableIn />
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{marginTop: hp(2)}}>
              <Table borderStyle={{borderWidth: 1, borderColor: Colors.GREY9}}>
                <Row
                  data={tradingTableHead}
                  style={styles.head}
                  textStyle={styles.text}
                  widthArr={[75, 75, 75, 75, 150]}
                />
                <Rows
                  data={tradingTableData}
                  textStyle={styles.text}
                  widthArr={[75, 75, 75, 75, 150]}
                />
              </Table>
            </ScrollView>
          </NFTDetailDropdown>
          <NFTDetailDropdown title="More from this collection" icon={grid} />
        </ScrollView>
      </SafeAreaView>
      <PaymentMethod
        visible={showPaymentMethod}
        price={price ? price : 0}
        chain={chain}
        onRequestClose={() => setShowPaymentMethod(false)}
      />
      <PaymentNow
        visible={showPaymentNow}
        price={price ? price : 0}
        chain={chain}
        NftId={_tokenId}
        ownerId={nonCryptoOwnerId}
        lastBidAmount={priceNFT}
        onRequestClose={() => {
          dispatch(setPaymentObject(null));
          setShowPaymentNow(false);
        }}
        onPaymentDone={() => {
          dispatch(setPaymentObject(null));
          setBuyLoading(true);
          getNonCryptoNFTOwner();
          setShowPaymentNow(false);
          setSuccessModalVisible(true);
        }}
      />

      <AppModal
        visible={successModalVisible}
        onRequestClose={() => setSuccessModalVisible(false)}>
        <SuccessModalContent
          onClose={() => setSuccessModalVisible(false)}
          onDonePress={() => {
            setSuccessModalVisible(false);
          }}
          sucessMsg={translate('wallet.common.purchasedSuccess')}
        />
      </AppModal>
    </>
  );
};

export default DetailScreen;
