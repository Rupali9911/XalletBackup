import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Video from 'react-native-fast-video';
import {
  Row, Table, Cell, TableWrapper
} from 'react-native-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { IMAGES, SIZE, SVGS } from 'src/constants';
import detailsImg from '../../../assets/images/details.png';
import grid from '../../../assets/images/grid.png';
import tradingImg from '../../../assets/images/trading.png';
import historyImg from '../../../assets/images/history.png'
import { networkType } from '../../common/networkType';
import { AppHeader, C_Image, GroupButton } from '../../components';
import AppModal from '../../components/appModal';
import TextView from '../../components/appText';
import NFTDetailDropdown from '../../components/NFTDetailDropdown';
import PaymentMethod from '../../components/PaymentMethod';
import PaymentNow from '../../components/PaymentMethod/payNowModal';
import SuccessModalContent from '../../components/successModal';
import Colors from '../../constants/Colors';
import { hp, wp } from '../../constants/responsiveFunct';
import { getAllCards, setPaymentObject } from '../../store/reducer/paymentReducer';
import { alertWithSingleBtn, divideNo, numberWithCommas } from '../../utils';
import { translate } from '../../walletUtils';
import { basePriceTokens } from '../../web3/config/availableTokens';
import { blockChainConfig, CDN_LINK } from '../../web3/config/blockChainConfig';
import { CardField, TabModal } from '../createNFTScreen/components';
import styles from './styles';
import AppButton from '../../components/appButton';
import CommonStyles from '../../constants/styles';
import { BASE_URL, NEW_BASE_URL } from '../../common/constants';
import { ActivityIndicator } from 'react-native-paper';
import { currencyInDollar } from '../wallet/functions';
import { getBaseCurrency } from '../../utils/parseNFTObj';
import AppBackground from '../../components/appBackground'
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import addComma from '../../utils/insertComma';
import { convertPrice, getPrice, collectionClick, firstCellData, fourthCellData } from '../../utils/detailHelperFunctions';
import { isChinaApp } from '../../web3/config/networkType';
import { handleLike } from '../discover/discoverItem';
import { Verifiedcollections } from '../../components/verifiedCollection';
import { CATEGORY_VALUE, compareAddress, FILTER_TRADING_HISTORY_OPTIONS, NFT_MARKET_STATUS, SORT_TRADING_HISTORY } from '../../constants';
import { ApiRequest } from '../../helpers/ApiRequest';
import NFTItem from '../../components/NFTItem';
import { getEventByValue, getFromAddress, getKeyEventByValue, getToAddress } from '../../constants/tradingHistory';
import { formatAddress } from '../../constants/addressFormat';
import { getDateString, getExpirationDate } from '../../constants/date';
import CountDown from 'react-native-countdown-component';
import { twitterLink } from '../../common/function';
import sendRequest from '../../helpers/AxiosApiRequest';
const Web3 = require('web3');
// =============== SVGS Destructuring ========================
const {
  PlayButtonIcon,
  HeartWhiteIcon,
  HeartActiveIcon,
  ThreeDotsVerticalIcon,
  TwiiterIcon,
  FacebookIcon,
  InstagramIcon,
  VerficationIcon
} = SVGS;

const DetailScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const scrollRef = useRef(null);
  const refVideo = useRef(null);

  // =============== Props Destructuring ========================
  const { item, setNftItem, networkName, collectionAddress, nftTokenId } = route.params;

  // =============== Getting data from reducer ========================
  const { paymentObject } = useSelector(state => state.PaymentReducer);
  const { userData, wallet } = useSelector(state => state.UserReducer);
  // const { selectedLanguageItem } = useSelector(state => state.LanguageReducer);

  //================== Components State Declaration ===================
  const [ownerDataN, setOwnerDataN] = useState();
  const [ownerN, setOwnerN] = useState();
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const [showPaymentNow, setShowPaymentNow] = useState(false);
  const [singleNFT, setSingleNFT] = useState({});
  const [nonCryptoOwnerId, setNonCryptoOwnerId] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [priceNFT, setPriceNFT] = useState('');
  const [priceNFTString, setPriceNFTString] = useState('');
  const [auctionETime, setAuctionETime] = useState('');
  const [buyLoading, setBuyLoading] = useState(false);
  const [availableTokens, setAvailableTokens] = useState([]);
  const [ownerAddress, setOwnerAddress] = useState('');
  const [baseCurrency, setBaseCurrency] = useState(null);
  const [sellDetails, setSellDetails] = useState([]);
  const [currencyPrices, setCurrencyPrices] = useState({});
  const [priceInDollar, setPriceInDollar] = useState('');
  const [nftPrice, setNFTPrice] = useState('');
  const [payableInCurrency, setPayableInCurrency] = useState('');
  const [payableInDollar, setPayableInDollar] = useState('');
  const [moreData, setMoreData] = useState([]);
  const [allowedTokenModal, setAllowedTokenModal] = useState(false);
  const [load, setLoad] = useState(true);
  const [payableIn, setPayableIn] = useState('');
  const [collectCreat, setcollectCreat] = useState();
  const [artistDetail, setArtistData] = useState();
  const [artist, setArtist] = useState();
  const [showThumb, toggleThumb] = useState(true);
  const [videoLoad, setVideoLoad] = useState(false);
  const [playVideoLoad, setPlayVideoLoad] = useState(false);
  const [videoLoadErr, setVideoLoadErr] = useState(false);
  const [videoKey, setVideoKey] = useState(1);
  const [playVideo, toggleVideoPlay] = useState(false);
  const [artistRole, setArtistRole] = useState('');
  const [tradingTableHead, setTradingTableHead] = useState([
    translate('common.event'),
    translate('common.price'),
    translate('common.from'),
    translate('common.to'),
    translate('common.date') + ' (YYYY/MM/DD)',
  ]);
  const [bidHistoryTableHead, setBidHistoryTableHead] = useState([
    translate('common.price'),
    translate('common.from'),
    translate('common.date'),
    translate('common.expiration')
  ]);
  const [filterTableList, setFilterTableList] = useState([]);
  const [tradingTableData1, setTradingTableData1] = useState([]);
  const [filterTableValue, setFilterTableValue] = useState([]);
  const [tradingTableData, setTradingTableData] = useState([]);
  const [tradingList, setTradingList] = useState([]);
  const [offerList, setOfferList] = useState([]);
  const [isLike, setLike] = useState();
  const [detailNFT, setDetailNFT] = useState({});

  // const [isContractOwner, setIsContractOwner] = useState(false);
  // const [isOwner, setIsOwner] = useState(false);
  // const [nFTOnAuction, setIsNFTOnAuction] = useState(false);
  // const [lBidAmount, setLastBidAmount] = useState('');
  // const [auctionInitiatorAdd, setAuctionInitiatorAdd] = useState('');
  // const [isForAward, setIsForAward] = useState(false);
  // const [videoURL, setVideoURL] = useState(mediaUrl);
  // const [highestBidderAddValue, setHighestBidderAddValue] = useState("");
  // const [bidPriceInDollar, setBidPriceInDollar] = useState('');
  // const [minBidPrice, setMinBidPrice] = useState('')
  // const fileType = mediaUrl ? mediaUrl?.split('.')[mediaUrl?.split('.').length - 1] : '';

  const categoryType = detailNFT?.category ? detailNFT?.category : item?.category;
  const mediaUrl = detailNFT?.mediaUrl ? detailNFT.mediaUrl : item?.mediaUrl;
  const thumbnailUrl = detailNFT?.thumbnailUrl
    ? detailNFT.thumbnailUrl :
    categoryType === CATEGORY_VALUE.music
      ? item?.mediaUrl
      : item?.thumbnailUrl
  // const nftTokenId = detailNFT?.tokenId ? detailNFT.tokenId : item?.tokenId
  const nftId = detailNFT?.nftId ? detailNFT.nftId : item?.nftId
  const network = detailNFT?.network ? detailNFT.network : item?.network
  // const collectionAddress = item?.collectionAddress ? item.collectionAddress : item?.collection?.address
  const userId = userData?.id;

  const hitSlop = { top: 5, bottom: 5, left: 5, right: 5 }

  //================== Unused State Declaration ===================
  // const [updateComponent, setUpdateComponent] = useState(false);
  // const [discount, setDiscount] = useState(false);
  // const [discountValue, setDiscountValue] = useState('');
  // const [sellDetailsFiltered, setSellDetailsFiltered] = useState([]);
  // const [bidHistory, setBidHistory] = useState([]);
  // const [tableData, setTableData] = useState([]);

  //===================== UseEffect Function =========================
  useEffect(() => {
    if (isFocused && networkName && collectionAddress && nftTokenId) {
      // // if (chainType) {
      // // if (chainAvailable) {
      // setBuyLoading(true);
      // checkNFTOnAuction();
      // getNonCryptoNFTOwner();
      // // }
      // if (data.token) {
      //   dispatch(getAllCards(data.token))
      //     .then(() => { })
      //     .catch(err => {
      //       console.log('error====', err);
      //     });
      // }
      // // }
      getTokenDetailsApi();
    }
  }, [isFocused, networkName, collectionAddress, nftTokenId]);

  // useEffect(() => {
  //   getCurrencyPrice(item?.price ? item.price : priceNFT);
  // }, [wallet, baseCurrency, availableTokens, priceNFT]);

  useEffect(() => {
    if (filterTableValue?.length && nftId) {
      // let filterValue = tradingTableData1.filter(o1 =>
      //   filterTableValue.some(o2 => o1[0] === o2),
      // );
      setTradingTableData([])
      getHistory('trading', filterTableValue);
      // setTradingTableData(filterValue)
    } else if (nftId) {
      //   setTradingTableData(tradingTableData1)
      getHistory('trading');
    }
  }, [filterTableValue, nftId]);

  useEffect(() => {
    if (nftId) {
      getHistory('bid')
      getOfferList()
      getRealtedNFT();
    }
  }, [nftId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // getRealtedNFT();
      // getNFTSellDetails();
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (paymentObject) {
      setShowPaymentNow(true);
    }
  }, [paymentObject]);

  useEffect(() => {
    // checkNFTOnAuction();
  }, [singleNFT]);

  //===================== API Call Functions =========================
  // const getOwnerDetailsById = async id => {
  //   const profileUrl = `${BASE_URL}/user/get-public-profile?userId=${id}`;
  //   try {
  //     let profile = await axios.get(profileUrl);
  //     setOwnerDataN(profile?.data?.data);
  //     setOwnerN(id);
  //   } catch (err) {
  //     // setLoad(false);
  //   }
  // };
  //<<<<<<<<<<<<<<<<<<<<<<<<<<<   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const getTokenDetailsApi = async () => {
    // let networkName = typeof network === 'string' ? network : network?.networkName
    let url = `${NEW_BASE_URL}/nfts/details`

    sendRequest({
      url,
      params: {
        networkName,
        collectionAddress,
        nftTokenId,
        userId
      }
    })
      .then(json => {
        console.log("🚀 ~ file: detail.js ~ line 223 ~  ~ json", json)
        if (typeof json === 'object' && json?.creator && json?.collection && json?.owner) {

          setNFTPrice(json?.price)
          setDetailNFT(json)
          setLike(Number(json?.isLike))

          setArtistData(json?.creator)
          setOwnerDataN(json?.owner)
          setOwnerAddress(json?.owner?.address)
          setcollectCreat(json?.collection)
        }
        setLoad(false);
      })
      .catch(err => {
        setLoad(false);
      });

    // let category = '2D';
    // let data = {
    //   tokenId: nft,
    //   networkType: networkType,
    //   type: category,
    //   chain: chainType,
    //   owner: wallet?.address,
    // };

    // let fetch_data_body = {
    //   method: 'POST',
    //   body: JSON.stringify(data),
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    // };
    // fetch(`${BASE_URL}/xanalia/getDetailNFT`, fetch_data_body)
    //   .then(response => response.json())
    //   .then(async res => {
    //     if (res.data.length > 0 && res.data !== 'No record found') {
    //       setNFTPrice(res.data[0]?.price);
    //       setDetailNFT(res.data[0])
    //       let data = await getNFTDetails(res.data[0]);
    //       setLike(data.like);
    //       // if (route.params.hasOwnProperty("routeName") && (route.params.routeName === "Search" || "Detail")) {
    //       let collection = data.offchain
    //         ? data.collectionOffChainId
    //         : data.collectionAdd.toString().split('-')[1];
    //       getCollectionByAddress(collection);
    //       let req_data = {
    //         owner: res.data[0]?.returnValues?.to?.toLowerCase(),
    //         token: 'HubyJ*%qcqR0',
    //       };

    //       let body = {
    //         method: 'POST',
    //         body: JSON.stringify(req_data),
    //         headers: {
    //           Accept: 'application/json',
    //           'Content-Type': 'application/json',
    //         },
    //       };
    //       await fetch(`${BASE_URL}/xanalia/getProfile`, body)
    //         .then(response => response.json())
    //         .then(response => {
    //           // res?.data?.success
    //           if (response.success) {
    //             if (response.data) {
    //               setArtist(res.data[0]?.returnValues?.to?.toLowerCase());
    //               setArtistData(response.data);
    //               // setLoad(false)
    //               setArtistRole(
    //                 response.data !== 'No record found'
    //                   ? response.data.role
    //                     ? response.data.role
    //                     : 'crypto'
    //                   : '',
    //               );
    //             }
    //           }
    //         });
    //       if (data.newprice && data.newprice.allowedCurrencies) {
    //         let currArray = data.newprice.allowedCurrencies.split('');
    //         let availableTokens = basePriceTokens.filter(
    //           token =>
    //             token.chain === chainType &&
    //             currArray.includes(token.order.toString()),
    //         );
    //         setAvailableTokens(availableTokens);
    //         setPayableIn(availableTokens[0].name);
    //       } else {
    //         setAvailableTokens([]);
    //       }
    //       let lastBid = data?.newprice?.bidData && data?.newprice?.bidData?.length > 0
    //         ? data?.newprice.bidData[data?.newprice?.bidData?.length - 1]
    //         : "";
    //       let highestBidderAdd = lastBid
    //         ? lastBid?.bidder
    //         : '0x0000000000000000000000000000000000000000';
    //       setHighestBidderAddValue(highestBidderAdd);
    //       setSingleNFT(data);
    //       setIsForAward(
    //         res?.data[0]?.award
    //           ? res?.data[0]?.award
    //           : res?.data[1]?.award
    //             ? res?.data[1]?.award
    //             : false,
    //       );
    //       //checkNFTOnAuction();
    //       getNFTSellDetails();
    //     } else if (res.data === 'No record found') {
    //       setLoad(false);
    //     }
    //   })
    // setLoad(false)
  };

  //====================== Render App Header Function =========================
  const renderAppHeader = () => {
    return (
      <AppHeader
        showBackButton
        title={translate('wallet.common.detail')}
        showRightComponent={
          <View style={{ paddingRight: 10 }}>
            <Menu
              onSelect={value => {
                alertWithSingleBtn(
                  translate('common.Confirm'),
                  value === 1
                    ? translate('common.nftReported')
                    : translate('common.userBlocked'),
                );
              }}>
              <MenuTrigger children={<ThreeDotsVerticalIcon />} />
              <MenuOptions>
                {renderMenuOption(1)}
                {renderMenuOption(2)}
              </MenuOptions>
            </Menu>
          </View>
        }
      />
    )
  }

  const renderMenuOption = (value) => {
    return (
      <MenuOption value={value}>
        <Text style={{ marginVertical: 10 }}>
          {value === 1 && translate('common.reportNft')}
          {value === 2 && translate('common.blockUser')}
        </Text>
      </MenuOption>
    )
  }

  //================== Render Banner Image/Video Function ==================
  const renderBannerImageVideo = () => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          if (showThumb) {
            setVideoLoad(true);
          } else {
            setPlayVideoLoad(true);
          }
          if (playVideo) {
            setVideoLoad(false);
            setPlayVideoLoad(false);
          }
          toggleVideoPlay(!playVideo);
        }}>
        {categoryType === CATEGORY_VALUE.movie ? (
          <View style={{ ...styles.modalImage }}>
            {showThumb && (
              <C_Image
                uri={thumbnailUrl}
                imageStyle={styles.modalImage}
              // isContain
              />
            )}
            <Video
              key={videoKey}
              ref={refVideo}
              source={{ uri: mediaUrl }}
              repeat
              playInBackground={false}
              paused={!playVideo}
              onProgress={r => {
                setVideoLoad(false);
                setPlayVideoLoad(false);
              }}
              resizeMode={'cover'}
              onError={error => {
                console.log(error);
                setVideoLoadErr(true);
              }}
              onReadyForDisplay={() => {
                toggleThumb(false);
              }}
              onLoad={data => {
                refVideo.current.seek(0);
              }}
              style={[styles.video]}
            />

            {!playVideo && !videoLoad && (
              <View style={styles.videoPlayIconCont}>
                <View style={styles.videoPlayIconChild}>
                  <PlayButtonIcon width={SIZE(100)} height={SIZE(100)} />
                </View>
              </View>
            )}
            {(videoLoad || playVideoLoad) && !videoLoadErr && (
              <View style={styles.videoPlayIconCont}>
                <View style={styles.videoPlayIconChild}>
                  <ActivityIndicator size="large" color="white" />
                </View>
              </View>
            )}
            {videoLoadErr && (
              <View style={styles.videoPlayIconCont}>
                <View style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                  <TouchableOpacity
                    onPress={() => {
                      setVideoLoadErr(false);
                      setVideoKey(videoKey + 1);
                    }}
                    style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
                    <Text style={styles.retry}>{translate('common.retryLoading')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ) : categoryType === CATEGORY_VALUE.music ? (
          <View style={{ ...styles.modalImage }}>
            <C_Image
              uri={thumbnailUrl}
              imageStyle={styles.modalImage}
            // isContain
            />
          </View>
        ) : (
          <C_Image
            uri={mediaUrl}
            imageStyle={styles.modalImage}
          // isContain
          />
        )}
      </TouchableOpacity>
    )
  }

  //================== Render Heart Icon Function ==================
  const renderHeartIcon = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          setLike(!isLike);
          handleLikeMethod();
        }}
        style={styles.likeButton}>
        {isLike ? <HeartActiveIcon /> : <HeartWhiteIcon />}
      </TouchableOpacity>
    )
  }

  //================== Render Creator, Collection and Owner Function ==================
  const renderCreatorCollectionOwnerName = () => {
    let isLaunchPad = false;
    if (detailNFT?.launchpadId) {
      isLaunchPad = true;
    }
    return (
      <View style={styles.person}>
        <TouchableOpacity
          onPress={() => {
            if (!disableCreator) {
              onProfile(false);
            }
          }}
          style={styles.personType}>
          {renderIconImage('creator', false)}
        </TouchableOpacity>

        <TouchableOpacity
          disabled={collectionClick(collectCreat)}
          onPress={() => {
            navigation.push('CollectionDetail', { networkName: detailNFT?.network?.networkName, contractAddress: detailNFT?.collection?.address,  launchpadId: detailNFT?.launchpadId, isLaunchPad });
          }}
          style={styles.personType}>
          {renderIconImage('collection', false)}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onProfile(true)}
          style={styles.personType}>
          {renderIconImage('owner', false)}
        </TouchableOpacity>
      </View>
    )
  }

  const renderIconImage = (key, fromNFT) => {
    return (
      <>
        <Image
          style={fromNFT ? styles.creatorImage : styles.iconsImage}
          source={
            key === 'creator' ?
              artistDetail?.avatar ? { uri: artistDetail.avatar } : IMAGES.DEFAULTPROFILE
              : key === 'collection'
                ? collectCreat ? { uri: collectCreat.avatar } : IMAGES.DEFAULTPROFILE
                : key === 'owner' &&
                  ownerDataN?.avatar ? { uri: ownerDataN.avatar } : IMAGES.DEFAULTPROFILE
          } />
        <View>
          {!fromNFT && <Text style={styles.personTypeText}>
            {key === 'creator'
              ? translate('common.creator')
              : key === 'collection'
                ? translate('wallet.common.collection')
                : key === 'owner' && translate('common.owner')}
          </Text>}
          {key !== 'collection' ?
            <Text numberOfLines={1} style={fromNFT ? styles.creatorName : styles.personName}>
              {key === 'creator' ? creatorName : key === 'owner' && ownerName}
            </Text>
            :
            <View style={CommonStyles.flexRow}>
              <Text numberOfLines={1} style={styles.collectionName}>
                {collectionName}
              </Text>
              {collectCreat?.isOfficial === 1 && <VerficationIcon />}
            </View>}
        </View>
      </>
    )
  }

  //================== Render Creator and NFT Name Function ==================
  const renderCreatorAndNFTName = () => {
    return (
      <>
        {!load && <Text style={styles.nftTitle} ellipsizeMode="tail">
          {creatorName}
        </Text>}
        {!load && <Text style={styles.nftName}>
          {detailNFT ? detailNFT?.name : item?.name}
        </Text >}
      </>
    )
  }

  //================== Render NFT Price and Tokens Function ==================
  const renderNFTPriceNToken = () => {
    if (detailNFT.marketNftStatus === NFT_MARKET_STATUS.NOT_ON_SALE) {
      return null
    }

    let label, tokenIcon, price, tokenPrice, priceToUsd;
    if (
      detailNFT.marketNftStatus === NFT_MARKET_STATUS.ON_AUCTION ||
      detailNFT.marketNftStatus === NFT_MARKET_STATUS.UPCOMMING_AUCTION ||
      detailNFT.marketNftStatus === NFT_MARKET_STATUS.CANCEL_AUCTION ||
      detailNFT.marketNftStatus === NFT_MARKET_STATUS.END_AUCTION
    ) {
      label = detailNFT?.saleData?.auction?.highestPrice ===
        detailNFT?.saleData?.auction?.startPrice
        ? translate('common.minimumBid') : translate('common.highestBid')
      tokenIcon = detailNFT?.saleData?.auction?.tokenIcon
      price = detailNFT?.saleData?.auction?.highestPrice
      tokenPrice = detailNFT?.saleData?.auction?.tokenPrice
      priceToUsd = detailNFT?.saleData?.auction?.priceToUsd
    } else {
      tokenIcon = detailNFT?.saleData?.fixPrice?.tokenIcon
      price = detailNFT?.saleData?.fixPrice?.price
      tokenPrice = detailNFT?.saleData?.fixPrice?.tokenPrice
      priceToUsd = detailNFT?.saleData?.fixPrice?.priceToUsd
    }

    return (
      <View style={{ paddingHorizontal: SIZE(12), paddingBottom: SIZE(5) }}>
        {label && <Text style={styles.labelText}>
          {label}
        </Text>}
        <View
          style={styles.priceView}>
          <Image
            style={styles.tokenIcon}
            source={{ uri: tokenIcon }}
          />

          {!load && <Text style={styles.price}>
            {price ? numberWithCommas(Number(price).toFixed(2)) : ''}
            <Text style={styles.priceUnit}>
              {` ${tokenPrice}`}
              <Text style={styles.dollarText}>
                {priceToUsd
                  ? ` ($${parseFloat(priceToUsd).toFixed(2)})`
                  : ''}
              </Text>
            </Text>
          </Text>}
        </View>
      </View>
    )
  }

  //================== Render Description Function ==================
  const renderDescription = () => {
    if (!load && detailNFT?.description) {
      return (
        <View>
          <Text style={styles.description}>
            {detailNFT?.description.trim()}
          </Text>
        </View>
      )
    }
    return null;
  }

  //================== Render Auction Time Function ==================
  // const renderAuctionTimeRemain = () => {
  //   return (
  //     <View style={styles.bidTimeContainer}>
  //       {isBiddingTimeEnd ? (
  //         <Text style={{ fontSize: 14 }}>
  //           {translate('common.biddingTime')}
  //         </Text>
  //       ) : (
  //         <View style={styles?.bidTitleView}>
  //           <Text style={styles.bidTitleTxt}>
  //             {translate('common.saleEndIn')} :
  //           </Text>
  //           <Text style={styles.bidTimeTxt}>
  //             {/* {getAuctionTimeRemain(item?.newprice ? item : singleNFT)} */}
  //           </Text>
  //         </View>
  //       )}
  //       <Text style={styles.highestBidTxt}>
  //         {translate('common.highhestBidder')}:{' '}
  //         {highestBidderAddValue
  //           ? highestBidderAddValue.toUpperCase().substring(0, 6)
  //           : '0X0000'}{' '}
  //       </Text>
  //     </View>
  //   )
  // }

  //================== Render Group Button Function ==================

  const renderContentAction = () => {
    switch (detailNFT?.marketNftStatus) {
      case NFT_MARKET_STATUS.NOT_ON_SALE:
        return <NotOnSaleAction />
      case NFT_MARKET_STATUS.ON_FIX_PRICE:
        return <OnFixPriceAction />
      case NFT_MARKET_STATUS.ON_AUCTION:
        return <OnAuctionAction />
      case NFT_MARKET_STATUS.CANCEL_AUCTION:
      case NFT_MARKET_STATUS.END_AUCTION:
        return <EndAuctionAction />
      default:
        return <UpCommingAuctionAction />
    }
  }


  const NotOnSaleAction = () => {
    if (compareAddress(wallet?.address, ownerAddress)) {
      return (
        <View style={styles.buybutton}>
          <GroupButton
            leftText={translate('common.sell')}
            leftDisabled={false}
            leftLoading={false}
            onLeftPress={() => { }}
            rightHide
          />
        </View>
      )
    }
    return (
      <View style={styles.buybutton}>
        <GroupButton
          leftText={translate('common.makeOffer')}
          leftDisabled={false}
          leftLoading={false}
          onLeftPress={() => { }}
          rightHide
        />
      </View>
    )
  }

  const OnFixPriceAction = () => {
    if (compareAddress(wallet?.address, ownerAddress)) {
      return (
        <View style={styles.buybutton}>
          <GroupButton
            leftText={translate('common.cancelResell')}
            leftDisabled={false}
            leftLoading={false}
            onLeftPress={() => { }}

            rightText={translate('common.editPrice')}
            rightDisabled={false}
            rightLoading={false}
            onrightPress={() => { }}
            rightStyle={styles.rightButton}
            rightTextStyle={styles.rightButtonText}
          />
        </View>
      )
    }
    return (
      <View style={styles.buybutton}>
        <GroupButton
          leftText={translate('common.buy')}
          leftDisabled={false}
          leftLoading={false}
          onLeftPress={() => { }}
          rightText={translate('common.makeOffer')}
          rightDisabled={false}
          rightLoading={false}
          onrightPress={() => { }}
          rightStyle={styles.rightButton}
          rightTextStyle={styles.rightButtonText}
        />
      </View>
    )
  }

  const BidInfo = ({ status }) => {
    const [isWaiting, setIsWaiting] = useState(false);
    const auction = detailNFT?.saleData?.auction
    const startTime = auction?.startTime
    const endTime = auction?.endTime

    const nowTimeStamp = Date.now()
    const startTimeStamp = new Date(startTime).getTime()
    const endTimeStamp = new Date(endTime).getTime()

    const finalTime = nowTimeStamp < startTimeStamp
      ? startTimeStamp : endTimeStamp

    const endCoundownTime = (finalTime - nowTimeStamp) / 1000;

    const CountdownTime = () => {
      return (
        <View>
          <CountDown
            size={18}
            until={endCoundownTime}
            onFinish={() => { }}
            digitStyle={styles.countDownDigit}
            digitTxtStyle={styles.countDownText}
            separatorStyle={styles.countDownText}
            timeToShow={['D', 'H', 'M', 'S']}
            timeLabels={{ d: null, h: null, m: null, s: null }}
            showSeparator
          />
        </View>
      )
    }

    const renderCoundown = () => {
      if (status === NFT_MARKET_STATUS.UPCOMMING_AUCTION) {
        return (
          <View style={CommonStyles.rowAlign}>
            {isWaiting ? (
              <Text style={styles.marginRight}>{translate('common.auctionBeingUpdatedPleasewait')}</Text>
            ) : (
              <>
                <Text style={styles.marginRight}>{translate('common.auctionStartIn')}:</Text>
                <CountdownTime />
              </>
            )}
          </View>
        )
      }
      if (status === NFT_MARKET_STATUS.ON_AUCTION) {
        return (
          <View style={CommonStyles.rowAlign}>
            {isWaiting ? (
              <Text style={styles.marginRight}>{translate('common.auctionBeingUpdatedPleasewait')}</Text>
            ) : (
              <>
                <Text style={styles.marginRight}>{translate('common.auctionEndIn')}:</Text>
                <CountdownTime />
              </>
            )}
          </View>
        )
      }
      return null
    }

    return (
      <View style={{ paddingTop: 5, paddingBottom: 10 }}>
        {renderCoundown()}
        {auction?.highestBidder ?
          <Text>
            {translate('common.highhestBidder')}:{' '}
            {auction?.highestBidder.slice(0, 7) + '...'}
          </Text>
          : null}
      </View>
    )
  }

  const OnAuctionAction = () => {
    return (
      <View>
        <BidInfo status={NFT_MARKET_STATUS.ON_AUCTION} />
        {compareAddress(wallet?.address, ownerAddress)
          ?
          <View style={CommonStyles.flexRow}>
            <GroupButton
              leftText={translate('common.cancelAuction')}
              leftDisabled={false}
              leftLoading={false}
              onLeftPress={() => { }}
              rightHide
            />
          </View>
          :
          <View style={CommonStyles.flexRow}>
            <GroupButton
              leftText={translate('common.placeABid')}
              leftDisabled={false}
              leftLoading={false}
              onLeftPress={() => { }}
              rightHide
            />
          </View>
        }
      </View>
    )
  }

  const EndAuctionAction = () => {
    return (
      <View>
        <BidInfo status={NFT_MARKET_STATUS.CANCEL_AUCTION} />
        {compareAddress(wallet?.address, ownerAddress)
          ?
          <View style={CommonStyles.flexRow}>
            <GroupButton
              leftText={translate('common.reclaimNFT')}
              leftDisabled={false}
              leftLoading={false}
              onLeftPress={() => { }}
              rightHide
            />
          </View>
          :
          <View style={CommonStyles.flexRow}>
            <GroupButton
              leftText={translate('common.auctionEnd')}
              leftDisabled={false}
              leftLoading={false}
              onLeftPress={() => { }}
              rightHide
            />
          </View>
        }
      </View>
    )
  }

  const UpCommingAuctionAction = () => {
    return (
      <View>
        <BidInfo status={NFT_MARKET_STATUS.UPCOMMING_AUCTION} />
        {compareAddress(wallet?.address, ownerAddress) ?
          <GroupButton
            leftText={translate('common.cancelAuction')}
            leftDisabled={false}
            leftLoading={false}
            onLeftPress={() => { }}
            rightHide
          /> : null}
      </View>
    )
  }

  // const renderGroupButton = () => {
  //   return (
  //     <GroupButton
  //       leftText={
  //         setNFTStatus() === 'onSell'
  //           ? translate('common.cancelSell')
  //           : setNFTStatus() === 'sell'
  //             ? singleNFT?.secondarySales
  //               ? translate('wallet.common.reSell')
  //               : translate('common.sell')
  //             : setNFTStatus() === 'buy'
  //               ? translate('common.buy')
  //               : setNFTStatus() === 'notOnSell'
  //                 ? translate('common.soonOnSell')
  //                 : translate('common.buy')
  //       }
  //       rightText={translate('wallet.common.offerPrice')}
  //       leftDisabled={
  //         setNFTStatus() === '' || setNFTStatus() === 'notOnSell'
  //       }
  //       leftLoading={buyLoading}
  //       onLeftPress={() => {
  //         if (buyLoading) return;
  //         // navigation.navigate('WalletConnect')
  //         // if(price && price > 0){
  //         if (setNFTStatus() === 'buy') {
  //           // if (payableIn === translate('common.allowedcurrency')) {
  //           //   alertWithSingleBtn(
  //           //     translate('wallet.common.alert'),
  //           //     translate('common.Selectcurrencypopup'),
  //           //   );
  //           // } else {
  //           setShowPaymentMethod(true);
  //           // }
  //         } else if (setNFTStatus() === 'sell') {
  //           navigation.navigate('sellNft', { nftDetail: singleNFT });
  //         }
  //         // }
  //       }}
  //       leftHide={setNFTStatus() === undefined}
  //       rightHide
  //       onRightPress={() => navigation.navigate('MakeBid')}
  //     />
  //   )
  // }

  //======= Render App Button NFT Price and Edit Price Function ========
  // const renderNFTPriceNeditPriceAppButton = () => {
  //   return (
  //     <View
  //       style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
  //       <AppButton
  //         label={
  //           (nftPrice
  //             ? numberWithCommas(
  //               parseFloat(Number(nftPrice).toFixed(4)),
  //             )
  //             : 0) +
  //           ' ' +
  //           baseCurrency?.key
  //         }
  //         containerStyle={[styles.button, CommonStyles.outlineButton]}
  //         labelStyle={[CommonStyles.outlineButtonLabel]}
  //         onPress={() => { }}
  //       />
  //       <AppButton
  //         label={translate('common.editPrice')}
  //         containerStyle={styles.button}
  //         labelStyle={CommonStyles.buttonLabel}
  //         onPress={() => { }}
  //       />
  //     </View>
  //   )
  // }

  //===================== Render Bid History Function =======================
  const noDataRender = (history) => {
    return (
      <Cell
        style={styles.emptyData(history)}
        data={translate('common.noDataFound')}
      />
    )
  }

  const renderBidNTradingHistory = (history) => {
    let listData = history === 'bid' ? sellDetails : history === 'offers' ? offerList : tradingTableData
    return (
      <NFTDetailDropdown
        title={history === 'bid'
          ? translate('wallet.common.bidHistory')
          : history === 'offers'
            ? 'Offers'
            : translate('common.tradingHistory')
        }
        containerChildStyles={{
          height:
            listData?.length === 0
              ? history === 'trading' ? hp(28) : hp(19)
              : listData?.length < 5
                ? hp(16) + (hp(4) * (history === 'trading' && listData.length <= 3 ? 3 : listData?.length))
                : hp(35.7),
        }}
        icon={
          history === 'bid' ? historyImg
            : history === 'offers' ? tradingImg : detailsImg
        }
      >
        {history === 'trading' &&
          <Filters
            value={filterTableValue}
            setValue={setFilterTableValue}
            setData={setFilterTableList}
            data={filterTableList}
          />}
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          // nestedScrollEnabled={true}
          style={{ marginVertical: hp(2) }}>
          <Table
            borderStyle={styles.cellBorderStyle}>
            <Row
              data={history === 'trading' ? tradingTableHead : bidHistoryTableHead}
              style={styles.head}
              textStyle={styles.text}
              widthArr={history === 'trading' ? [200, 130, 180, 180, 200] : [130, 180, 180, 200]}
            />
            {history === 'bid'
              ? sellDetails?.length > 0
                ? (sellDetails?.map((rowData, rowIndex) => {
                  return (
                    <TableWrapper
                      key={rowIndex}
                      style={CommonStyles.flexRow}>
                      {rowData?.map((cellData, cellIndex) => {
                        return (
                          renderCell(cellIndex, cellData, rowIndex)
                        );
                      })}
                    </TableWrapper>
                  );
                })) : (
                  noDataRender()
                )
              : history === 'offers'
                ? offerList?.length > 0
                  ? (offerList?.map((rowData, rowIndex) => {
                    let temprowData = rowData.slice(0, 4);
                    let iconUri = rowData.find((e, i) => i === 4);
                    return (
                      <TableWrapper
                        key={rowIndex}
                        style={CommonStyles.flexRow}>
                        {temprowData?.map((cellData, cellIndex) => {
                          return (
                            renderCell(cellIndex, cellData, rowIndex, iconUri)
                          );
                        })}
                      </TableWrapper>
                    );
                  })) : (
                    noDataRender()
                  )
                : tradingTableData.length > 0 ? (
                  tradingTableData?.map((rowData, rowIndex) => {
                    return (
                      <TableWrapper
                        key={rowIndex}
                        style={CommonStyles.flexRow}>
                        {rowData?.map((cellData, cellIndex) => {
                          let wid;
                          if (cellIndex === 0) {
                            wid = 200;
                          }
                          if (cellIndex === 1) {
                            wid = 130;
                          }
                          if (cellIndex === 2) {
                            wid = 180;
                          }
                          if (cellIndex === 3) {
                            wid = 180;
                          }
                          if (cellIndex === 4) {
                            wid = 200;
                          }
                          return (
                            <Cell
                              key={cellIndex}
                              data={
                                (cellIndex == 2 || cellIndex == 3) && cellData !== 'Null Address' ? (
                                  renderAddress(cellData)
                                ) : (
                                  cellData
                                )
                              }
                              textStyle={styles.text}
                              width={wid}
                            />
                          );
                        })}
                      </TableWrapper>
                    );
                  })
                ) : (
                  noDataRender(history)
                )}
          </Table>
        </ScrollView>
      </NFTDetailDropdown >
    )
  }

  const renderAddress = (cellData) => {
    return (
      <TouchableOpacity
        disabled={!cellData}
        onPress={() =>
          navigation.push('ArtistDetail', { id: cellData })
        }>
        <Text
          numberOfLines={1}
          style={[styles.text, styles.themeColor]}>
          {formatAddress(cellData)}
        </Text>
      </TouchableOpacity>
    )
  }

  const renderCell = (index, cellData, rowIndex, iconUri) => {
    return (
      <Cell
        key={rowIndex}
        data={
          index === 0 && iconUri ?
            <View style={CommonStyles.rowAlign}>
              <Image
                style={styles.networkIcon}
                source={{ uri: iconUri }}
              />
              <Text>
                {cellData}
              </Text>
            </View>
            : index === 1
              ? renderAddress(cellData)
              : cellData
        }
        borderStyle={styles.cellBorderStyle}
        textStyle={styles.text}
        width={index === 0 ? 130 : index === 1 ? 180 : index === 2 ? 180 : 200}
      />
    )
  }

  // const renderCell = (index, rowData, rowIndex) => {
  //   return (
  //     <Cell
  //       key={rowIndex}
  //       data={
  //         index === '1'
  //           ? firstCellData(rowData)
  //           : index === '2'
  //             ? renderSecondNThird('2', rowData)
  //             : index === '3'
  //               ? renderSecondNThird('3', rowData)
  //               : fourthCellData(rowData)
  //       }
  //       borderStyle={styles.cellBorderStyle}
  //       textStyle={styles.text}
  //       width={index === '1' ? 130 : index === '2' ? 180 : index === '3' ? 180 : 200}
  //     />
  //   )
  // }

  // const renderSecondNThird = (key, detail) => {
  //   return (
  //     <TouchableOpacity
  //       onPress={() => {
  //         key === '2' ? (detail?.seller && !isChinaApp) && goToOwnerProfile(detail?.seller, 'pro') : detail?.owner && goToOwnerProfile(detail?.owner, 'pro');
  //       }}>
  //       <Text numberOfLines={1} style={[styles.text, { color: '#00A8FF' }]}>
  //         {(key === '2' && !isChinaApp) ? detail?.seller ? showSeller(detail?.seller) : 'Null Address' : detail?.owner
  //           ? detail?.owner?.includes('0x')
  //             ? detail?.owner?.substring(0, 6)
  //             : detail?.owner
  //           : ''}
  //       </Text>
  //     </TouchableOpacity>
  //   )
  // }

  // const goToOwnerProfile = (id, profile) => {
  //   if (id?.toLowerCase() === walletAddressForNonCrypto?.toLowerCase()) {
  //     return;
  //   }
  //   if (profile === 'pro') {
  //     navigation.push('ArtistDetail', { id: id });
  //   }
  // };

  const showContractAddress = (item) => {
    return (typeof item?.collection === 'object'
      ? item?.collection?.address
      : item?.collection ?
        item?.collection?.substring(0, 5) +
        ' ... ' +
        item.collection.slice([item.collection.length - 4])
        : MarketContractAddress)
  }

  //===================== Render Creator NFTDetailDropdown Function =======================
  const renderCreatorNFTDetailDropdown = () => {
    return (
      <NFTDetailDropdown
        title={translate('common.creator')}
        icon={detailsImg}>
        <TouchableOpacity
          onPress={() => {
            if (!disableCreator) {
              onProfile(false);
            }
          }}
          style={styles.personType}>
          {renderIconImage('creator', true)}
        </TouchableOpacity>

        {detailNFT?.creator?.description ?
          <TextView style={[styles.rowText, { marginTop: SIZE(10) }]}>
            {detailNFT?.creator?.description}
          </TextView>
          : null}
        {renderSocialLinks()}
      </NFTDetailDropdown>
    )
  }

  const renderSocialLinks = () => {
    let twitterFullLink = twitterLink(detailNFT?.creator?.twitterLink)
    return (
      <View style={styles.socialLinksWrap}>
        {detailNFT?.creator?.twitterLink ? (
          <TouchableOpacity
            style={styles.marginRight}
            hitSlop={hitSlop}
            onPress={() => Linking.openURL(twitterFullLink)}>
            <TwiiterIcon />
          </TouchableOpacity>
        ) : null}
        {detailNFT?.creator?.instagramLink ? (
          <TouchableOpacity
            hitSlop={hitSlop}
            style={{ marginRight: 6 }}
            onPress={() => Linking.openURL(detailNFT?.creator?.instagramLink)}>
            <InstagramIcon />
          </TouchableOpacity>
        ) : null}
        {detailNFT?.creator?.facebookLink ? (
          <TouchableOpacity
            hitSlop={hitSlop}
            onPress={() => Linking.openURL(detailNFT?.creator?.facebookLink)}>
            <FacebookIcon />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  //===================== Render Detail NFTDetailDropdown Function =======================
  const renderDetailNFTDetailDropdown = () => {
    return (
      <NFTDetailDropdown
        title={translate('wallet.common.detail')}
        icon={detailsImg}>
        {renderDetail('wallet.common.contractAddress', 'address', showContractAddress(item))}
        {renderDetail('wallet.common.nftId', '', _tokenId)}
        {renderDetail('wallet.common.tokenStandard', '', 'ERC-721')}
        {renderDetail('wallet.common.blockChainType', 'blockChainType', network?.networkName)}
      </NFTDetailDropdown>
    )
  }
  const renderDetail = (translateKey, key, value) => {
    let translateWord = translateKey;
    return (
      <View style={styles.rowContainer}>
        <TextView style={styles.rowText}>
          {translate(translateWord)}
        </TextView>
        <TextView
          style={key === '' ? styles.rowText : key === 'blockChainType' ? [styles.rowText, { textTransform: 'uppercase' }] : [
            styles.rowTextcontractaddress,
            { color: Colors.themeColor },
          ]}
          ellipsizeMode="middle"
          numberOfLines={1}>
          {/* {MarketContractAddress} */}
          {value}
        </TextView>
      </View>
    )
  }

  //=============== Render More from this collection Function ===============
  const renderMoreCollection = () => {
    let isLaunchPad = false;
    if (detailNFT?.launchpadId) {
      isLaunchPad = true;
    }
    return (
      <NFTDetailDropdown
        title={translate('wallet.common.collectionHint')}
        icon={detailsImg}
        containerStyles={{ width: wp(100) }}
        containerChildStyles={styles.containerChildStyles}
      >
        {moreData.length !== 0 ? (
          <>
            <FlatList
              data={moreData}
              numColumns={2}
              horizontal={false}
              renderItem={memoizedItem}
              keyExtractor={(v, i) => 'item_' + i}
            />
            <GroupButton
              leftText={translate('common.viewAllCollection')}
              style={styles.viewAllBtn}
              leftStyle={styles.viewAllBtnInner}
              leftTextStyle={{ color: Colors.BLUE4 }}
              onLeftPress={() => navigation.push('CollectionDetail', { networkName: detailNFT?.network?.networkName, contractAddress: detailNFT?.collection?.address,  launchpadId: detailNFT?.launchpadId, isLaunchPad })}
              rightHide
            />
          </>
        ) : (
          <View style={styles.sorryMessageCont}>
            <Text style={styles.sorryMessage}>
              {translate('common.noNFT')}
            </Text>
          </View>
        )}
      </NFTDetailDropdown>
    )
  }

  const renderItem = ({ item }) => {
    return (
      <NFTItem
        item={item}
        image={item?.mediaUrl}
        onPress={() => {
          navigation.push('CertificateDetail', {
            networkName: item?.network?.networkName,
            collectionAddress: item?.collection?.address,
            nftTokenId: item?.tokenId,
          });
        }}
      />
    )
  }

  // const renderItem = ({ item, index }) => {
  //   // let findIndex = moreData.findIndex(x => x.id === item.id);
  //   // if (item && item?.hasOwnProperty('metaData') && item?.metaData) {
  //   // it's temporary fix
  //   // const imageUri = item?.thumbnailUrl;

  //   const mediaUrl = item?.mediaUrl;
  //   return (
  //     <TouchableOpacity
  //       key={index}
  //       onPress={() => {
  //         setVideoURL(null);
  //         navigation.push('CertificateDetail', { item: item });
  //       }}
  //       style={styles.listItem}>
  //       <C_Image
  //         uri={mediaUrl}
  //         category={item?.category}
  //         imageStyle={styles.listImage}
  //       />
  //     </TouchableOpacity>
  //   );
  //   // }
  // };

  const memoizedItem = useMemo(() => renderItem, [moreData]);

  //=============== Render Payment Method Function ===============
  // const renderPaymentMethod = () => {
  //   return (
  //     <PaymentMethod
  //       visible={showPaymentMethod}
  //       payableIn={payableIn}
  //       price={
  //         payableIn && data?.user?.role === 'crypto'
  //           ? payableInCurrency
  //           : priceNFT
  //         //  nftPrice
  //         //   ? nftPrice
  //         //   : 0
  //       }
  //       priceStr={priceNFTString}
  //       priceInDollar={
  //         payableIn && data?.user?.role === 'crypto'
  //           ? payableInDollar
  //           : priceInDollar
  //       }
  //       baseCurrency={baseCurrency}
  //       allowedTokens={availableTokens}
  //       ownerAddress={
  //         ownerAddress?.includes('0x')
  //           ? ownerAddress
  //           : walletAddressForNonCrypto
  //       }
  //       id={singleNFT.id}
  //       collectionAddress={collectionAddress}
  //       chain={chainType}
  //       onRequestClose={() => setShowPaymentMethod(false)}
  //     />
  //   )
  // }

  //=============== Render Payment Now Function ===============
  // const renderPaymentNow = () => {
  //   return (
  //     <PaymentNow
  //       visible={showPaymentNow}
  //       price={
  //         payableIn && data?.user?.role === 'crypto'
  //           ? payableInCurrency
  //           : nftPrice
  //             ? nftPrice
  //             : 0
  //       }
  //       priceInDollar={
  //         payableIn && data?.user?.role === 'crypto'
  //           ? payableInDollar
  //           : priceInDollar
  //       }
  //       chain={chainType}
  //       NftId={_tokenId}
  //       IdWithChain={nft}
  //       ownerId={nonCryptoOwnerId}
  //       ownerAddress={
  //         ownerAddress.includes('0x') ? ownerAddress : walletAddressForNonCrypto
  //       }
  //       baseCurrency={baseCurrency}
  //       collectionAddress={collectionAddress}
  //       lastBidAmount={priceNFT}
  //       onRequestClose={() => {
  //         dispatch(setPaymentObject(null));
  //         setShowPaymentNow(false);
  //       }}
  //       onPaymentDone={() => {
  //         dispatch(setPaymentObject(null));
  //         setBuyLoading(true);
  //         setShowPaymentNow(false);
  //         setSuccessModalVisible(true);
  //       }}
  //     />
  //   )
  // }

  //=============== Render Tab Modal Function ===============
  // const renderTabModal = () => {
  //   return (
  //     <TabModal
  //       modalProps={{
  //         isVisible: allowedTokenModal,
  //         onBackdropPress: () => {
  //           setAllowedTokenModal(false);
  //         },
  //       }}
  //       data={{ data: availableTokens }}
  //       title={translate('common.allowedcurrency')}
  //       itemPress={async tradeCurr => {
  //         setAllowedTokenModal(false);
  //         await calculatePrice(tradeCurr);
  //       }}
  //       renderItemName={'name'}
  //     />
  //   )
  // }

  //=============== Render Tab Modal Function ===============
  const renderAppModal = () => {
    return (
      <AppModal visible={successModalVisible} onRequestClose={closeSuccess}>
        <SuccessModalContent
          onClose={closeSuccess}
          onDonePress={closeSuccess}
          sucessMsg={translate('wallet.common.purchasedSuccess')}
        />
      </AppModal>
    )
  }

  //=================== Other Functions =====================
  let disableCreator = false;
  let isBiddingTimeEnd = false;
  let doComponentUpdate = false;
  // const nft = item?.tokenId || item?.collectionAdd;
  // let params = nft?.toString().split('-');
  let _tokenId = item?.tokenId
  let chainType,
    ERC721Abi,
    ERC721Address,
    MarketPlaceAbi,
    MarketContractAddress,
    providerUrl,
    walletAddressForNonCrypto,
    chainAvailable;
  // if (params?.length > 2) {
  //   chainType = params[0];
  //   // collectionAddress = params[1];
  //   _tokenId = params[2];

  //   let getBlockChainConfig = blockChainConfig.find(
  //     v => v.key.toLowerCase() === chainType.toLowerCase(),
  //   );
  //   ERC721Abi = getBlockChainConfig.erc721ConConfig.abi;
  //   ERC721Address = getBlockChainConfig.erc721ConConfig.add;
  //   MarketPlaceAbi = getBlockChainConfig.marketConConfig.abi;
  //   MarketContractAddress = getBlockChainConfig.marketConConfig.add;
  //   providerUrl = getBlockChainConfig.providerUrl;
  //   chainAvailable = true;
  //   walletAddressForNonCrypto = getBlockChainConfig.walletAddressForNonCrypto;
  // }
  //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  let ownerName = ownerDataN?.name?.trim()
    ? ownerDataN.name
    : ownerDataN?.address?.includes('0x')
      ? ownerDataN.address.substring(0, 6)
      : '---'
  // ownerDataN && typeof ownerDataN === 'object'
  //   ? ownerDataN?.role === 'crypto'
  //     ? ownerDataN?.title?.trim()
  //       ? ownerDataN.title
  //       : ownerDataN?.name?.trim()
  //         ? ownerDataN.name
  //         : ownerDataN?.username?.trim()
  //           ? ownerDataN.username.substring(0, 6)
  //           : ownerN
  //             ? ownerN.substring(0, 6)
  //             : ''
  //     : ownerDataN?.username?.trim()
  //       ? ownerDataN.username
  //       : ownerDataN?.name?.trim()
  //         ? ownerDataN.name
  //         : ownerDataN?.title?.trim()
  //           ? ownerDataN.title
  //           : ownerN
  //             ? ownerN.substring(0, 6)
  //             : ''
  //   : ownerN
  //     ? ownerN.substring(0, 6)
  //     : '';

  // Crypto user: title/name/username
  // Non Crypto user: username/name/title

  // const getArtistName = artistId => {
  //   return artistId ===
  //     '0x913d90bf7e4A2B1Ae54Bd5179cDE2e7cE712214A'.toLowerCase() ||
  //     artistId === '0xf45C0d38Df3eac6bf6d0fF74D53421Dc34E14C04'.toLowerCase() ||
  //     artistId === '0x77FFb287573b46AbDdcEB7F2822588A847358933'.toLowerCase() ||
  //     artistId === '0xfaae9d5b6f4779689bd273ab30f78beab3a0fc8f'.toLowerCase()
  //     ? ((disableCreator = true), collectCreat?.creator)
  //     : artistId
  //       ? artistId?.substring(0, 6)
  //       : '';
  // };

  let creatorName = artistDetail?.name?.trim()
    ? artistDetail.name
    : artistDetail?.address?.includes('0x')
      ? artistDetail.address.substring(0, 6)
      : '---'
  // artistDetail && typeof artistDetail === 'object'
  //   ? artistDetail?.role === 'crypto'
  //     ? artistDetail?.title?.trim()
  //       ? artistDetail.title
  //       : artistDetail?.name?.trim()
  //         ? artistDetail.name
  //         : artistDetail?.username?.trim()
  //           ? artistDetail.username.substring(0, 6)
  //           : getArtistName(artist)
  //     : artistDetail?.username?.trim()
  //       ? artistDetail.username
  //       : artistDetail?.name?.trim()
  //         ? artistDetail.name
  //         : artistDetail?.title?.trim()
  //           ? artistDetail.title
  //           : artist
  //             ? artist?.substring(0, 6)
  //             : ''
  //   : getArtistName(artist);

  let collectionName = collectCreat?.name
    ? collectCreat.name
    : collectCreat?.address?.includes('0x')
      ? collectCreat.address.substring(0, 6)
      : '---'

  //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // const checkNFTOnAuction = () => {
  //   const setAuctionVariables = (
  //     auctionInitiatorAdd = '',
  //     highestBidderAdd = '',
  //     minBidPrice = '',
  //     auctionSTime = '',
  //     auctionETime = '',
  //     lastBidAmount = '',
  //     isNFTOnAuction = false,
  //   ) => {
  //     setHighestBidderAddValue(highestBidderAdd);
  //     setIsNFTOnAuction(isNFTOnAuction);
  //     setMinBidPrice(minBidPrice)
  //     setAuctionInitiatorAdd(auctionInitiatorAdd);
  //     setAuctionETime(auctionETime);
  //     setLastBidAmount(lastBidAmount);
  //   };
  //   let web3 = new Web3(providerUrl);
  //   let MarketPlaceContract = new web3.eth.Contract(
  //     MarketPlaceAbi,
  //     MarketContractAddress,
  //   );
  //   MarketPlaceContract.methods
  //     .getSellDetail(collectionAddress, _tokenId)
  //     .call(async (err, res) => {
  //       if (!err) {
  //         let baseCurrency = [];
  //         if (res[6]) {
  //           baseCurrency = basePriceTokens.filter(
  //             token => token.chain === chainType && token.order === 1,
  //           );
  //           setBaseCurrency(baseCurrency[0]);
  //         } else {
  //           baseCurrency = basePriceTokens.filter(
  //             token =>
  //               token.chain === chainType && token.order === parseInt(res[7]),
  //           );
  //           setBaseCurrency(baseCurrency[0]);
  //         }
  //         if (parseInt(res[5]) * 1000 > 0) {
  //           calculateBidPriceDollar(res[4], res[0]);
  //           setAuctionVariables(
  //             res[0],
  //             res[3],
  //             divideNo(res[4]),
  //             parseInt(res[5]) * 1000,
  //             parseInt(res[2]) * 1000,
  //             divideNo(res[1]),
  //             true,
  //           );
  //         } else {
  //           setAuctionVariables();
  //         }
  //       } else {
  //         setAuctionVariables();
  //       }
  //     });
  // };

  //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // const getAuctionTimeRemain = item => {
  //   if (
  //     item?.newprice &&
  //     item?.newprice?.endTime &&
  //     new Date(item?.newprice?.endTime) < new Date().getTime()
  //   ) {
  //     isBiddingTimeEnd = true;
  //     return translate('common.biddingTime');
  //   }
  //   if (item?.newprice && item?.newprice?.endTime) {
  //     const diff =
  //       new Date(item?.newprice?.endTime).getTime() - new Date().getTime();
  //     if (diff <= 0) {
  //       return null;
  //     } else {
  //       isBiddingTimeEnd = false;
  //       let daysDiff =
  //         (new Date(item?.newprice?.endTime).getTime() - new Date().getTime()) /
  //         (1000 * 60 * 60 * 24);
  //       let hoursDiff = (daysDiff - parseInt(daysDiff)) * 24;
  //       let minDiff = (hoursDiff - parseInt(hoursDiff)) * 60;
  //       let secDiff = (minDiff - parseInt(minDiff)) * 60;
  //       const daysLeft =
  //         (parseInt(daysDiff) * 24 * 60 * 60 * 1000) / (24 * 60 * 60 * 1000);
  //       const hourLeft =
  //         (parseInt(hoursDiff) * 60 * 60 * 1000) / (60 * 60 * 1000);
  //       const minLeft = (parseInt(minDiff) * 60 * 1000) / (60 * 1000);
  //       const secLeft = (parseInt(secDiff) * 1000) / 1000;
  //       if (daysLeft > 0) {
  //         return ` ${daysLeft >= 10 ? daysLeft : "0" + daysLeft} ${translate('common.day').toUpperCase()}`;
  //       } else {
  //         doComponentUpdate = true;
  //         return ` ${hourLeft >= 10 ? hourLeft : '0' + hourLeft} ${translate(
  //           'common.hours',
  //         )}  ${minLeft >= 10 ? minLeft : '0' + minLeft} ${translate(
  //           'common.min',
  //         )}  ${secLeft >= 10 ? secLeft : '0' + secLeft} ${translate(
  //           'common.sec',
  //         )}`;
  //       }
  //     }
  //   }
  //   return null;
  // };

  //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // const getNonCryptoNFTOwner = async () => {
  //   // let tokenId = "317";
  //   let web3 = new Web3(providerUrl);
  //   let MarketPlaceContract = new web3.eth.Contract(
  //     MarketPlaceAbi,
  //     MarketContractAddress,
  //   );
  //   if (MarketPlaceContract.methods.getNonCryptoOwner) {
  //     MarketPlaceContract.methods
  //       .getNonCryptoOwner(collectionAddress, _tokenId)
  //       .call(async (err, res) => {
  //         if (res) {
  //           setNonCryptoOwnerId(res);
  //           getOwnerDetailsById(res);
  //           lastOwnerOfNFTNonCrypto(res);
  //           await getTokenDetailsApi(false);
  //         } else if (!res) {
  //           lastOwnerOfNFT();
  //           await getTokenDetailsApi();
  //         } else if (err) {
  //           // setLoad(false);
  //         }
  //       });
  //   } else {
  //     lastOwnerOfNFT();
  //     await getTokenDetailsApi();
  //   }
  // };

  //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // const lastOwnerOfNFTNonCrypto = nonCryptoOwner => {
  //   let _data = singleNFT;
  //   let web3 = new Web3(providerUrl);
  //   let ERC721Contract = new web3.eth.Contract(ERC721Abi, collectionAddress);

  //   let MarketPlaceContract = new web3.eth.Contract(
  //     MarketPlaceAbi,
  //     MarketContractAddress,
  //   );
  //   ERC721Contract.methods.ownerOf(_tokenId).call((err, res) => {
  //     if (!err) {
  //       _data.owner_address = res;
  //       MarketPlaceContract.methods
  //         .getSellDetail(collectionAddress, _tokenId)
  //         .call(async (err, res) => {
  //           // return ;
  //           if (!err) {
  //             let priceOfNft = res[1] / 1e18;
  //             if (wallet?.address) {
  //               // if (priceOfNft === 0) {
  //               if (res[0] === '0x0000000000000000000000000000000000000000') {
  //                 setPriceNFT(priceOfNft);
  //                 setPriceNFTString(res[1]);
  //                 setIsContractOwner(
  //                   res[0].toLowerCase() === wallet.address.toLowerCase() ||
  //                     (res[0].toLowerCase() ===
  //                       walletAddressForNonCrypto.toLowerCase() &&
  //                       data &&
  //                       nonCryptoOwnerId.toLowerCase() === data.user._id)
  //                     ? true
  //                     : false,
  //                 );
  //                 setIsOwner(
  //                   (_data.owner_address.toLowerCase() ===
  //                     wallet.address.toLowerCase() &&
  //                     res[1] !== '') ||
  //                     (data &&
  //                       _data.owner_address.toLowerCase() ===
  //                       walletAddressForNonCrypto.toLowerCase() &&
  //                       res[1] !== '' &&
  //                       nonCryptoOwnerId.toLowerCase() === data.user._id)
  //                     ? true
  //                     : false,
  //                 );
  //               } else if (
  //                 res[0] !== '0x0000000000000000000000000000000000000000'
  //               ) {
  //                 setIsOwner(
  //                   (res[0].toLowerCase() === wallet.address.toLowerCase() &&
  //                     res[1] !== '') ||
  //                     (data &&
  //                       res[0].toLowerCase() ===
  //                       walletAddressForNonCrypto.toLowerCase() &&
  //                       res[1] !== '' &&
  //                       nonCryptoOwnerId.toLowerCase() === data.user._id)
  //                     ? true
  //                     : false,
  //                 );
  //                 setIsContractOwner(
  //                   res[0].toLowerCase() === wallet.address.toLowerCase() ||
  //                     (res[0].toLowerCase() ===
  //                       walletAddressForNonCrypto.toLowerCase() &&
  //                       nonCryptoOwnerId.toLowerCase() === data.user._id)
  //                     ? true
  //                     : false,
  //                 );
  //                 setPriceNFT(priceOfNft);
  //                 setPriceNFTString(res[1]);
  //               }
  //             } else {
  //               if (res[0] === '0x0000000000000000000000000000000000000000') {
  //                 setIsContractOwner(false);
  //                 setPriceNFT(priceOfNft);
  //                 setPriceNFTString(res[1]);
  //               } else if (
  //                 res[0] !== '0x0000000000000000000000000000000000000000'
  //               ) {
  //                 setPriceNFT(priceOfNft);
  //                 setPriceNFTString(res[1]);
  //                 setIsContractOwner(false);
  //               }
  //             }
  //             // if (res[0] !== "0x0000000000000000000000000000000000000000") {
  //             //   // calculateBidPriceDollar(res[1], walletAddressForNonCrypto);
  //             //   let dollarToken = basePriceTokens.filter(
  //             //     (token) =>
  //             //       token.chain === singleNFT.nftChain &&
  //             //       token.dollarCurrency
  //             //   );
  //             //   let rs = await this.calculatePrice(
  //             //     res[1],
  //             //     dollarToken[0].order,
  //             //     // this.state.nonCryptoOwnerId
  //             //     walletAddressForNonCrypto
  //             //   );
  //             //   if (rs) {
  //             //     let res = divideNo(rs);
  //             //     setPriceInDollar(res);
  //             //   }
  //             // }
  //             setOwnerAddress(nonCryptoOwner);
  //           } else {
  //             // setLoad(false);
  //           }
  //           setBuyLoading(false);
  //         });
  //     } else {
  //       setBuyLoading(false);
  //     }
  //   });
  // };
  //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const getRealtedNFT = async () => {
    let page = 1
    let limit = 6
    let networkId = network?.networkId
    let url = `${NEW_BASE_URL}/nfts/nfts-by-collection`;
    sendRequest({
      url,
      method: 'GET',
      params: {
        page,
        limit,
        collectionAddress,
        currentNftId: nftId,
        userId,
        networkId
      },
    })
      .then(res => {
        if (res?.list?.length > 0) {
          setMoreData(res?.list);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const getOfferList = () => {
    let url = `${NEW_BASE_URL}/sale-nft/offer-list/${nftId}`
    sendRequest({
      url,
      method: 'GET',
    })
      .then(res => {
        console.log("🚀 ~ file: detail.js ~ line 1677 ~ ~ res", res)
        if (res?.length > 0) {
          let tempList = []

          res?.map(item => {
            let temp = [
              `${Number(item?.price)} ${item?.receiveToken}`,
              item.fromUser?.address,
              getDateString(
                item.createdAt
                  ? item.createdAt
                  : Date.now()
              ),
              item.expired * 1000 > Date.now()
                ? timeSince(
                  new Date(item.expired * 1000)
                )
                : 'Expired',
              item?.networkTokenIcon
            ]
            tempList.push(temp)
          })
          console.log("🚀 ~ file: detail.js ~ line 1700 ~  ~ ", tempList)

          setOfferList(tempList)
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const getHistory = (history, sort) => {
    let page = 1
    let limit = 5
    let bidSort = 3
    let payload = history === 'bid' ? {
      url: `${NEW_BASE_URL}/sale-nft/bid-history?page=${page}&limit=${limit}&nftId=${nftId}&sort=${bidSort}`,
      method: 'GET',
    } : {
      url: `${NEW_BASE_URL}/sale-nft/trading-history`,
      method: 'POST',
      data: {
        page: 1,
        limit: 30,
        nftId: nftId,
        sort
      }
    }
    sendRequest(payload)
      .then(res => {
        console.log("🚀 ~ file: detail.js ~ line 1656 ~ ~ res", history, res)
        if (res?.items?.length > 0) {
          if (history === 'bid') {
            let tempList = []

            res?.items?.map(item => {
              let temp = [
                `${Number(item?.price)} ${item?.receiveToken}`,
                item?.fromUser?.userWallet?.address,
                moment(item?.createdAt).format('YYYY/MM/DD hh:mm:ss'),
                getExpirationDate(item?.expired),
              ]
              tempList.push(temp)
            })
            console.log("🚀 ~ file: detail.js ~ line 1780 ~  ~ ", tempList)

            setSellDetails(tempList)
          } else {
            let tradingList = []
            let filterList = []

            res?.items?.map(item => {
              let from = item?.fromUser?.userWallet?.address
              let to = item?.toUser?.userWallet?.address

              if (item.action === SORT_TRADING_HISTORY.BUY_NFT) {
                from = item?.toUser?.userWallet?.address
                to = item?.fromUser?.userWallet?.address
              }
              let temp = [
                getEventByValue(item?.action),
                item?.price && item?.receiveToken
                  ? Number(item?.price) + ' ' + item?.receiveToken
                  : '',
                getFromAddress(from, item?.action),
                getToAddress(to, item?.action),
                moment(item?.createdAt).format('YYYY/MM/DD hh:mm:ss'),
              ]
              tradingList.push(temp)
              filterList.push(getEventByValue(item?.action))
            })
            console.log("🚀 ~ file: detail.js ~ line 1680 ~  ~ ", tradingList)

            setTradingList(res?.items)
            setTradingTableData(tradingList)
            setFilterTableList(FILTER_TRADING_HISTORY_OPTIONS)
            // setTradingTableData1(tradingList)
            // setFilterTableValue(FILTER_TRADING_HISTORY_OPTIONS)
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // const getCurrencyPrice = async (value) => {
  //   let finalPrice = '';
  //   let i;
  //   let price = value ? value : nftPrice
  //   switch (chainType) {
  //     case 'BinanceNtwk':
  //       i = 0;
  //       break;
  //     case 'polygon':
  //       i = 1;
  //       break;
  //     case 'ethereum':
  //       i = 2;
  //       break;
  //   }

  //   let currencyPrices = await priceInDollars(
  //     data?.user?.role === 'crypto'
  //       ? wallet?.address
  //       : blockChainConfig[i]?.walletAddressForNonCrypto,
  //   );
  //   setCurrencyPrices(currencyPrices);
  //   switch (baseCurrency?.key) {
  //     case 'BNB':
  //       finalPrice = price * currencyPrices?.BNB;
  //       break;

  //     case 'ALIA':
  //       finalPrice = price * currencyPrices?.ALIA;
  //       break;

  //     case 'ETH':
  //       finalPrice = price * currencyPrices?.ETH;
  //       break;

  //     case 'MATIC':
  //       finalPrice = price * currencyPrices?.MATIC;
  //       break;

  //     default:
  //       finalPrice = price * 1;
  //       break;
  //   }
  //   setPriceInDollar(finalPrice);
  // };
  //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // const priceInDollars = pubKey => {
  //   return new Promise((resolve, reject) => {
  //     let balanceRequests = [
  //       currencyInDollar(pubKey, 'BSC'),
  //       currencyInDollar(pubKey, 'ETH'),
  //       currencyInDollar(pubKey, 'Polygon'),
  //       currencyInDollar(pubKey, 'ALIA'),
  //     ];
  //     Promise.all(balanceRequests)
  //       .then(responses => {
  //         let balances = {
  //           BNB: responses[0],
  //           ETH: responses[1],
  //           MATIC: responses[2],
  //           ALIA: parseFloat(responses[0]) / parseFloat(responses[3]),
  //         };
  //         resolve(balances);
  //       })
  //       .catch(err => {
  //         console.log('err', err);
  //         reject();
  //       });
  //   });
  // };
  //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // const getTradeCurrency = (baseCurrency, dollarPrice) => {
  //   return baseCurrency
  //     ? getBaseCurrency(chainType, parseInt(baseCurrency._hex, 16))
  //     : dollarPrice && parseFloat(divideNo(parseInt(dollarPrice?._hex, 16))) > 0
  //       ? '$'
  //       : 'ALIA';
  // };

  // const getNFTSellDetails = async (id, filterArray = []) => {
  //   let url = `${BASE_URL}/xanalia/getEventHistory`;
  //   await axios
  //     .post(url, {
  //       tokenId: nft,
  //       networkType,
  //       filter: filterArray,
  //     })
  //     .then(async res => {
  //       if (res.data.data.length > 0) {
  //         let filterList = [];
  //         let bids = [];
  //         for (let i = 0; i < res.data.data.length; i++) {
  //           if (
  //             res.data.data[i].event === 'SellNFT' ||
  //             res.data.data[i].event === 'SellNFTNonCrypto'
  //           ) {
  //             let { dollarPrice, price, baseCurrency } =
  //               res.data.data[i].returnValues;

  //             let priceCond = getPrice(dollarPrice, price);

  //             let tradeCurr = getTradeCurrency(baseCurrency, dollarPrice);

  //             let obj = {
  //               translatedEvent: translate('common.sales'),
  //               price: convertPrice(priceCond, res.data.data[i], tradeCurr),
  //               seller: res.data.data[i].returnValues.seller,
  //               owner: '',
  //               sellDateTime: moment
  //                 .utc(res.data.data[i].timestamp * 1000)
  //                 .local()
  //                 .format('YYYY/MM/DD HH:mm:ss'),
  //               dateTime: res.data.data[i].timestamp,
  //             };
  //             bids = [obj, ...bids];
  //             filterList.push({
  //               label: translate('common.sales'),
  //               value: translate('common.sales'),
  //             });
  //           }

  //           if (res.data.data[i].event === 'OfferAccept') {
  //             let { amount } = res.data.data[i].returnValues;
  //             let priceCond = getPrice(amount, null);
  //             let tradeCurr = res.data.data[i].returnValues.currencyType
  //               ? getBaseCurrency(
  //                 chainType,
  //                 parseInt(
  //                   res.data.data[i].returnValues.currencyType._hex,
  //                   16,
  //                 ),
  //               )
  //               : 'ALIA';

  //             let obj = {
  //               translatedEvent: translate('wallet.common.OfferAccept'),
  //               price: convertPrice(priceCond, res.data.data[i], tradeCurr),
  //               seller: res.data.data[i].returnValues.from,
  //               owner: res.data.data[i].returnValues.to,
  //               sellDateTime: moment
  //                 .utc(res.data.data[i].timestamp * 1000)
  //                 .local()
  //                 .format('YYYY/MM/DD HH:mm:ss'),
  //               dateTime: res.data.data[i].timestamp,
  //             };
  //             bids = [obj, ...bids];
  //             filterList.push({
  //               label: translate('wallet.common.OfferAccept'),
  //               value: translate('wallet.common.OfferAccept'),
  //             });
  //           }

  //           if (res.data.data[i].event === 'UpdatePrice') {
  //             let sellEvent = '';
  //             for (let j = i + 1; j <= res.data.data.length; j++) {
  //               if (
  //                 res.data.data[j]?.event &&
  //                 (res.data.data[j].event === 'SellNFT' ||
  //                   res.data.data[j].event === 'SellNFTNonCrypto')
  //               ) {
  //                 sellEvent = res.data.data[j];
  //                 break;
  //               }
  //             }

  //             let { newDollarPrice, newPrice, baseCurrency } =
  //               res.data.data[i].returnValues;
  //             let priceCond = getPrice(newDollarPrice, newPrice);
  //             let tradeCurr = getTradeCurrency(baseCurrency, newDollarPrice);

  //             let obj = {
  //               translatedEvent: translate('wallet.common.updatePrice'),
  //               price: convertPrice(priceCond, res.data.data[i], tradeCurr),
  //               seller: sellEvent?.returnValues?.seller,
  //               owner: '',
  //               sellDateTime: moment
  //                 .utc(res.data.data[i].timestamp * 1000)
  //                 .local()
  //                 .format('YYYY/MM/DD HH:mm:ss'),
  //               dateTime: res.data.data[i].timestamp * 1000,
  //             };
  //             bids = [obj, ...bids];
  //             filterList.push({
  //               label: translate('wallet.common.updatePrice'),
  //               value: translate('wallet.common.updatePrice'),
  //             });
  //           }

  //           if (res.data.data[i].event === 'OnAuction') {
  //             let { startPrice, baseCurrency, dollarPrice } =
  //               res.data.data[i].returnValues;
  //             let priceCond = getPrice(startPrice, null);
  //             let tradeCurr = getTradeCurrency(baseCurrency, dollarPrice);

  //             let obj = {
  //               //event: 'OnAuction',
  //               translatedEvent: translate('common.OnAuction'),
  //               price: convertPrice(priceCond, res.data.data[i], tradeCurr),
  //               seller: res.data.data[i].returnValues.seller,
  //               owner: '',
  //               sellDateTime: moment
  //                 .utc(res.data.data[i].timestamp * 1000)
  //                 .local()
  //                 .format('YYYY/MM/DD HH:mm:ss'),
  //               dateTime: res.data.data[i].timestamp,
  //             };
  //             bids = [obj, ...bids];
  //             filterList.push({
  //               label: translate('common.OnAuction'),
  //               value: translate('common.OnAuction'),
  //             });
  //           }

  //           if (res.data.data[i].event === 'awardAuctionNFT') {
  //             let seller = '';
  //             for (let j = 0; j <= res.data.data.length; j++) {
  //               if (res.data.data[j].event === 'MintWithTokenURINonCrypto') {
  //                 seller = res.data.data[j].returnValues.to;
  //                 break;
  //               }
  //             }

  //             let { startPrice, priceDollar, baseCurrency } =
  //               res.data.data[i].returnValues;

  //             let priceCond = getPrice(startPrice, priceDollar);

  //             let tradeCurr = getTradeCurrency(baseCurrency, priceDollar);

  //             let obj = {
  //               translatedEvent: translate('common.OnAuction'),
  //               price: convertPrice(priceCond, res.data.data[i], tradeCurr),
  //               seller: seller,
  //               owner: '',
  //               sellDateTime: moment
  //                 .utc(res.data.data[i].timestamp * 1000)
  //                 .local()
  //                 .format('YYYY/MM/DD HH:mm:ss'),
  //               dateTime: res.data.data[i].timestamp,
  //             };
  //             bids = [obj, ...bids];
  //             filterList.push({
  //               label: translate('common.OnAuction'),
  //               value: translate('common.OnAuction'),
  //             });
  //           }

  //           if (res.data.data[i].event === 'Bid') {
  //             let lastAuction = '';
  //             for (let j = i + 1; j <= res.data.data.length; j++) {
  //               if (res.data.data[j].event === 'OnAuction') {
  //                 lastAuction = res.data.data[j];
  //                 break;
  //               }
  //             }

  //             let { amount } = res.data.data[i].returnValues;

  //             let priceCond = getPrice(amount, null);

  //             let tradeCurr =
  //               lastAuction && lastAuction.returnValues.baseCurrency
  //                 ? getBaseCurrency(
  //                   chainType,
  //                   parseInt(lastAuction.returnValues.baseCurrency._hex, 16),
  //                 )
  //                 : 'ALIA';

  //             let obj = {
  //               //event: 'Bid',
  //               translatedEvent: translate('common.Bids'),
  //               price: convertPrice(priceCond, res.data.data[i], tradeCurr),
  //               seller: res.data.data[i].returnValues.bidder,
  //               owner: '',
  //               sellDateTime: moment
  //                 .utc(res.data.data[i].timestamp * 1000)
  //                 .local()
  //                 .format('YYYY/MM/DD HH:mm:ss'),
  //               dateTime: res.data.data[i].timestamp,
  //             };
  //             bids = [obj, ...bids];
  //             filterList.push({
  //               label: translate('common.Bids'),
  //               value: translate('common.Bids'),
  //             });
  //           }

  //           if (res.data.data[i].event === 'BidAward') {
  //             let { amount } = res.data.data[i].returnValues;

  //             let priceCond = getPrice(amount, null);
  //             let tradeCurr = '$';
  //             let obj = {
  //               event: translate('wallet.common.bidaward'),
  //               price: convertPrice(priceCond, res.data.data[i], tradeCurr),
  //               seller: res.data.data[i].returnValues.bidder
  //                 ? res.data.data[i].returnValues.bidder
  //                 : res.data.data[i].returnValues.ownerId,
  //               owner: '',
  //               sellDateTime: moment
  //                 .utc(res.data.data[i].timestamp)
  //                 .local()
  //                 .format('YYYY/MM/DD HH:mm:ss'),
  //               dateTime: res.data.data[i].timestamp,
  //             };
  //             bids = [obj, ...bids];
  //             filterList.push({
  //               label: translate('wallet.common.bidaward'),
  //               value: translate('wallet.common.bidaward'),
  //             });
  //           }

  //           if (res.data.data[i].event === 'Claim') {
  //             let seller = '';
  //             for (let j = i + 1; j <= res.data.data.length; j++) {
  //               if (res.data.data[j].event === 'OnAuction') {
  //                 seller = res.data.data[j].returnValues.seller;
  //                 break;
  //               }
  //             }

  //             let { amount } = res.data.data[i].returnValues;

  //             let priceCond = getPrice(amount, null);
  //             let tradeCurr = res.data.data[i].returnValues.baseCurrency
  //               ? getBaseCurrency(
  //                 chainType,
  //                 parseInt(
  //                   res.data.data[i].returnValues.baseCurrency._hex,
  //                   16,
  //                 ),
  //               )
  //               : 'ALIA';

  //             let obj = {
  //               translatedEvent: translate('common.Claim'),
  //               price: convertPrice(priceCond, res.data.data[i], tradeCurr),
  //               seller: seller,
  //               owner: res.data.data[i].returnValues.bidder,
  //               sellDateTime: moment
  //                 .utc(res.data.data[i].timestamp * 1000)
  //                 .local()
  //                 .format('YYYY/MM/DD HH:mm:ss'),
  //               dateTime: res.data.data[i].timestamp,
  //             };
  //             bids = [obj, ...bids];
  //             filterList.push({
  //               label: translate('common.Claim'),
  //               value: translate('common.Claim'),
  //             });
  //           }

  //           if (
  //             res.data.data[i].event === 'BuyNFT' ||
  //             res.data.data[i].event === 'BuyNFTNonCrypto'
  //           ) {
  //             let sellEvent = '';
  //             let updateEvent = '';
  //             for (let j = i + 1; j <= res.data.data.length; j++) {
  //               if (
  //                 res.data.data[j]?.event &&
  //                 res.data.data[j].event === 'UpdatePrice'
  //               ) {
  //                 updateEvent = res.data.data[j];
  //               }
  //               if (
  //                 res.data.data[j]?.event &&
  //                 (res.data.data[j].event === 'SellNFT' ||
  //                   res.data.data[j].event === 'SellNFTNonCrypto')
  //               ) {
  //                 sellEvent = res.data.data[j];
  //                 break;
  //               }
  //             }

  //             let priceCond = res.data.data[i].returnValues.calculated
  //               ? divideNo(
  //                 parseInt(res.data.data[i].returnValues.calculated._hex, 16),
  //               )
  //               : updateEvent
  //                 ? updateEvent.returnValues.newDollarPrice &&
  //                   parseFloat(
  //                     divideNo(
  //                       parseInt(
  //                         updateEvent.returnValues.newDollarPrice?._hex,
  //                         16,
  //                       ),
  //                     ),
  //                   ) > 0
  //                   ? divideNo(
  //                     parseInt(
  //                       updateEvent.returnValues.newDollarPrice._hex,
  //                       16,
  //                     ),
  //                   )
  //                   : divideNo(
  //                     parseInt(updateEvent.returnValues.newPrice._hex, 16),
  //                   )
  //                 : sellEvent.returnValues.dollarPrice &&
  //                   parseFloat(
  //                     divideNo(
  //                       parseInt(sellEvent.returnValues.dollarPrice._hex, 16),
  //                     ),
  //                   ) > 0
  //                   ? divideNo(
  //                     parseInt(sellEvent.returnValues.dollarPrice._hex, 16),
  //                   )
  //                   : divideNo(parseInt(sellEvent.returnValues.price._hex, 16));
  //             let tradeCurr = res.data.data[i].returnValues.currencyType
  //               ? getBaseCurrency(
  //                 chainType,
  //                 parseInt(
  //                   res.data.data[i].returnValues.currencyType._hex,
  //                   16,
  //                 ),
  //               )
  //               : updateEvent
  //                 ? updateEvent.returnValues.baseCurrency
  //                   ? getBaseCurrency(
  //                     chainType,
  //                     parseInt(updateEvent.returnValues.baseCurrency._hex, 16),
  //                   )
  //                   : updateEvent.returnValues.newDollarPrice &&
  //                     parseFloat(
  //                       divideNo(
  //                         parseInt(
  //                           updateEvent.returnValues.newDollarPrice?._hex,
  //                           16,
  //                         ),
  //                       ),
  //                     ) > 0
  //                     ? '$'
  //                     : 'ALIA'
  //                 : sellEvent.returnValues.dollarPrice &&
  //                   parseInt(
  //                     divideNo(
  //                       parseInt(sellEvent.returnValues.dollarPrice._hex, 16),
  //                     ),
  //                   ) > 0
  //                   ? '$'
  //                   : 'ALIA';

  //             let obj = {
  //               translatedEvent: translate('common.Buys'),
  //               price: convertPrice(priceCond, res.data.data[i], tradeCurr),
  //               seller: sellEvent?.returnValues?.seller,
  //               owner: res.data.data[i].returnValues.buyer,
  //               sellDateTime: moment
  //                 .utc(res.data.data[i].timestamp * 1000)
  //                 .local()
  //                 .format('YYYY/MM/DD HH:mm:ss'),
  //               dateTime: res.data.data[i].timestamp,
  //             };
  //             bids = [obj, ...bids];
  //             filterList.push({
  //               label: translate('common.Buys'),
  //               value: translate('common.Buys'),
  //             });
  //           }
  //           if (res.data.data[i].event === 'CancelSell') {
  //             let obj = {
  //               translatedEvent: translate('common.cancelSell'),
  //               price: '',
  //               seller: res.data.data[i].returnValues.from,
  //               owner: '',
  //               sellDateTime: moment
  //                 .utc(res.data.data[i].timestamp * 1000)
  //                 .local()
  //                 .format('YYYY/MM/DD HH:mm:ss'),
  //               dateTime: res.data.data[i].timestamp,
  //             };
  //             bids = [obj, ...bids];
  //             filterList.push({
  //               label: translate('common.cancelSell'),
  //               value: translate('common.cancelSell'),
  //             });
  //           }

  //           if (
  //             res.data.data[i].event === 'MintWithTokenURI' ||
  //             res.data.data[i].event === 'MintWithTokenURINonCrypto'
  //           ) {
  //             let obj = {
  //               translatedEvent: translate('common.minted'),
  //               price: '',
  //               seller: 'Null Address',
  //               owner: res.data.data[i].returnValues.minter
  //                 ? res.data.data[i].returnValues.minter
  //                 : res.data.data[i].returnValues.from.toLowerCase() ===
  //                   walletAddressForNonCrypto.toLocaleLowerCase()
  //                   ? res.data.data[i].returnValues.to
  //                   : res.data.data[i].returnValues.from,
  //               sellDateTime: moment
  //                 .utc(res.data.data[i].timestamp * 1000)
  //                 .local()
  //                 .format('YYYY/MM/DD HH:mm:ss'),
  //               dateTime: res.data.data[i].timestamp,
  //             };
  //             bids = [obj, ...bids];
  //             filterList.push({
  //               label: translate('common.minted'),
  //               value: translate('common.minted'),
  //             });
  //           }
  //           if (res.data.data[i].event === 'transferFrom') {
  //             let obj = {
  //               translatedEvent: translate('wallet.common.transferFrom'),
  //               price: '',
  //               seller: res.data.data[i].returnValues.from,
  //               owner: res.data.data[i].returnValues.to,
  //               sellDateTime: moment
  //                 .utc(res.data.data[i].timestamp * 1000)
  //                 .local()
  //                 .format('YYYY/MM/DD HH:mm:ss'),
  //               dateTime: res.data.data[i].timestamp,
  //             };
  //             bids = [obj, ...bids];
  //             filterList.push({
  //               label: translate('wallet.common.transferFrom'),
  //               value: translate('wallet.common.transferFrom'),
  //             });
  //           }
  //         }

  //         function getUnique(array, key) {
  //           if (typeof key !== 'function') {
  //             const property = key;
  //             key = function (item) {
  //               return item[property];
  //             };
  //           }
  //           return Array.from(
  //             array
  //               .reduce(function (map, item) {
  //                 const k = key(item);
  //                 if (!map.has(k)) map.set(k, item);
  //                 return map;
  //               }, new Map())
  //               .values(),
  //           );
  //         }

  //         let value = getUnique(filterList, 'value');
  //         setFilterTableList(value);

  //         let _bidHistory = bids.filter(item => item?.event === 'Bid');
  //         if (_bidHistory.length > 0) {
  //           var array = [];
  //           array = _bidHistory.filter(item => delete item['event']);
  //           let bidsArray = [];
  //           for (let i = 0; i < array.length; i++) {
  //             const obj = array[i];
  //             bidsArray.push(Object.values(obj));
  //           }
  //         }

  //         let arr = [];
  //         for (let i = 0; i < bids.length; i++) {
  //           const obj = bids[i];
  //           let convertArr = Object.values(obj);
  //           convertArr.pop();
  //           arr.push(convertArr);
  //         }
  //         let fDArray = arr.reverse();
  //         setTradingTableData1(fDArray);
  //         setSellDetails(bids.reverse());
  //         setTradingTableData(fDArray);
  //         setTimeout(() => {
  //           // setLoad(false);
  //         }, 1000);
  //       } else {
  //         setSellDetails([]);
  //         // setSellDetailsFiltered([]);
  //         // setLoad(false);
  //       }
  //     })
  //     .catch(err => {
  //       // setLoad(false);
  //       setSellDetails([]);
  //       // setSellDetailsFiltered([]);
  //     });
  // };

  const showSeller = seller => {
    let sellerName = '';
    if (artist === seller) {
      if (
        artistRole === 'crypto' &&
        artistDetail.hasOwnProperty('title') &&
        artistDetail.title
      ) {
        sellerName = artistDetail.title;
      } else if (
        artistRole === 'non_crypto' &&
        artistDetail.hasOwnProperty('username') &&
        artistDetail.username
      ) {
        sellerName = artistDetail.username.includes('0x')
          ? artistDetail.username.substring(0, 6)
          : artistDetail.username;
      } else {
        sellerName = seller;
      }
    } else {
      sellerName =
        seller && seller.includes('0x')
          ? seller.substring(0, 6)
          : ownerDataN._id === seller
            ? ownerDataN.username
            : seller;
    }
    return sellerName;
  };

  // const getPublicProfile = async (id, type) => {
  // const userId = id?.toLowerCase();
  // let profileUrl = type
  //   ? `${BASE_URL}/user/get-public-profile?publicAddress=${userId}`
  //   : `${BASE_URL}/user/get-public-profile?userId=${userId}`;
  // // setOwnerId(userId);
  // let profile = await axios.get(profileUrl);
  // if (profile.data.success) {
  //   setArtistRole(type ? 'crypto' : 'non_crypto');
  //   setOwnerDataN(profile.data.data);
  //   setOwnerN(userId);
  // } else {
  //   setOwnerN(userId);
  // }
  // };

  // const lastOwnerOfNFT = () => {
  //   let _data = singleNFT;
  //   let web3 = new Web3(providerUrl);
  //   let ERC721Contract = new web3.eth.Contract(ERC721Abi, collectionAddress);

  //   let MarketPlaceContract = new web3.eth.Contract(
  //     MarketPlaceAbi,
  //     MarketContractAddress,
  //   );
  //   ERC721Contract.methods.ownerOf(_tokenId).call((err, res) => {
  //     if (!err) {
  //       _data.owner_address = res;
  //       MarketPlaceContract.methods
  //         .getSellDetail(collectionAddress, _tokenId)
  //         .call(async (err, res) => {
  //           if (!err) {
  //             let priceOfNft = res[1] / 1e18;
  //             let _ownerAddress = _data.owner_address;
  //             if (wallet?.address) {
  //               if (res[0] !== '0x0000000000000000000000000000000000000000') {
  //                 _ownerAddress = res[0];
  //                 getPublicProfile(res[0], true);
  //                 setIsOwner(
  //                   res[0].toLowerCase() === wallet.address.toLowerCase() &&
  //                     res[1] !== ''
  //                     ? true
  //                     : false,
  //                 );
  //                 // let dollarToken = basePriceTokens.filter(
  //                 //   (token) =>
  //                 //     token.chain === singleNFT.nftChain &&
  //                 //     token.dollarCurrency
  //                 // );
  //                 // let rs = await this.calculatePrice(
  //                 //   res[1],
  //                 //   dollarToken[0].order,
  //                 //   res[0]
  //                 // );
  //                 // if (rs) {
  //                 //   let res = divideNo(rs);
  //                 //   setPriceInDollar(res);
  //                 // }
  //               } else {
  //                 getPublicProfile(_ownerAddress, true);
  //                 setIsOwner(
  //                   _ownerAddress.toLowerCase() ===
  //                     wallet.address.toLowerCase() && res[1] !== ''
  //                     ? true
  //                     : false,
  //                 );
  //               }
  //               setIsContractOwner(
  //                 res[0].toLowerCase() === wallet.address.toLowerCase()
  //                   ? true
  //                   : false,
  //               );
  //               setPriceNFT(priceOfNft);
  //               setPriceNFTString(res[1]);
  //             } else {
  //               // if (priceOfNft === 0) {
  //               if (res[0] === '0x0000000000000000000000000000000000000000') {
  //                 setIsContractOwner(false);
  //                 setPriceNFT(priceOfNft);
  //                 setPriceNFTString(res[1]);
  //                 getPublicProfile(_ownerAddress, true);
  //               } else if (
  //                 res[0] !== '0x0000000000000000000000000000000000000000'
  //               ) {
  //                 getPublicProfile(res[0], true);
  //                 setIsContractOwner(false);
  //                 setPriceNFT(priceOfNft);
  //                 setPriceNFTString(res[1]);
  //               }
  //             }
  //             setOwnerAddress(_ownerAddress);
  //           } else {
  //             // setLoad(false);
  //           }
  //           setBuyLoading(false);
  //         });
  //     } else {
  //       setBuyLoading(false);
  //     }
  //   });
  // };

  // const getCollectionByAddress = c => {
  //   let url = `${BASE_URL}/xanalia/collection-info?collectionAddr=${c.toLowerCase()}`;
  //   axios
  //     .get(url)
  //     .then(response => {
  //       if (response.data) {
  //         setcollectCreat(response.data.data)
  //         // setLoad(false)
  //       }
  //     })
  //     .catch(err => {
  //       console.log('err from collection info', err);
  //     });
  // };

  // const getNFTDetails = async obj => {
  //   let _MarketPlaceAbi = ERC721Abi;
  //   let _MarketContractAddress = collectionAddress;

  //   let web3 = new Web3(providerUrl);
  //   if (_tokenId) {
  //     let nftChain = chainType;
  //     let collectionAdd = collectionAddress;
  //     let nftId = _tokenId;

  //     obj.chainType = nftChain ? nftChain : '';
  //     obj.polygonId = '';
  //     obj.collection = collectionAdd;
  //     obj.collectionAdd = obj.tokenId;
  //     obj.tokenId = nftId;
  //   }

  //   let MarketPlaceContract = new web3.eth.Contract(
  //     _MarketPlaceAbi,
  //     _MarketContractAddress,
  //   );

  //   let nftObj = {
  //     image: obj.metaData.image,
  //     description: obj.metaData.description,
  //     title: obj.metaData.name,
  //     type: obj.metaData.properties.type,
  //     price: obj.price ? obj.price : '',
  //     rating: obj.rating,
  //     like: obj?.like,
  //     author: obj.returnValues.to,
  //     _id: obj._id,
  //     thumbnailUrl: obj?.thumbnailUrl,
  //     imageForVideo: obj?.metaData?.thumbnft
  //       ? obj?.metaData?.thumbnft
  //       : obj?.thumbnailUrl,
  //     newprice: obj.newprice,
  //     approval: obj.approval,
  //     id: obj.tokenId,
  //     buyTxHash: obj?.buyTxHash ? obj?.buyTxHash : '',
  //     offchain: obj?.offchain ? obj?.offchain : false,
  //     collectionOffChainId: obj?.returnValues?.collection
  //       ? obj?.returnValues?.collection
  //       : '',

  //     seriesId: obj?.seriesId ? obj?.seriesId : '',
  //     secondarySales: obj.secondarySales ? true : false,
  //     lastTradeType:
  //       obj.newprice2 && obj.newprice2?.type === 'auction' ? 'auction' : 'sell',
  //     collection: _MarketContractAddress,
  //     collectionAdd: obj.collectionAdd,
  //     nftChain: obj.chainType,
  //     logoImg: `${CDN_LINK}/logo-v2.svg`,
  //   };

  //   await MarketPlaceContract.methods
  //     .ownerOf(nftObj.id)
  //     .call(function (err, res) {
  //       if (!err) {
  //         nftObj.owner_address = res;
  //       }
  //     });

  //   return nftObj;
  // };

  // const getNFTDiscount = id => {
  // let web3 = new Web3(providerUrl);
  // let MarketPlaceContract = new web3.eth.Contract(
  //   MarketPlaceAbi,
  //   MarketContractAddress,
  // );
  // MarketPlaceContract.methods.adminOwner &&
  //   MarketPlaceContract.methods.adminOwner(id).call((err, res) => {
  //     setDiscount(res);
  //   });
  // };

  // const getDiscount = () => {
  // let web3 = new Web3(providerUrl);
  // let MarketPlaceContract = new web3.eth.Contract(
  //   MarketPlaceAbi,
  //   MarketContractAddress,
  // );
  // MarketPlaceContract.methods.adminDiscount &&
  //   MarketPlaceContract.methods.adminDiscount().call((err, res) => {
  //     setDiscountValue(res ? res / 10 : 0);
  //   });
  // };

  // const calculatePrice = async tradeCurr => {
  //   setPayableIn(tradeCurr.name);
  //   let web3 = new Web3(providerUrl);
  //   let MarketPlaceContract = new web3.eth.Contract(
  //     MarketPlaceAbi,
  //     MarketContractAddress,
  //   );
  //   let ownerAddress =
  //     data?.user?.role === 'crypto'
  //       ? wallet?.address
  //       : blockChainConfig[i]?.walletAddressForNonCrypto;
  //   let res = await MarketPlaceContract.methods
  //     .calculatePrice(
  //       priceNFTString,
  //       baseCurrency?.order,
  //       tradeCurr.order,
  //       _tokenId,
  //       ownerAddress,
  //       collectionAddress,
  //     )
  //     .call();

  //   if (res) {
  //     let currPay = res / 1e18;
  //     let finalPrice = '';
  //     switch (tradeCurr.key) {
  //       case 'BNB':
  //         finalPrice = currPay * currencyPrices?.BNB;
  //         break;

  //       case 'ALIA':
  //         finalPrice = currPay * currencyPrices?.ALIA;
  //         break;

  //       case 'ETH':
  //         finalPrice = currPay * currencyPrices?.ETH;
  //         break;

  //       case 'MATIC':
  //         finalPrice = currPay * currencyPrices?.MATIC;
  //         break;

  //       default:
  //         finalPrice = currPay * 1;
  //         break;
  //     }
  //     setPayableInCurrency(currPay);
  //     setPayableInDollar(finalPrice);
  //     return currPay;
  //   } else {
  //     return '';
  //   }
  // };

  // const calculateBidPriceDollar = async (price, owner) => {
  //   let dollarToken = basePriceTokens.filter(
  //     token => token.chain === singleNFT.nftChain && token.dollarCurrency,
  //   );
  //   let rs = await calculatePriceWeb(price, dollarToken[0]?.order, owner);
  //   if (rs) {
  //     let res = divideNo(rs);
  //     setBidPriceInDollar(res);
  //   }
  // };

  // const calculatePriceWeb = async (price, tradeCurr, owner) => {
  //   let collectionAddress = singleNFT?.collection
  //     ? singleNFT?.collection
  //     : ERC721Address;
  //   let web3 = new Web3(providerUrl);
  //   let MarketPlaceContract = new web3.eth.Contract(
  //     MarketPlaceAbi,
  //     MarketContractAddress,
  //   );
  //   let res = await MarketPlaceContract.methods
  //     .calculatePrice(
  //       price,
  //       baseCurrency?.order,
  //       tradeCurr,
  //       singleNFT.id,
  //       owner,
  //       collectionAddress,
  //     )
  //     .call()
  //     .then(res => res)
  //     .catch(err => {
  //       console.log(err);
  //     });
  //   if (res) return res;
  //   else return '';
  // };

  const bidingTimeEnded = () => {
    return new Date().getTime() > new Date(auctionETime).getTime();
  };

  const setNFTStatus = () => {
    let marketplaceStatus = detailNFT?.marketNftStatus
    let saleDataAuction = detailNFT?.saleData?.auction
    switch (marketplaceStatus) {
      case NFT_MARKET_STATUS.NOT_ON_SALE:
        return 'notOnSell';

      case NFT_MARKET_STATUS.ON_FIX_PRICE:
        return 'buy';

      case NFT_MARKET_STATUS.ON_AUCTION:
        return 'onAuction';

      case NFT_MARKET_STATUS.CANCEL_AUCTION:
        return 'cancelAuction';

      case NFT_MARKET_STATUS.UPCOMMING_AUCTION:
        return 'highest_bid';

      case NFT_MARKET_STATUS.END_AUCTION:
        if (
          saleDataAuction &&
          Number(saleDataAuction.startPrice) ===
          Number(saleDataAuction.highestPrice)
        ) {
          return 'min_bid';
        }
        return 'highest_bid';
    }

    // let _nftStatus = '';
    // if (isContractOwner) {
    //   if (nFTOnAuction && lBidAmount !== '0.000000000000000000') {
    //     _nftStatus = undefined;
    //   } else if (isForAward) {
    //     _nftStatus = undefined;
    //   } else {
    //     _nftStatus = 'onSell';
    //   }
    // } else if (isOwner) {
    //   _nftStatus = 'sell';
    // } else if (
    //   priceNFT ||
    //   (nFTOnAuction &&
    //     auctionInitiatorAdd?.toLowerCase() !== wallet?.address.toLowerCase())
    // ) {
    //   if (
    //     nFTOnAuction &&
    //     auctionInitiatorAdd?.toLowerCase() !== wallet?.address.toLowerCase() &&
    //     bidingTimeEnded() !== true
    //   ) {
    //     _nftStatus = undefined;
    //   } else if (priceNFT && !nFTOnAuction) {
    //     if (wallet?.address) {
    //       _nftStatus = 'buy';
    //     } else {
    //       _nftStatus = 'buy';
    //     }
    //   } else {
    //     _nftStatus = undefined;
    //   }
    // } else {
    //   _nftStatus = 'notOnSell';
    // }
    // return _nftStatus;
  };

  const onProfile = ownerStatus => {
    if (ownerStatus) {
      if (ownerN) {
        navigation.push('ArtistDetail', { id: ownerN });
      }
    } else {
      if (artist) {
        navigation.push('ArtistDetail', { id: artist });
      }
    }
  };

  const Filters = props => {
    const [open, setOpen] = useState(false);
    return (
      <DropDownPicker
        open={open}
        value={props.value}
        items={props.data}
        multiple={true}
        min={0}
        mode={'BADGE'}
        setOpen={setOpen}
        setValue={props.setValue}
        setItems={props.setData}
        closeAfterSelecting={true}
        style={styles.tokenPicker}
        dropDownContainerStyle={styles.dropDownContainer}
        placeholder={translate('wallet.common.filter')}
        maxHeight={hp(20)}
      />
    );
  };

  const handleLikeMethod = async () => {
    const nftData = await handleLike(detailNFT);
    if (nftData) {
      setDetailNFT(nftData)
      if (typeof setNftItem == 'function') {
        let nftItem = {
          ...item,
          isLike: nftData?.isLike,
          totalLike: nftData?.totalLike
        };
        setNftItem(nftItem);
      }
    }
  };

  const closeSuccess = () => {
    setSuccessModalVisible(false);
    setLoad(true);
    // getNonCryptoNFTOwner();
  };

  // let ownerName = ownerDataN && (
  //   ownerDataN.role === 'crypto' ?
  //     ownerDataN.title ?
  //       ownerDataN.title :
  //       ownerN?.includes("0x")
  //         ? ownerN?.substring(0, 6)
  //         : ownerN?.substring(0, 6) :
  //     ownerDataN.role === 'non_crypto' ?
  //       ownerDataN.username ?
  //         ownerDataN.username : ""
  //       : "")

  // let creatorName = artistDetail && artist
  //   ? artist.includes("0x")
  //     ? artistDetail.hasOwnProperty("title") && artistDetail.title ?
  //       artistDetail.title
  // : (artist === '0x913d90bf7e4A2B1Ae54Bd5179cDE2e7cE712214A'.toLowerCase()
  //   || artist === '0xf45C0d38Df3eac6bf6d0fF74D53421Dc34E14C04'.toLowerCase()
  //   || artist === '0x77FFb287573b46AbDdcEB7F2822588A847358933'.toLowerCase()
  //   || artist === '0xfaae9d5b6f4779689bd273ab30f78beab3a0fc8f'.toLowerCase())
  //   ? (
  //     disableCreator = true,
  //     collectCreat?.creator
  //   )
  //   : artist.substring(0, 6)
  //     : artistDetail === "No record found" ?
  //       artist.substring(0, 6) :
  //       artistDetail.hasOwnProperty("username") && artistDetail.username ?
  //         artistDetail.username.substring(0, 6) : artist.substring(0, 6)
  //   : artist ? artist?.substring(0, 6) : "";

  return (
    <>
      <SafeAreaView style={styles.mainContainer}>
        {renderAppHeader()}
        <AppBackground isBusy={load}>
          <ScrollView showsVerticalScrollIndicator={false} ref={scrollRef}>
            {renderBannerImageVideo()}
            {renderHeartIcon()}
            {!load && renderCreatorCollectionOwnerName()}
            {renderCreatorAndNFTName()}
            {renderDescription()}
            {renderNFTPriceNToken()}
            {/* {getAuctionTimeRemain(item?.newprice ? item : singleNFT) ? renderAuctionTimeRemain() : null} */}
            {<View style={styles.bottomView}>
              {/* {!load && setNFTStatus() !== undefined && renderGroupButton()} */}
              {!load && renderContentAction()}
              {/* {!load && setNFTStatus() === 'onSell' && renderNFTPriceNeditPriceAppButton()} */}
            </View>}
            {renderCreatorNFTDetailDropdown()}
            {renderDetailNFTDetailDropdown()}
            {renderBidNTradingHistory('bid')}
            {renderBidNTradingHistory('offers')}
            {renderBidNTradingHistory('trading')}
            {renderMoreCollection()}
          </ScrollView >
        </AppBackground>
      </SafeAreaView >
      {/* {renderPaymentMethod()}
      {renderPaymentNow()} 
      {renderTabModal()}
      {renderAppModal()} */}
    </>
  );
};

export default DetailScreen;