import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Video from 'react-native-fast-video';
import { Row, Rows, Table } from 'react-native-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { IMAGES, SIZE, SVGS } from 'src/constants';
import details from '../../../assets/images/details.png';
import grid from '../../../assets/images/grid.png';
import history from '../../../assets/images/history.png';
import trading from '../../../assets/images/trading.png';
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
import {
  getAllCards,
  setPaymentObject,
} from '../../store/reducer/paymentReducer';
import { alertWithSingleBtn, divideNo, numberWithCommas } from '../../utils';
import { translate } from '../../walletUtils';
import { basePriceTokens } from '../../web3/config/availableTokens';
import { blockChainConfig, CDN_LINK } from '../../web3/config/blockChainConfig';
import { CardField, TabModal } from '../createNFTScreen/components';
import styles from './styles';
import AppButton from '../../components/appButton';
import CommonStyles from '../../constants/styles';
import { BASE_URL } from '../../common/constants';
import { handleLikeDislike } from '../../store/actions/nftTrendList';
import { ActivityIndicator } from 'react-native-paper';
import FetchingIndicator from '../../components/fetchingIndicator';
import { currencyInDollar } from '../wallet/functions';
import { getBaseCurrency } from '../../utils/parseNFTObj';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
const { PlayButtonIcon, HeartWhiteIcon, HeartActiveIcon, ThreeDotsVerticalIcon } = SVGS;
import addComma from '../../utils/insertComma';
import { handleLike } from '../explore/nftItems';

const Web3 = require('web3');

export function showActualValue(data, decimalValue, returnType) {
  let value = data.toString();
  let val;
  if (parseFloat(value) === 0) {
    val = parseFloat(value)?.toFixed(2);
    return val;
  }

  if (parseFloat(value) > 0) {
    if (!value.includes('.')) {
      value = value + '.0';
    }
    let split = value.split('.');

    val = split[0] + '.' + split[1].slice(0, decimalValue);
  } else {
    val = parseFloat(value)?.toFixed(decimalValue);
  }

  if (returnType === 'string') {
    let splited = val.split('.')[1];
    let ind = '';
    for (let i = 0; i < splited.length; i++) {
      let afterAllZero = true;
      for (let j = i; j < splited.length; j++) {
        if (splited[j] !== '0') {
          afterAllZero = false;
          break;
        }
      }
      if (afterAllZero) {
        ind = i;
        break;
      }
    }
    if (ind !== '') {
      if (ind === 0) {
        let v = val.split('.')[0] + '.' + '00';
        return v.toString();
      } else {
        let v = val.split('.')[0] + '.' + splited.slice(0, ind + 1);
        return v.toString();
      }
    }
    return val.toString();
  } else if (returnType === 'number') {
    // console.log(parseFloat(val));
    return parseFloat(val);
  }
}

export function trimZeroFromTheEnd(val) {
  let str = val.toString();
  if (str.includes(".")) {
    let decimalPart = str.split(".")[1];
    let nonDecimalPart = str.split(".")[0];
    for (let i = 0; i < decimalPart.length; i++) {
      let isZero = true;
      for (let j = i + 1; j < decimalPart.length; j++) {
        if (decimalPart[j] !== "0") {
          isZero = false;
          break;
        }
      }

      if (isZero) {
        // console.log(i);
        // console.log(decimalPart.slice(0, i + 1));
        return nonDecimalPart + "." + decimalPart.slice(0, i + 1);
      }
    }
  }
  return str;
}

const DetailScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { paymentObject } = useSelector(state => state.PaymentReducer);
  const { data, wallet } = useSelector(state => state.UserReducer);
  const isFocused = useIsFocused();
  const scrollRef = useRef(null);
  const refVideo = useRef(null);
  const {
    owner,
    ownerData,
    artistId,
    collectCreat,
    artistData,
    video,
    fileType,
    item,
    index,
    setNftItem
  } = route.params;

  const [ownerDataN, setOwnerDataN] = useState(ownerData);
  const [ownerN, setOwnerN] = useState(owner);

  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const [showPaymentNow, setShowPaymentNow] = useState(false);
  const [isContractOwner, setIsContractOwner] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [nFTOnAuction, setIsNFTOnAuction] = useState(false);
  const [singleNFT, setSingleNFT] = useState({});
  const [nonCryptoOwnerId, setNonCryptoOwnerId] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [lBidAmount, setLastBidAmount] = useState('');
  const [priceNFT, setPriceNFT] = useState('');
  const [priceNFTString, setPriceNFTString] = useState('');
  const [auctionInitiatorAdd, setAuctionInitiatorAdd] = useState('');
  const [auctionETime, setAuctionETime] = useState('');
  const [buyLoading, setBuyLoading] = useState(false);
  const [availableTokens, setAvailableTokens] = useState([]);
  const [ownerAddress, setOwnerAddress] = useState('');
  const [isForAward, setIsForAward] = useState(false);
  const [baseCurrency, setBaseCurrency] = useState(null);
  // const [discount, setDiscount] = useState(false);
  // const [discountValue, setDiscountValue] = useState('');
  // const [sellDetails, setSellDetails] = useState([]);
  // const [sellDetailsFiltered, setSellDetailsFiltered] = useState([]);
  // const [bidHistory, setBidHistory] = useState([]);
  const [priceInDollar, setPriceInDollar] = useState('');
  const [moreData, setMoreData] = useState([]);
  const [allowedTokenModal, setAllowedTokenModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [payableIn, setPayableIn] = useState("");
  const [collectCreatData, setcollectCreat] = useState(collectCreat);
  const [artistDetail, setArtistData] = useState(artistData);
  const [artist, setArtist] = useState(artistId);

  const [showThumb, toggleThumb] = useState(true);
  const [videoLoad, setVideoLoad] = useState(false);
  const [playVideoLoad, setPlayVideoLoad] = useState(false);
  const [videoLoadErr, setVideoLoadErr] = useState(false);
  const [videoKey, setVideoKey] = useState(1);
  const [videoURL, setVideoURI] = useState(video);
  const [playVideo, toggleVideoPlay] = useState(false);

  const [tradingTableHead, setTradingTableHead] = useState([
    translate('common.event'),
    translate('common.price'),
    translate('common.from'),
    translate('common.to'),
    translate('common.date') + ' (DD/MM/YYYY)',
  ]);
  // const [tableData, setTableData] = useState([]);
  const [tradingTableData, setTradingTableData] = useState([]);
  const [tradingTableLoader, setTradingTableLoader] = useState(false);
  const [isLike, setLike] = useState(item.like);
  const [currenciesInDollar, setCurrenciesInDollar] = useState(null);

  const nft = item.tokenId || item.collectionAdd;
  let params = nft.toString().split('-');
  let chainType,
    _tokenId,
    collectionAddress,
    ERC721Abi,
    ERC721Address,
    MarketPlaceAbi,
    MarketContractAddress,
    providerUrl,
    walletAddressForNonCrypto,
    chainAvailable;
  if (params.length > 2) {
    chainType = params[0];
    collectionAddress = params[1];
    _tokenId = params[2]

    let getBlockChainConfig = blockChainConfig.find(v => v.key.toLowerCase() === chainType.toLowerCase());
    ERC721Abi = getBlockChainConfig.erc721ConConfig.abi;
    ERC721Address = getBlockChainConfig.erc721ConConfig.add;
    MarketPlaceAbi = getBlockChainConfig.marketConConfig.abi
    MarketContractAddress = getBlockChainConfig.marketConConfig.add;
    providerUrl = getBlockChainConfig.providerUrl;
    chainAvailable = true
    walletAddressForNonCrypto = getBlockChainConfig.walletAddressForNonCrypto
  }

  useEffect(() => {
    if (chainType) {
      if (isFocused) {
        if (chainAvailable) {
          setBuyLoading(true);
          checkNFTOnAuction();
          getNonCryptoNFTOwner();
        }
        if (data.token) {
          dispatch(getAllCards(data.token))
            .then(() => { })
            .catch(err => {
              console.log('error====', err);
            });
        }
      }
    }

    getRealtedNFT();
  }, [isFocused]);

  useEffect(() => {
    getCurrencyPrice();
  }, [wallet, baseCurrency])

  const getCurrencyPrice = async () => {
    let finalPrice = '';
    let i;
    switch (chainType) {
      case 'BinanceNtwk':
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
        finalPrice = item.price * currencyPrices?.BNB;
        break;

      case "ALIA":
        finalPrice = item.price * currencyPrices?.ALIA;
        break;

      case "ETH":
        finalPrice = item.price * currencyPrices?.ETH;
        break;

      case "MATIC":
        finalPrice = item.price * currencyPrices?.MATIC;
        break;

      default:
        finalPrice = item.price * 1;
        break;
    }
    console.log('=======finalPrice', currencyPrices, finalPrice);
    setPriceInDollar(finalPrice);
  };

  const getPaybleInPrice = (prices, paybleInCurrency) => {
    let finalPrice = '';
    switch (paybleInCurrency) {
      case "BNB":
        finalPrice = item.price * prices?.BNB;
        break;

      case "ALIA":
        finalPrice = item.price * prices?.ALIA;
        break;

      case "ETH":
        finalPrice = item.price * prices?.ETH;
        break;

      case "MATIC":
        finalPrice = item.price * prices?.MATIC;
        break;

      default:
        finalPrice = item.price * 1;
        break;
    }
    return finalPrice;
  };

  const currencyConversion = (prices, baseCurrency, paybleInCurrency) => {
    // console.log("🚀 ~ file: detail.js ~ line 332 ~ currencyConversion", prices, baseCurrency, paybleInCurrency)
    let finalPrice = '';

    let temp = currConversion(baseCurrency) / currConversion(paybleInCurrency)
    // console.log("🚀 ~ file: detail.js ~ line 334 ~ currencyConversion ~ temp", temp)
    temp = temp * item?.price
    // console.log("🚀 ~ file: detail.js ~ line 334 ~ currencyConversion ~ temp", temp)

    switch (paybleInCurrency) {
      case "BNB":
        finalPrice = temp * prices?.BNB;
        break;

      case "ALIA":
        finalPrice = temp * prices?.ALIA;
        break;

      case "ETH":
        finalPrice = temp * prices?.ETH;
        break;

      case "MATIC":
        finalPrice = temp * prices?.MATIC;
        break;

      default:
        finalPrice = temp * 1;
        break;
    }
    // return finalPrice;
  };

  const currConversion = (key) => {
    let finalPrice = '';
    switch (key) {
      case "BNB":
        finalPrice = currenciesInDollar?.BNB;
        break;

      case "ALIA":
        finalPrice = currenciesInDollar?.ALIA;
        break;

      case "ETH":
        finalPrice = currenciesInDollar?.ETH;
        break;

      case "MATIC":
        finalPrice = currenciesInDollar?.MATIC;
        break;

      default:
        finalPrice = 1;
        break;
    }
    return finalPrice;
  };

  // currencyConversion(currenciesInDollar, baseCurrency?.key, payableIn);

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

  const getRealtedNFT = async () => {
    let url =
      networkType === 'testnet'
        ? 'https://testapi.xanalia.com/xanalia/getMoreItems'
        : 'https://api.xanalia.com/xanalia/getMoreItems';
    await axios
      .post(url, {
        tokenId: nft,
        networkType,
      })
      .then(res => {
        if (res.data.data) {
          setMoreData(res.data.data);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const convertPrice = (price2, detail, tradeCurrency) => {
    let data = price2 ? detail.currency_type === "dollar" ?
      addComma(
        trimZeroFromTheEnd(showActualValue(parseFloat(price2.toString()), 4, "number"), true),
        true
      ) : addComma(
        trimZeroFromTheEnd(showActualValue(price2, 6, "number"), true),
        true
      ) + " " + tradeCurrency
      : "";

    return data;
  }

  const getPrice = (aPrice, bPrice) => {
    return aPrice &&
      parseFloat(divideNo(parseInt(aPrice?._hex, 16))) > 0
      ? divideNo(parseInt(aPrice._hex, 16)
      )
      : bPrice ? divideNo(
        parseInt(bPrice._hex, 16)
      ) : "";
  }

  const getTradeCurrency = (baseCurrency, dollarPrice) => {
    return baseCurrency ? getBaseCurrency(chainType, parseInt(baseCurrency._hex, 16))
      : dollarPrice &&
        parseFloat(divideNo(parseInt(dollarPrice?._hex, 16))) > 0 ?
        "$" : "ALIA";
  }

  const getNFTSellDetails = async (id, filterArray = []) => {
    function comparator(a, b) {
      return parseInt(b['sellDateTime'], 10) - parseInt(a['sellDateTime'], 10);
    }

    setTradingTableLoader(true)
    let url =
      networkType === 'testnet'
        ? 'https://testapi.xanalia.com/xanalia/getEventHistory'
        : 'https://api.xanalia.com/xanalia/getEventHistory';
    await axios
      .post(url, {
        tokenId: nft,
        networkType,
        filter: filterArray,
      })
      .then(async res => {
        // console.log('transactoinhistory: ', res.data.data);
        if (res.data.data.length > 0) {
          let bids = [];
          for (let i = 0; i < res.data.data.length; i++) {
            if (
              res.data.data[i].event === 'SellNFT' ||
              res.data.data[i].event === 'SellNFTNonCrypto'
            ) {

              let { dollarPrice, price, baseCurrency } = res.data.data[i].returnValues;

              let priceCond = getPrice(dollarPrice, price);

              let tradeCurr = getTradeCurrency(baseCurrency, dollarPrice)

              let obj = {
                //event: 'SellNFT',
                translatedEvent: translate('common.sales'),
                price: convertPrice(priceCond, res.data.data[i], tradeCurr),
                seller: res.data.data[i].returnValues.seller.slice(0, 6),
                owner: '',
                sellDateTime: moment
                  .unix(res.data.data[i].timestamp)
                  .format('DD-MM-YYYY HH:mm:ss'),
                dateTime: res.data.data[i].timestamp
              };
              bids = [obj, ...bids];
            }

            if (
              res.data.data[i].event === "OfferAccept"
            ) {

              let { amount } = res.data.data[i].returnValues;
              let priceCond = getPrice(amount, null);
              let tradeCurr = res.data.data[i].returnValues.currencyType ?
                getBaseCurrency(chainType, parseInt(res.data.data[i].returnValues.currencyType._hex, 16))
                : "ALIA"

              let obj = {
                //event: 'SellNFT',
                translatedEvent: translate('common.sales'),
                price: convertPrice(priceCond, res.data.data[i], tradeCurr),
                seller: res.data.data[i].returnValues.from.slice(0, 6),
                owner: res.data.data[i].returnValues.to,
                sellDateTime: moment
                  .unix(res.data.data[i].timestamp)
                  .format('DD-MM-YYYY HH:mm:ss'),
                dateTime: res.data.data[i].timestamp
              };
              bids = [obj, ...bids];
            }

            if (
              res.data.data[i].event === "UpdatePrice"
            ) {

              let sellEvent = "";
              for (let j = i + 1; j <= res.data.data.length; j++) {
                if (
                  res.data.data[j]?.event &&
                  (res.data.data[j].event === "SellNFT" ||
                    res.data.data[j].event === "SellNFTNonCrypto")
                ) {
                  sellEvent = res.data.data[j];
                  break;
                }
              }

              let { newDollarPrice, newPrice, baseCurrency } = res.data.data[i].returnValues;
              let priceCond = getPrice(newDollarPrice, newPrice);
              let tradeCurr = getTradeCurrency(baseCurrency, newDollarPrice)

              let obj = {
                translatedEvent: "UpdatePrice",
                price: convertPrice(priceCond, res.data.data[i], tradeCurr),
                seller: sellEvent?.returnValues?.seller.slice(0, 6),
                owner: "",
                sellDateTime: moment
                  .unix(res.data.data[i].timestamp)
                  .format('DD-MM-YYYY HH:mm:ss'),
                dateTime: res.data.data[i].timestamp
              };
              bids = [obj, ...bids];
            }

            if (res.data.data[i].event === 'OnAuction') {
              let { startPrice, baseCurrency, dollarPrice } = res.data.data[i].returnValues;
              let priceCond = getPrice(startPrice, null);
              let tradeCurr = getTradeCurrency(baseCurrency, dollarPrice)

              let obj = {
                //event: 'OnAuction',
                translatedEvent: translate('common.OnAuction'),
                price: convertPrice(priceCond, res.data.data[i], tradeCurr),
                seller: res.data.data[i].returnValues.seller.slice(0, 6),
                owner: '',
                sellDateTime: moment
                  .unix(res.data.data[i].timestamp)
                  .format('DD-MM-YYYY HH:mm:ss'),
                //currency_type: 'alia',
                dateTime: res.data.data[i].timestamp
              };
              bids = [obj, ...bids];
            }

            if (res.data.data[i].event === 'awardAuctionNFT') {

              let seller = "";
              for (let j = 0; j <= res.data.data.length; j++) {
                if (res.data.data[j].event === "MintWithTokenURINonCrypto") {
                  seller = res.data.data[j].returnValues.to;
                  break;
                }
              }

              let { startPrice, priceDollar, baseCurrency } = res.data.data[i].returnValues;

              let priceCond = getPrice(startPrice, priceDollar);

              let tradeCurr = getTradeCurrency(baseCurrency, priceDollar)

              let obj = {
                //event: 'OnAuction',
                translatedEvent: translate('common.OnAuction'),
                price: convertPrice(priceCond, res.data.data[i], tradeCurr),
                seller: seller,
                owner: '',
                sellDateTime: moment
                  .unix(res.data.data[i].timestamp)
                  .format('DD-MM-YYYY HH:mm:ss'),
                //currency_type: 'dollar',
                dateTime: res.data.data[i].timestamp
              };
              bids = [obj, ...bids];
            }

            if (res.data.data[i].event === 'Bid') {

              let lastAuction = "";
              for (let j = i + 1; j <= res.data.data.length; j++) {
                if (res.data.data[j].event === "OnAuction") {
                  lastAuction = res.data.data[j];
                  break;
                }
              }

              let { amount } = res.data.data[i].returnValues;

              let priceCond = getPrice(amount, null);

              let tradeCurr = lastAuction && lastAuction.returnValues.baseCurrency ?
                getBaseCurrency(chainType,
                  parseInt(lastAuction.returnValues.baseCurrency._hex, 16))
                : "ALIA"

              let obj = {
                //event: 'Bid',
                translatedEvent: translate('common.Bids'),
                price: convertPrice(priceCond, res.data.data[i], tradeCurr),
                seller: res.data.data[i].returnValues.bidder.slice(0, 6),
                owner: '',
                sellDateTime: moment
                  .unix(res.data.data[i].timestamp)
                  .format('DD-MM-YYYY HH:mm:ss'),
                //currency_type: 'alia',
                dateTime: res.data.data[i].timestamp
              };
              bids = [obj, ...bids];
            }

            if (res.data.data[i].event === 'Claim') {
              let seller = '';
              for (let j = i + 1; j <= res.data.data.length; j++) {
                if (res.data.data[j].event === 'OnAuction') {
                  seller = res.data.data[j].returnValues.seller;
                  break;
                }
              }

              let { amount } = res.data.data[i].returnValues;

              let priceCond = getPrice(amount, null);
              let tradeCurr = res.data.data[i].returnValues.baseCurrency ?
                getBaseCurrency(chainType,
                  parseInt(res.data.data[i].returnValues.baseCurrency._hex, 16))
                : "ALIA"

              let obj = {
                //event: 'Claim',
                translatedEvent: translate('common.Claim'),
                price: convertPrice(priceCond, res.data.data[i], tradeCurr),
                seller: seller,
                owner: res.data.data[i].returnValues.bidder.slice(0, 6),
                sellDateTime: moment
                  .unix(res.data.data[i].timestamp)
                  .format('DD-MM-YYYY HH:mm:ss'),
                //currency_type: 'alia',
                dateTime: res.data.data[i].timestamp
              };
              bids = [obj, ...bids];
            }

            if (
              res.data.data[i].event === 'BuyNFT' ||
              res.data.data[i].event === 'BuyNFTNonCrypto'
            ) {
              let sellEvent = "";
              let updateEvent = ""
              for (let j = i + 1; j <= res.data.data.length; j++) {
                if (res.data.data[j]?.event && res.data.data[j].event === "UpdatePrice") {
                  updateEvent = res.data.data[j]
                }
                if (
                  res.data.data[j]?.event &&
                  (res.data.data[j].event === "SellNFT" ||
                    res.data.data[j].event === "SellNFTNonCrypto")
                ) {
                  sellEvent = res.data.data[j];
                  break;
                }
              }

              let priceCond = res.data.data[i].returnValues.calculated ?
                divideNo(parseInt(res.data.data[i].returnValues.calculated._hex, 16)) :
                updateEvent ?
                  updateEvent.returnValues.newDollarPrice &&
                    parseFloat(
                      divideNo(
                        parseInt(updateEvent.returnValues.newDollarPrice?._hex, 16)
                      )
                    ) > 0
                    ? divideNo(
                      parseInt(
                        updateEvent.returnValues.newDollarPrice._hex,
                        16
                      )
                    ) : divideNo(
                      parseInt(updateEvent.returnValues.newPrice._hex, 16)
                    ) :
                  sellEvent.returnValues.dollarPrice &&
                    parseFloat(
                      divideNo(parseInt(sellEvent.returnValues.dollarPrice._hex, 16))
                    ) > 0
                    ? divideNo(
                      parseInt(sellEvent.returnValues.dollarPrice._hex, 16)
                    )
                    : divideNo(parseInt(sellEvent.returnValues.price._hex, 16))
              let tradeCurr = res.data.data[i].returnValues.currencyType ?
                getBaseCurrency(chainType,
                  parseInt(res.data.data[i].returnValues.currencyType._hex, 16)) :
                updateEvent ?
                  updateEvent.returnValues.baseCurrency ?
                    getBaseCurrency(chainType, parseInt(updateEvent.returnValues.baseCurrency._hex, 16)) :
                    updateEvent.returnValues.newDollarPrice &&
                      parseFloat(
                        divideNo(
                          parseInt(updateEvent.returnValues.newDollarPrice?._hex, 16)
                        )
                      ) > 0
                      ?
                      "$" :
                      "ALIA" :
                  sellEvent.returnValues.dollarPrice &&
                    parseInt(
                      divideNo(parseInt(sellEvent.returnValues.dollarPrice._hex, 16))
                    ) > 0
                    ? "$"
                    : "ALIA"

              let obj = {
                // 'BuyNFT',
                translatedEvent: translate('common.Buys'),
                price: convertPrice(priceCond, res.data.data[i], tradeCurr),
                seller: sellEvent?.returnValues?.seller.slice(0, 6),
                owner: res.data.data[i].returnValues.buyer.slice(0, 6),
                sellDateTime: moment
                  .unix(res.data.data[i].timestamp)
                  .format('DD-MM-YYYY HH:mm:ss'),
                dateTime: res.data.data[i].timestamp
              };
              bids = [obj, ...bids];
            }
            if (res.data.data[i].event === 'CancelSell') {
              let obj = {
                //event: 'CancelSell',
                translatedEvent: translate('common.cancelSell'),
                price: '',
                seller: res.data.data[i].returnValues.from.slice(0, 6),
                owner: '',
                sellDateTime: moment
                  .unix(res.data.data[i].timestamp)
                  .format('DD-MM-YYYY HH:mm:ss'),
                dateTime: res.data.data[i].timestamp
                //currency_type: '',
              };
              bids = [obj, ...bids];
            }

            if (
              res.data.data[i].event === 'MintWithTokenURI' ||
              res.data.data[i].event === 'MintWithTokenURINonCrypto'
            ) {
              let obj = {
                //event: 'MintWithTokenURI',
                translatedEvent: translate('common.minted'),
                price: '',
                seller: 'Null Address',
                owner: res.data.data[i].returnValues.minter ? res.data.data[i].returnValues.minter
                  : res.data.data[i].returnValues.from.toLowerCase() === walletAddressForNonCrypto.toLocaleLowerCase() ?
                    res.data.data[i].returnValues.to :
                    res.data.data[i].returnValues.from,
                sellDateTime: moment
                  .unix(res.data.data[i].timestamp)
                  .format('DD-MM-YYYY HH:mm:ss'),
                dateTime: res.data.data[i].timestamp
                //currency_type: '',
              };
              bids = [obj, ...bids];
            }
          }
          bids.sort(comparator);

          let _bidHistory = bids.filter(item => item.event === 'Bid');
          // console.log(_bidHistory, "_bidHistory")
          if (_bidHistory.length > 0) {
            // setBidHistory(_bidHistory);
            var array = [];
            array = _bidHistory.filter(item => delete item['event']);
            let bidsArray = [];
            for (let i = 0; i < array.length; i++) {
              const obj = array[i];
              bidsArray.push(Object.values(obj));
            }
            // setTableData(bidsArray);
          }
          // setSellDetails(bids);
          let dataSorted = bids.sort((a, b) => {
            const dateA = new Date(a.dateTime).valueOf();
            const dateB = new Date(b.dateTime).valueOf();
            // console.log(dateA, dateB, "aaaa")
            if (dateA > dateB) {
              return -1; // return -1 here for DESC order
            }
            return 1 // return 1 here for DESC Order
          });
          // console.log(bids, "bids333333", dataSorted)
          let arr = [];
          for (let i = 0; i < dataSorted.length; i++) {
            const obj = dataSorted[i];
            arr.push(Object.values(obj));
          }
          // console.log(arr)
          setTradingTableData(arr);
          setTimeout(() => {
            setTradingTableLoader(false)
            setLoader(false)
          }, 1000);
        } else {
          // setSellDetails([]);
          // setSellDetailsFiltered([]);
          setTradingTableLoader(false)
          setLoader(false)
        }
      })
      .catch(err => {
        setLoader(false)
        setTradingTableLoader(false)
        // setSellDetails([]);
        // setSellDetailsFiltered([]);
      });
  };
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

  const checkNFTOnAuction = () => {
    const setAuctionVariables = (
      auctionInitiatorAdd = "",
      highestBidderAdd = "",
      minBidPrice = "",
      auctionSTime = "",
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
      MarketContractAddress,
    );
    // console.log('MarketPlaceContract.methods', MarketPlaceContract.methods)
    MarketPlaceContract.methods
      .getSellDetail(collectionAddress, _tokenId)
      .call(async (err, res) => {
        // console.log('checkNFTOnAuction_res', res);
        if (!err) {
          let baseCurrency = [];
          if (res[6]) {
            baseCurrency = basePriceTokens.filter(
              token => token.chain === chainType && token.order === 1,
            );
            setBaseCurrency(baseCurrency[0]);
            // console.log('baseCurrency________', baseCurrency[0]);
          } else {
            baseCurrency = basePriceTokens.filter(
              token =>
                token.chain === chainType && token.order === parseInt(res[7]),
            );
            setBaseCurrency(baseCurrency[0]);
            // console.log('baseCurrency________', baseCurrency[0]);
          }

          if (parseInt(res[5]) * 1000 > 0) {
            setAuctionVariables(
              res[0],
              res[3],
              divideNo(res[4]),
              parseInt(res[5]) * 1000,
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
  };

  const getNonCryptoNFTOwner = async () => {
    // let tokenId = "317";
    let web3 = new Web3(providerUrl);
    let MarketPlaceContract = new web3.eth.Contract(
      MarketPlaceAbi,
      MarketContractAddress,
    );
    // console.log('MarketPlaceContract.methods', collectionAddress, _tokenId)
    if (MarketPlaceContract.methods.getNonCryptoOwner) {
      MarketPlaceContract.methods
        .getNonCryptoOwner(collectionAddress, _tokenId)
        .call(async (err, res) => {
          // console.log('getNonCryptoOwner_res', res, item.metaData.name);
          if (res) {
            // console.log("crypto user")
            setNonCryptoOwnerId(res)
            getOwnerDetailsById(res);
            lastOwnerOfNFTNonCrypto(res);
            await getTokenDetailsApi(false);
          } else if (!res) {
            // console.log("non crypto user")
            lastOwnerOfNFT();
            await getTokenDetailsApi();
          } else if (err) {
            setLoader(false);
            console.log('error----->', err);
          }
        });
    } else {
      lastOwnerOfNFT();
      await getTokenDetailsApi();
    }
  };

  const getOwnerDetailsById = async (id) => {
    const profileUrl = `${BASE_URL}/user/get-public-profile?userId=${id}`;
    try {
      let profile = await axios.get(profileUrl);
      // console.log(profile, "non_crypto", item.metaData.name)
      setOwnerDataN(profile?.data?.data)
      setOwnerN(id);
    } catch (err) {
      setLoader(false);
    }
  };

  const getPublicProfile = async (id, type) => {
    const userId = id?.toLowerCase();
    let profileUrl = type
      ? `${BASE_URL}/user/get-public-profile?publicAddress=${userId}`
      : `${BASE_URL}/user/get-public-profile?userId=${userId}`;
    // setOwnerId(userId);
    let profile = await axios.get(profileUrl);
    // console.log(profile.data, "userIduserIduserIduserId")

    if (profile.data.success) {
      // console.log(profile?.data?.data, "crypto")
      setOwnerDataN(profile.data.data);
      setOwnerN(userId);
    } else {
      setOwnerN(userId);
    }

  };
  const lastOwnerOfNFTNonCrypto = nonCryptoOwner => {
    let _data = singleNFT;
    let web3 = new Web3(providerUrl);
    let ERC721Contract = new web3.eth.Contract(ERC721Abi, collectionAddress);

    let MarketPlaceContract = new web3.eth.Contract(
      MarketPlaceAbi,
      MarketContractAddress,
    );
    ERC721Contract.methods.ownerOf(_tokenId).call((err, res) => {
      if (!err) {
        _data.owner_address = res;
        // console.log('owner_address', res, _tokenId);
        MarketPlaceContract.methods
          .getSellDetail(collectionAddress, _tokenId)
          .call(async (err, res) => {
            // console.log(
            //   'MarketPlaceContract_res',
            //   res[0] === '0x0000000000000000000000000000000000000000',
            //   res[0] !== '0x0000000000000000000000000000000000000000',
            //   wallet?.address
            // );
            // return ;
            if (!err) {
              let priceOfNft = res[1] / 1e18;
              if (wallet?.address) {
                // if (priceOfNft === 0) {
                if (res[0] === '0x0000000000000000000000000000000000000000') {
                  setPriceNFT(priceOfNft);
                  setPriceNFTString(res[1]);
                  setIsContractOwner(
                    res[0].toLowerCase() === wallet.address.toLowerCase() ||
                      (res[0].toLowerCase() ===
                        walletAddressForNonCrypto.toLowerCase() &&
                        data &&
                        nonCryptoOwnerId.toLowerCase() === data.user._id)
                      ? true
                      : false,
                  );
                  setIsOwner(
                    (_data.owner_address.toLowerCase() === wallet.address.toLowerCase() &&
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
                    (res[0].toLowerCase() === wallet.address.toLowerCase() && res[1] !== "") ||
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
                        nonCryptoOwnerId.toLowerCase() === data.user._id)
                      ? true
                      : false,
                  );
                  setPriceNFT(priceOfNft);
                  setPriceNFTString(res[1]);
                }
              } else {
                if (res[0] === '0x0000000000000000000000000000000000000000') {
                  setIsContractOwner(false);
                  setPriceNFT(priceOfNft);
                  setPriceNFTString(res[1]);
                } else if (
                  res[0] !== '0x0000000000000000000000000000000000000000'
                ) {
                  setPriceNFT(priceOfNft);
                  setPriceNFTString(res[1]);
                  setIsContractOwner(false);
                }
              }

              setOwnerAddress(nonCryptoOwner);
            } else {
              setLoader(false);
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
    let ERC721Contract = new web3.eth.Contract(ERC721Abi, collectionAddress);

    let MarketPlaceContract = new web3.eth.Contract(
      MarketPlaceAbi,
      MarketContractAddress,
    );
    ERC721Contract.methods.ownerOf(_tokenId).call((err, res) => {
      if (!err) {
        _data.owner_address = res;
        // console.log('owner_address', res);
        MarketPlaceContract.methods
          .getSellDetail(collectionAddress, _tokenId)
          .call((err, res) => {
            // console.log('getSellDetail public', res, item.metaData.name);
            if (!err) {
              let priceOfNft = res[1] / 1e18;
              let _ownerAddress = _data.owner_address;
              if (wallet?.address) {
                if (res[0] !== '0x0000000000000000000000000000000000000000') {
                  _ownerAddress = res[0];
                  getPublicProfile(res[0], true);
                  setIsOwner(
                    res[0].toLowerCase() === wallet.address.toLowerCase() &&
                      res[1] !== ''
                      ? true
                      : false,
                  );
                } else {
                  getPublicProfile(_ownerAddress, true);
                  setIsOwner(
                    _ownerAddress.toLowerCase() ===
                      wallet.address.toLowerCase() && res[1] !== ''
                      ? true
                      : false,
                  );
                }
                setIsContractOwner(
                  res[0].toLowerCase() === wallet.address.toLowerCase()
                    ? true
                    : false,
                );
                setPriceNFT(priceOfNft);
                setPriceNFTString(res[1]);
              } else {
                // if (priceOfNft === 0) {
                if (res[0] === '0x0000000000000000000000000000000000000000') {
                  setIsContractOwner(false);
                  setPriceNFT(priceOfNft);
                  setPriceNFTString(res[1]);
                  getPublicProfile(_ownerAddress, true);
                } else if (
                  res[0] !== '0x0000000000000000000000000000000000000000'
                ) {
                  getPublicProfile(res[0], true);
                  setIsContractOwner(false);
                  setPriceNFT(priceOfNft);
                  setPriceNFTString(res[1]);
                }
              }
              setOwnerAddress(_ownerAddress);
            } else {
              setLoader(false);
            }
            setBuyLoading(false);
          });
      } else {
        //console.log("err getAuthor", err);
        setBuyLoading(false);
      }
    });
  };

  const getCollectionByAddress = (c) => {
    let url = `${BASE_URL}/xanalia/collection-info?collectionAddr=${c.toLowerCase()}`

    // console.log(c, "response.data")
    axios
      .get(url)
      .then((response) => {
        // console.log('response from collection info', response.data)
        if (response.data) {
          setcollectCreat(response.data.data)
        }
      })
      .catch((err) => { console.log('err from collection info', err) });
  }

  const getTokenDetailsApi = async () => {
    let category = '2D';
    let data = {
      tokenId: nft,
      networkType: networkType,
      type: category,
      chain: chainType,
      owner: wallet?.address,
    };

    let fetch_data_body = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    // console.log('/xanalia/getDetailNFT called')
    fetch(`${BASE_URL}/xanalia/getDetailNFT`, fetch_data_body)
      .then(response => response.json())
      .then(async res => {
        // console.log('getDetailNFT_res', res);
        if (res.data.length > 0 && res.data !== 'No record found') {

          let data = await getNFTDetails(res.data[0]);
          setLike(data.like)
          if (route.params.hasOwnProperty("routeName") && (route.params.routeName === "Search" || "Detail")) {
            let collection = data.offchain
              ? data.collectionOffChainId
              : data.collectionAdd.toString().split("-")[1];
            // console.log("yahoo")
            getCollectionByAddress(collection);
            let req_data = {
              owner: res.data[0]?.returnValues?.to?.toLowerCase(),
              token: 'HubyJ*%qcqR0',
            };

            let body = {
              method: 'POST',
              body: JSON.stringify(req_data),
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
            };
            await fetch(`${BASE_URL}/xanalia/getProfile`, body)
              .then(response => response.json())
              .then(response => {
                // console.log(response.data, "///////", item.metaData.name)
                if (response.data) {
                  setArtist(res.data[0]?.returnValues?.to?.toLowerCase());
                  setArtistData(response.data);
                }
              });
          }
          // console.log('NFT Detail', data, data.newprice);
          if (data.newprice && data.newprice.allowedCurrencies) {
            let currArray = data.newprice.allowedCurrencies.split('');
            let availableTokens = basePriceTokens.filter(
              token =>
                token.chain === chainType &&
                currArray.includes(token.order.toString()),
            );
            // console.log('availableTokens S', availableTokens);
            setAvailableTokens(availableTokens);
            setPayableIn(availableTokens[0].name);
          } else {
            // console.log('availableTokens F', availableTokens);
            setAvailableTokens([]);
          }

          setSingleNFT(data);
          setIsForAward(
            res?.data[0]?.award
              ? res?.data[0]?.award
              : res?.data[1]?.award
                ? res?.data[1]?.award
                : false,
          );
          // console.log('calling');
          //checkNFTOnAuction();
          getNFTSellDetails();
        } else if (res.data === 'No record found') {
          setLoader(false);
          // console.log('res.data.data', res.data);
        }
      })
      .catch(err => {
        setLoader(false);
        // console.log(err)
      });
  };

  const getNFTDetails = async obj => {
    let _MarketPlaceAbi = ERC721Abi;
    let _MarketContractAddress = collectionAddress;

    let web3 = new Web3(providerUrl);
    if (_tokenId) {
      let nftChain = chainType;
      let collectionAdd = collectionAddress;
      let nftId = _tokenId;

      obj.chainType = nftChain ? nftChain : '';
      obj.polygonId = '';
      obj.collection = collectionAdd;
      obj.collectionAdd = obj.tokenId;
      obj.tokenId = nftId;
    }

    let MarketPlaceContract = new web3.eth.Contract(
      _MarketPlaceAbi,
      _MarketContractAddress,
    );

    let nftObj = {
      image: obj.metaData.image,
      description: obj.metaData.description,
      title: obj.metaData.name,
      type: obj.metaData.properties.type,
      price: obj.price ? obj.price : "",
      rating: obj.rating,
      like: obj.like,
      author: obj.returnValues.to,
      _id: obj._id,
      thumbnailUrl: obj?.thumbnailUrl,
      imageForVideo: obj?.metaData?.thumbnft
        ? obj?.metaData?.thumbnft
        : obj?.thumbnailUrl,
      newprice: obj.newprice,
      approval: obj.approval,
      id: obj.tokenId,
      buyTxHash: obj?.buyTxHash ? obj?.buyTxHash : "",
      offchain: obj?.offchain ? obj?.offchain : false,
      collectionOffChainId: obj?.returnValues?.collection
        ? obj?.returnValues?.collection
        : "",

      seriesId: obj?.seriesId
        ? obj?.seriesId
        : "",
      secondarySales: obj.secondarySales ? true : false,
      lastTradeType: obj.newprice2 && obj.newprice2?.type === 'auction' ? "auction" : "sell",
      collection: _MarketContractAddress,
      collectionAdd: obj.collectionAdd,
      nftChain: obj.chainType,
      logoImg: `${CDN_LINK}/logo-v2.svg`
    };

    await MarketPlaceContract.methods
      .ownerOf(nftObj.id)
      .call(function (err, res) {
        // console.log('aaaaaaaa', res, err);
        if (!err) {
          nftObj.owner_address = res;
        }
      });

    return nftObj;
  };

  const getNFTDiscount = id => {
    // let web3 = new Web3(providerUrl);
    // let MarketPlaceContract = new web3.eth.Contract(
    //   MarketPlaceAbi,
    //   MarketContractAddress,
    // );
    // MarketPlaceContract.methods.adminOwner &&
    //   MarketPlaceContract.methods.adminOwner(id).call((err, res) => {
    //     setDiscount(res);
    //   });
  };

  const getDiscount = () => {
    // let web3 = new Web3(providerUrl);
    // let MarketPlaceContract = new web3.eth.Contract(
    //   MarketPlaceAbi,
    //   MarketContractAddress,
    // );
    // MarketPlaceContract.methods.adminDiscount &&
    //   MarketPlaceContract.methods.adminDiscount().call((err, res) => {
    //     setDiscountValue(res ? res / 10 : 0);
    //   });
  };

  const calculatePrice = async (price1, tradeCurr, owner, _baseCurrency) => {
    let web3 = new Web3(providerUrl);
    let MarketPlaceContract = new web3.eth.Contract(
      MarketPlaceAbi,
      MarketContractAddress,
    );

    let res = await MarketPlaceContract.methods
      .calculatePrice(
        price1,
        _baseCurrency.order,
        tradeCurr,
        _tokenId,
        owner,
        collectionAddress,
      )
      .call();
    // console.log('calculate price response', res, price);
    if (res) return res;
    else return '';
  };

  const bidingTimeEnded = () => {
    return new Date().getTime() > new Date(auctionETime).getTime();
  };

  const setNFTStatus = () => {
    let _nftStatus = '';
    if (isContractOwner) {
      if (nFTOnAuction && lBidAmount !== '0.000000000000000000') {
        // console.log('set NftStatus 1');
        _nftStatus = undefined;
      } else if (isForAward) {
        // console.log('set NftStatus 1.1');
        _nftStatus = undefined;
      } else {
        // console.log('set NftStatus 2');
        _nftStatus = 'onSell';
      }
    } else if (isOwner) {
      // console.log('set NftStatus 3');
      _nftStatus = 'sell';
    } else if (
      priceNFT ||
      (nFTOnAuction &&
        auctionInitiatorAdd.toLowerCase() !== wallet?.address.toLowerCase())
    ) {
      if (
        nFTOnAuction &&
        auctionInitiatorAdd.toLowerCase() !== wallet?.address.toLowerCase() &&
        bidingTimeEnded() !== true
      ) {
        // console.log('set NftStatus 4');
        _nftStatus = undefined;
      } else if (priceNFT && !nFTOnAuction) {
        if (wallet?.address) {
          // console.log('set NftStatus 5');
          _nftStatus = 'buy';
        } else {
          // console.log('set NftStatus 6');
          _nftStatus = 'buy';
        }
      } else {
        // console.log('set NftStatus 7');
        _nftStatus = undefined;
      }
    } else {
      // console.log('set NftStatus 8');
      _nftStatus = 'notOnSell';
    }
    // console.log(
    //   '_nftStatus',
    //   isContractOwner,
    //   isOwner,
    //   priceNFT || (nFTOnAuction &&
    //     auctionInitiatorAdd.toLowerCase() !== wallet?.address.toLowerCase())
    // );
    return _nftStatus;
  };

  const onProfile = (ownerStatus) => {
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
  const renderItem = ({ item }) => {
    // let findIndex = moreData.findIndex(x => x.id === item.id);
    if (item.metaData) {
      // it's temporary fix
      const imageUri = item.metaData?.image?.replace('nftdata', 'nftData') || item.thumbnailUr;

      const image = item.metaData.image || item.thumbnailUrl;
      const fileType = image ? image?.split('.')[image?.split('.').length - 1] : '';
      // console.log(fileType, item.metaData.name, "item.metaData.name")
      return (
        <TouchableOpacity
          onPress={() => {
            setVideoURI(null);
            navigation.push('CertificateDetail', {
              owner: ownerN,
              ownerData: ownerDataN,
              artistId: artist,
              collectCreat: collectCreatData,
              artistData: artistDetail,
              video: item.metaData.image,
              fileType: fileType,
              item: item,
              index: index,
              routeName: "Detail"
            });
          }}
          style={styles.listItem}>
          <C_Image
            type={
              item.metaData.image.split('.')[
              item.metaData.image.split('.').length - 1
              ]
            }
            uri={imageUri}
            imageStyle={styles.listImage}
          />
        </TouchableOpacity>
      );
    }
  };

  const Filters = props => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState([]);
    const [items, setItems] = useState([
      { label: translate('common.minted'), value: translate('common.minted') },
      { label: translate('common.sales'), value: translate('common.sales') },
      { label: translate('common.Bids'), value: translate('common.Bids') },
      { label: translate('common.Buys'), value: translate('common.Buys') },
      { label: translate('common.Claim'), value: translate('common.Claim') },
      {
        label: translate('common.OnAuction'),
        value: translate('common.OnAuction'),
      },
      {
        label: translate('common.cancelSell'),
        value: translate('common.cancelSell'),
      },
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
        placeholder={translate('wallet.common.filter')}
        maxHeight={hp(20)}
      />
    );
  };

  const collectionClick = () => {
    // console.log('collectCreat', collectCreatData?.collectionName)
    if (collectCreatData?.userId === "0") {
      return true;
    } else {
      switch (collectCreatData?.collectionName) {
        case "ULTRAMAN":
          return true;
        case "MONKEY COSER 101":
          return true;
        case "Underground City":
          return true;
        case "TIF2021 After Party":
          return true;
        case "Shinnosuke Tachibana":
          return true;
        case "XANA Alpha pass":
          return true;
        case "Shinnosuke Tachibana TEST":
          return true;
        default:
          return false;
      }
    }
  }

  const getAuctionTimeRemain = item => {
    if (item.newprice && item.newprice.endTime && new Date(item.newprice.endTime) < new Date().getTime()) {
      return translate('common.biddingTime');
    }
    if (item.newprice && item.newprice.endTime) {
      const diff =
        new Date(item.newprice.endTime).getTime() - new Date().getTime();
      if (diff <= 0) {
        return null;
      } else {
        let days = parseInt(diff / (1000 * 60 * 60 * 24));
        let hours = parseInt(diff / (1000 * 60 * 60));
        let mins = parseInt(diff / (1000 * 60));
        let secs = parseInt(diff / 1000);

        if (days > 0) {
          return `${translate('common.saleEndIn')} : ${days} ${translate('common.day')}`;
        } else if (hours > 0) {
          return `${translate('common.saleEndIn')} : ${hours} ${translate('common.hours')}`;
        } else if (mins > 0) {
          return `${translate('common.saleEndIn')} : ${mins} ${translate('common.min')}`;
        } else if (secs > 0) {
          return `${translate('common.saleEndIn')} : ${secs} ${translate('common.sec')}`;
        } else {
          return `${translate('common.saleEndIn')} ${hours}:${mins}:${secs} `;
        }
      }
    }
    return null;
  };

  const handleLikeMethod = async () => {
    let nftItem = { ...item, like: isLike }
    const handleLikeM = await handleLike(wallet, data, nftItem);
    if (handleLikeM) {
      if (route.params.hasOwnProperty("setNftItem") && route.params.setNftItem) {
        route.params.setNftItem(handleLikeM)
      }
    }
  }

  const closeSuccess = () => {
    setSuccessModalVisible(false);
    setLoader(true)
    // console.log("yahoo")
    getNonCryptoNFTOwner();
  }
  let disableCreator = false;
  let creatorName = artistDetail && artist
    ? artist.includes("0x")
      ? artistDetail.hasOwnProperty("title") && artistDetail.title ?
        artistDetail.title
        : (artist === '0x913d90bf7e4A2B1Ae54Bd5179cDE2e7cE712214A'.toLowerCase()
          || artist === '0xf45C0d38Df3eac6bf6d0fF74D53421Dc34E14C04'.toLowerCase()
          || artist === '0x77FFb287573b46AbDdcEB7F2822588A847358933'.toLowerCase()
          || artist === '0xfaae9d5b6f4779689bd273ab30f78beab3a0fc8f'.toLowerCase())
          ? (
            disableCreator = true,
            collectCreatData?.creator
          )
          : artist.substring(0, 6)
      : artistDetail === "No record found" ?
        artist.substring(0, 6) :
        artistDetail.hasOwnProperty("username") && artistDetail.username ?
          artistDetail.username.substring(0, 6) : artist.substring(0, 6)
    : artist ? artist?.substring(0, 6) : "";
  // console.log(item, "/////////")
  // console.log(isLike, item)
  return (
    <>
      {
        loader && <FetchingIndicator />
      }
      <SafeAreaView style={styles.mainContainer}>
        <AppHeader
          showBackButton
          title={translate('wallet.common.detail')}
          showRightComponent={
            <View style={{ paddingRight: 10 }}>
              <Menu onSelect={value => {
                alertWithSingleBtn(
                  translate('common.Confirm'),
                  value === 1 ? translate('common.nftReported') : translate('common.userBlocked'))
              }}>
                <MenuTrigger children={<ThreeDotsVerticalIcon />} />
                <MenuOptions>
                  <MenuOption value={1}>
                    <Text style={{ marginVertical: 10 }}>{translate('common.reportNft')}</Text>
                  </MenuOption>
                  <MenuOption value={2}>
                    <Text style={{ marginVertical: 10 }}>{translate('common.blockUser')}</Text>
                  </MenuOption>
                </MenuOptions>
              </Menu>
            </View>
          }
        />
        <ScrollView showsVerticalScrollIndicator={false} ref={scrollRef}>
          <TouchableOpacity activeOpacity={1} onPress={() => {
            let status = !playVideo;
            if (showThumb) {
              setVideoLoad(true)
            }else{
              setPlayVideoLoad(true)
            }
            if(!status){
              setVideoLoad(false);
              setPlayVideoLoad(false)
            }
            toggleVideoPlay(status)
          }}>
            {fileType.toLowerCase() === 'mp4' ||
              fileType.toLowerCase() === 'mov' ? (
              <View style={{ ...styles.modalImage }}>
                {showThumb &&
                  <C_Image
                    uri={item.metaData.thumbnft}
                    imageStyle={styles.modalImage}
                    isContain
                  />
                }
                <Video
                  key={videoKey}
                  ref={refVideo}
                  source={{ uri: videoURL }}
                  repeat
                  playInBackground={false}
                  paused={!playVideo}
                  onProgress={r => {
                      setVideoLoad(false)
                      setPlayVideoLoad(false)
                  }}
                  resizeMode={'cover'}
                  onError={(error) => {
                    console.log(error)
                    setVideoLoadErr(true)
                  }}
                  onReadyForDisplay={() => {
                    toggleThumb(false)
                  }}
                  onLoad={(data) => {
                    refVideo.current.seek(0)
                  }}
                  style={[styles.video]}
                />

                {(!playVideo && !videoLoad) && (
                  <View style={styles.videoPlayIconCont}>
                    <View
                      style={styles.videoPlayIconChild}>
                      <PlayButtonIcon width={SIZE(100)} height={SIZE(100)} />
                    </View>
                  </View>
                )
                }
                {
                  ((videoLoad || playVideoLoad) && !videoLoadErr ) &&
                  <View style={styles.videoPlayIconCont}>
                    <View
                      style={styles.videoPlayIconChild}>
                      <ActivityIndicator size="large" color='white' />
                    </View>
                  </View>
                }
                {
                  videoLoadErr &&
                  <View style={styles.videoPlayIconCont}>
                    <View style={{ backgroundColor: "rgba(0,0,0,0.5)" }} >
                      <TouchableOpacity onPress={() => {
                        setVideoLoadErr(false)
                        setVideoKey(videoKey + 1)
                      }} style={{ paddingHorizontal: 15, paddingVertical: 10 }} >
                        <Text style={styles.retry} >Retry Loading</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                }

              </View>
            ) : (
              <C_Image
                uri={item.thumbnailUrl}
                imageStyle={styles.modalImage}
                isContain
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setLike(!isLike);
              handleLikeMethod()
              // dispatch(handleLikeDislike(item, index));
            }}
            style={styles.likeButton}>
            {isLike ? <HeartActiveIcon /> : <HeartWhiteIcon />}
          </TouchableOpacity>
          <View style={styles.person}>
            <TouchableOpacity
              onPress={() => {
                if (!disableCreator) {
                  onProfile(false)
                }
              }}
              style={styles.personType}>
              <Image
                style={styles.iconsImage}
                source={
                  artistDetail && artistDetail.hasOwnProperty("profile_image") && artistDetail.profile_image ? { uri: artistDetail.profile_image } : IMAGES.DEFAULTPROFILE
                }
              />
              <View>
                <Text style={styles.personTypeText}>
                  {translate('common.creator')}
                </Text>
                <Text numberOfLines={1} style={styles.personName}>
                  {
                    creatorName
                  }
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={collectionClick()}
              onPress={() => {
                if (collectCreatData) {
                  if (collectCreatData.blind) {
                    console.log('========collection tab => blind2', collectCreatData.blind, collectCreatData.collectionId)
                    navigation.push('CollectionDetail', { isBlind: true, collectionId: collectCreatData._id, isHotCollection: false });
                  } else {
                    navigation.push('CollectionDetail', { isBlind: false, collectionId: collectCreatData._id, isHotCollection: true });
                  }
                }
              }}
              style={styles.personType}>
              <Image
                style={styles.iconsImage}
                source={
                  collectCreatData ? { uri: collectCreatData.iconImage } : IMAGES.DEFAULTPROFILE
                }
              />
              <View>
                <Text style={styles.personTypeText}>
                  {translate('wallet.common.collection')}
                </Text>
                <Text numberOfLines={1} style={styles.personName}>
                  {collectCreatData &&
                    collectCreatData.collectionName
                  }
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onProfile(true)}
              style={styles.personType}>
              <Image
                style={styles.iconsImage}
                source={
                  ownerDataN && ownerDataN.hasOwnProperty("profile_image") && ownerDataN.profile_image ? { uri: ownerDataN.profile_image } : IMAGES.DEFAULTPROFILE
                }
              />
              <View>
                <Text style={styles.personTypeText}>
                  {translate('common.owner')}
                </Text>
                <Text numberOfLines={1} style={styles.personName}>
                  {
                    ownerDataN && (
                      ownerDataN.role === 'crypto' ?
                        ownerDataN.title ?
                          ownerDataN.title :
                          ownerN?.includes("0x")
                            ? ownerN?.substring(0, 6)
                            : ownerN?.substring(0, 6) :
                        ownerDataN.role === 'non_crypto' ?
                          ownerDataN.username ?
                            ownerDataN.username : ""
                          : "")
                  }
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.nftTitle} ellipsizeMode="tail" numberOfLines={1}>
            {creatorName}
          </Text>
          <Text style={styles.nftName}>{item.metaData.name}</Text>
          {setNFTStatus() !== 'notOnSell' && (
            <View style={{ flexDirection: "row", paddingHorizontal: SIZE(12) }} >
              <View style={[{ flex: 1, flexDirection: "row", alignItems: "center", marginRight: wp(2) }]}>
                <Text style={styles.price}>{item.price ? numberWithCommas(parseFloat(Number(item.price).toFixed(4))) : 0}<Text style={styles.priceUnit}>
                  {` ${baseCurrency?.key}`}<Text style={styles.dollarText}>
                    {` ($${parseFloat(priceInDollar, true).toFixed(2)})`}
                  </Text></Text>
                </Text>
                {/* <Text style={styles.priceUnit}>{finalPrice}</Text> */}
              </View>
              <View style={{ flex: 0.4 }} >
                {availableTokens.length > 0 &&
                  setNFTStatus() !== 'notOnSell' &&
                  setNFTStatus() !== 'onSell' &&
                  data?.user?.role === 'crypto' && (
                    <>
                      <Text style={[styles.payIn]}>{translate('wallet.common.buyerpayin')}</Text>
                      <CardField
                        inputProps={{ value: payableIn }}
                        onPress={() => {
                          setAllowedTokenModal(true);
                        }}
                        pressable
                        showRight
                        contStyle={{ height: hp("5%") }}
                      />
                    </>
                  )}
              </View>
            </View>
          )}
          <Text style={styles.description}>{item.metaData.description}</Text>
          {getAuctionTimeRemain(item) ? (
            <View style={{ padding: 10, borderWidth: 1, borderColor: '#eeeeee', borderRadius: 4, marginHorizontal: 15, marginBottom: 10 }}>
              <Text style={{ fontSize: 11, }}>{getAuctionTimeRemain(item)}</Text>
            </View>
          ) : null}

          <View style={styles.bottomView}>
            {setNFTStatus() !== undefined &&
              <GroupButton
                leftText={
                  setNFTStatus() === 'onSell'
                    ? translate('common.cancelSell')
                    : setNFTStatus() === 'sell'
                      ? (singleNFT?.secondarySales ? translate("wallet.common.reSell") : translate('common.sell'))
                      : setNFTStatus() === 'buy'
                        ? translate('common.buy')
                        : setNFTStatus() === 'notOnSell'
                          ? translate('common.soonOnSell')
                          : translate('common.buy')
                }
                rightText={translate('wallet.common.offerPrice')}
                leftDisabled={setNFTStatus() === '' || setNFTStatus() === 'notOnSell'}
                leftLoading={buyLoading}
                onLeftPress={() => {
                  // console.log('priceOfNft', priceNFT);
                  if (buyLoading) return;
                  // navigation.navigate('WalletConnect')
                  // if(price && price > 0){
                  if (setNFTStatus() === 'buy') {
                    // if (payableIn === translate('common.allowedcurrency')) {
                    //   alertWithSingleBtn(
                    //     translate('wallet.common.alert'),
                    //     translate('common.Selectcurrencypopup'),
                    //   );
                    // } else {
                    setShowPaymentMethod(true);
                    // }
                  } else if (setNFTStatus() === 'sell') {
                    navigation.navigate('sellNft', { nftDetail: singleNFT });
                  }
                  // }
                }}
                leftHide={setNFTStatus() === undefined}
                rightHide
                onRightPress={() => navigation.navigate('MakeBid')}
              />
            }
            {setNFTStatus() === 'onSell' && (
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <AppButton
                  label={(item.price ? numberWithCommas(parseFloat(Number(item.price).toFixed(4))) : 0) + ' ' + baseCurrency?.key}
                  containerStyle={[styles.button, CommonStyles.outlineButton]}
                  labelStyle={[CommonStyles.outlineButtonLabel]}
                  onPress={() => { }}
                />
                <AppButton
                  label={translate('common.editPrice')}
                  containerStyle={styles.button}
                  labelStyle={CommonStyles.buttonLabel}
                  onPress={() => { }}
                />
              </View>
            )}
          </View>
          <NFTDetailDropdown
            title={translate('common.creator')}
            icon={details}
            containerStyles={{ marginTop: hp(2) }}>
            <TouchableOpacity
              onPress={() => {
                if (!disableCreator) {
                  onProfile(false)
                }
              }}
              style={styles.personType}>
              <Image
                style={styles.creatorImage}
                source={
                  artistDetail && artistDetail.hasOwnProperty("profile_image") && artistDetail.profile_image ? { uri: artistDetail.profile_image } : IMAGES.DEFAULTPROFILE
                }
              />
              <View>
                <Text numberOfLines={1} style={styles.creatorName}>
                  {creatorName}
                </Text>
              </View>
            </TouchableOpacity>
          </NFTDetailDropdown>
          <NFTDetailDropdown
            title={translate('wallet.common.detail')}
            icon={details}>
            <View style={styles.rowContainer}>
              <TextView style={styles.rowText}>
                {translate('wallet.common.contractAddress')}
              </TextView>
              <TextView
                style={[styles.rowText, { color: Colors.themeColor }]}
                ellipsizeMode="middle"
                numberOfLines={1}>
                {MarketContractAddress}
              </TextView>
            </View>
            <View style={styles.rowContainer}>
              <TextView style={styles.rowText}>
                {translate('wallet.common.nftId')}
              </TextView>
              <TextView style={styles.rowText}>{_tokenId}</TextView>
            </View>
            <View style={styles.rowContainer}>
              <TextView style={styles.rowText}>
                {translate('wallet.common.tokenStandard')}
              </TextView>
              <TextView style={styles.rowText}>ERC721</TextView>
            </View>
            <View style={styles.rowContainer}>
              <TextView style={styles.rowText}>
                {translate('wallet.common.blockChainType')}
              </TextView>
              <TextView style={[styles.rowText, { textTransform: 'uppercase' }]}>
                {chainType}
              </TextView>
            </View>
          </NFTDetailDropdown>
          {
            tradingTableLoader ?
              <View style={{ paddingVertical: 10, }} >
                <ActivityIndicator size={"small"} />
              </View> :
              <NFTDetailDropdown
                title={translate('common.tradingHistory')}
                containerChildStyles={{
                  height: tradingTableData.length == 0 ? hp(19) :
                    tradingTableData.length < 5 ?
                      hp(16) + (hp(6) * tradingTableData.length) : hp(47.6)
                }}
                icon={trading}>
                <Filters />
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  style={{ marginTop: hp(2) }}>
                  <Table borderStyle={{ borderWidth: 1, borderColor: Colors.GREY9 }}>
                    <Row
                      data={tradingTableHead}
                      style={styles.head}
                      textStyle={styles.text}
                      widthArr={[90, 100, 140, 130, 150]}
                    />
                    {tradingTableData.length > 0 ? (
                      <Rows
                        data={tradingTableData}
                        textStyle={styles.text}
                        widthArr={[90, 100, 140, 130, 150]}
                      />
                    ) : (
                      <Text style={styles.emptyData}>
                        {translate('common.noDataFound')}
                      </Text>
                    )}
                  </Table>
                </ScrollView>
              </NFTDetailDropdown>
          }

          <NFTDetailDropdown
            title={translate('wallet.common.collectionHint')}
            icon={grid}>
            {moreData.length !== 0 ? (
              <FlatList
                data={moreData}
                numColumns={3}
                horizontal={false}
                renderItem={renderItem}
                keyExtractor={(v, i) => 'item_' + i}
              />
            ) : (
              <View style={styles.sorryMessageCont}>
                <Text style={styles.sorryMessage}>
                  {translate('common.noNFT')}
                </Text>
              </View>
            )}
          </NFTDetailDropdown>
        </ScrollView>
      </SafeAreaView>

      <PaymentMethod
        visible={showPaymentMethod}
        payableIn={payableIn}
        price={item.price ? item.price : 0}
        priceStr={priceNFTString}
        priceInDollar={payableIn ? getPaybleInPrice(currenciesInDollar, payableIn) : priceInDollar}
        baseCurrency={baseCurrency}
        allowedTokens={availableTokens}
        ownerAddress={
          ownerAddress?.includes('0x')
            ? ownerAddress
            : walletAddressForNonCrypto
        }
        id={singleNFT.id}
        collectionAddress={collectionAddress}
        chain={chainType}
        onRequestClose={() => setShowPaymentMethod(false)}
      />
      <PaymentNow
        visible={showPaymentNow}
        price={item.price ? item.price : 0}
        priceInDollar={priceInDollar}
        chain={chainType}
        NftId={_tokenId}
        IdWithChain={nft}
        ownerId={nonCryptoOwnerId}
        ownerAddress={
          ownerAddress.includes('0x') ? ownerAddress : walletAddressForNonCrypto
        }
        baseCurrency={baseCurrency}
        collectionAddress={collectionAddress}
        lastBidAmount={priceNFT}
        onRequestClose={() => {
          dispatch(setPaymentObject(null));
          setShowPaymentNow(false);
        }}
        onPaymentDone={() => {
          dispatch(setPaymentObject(null));
          setBuyLoading(true);
          setShowPaymentNow(false);
          setSuccessModalVisible(true);
        }}
      />
      <TabModal
        modalProps={{
          isVisible: allowedTokenModal,
          onBackdropPress: () => {
            setAllowedTokenModal(false);
          },
        }}
        data={{ data: availableTokens }}
        title={translate('common.allowedcurrency')}
        itemPress={v => {
          setPayableIn(v.name);
          setAllowedTokenModal(false);
        }}
        renderItemName={'name'}
      />
      <AppModal
        visible={successModalVisible}
        onRequestClose={closeSuccess}>
        <SuccessModalContent
          onClose={closeSuccess}
          onDonePress={closeSuccess}
          sucessMsg={translate('wallet.common.purchasedSuccess')}
        />
      </AppModal>
    </>
  );
};

export default DetailScreen;
