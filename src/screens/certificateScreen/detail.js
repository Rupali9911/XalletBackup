import Slider from '@react-native-community/slider';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CountDown from 'react-native-countdown-component';
import DatePicker from 'react-native-date-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import Video from 'react-native-fast-video';
import Modal from 'react-native-modal';
import {Menu, MenuTrigger} from 'react-native-popup-menu';
import Sound from 'react-native-sound';
import {Cell, Row, Table, TableWrapper} from 'react-native-table-component';
import {
  default as PlayPause,
  default as PlaySpeed,
} from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMute from 'react-native-vector-icons/Octicons';
import {useDispatch, useSelector} from 'react-redux';
import {IMAGES, SIZE, SVGS} from 'src/constants';
import detailsImg from '../../../assets/images/details.png';
import historyImg from '../../../assets/images/history.png';
import tradingImg from '../../../assets/images/trading.png';
import {NEW_BASE_URL} from '../../common/constants';
import Fee from '../../common/fee';
import {twitterLink} from '../../common/function';
import {AppHeader, C_Image, GroupButton} from '../../components';
import AppBackground from '../../components/appBackground';
import AppModal from '../../components/appModal';
import TextView from '../../components/appText';
import Checkbox from '../../components/checkbox';
import NFTDetailDropdown from '../../components/NFTDetailDropdown';
import NFTItem from '../../components/NFTItem';
import TransactionPending from '../../components/Popup/transactionPending';
import SuccessModalContent from '../../components/successModal';
import {
  AMOUNT_BID_HIGHER,
  CATEGORY_VALUE,
  COLORS,
  compareAddress,
  FILTER_TRADING_HISTORY_OPTIONS,
  NFT_MARKET_STATUS,
  saleType,
  SERVICE_FEE,
  SORT_TRADING_HISTORY,
} from '../../constants';
import {formatAddress} from '../../constants/addressFormat';
import Colors from '../../constants/Colors';
import {getDateString, getExpirationDate} from '../../constants/date';
import Images from '../../constants/Images';
import {hp, wp} from '../../constants/responsiveFunct';
import CommonStyles from '../../constants/styles';
import {
  getEventByValue,
  getFromAddress,
  getToAddress,
} from '../../constants/tradingHistory';
import sendRequest from '../../helpers/AxiosApiRequest';
import useValidate from '../../hooks/useValidate';
import {alertWithSingleBtn, numberWithCommas} from '../../utils';
import {collectionClick} from '../../utils/detailHelperFunctions';
import {getTokenNameFromId} from '../../utils/nft';
import {getDefaultToken, getERC20Tokens} from '../../utils/token';
import {translate} from '../../walletUtils';
import {toFixCustom} from '../createNFTScreen/helperFunction';
import {handleLike} from '../discover/discoverItem';
import {
  handleTransactionError,
  sendCustomTransaction,
} from '../wallet/functions/transactionFunctions';
import ShowModal from './modal';
import styles from './styles';
import {validatePrice} from './supportiveFunctions';

// =============== SVGS Destructuring ========================
const {
  PlayButtonIcon,
  HeartWhiteIcon,
  HeartActiveIcon,
  ThreeDotsVerticalIcon,
  TwitterIcon,
  FacebookIcon,
  InstagramIcon,
  VerficationIcon,
  CircleCloseIcon,
} = SVGS;

const DetailScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const scrollRef = useRef(null);
  const refVideo = useRef(null);

  const {validateNumber} = useValidate();

  // =============== Props Destructuring ========================
  const {item, setNftItem, networkName, collectionAddress, nftTokenId} =
    route.params;

  // =============== Getting data from reducer ========================
  const {paymentObject} = useSelector(state => state.PaymentReducer);
  const {userData} = useSelector(state => state.UserReducer);
  const {networks} = useSelector(state => state.NetworkReducer);

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
  // const [artistRole, setArtistRole] = useState('');
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
    translate('common.expiration'),
  ]);
  const [filterTableList, setFilterTableList] = useState([]);
  // const [tradingTableData1, setTradingTableData1] = useState([]);
  const [filterTableValue, setFilterTableValue] = useState([]);
  const [tradingTableData, setTradingTableData] = useState([]);
  // const [tradingList, setTradingList] = useState([]);
  const [offerList, setOfferList] = useState([]);
  const [isLike, setLike] = useState();
  const [detailNFT, setDetailNFT] = useState({});
  const [imgModal, setImgModal] = useState(false);

  const [currentNetwork, setCurrentNetwork] = useState({});

  // const [isVisible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [reclaimModal, setReclaimModal] = useState(false);
  const [cancelAuctionModal, setCancelAuctionModal] = useState(false);
  const [editedPrice, setEditedPrice] = useState('');
  const [priceEdit, setPriceEdit] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [placeABid, setPlaceABid] = useState(false);
  const [isCheckService, setCheckService] = useState(false);
  const [isCheckError, setIsCheckError] = useState(false);
  const [isTopUpError, setIsTopUpError] = useState(false);
  const [checkOut, setCheckOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const [openTransactionPending, setOpenTransactionPending] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [tokenList, setTokenList] = useState([]);
  const [sellVisible, setSellVisible] = useState(false);

  const [handleDate, setHandleDate] = useState({
    open: false,
    for: '',
  });

  const DAY14 = 86400000 * 14;
  const [offerData, setOfferData] = useState({
    totalPrice: '',
    quantity: 1,
    receiveToken: '',
    networkTokenId: 0,
    nftId: '',
    expried: new Date(),

    error: {
      totalPrice: '',
      expried: '',
    },
  });

  const [sellData, setSellData] = useState({
    saleType: saleType.FIXEDPRICE,
    fixedPrice: '',
    startPrice: '',
    basePrice: 0,
    startTime: new Date(), //  Date.now(),
    closeTime: new Date(), //  Date.now(),
    chainId: 0,
    error: {
      fixedPrice: '',
      closeTime: '',
      startTime: '',
      startPrice: '',
    },
  });

  const categoryType = detailNFT?.category
    ? detailNFT?.category
    : item?.category;
  const mediaUrl = detailNFT?.mediaUrl ? detailNFT.mediaUrl : item?.mediaUrl;
  const thumbnailUrl = detailNFT?.thumbnailUrl
    ? detailNFT.thumbnailUrl
    : categoryType === CATEGORY_VALUE.music
    ? item?.mediaUrl
    : item?.thumbnailUrl;
  const nftId = detailNFT?.nftId ? detailNFT.nftId : item?.nftId;
  const network = detailNFT?.network ? detailNFT.network : item?.network;
  const userId = userData?.id;
  const walletAddress = userData?.userWallet?.address;

  const hitSlop = {top: 5, bottom: 5, left: 5, right: 5};

  const auctionId = detailNFT?.saleData?.auction?.auctionId;
  const saleId = detailNFT?.saleData?.fixPrice?.id;
  const price = detailNFT?.saleData?.fixPrice?.price;

  //================== Unused State Declaration ===================
  // const [updateComponent, setUpdateComponent] = useState(false);
  // const [discount, setDiscount] = useState(false);
  // const [discountValue, setDiscountValue] = useState('');
  // const [sellDetailsFiltered, setSellDetailsFiltered] = useState([]);
  // const [bidHistory, setBidHistory] = useState([]);
  // const [tableData, setTableData] = useState([]);

  //================== Timer =======================

  const [music, setMusic] = useState(null);
  const [isPlaying, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [durationMin, setDurationMin] = useState(0);
  const [durationSec, setDurationSec] = useState(0);
  const [currentSec, setCurrentSec] = useState(0);
  const [currentmin, setCurrentmin] = useState(0);
  const [openPlaySpeed, setOpenPlaySpeed] = useState(false);
  const [mute, setMute] = useState(false);
  const [songCompleted, setSongCompleted] = useState(false);

  useEffect(() => {
    if (categoryType === CATEGORY_VALUE.music) {
      const audio = new Sound(mediaUrl, undefined, err => {
        if (err) {
          return;
        }
      });
      setMusic(audio);
      return function cleanup() {
        audio.release();
      };
    }
  }, [mediaUrl]);

  const durationRef = useRef(0);

  useEffect(() => {
    if (categoryType === CATEGORY_VALUE.music) {
      const interval = setInterval(() => {
        if (music && durationRef?.current <= 0) {
          setDuration(music?.getDuration());
          setDurationMin(Math.floor(music.getDuration() / 60));
          setDurationSec(Math.floor(music.getDuration() % 60));
          durationRef.current = music.getDuration();
        } else if (music && isPlaying) {
          music.getCurrentTime(seconds => {
            setCurrentTime(Math.round(seconds));
            setCurrentmin(Math.floor(seconds / 60));
            setCurrentSec(Math.floor(seconds % 60));
          });
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying, music]);

  useEffect(() => {
    if (Math.floor(duration) === currentTime) {
      setCurrentTime(0);
      setCurrentmin(0);
      setCurrentSec(0);
      setPlaying(false);
      setSongCompleted(true);
    }
  }, [currentTime]);

  useEffect(() => {
    if (songCompleted) {
      setCurrentSec(0);
      setSongCompleted(false);
    }
  }, [songCompleted]);

  const onPlayPausePress = async () => {
    if (isPlaying) {
      music.pause();
      setPlaying(false);
    } else {
      music.play(success => {
        setPlaying(false);
      });
      setPlaying(true);
    }
  };

  useEffect(() => {
    if (mute) {
      music?.setVolume(0);
    } else {
      music?.setVolume(1);
    }
  }, [mute, music]);

  const seekAudio = async value => {
    if (value < 0) {
      await music?.setCurrentTime(0);
      setCurrentTime(0);
      setCurrentmin(0);
      setCurrentSec(0);
      return;
    }
    await music?.setCurrentTime(value);
    if (isPlaying) {
      await music?.play();
    }
    setCurrentTime(value);
    setCurrentmin(Math.floor(value / 60));
    setCurrentSec(Math.floor(value % 60));
  };

  const setAudioSpeed = speed => {
    setOpenPlaySpeed(false);
    music.setSpeed(speed);
  };

  //====================== Full image Function =======================

  const imageModal = () => {
    return (
      <Modal
        onBackdropPress={() => setImgModal(false)}
        isVisible={imgModal}
        style={styles.modal}>
        <View>
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={() => setImgModal(false)}>
            <CircleCloseIcon />
          </TouchableOpacity>
          <Image source={{uri: thumbnailUrl}} style={styles.modalImg} />
        </View>
      </Modal>
    );
  };

  //===================== UseEffect Function =========================
  useEffect(() => {
    if (isFocused && networkName && collectionAddress && nftTokenId) {
      getNFTDetails();
    }
  }, [isFocused, networkName, collectionAddress, nftTokenId]);

  useEffect(() => {
    if (filterTableValue?.length && nftId) {
      setTradingTableData([]);
      getHistory('trading', filterTableValue);
    } else if (nftId) {
      getHistory('trading');
    }
  }, [filterTableValue, nftId]);

  useEffect(() => {
    if (nftId) {
      getHistory('bid');
      getOfferList();
      getRealtedNFT();
      const selectedNetwork = networks?.filter(
        item => item?.name === network?.networkName,
      );
      let currNetwork = selectedNetwork[0];
      setCurrentNetwork(currNetwork);

      if (selectedNetwork && currNetwork?.networkTokens?.length > 0) {
        setOfferData({
          ...offerData,
          nftId: detailNFT?.nftId,
          networkTokenId: getERC20Tokens(currNetwork?.networkTokens)[0].id,
          receiveToken: getTokenNameFromId(
            Number(getERC20Tokens(currNetwork?.networkTokens)[0].id),
            currNetwork?.networkTokens,
          ),
        });

        setSellData({
          ...sellData,
          chainId: currNetwork?.chainId,
          basePrice: getDefaultToken(
            getERC20Tokens(currNetwork?.networkTokens),
            sellData.saleType,
            currNetwork?.name,
          ).id,
        });

        const tokenTemp = currNetwork?.networkTokens?.map(net => {
          return {
            label: net?.tokenName,
            value: net?.id,
          };
        });
        setTokenList(tokenTemp);
        setValue(tokenTemp && tokenTemp[0]?.value);
        console.log(
          '🚀 ~ file: detail.js ~ line 303 ~ useEffect ~ tokenTemp',
          tokenTemp,
          '<<<!>>>',
          currNetwork,
        );
      }
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

  //===================== API Call Functions =========================

  const getNFTDetails = async reload => {
    // setLoad(true);
    let url = `${NEW_BASE_URL}/nfts/details`;

    sendRequest({
      url,
      params: {
        networkName,
        collectionAddress,
        nftTokenId,
        userId,
      },
    })
      .then(json => {
        if (
          typeof json === 'object' &&
          json?.creator &&
          json?.collection &&
          json?.owner
        ) {
          setNFTPrice(json?.price);
          setDetailNFT(json);
          setLike(Number(json?.isLike));

          setArtistData(json?.creator);
          setOwnerDataN(json?.owner);
          setOwnerAddress(json?.owner?.address);
          setcollectCreat(json?.collection);

          if (reload) {
            getHistory('trading');
            getHistory('bid');
            getOfferList();
            getRealtedNFT();
            handlePendingModal(false);
          }
        }
        setLoad(false);
      })
      .catch(err => {
        setLoad(false);
      });
  };

  //====================== Render App Header Function =========================
  const renderAppHeader = () => {
    return (
      <AppHeader
        showBackButton
        onPressBack={() => {
          navigation.goBack();
        }}
        title={translate('wallet.common.detail')}
        showRightComponent={
          <View style={{paddingRight: 10}}>
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
    );
  };

  const renderMenuOption = value => {
    return (
      <MenuOption value={value}>
        <Text style={{marginVertical: 10}}>
          {value === 1 && translate('common.reportNft')}
          {value === 2 && translate('common.blockUser')}
        </Text>
      </MenuOption>
    );
  };

  //================== Render Banner Image/Video Function ==================
  const renderBannerImageVideo = () => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          setImgModal(true);
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
          <View style={{...styles.modalImage}}>
            {showThumb && (
              <Image source={{uri: thumbnailUrl}} style={styles.modalImage} />
            )}
            {showThumb && (
              <ActivityIndicator
                style={styles.activity}
                size="medium"
                color={COLORS.BLACK1}
              />
            )}
            <Video
              ref={refVideo}
              source={{uri: mediaUrl}}
              repeat
              playInBackground={false}
              controls={true}
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
            {!playVideo && (
              <View style={styles.videoIcon}>
                <PlayButtonIcon width={SIZE(100)} height={SIZE(100)} />
              </View>
            )}
            {videoLoadErr && (
              <View style={styles.videoPlayIconCont}>
                <View style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                  <TouchableOpacity
                    onPress={() => {
                      setVideoLoadErr(false);
                      setVideoKey(videoKey + 1);
                    }}
                    style={{paddingHorizontal: 15, paddingVertical: 10}}>
                    <Text style={styles.retry}>
                      {translate('common.retryLoading')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ) : categoryType === CATEGORY_VALUE.music ? (
          <View style={{...styles.modalImage}}>
            <C_Image uri={thumbnailUrl} imageStyle={styles.modalImage} />
            <View style={styles.musicPlayer}>
              {duration === -1 ? (
                <View style={styles.controlView}>
                  <ActivityIndicator size="small" color="#0b0b0b" />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    onPlayPausePress();
                  }}
                  style={styles.controlView}>
                  <PlayPause
                    name={isPlaying ? 'pause' : 'play'}
                    size={wp('6.5%')}
                  />
                </TouchableOpacity>
              )}

              {duration !== -1 ? (
                <View style={styles.timeView}>
                  <Text>
                    {currentmin}:
                    {currentSec > 9 ? currentSec : '0' + currentSec} /{' '}
                    {durationMin}:
                    {durationSec > 9 ? durationSec : '0' + durationSec}
                  </Text>
                </View>
              ) : (
                <View style={styles.timeView}>
                  <Text>0:00 / 0:00</Text>
                </View>
              )}
              <View style={{width: SIZE(150)}}>
                <Slider
                  style={{width: SIZE(140)}}
                  value={currentTime === 0 ? -1 : currentTime}
                  tapToSeek={true}
                  minimumValue={0}
                  maximumValue={duration}
                  minimumTrackTintColor={Colors.GREY1}
                  maximumTrackTintColor={Colors.GREY2}
                  onSlidingComplete={value => {
                    seekAudio(value);
                  }}
                />
              </View>
              <TouchableOpacity
                style={styles.controlView}
                onPress={() => setMute(!mute)}>
                <IconMute name={mute ? 'mute' : 'unmute'} size={wp('4.5%')} />
              </TouchableOpacity>
              <View>
                <Menu
                  onSelect={() => {
                    setOpenPlaySpeed(true);
                  }}>
                  <MenuTrigger
                    style={styles.optionView}
                    children={<ThreeDotsVerticalIcon />}
                  />
                  <MenuOptions>
                    <MenuOption style={styles.menuOption}>
                      <PlaySpeed size={wp('5%')} name={'play-speed'} />
                      <Text>{translate('common.playbackSpeed')}</Text>
                    </MenuOption>
                  </MenuOptions>
                </Menu>
              </View>
              <View>
                <Menu
                  key={openPlaySpeed}
                  opened={openPlaySpeed}
                  onBackdropPress={() => setOpenPlaySpeed(false)}
                  style={
                    Platform.OS === 'android'
                      ? {
                          position: 'absolute',
                          left: 50,
                        }
                      : {}
                  }>
                  <MenuTrigger />
                  <MenuOptions>
                    <MenuOption
                      onSelect={() => setAudioSpeed(0.25)}
                      style={styles.speedMenuOption}
                      text="0.25"
                    />
                    <MenuOption
                      onSelect={() => setAudioSpeed(0.5)}
                      style={styles.speedMenuOption}
                      text="0.5"
                    />
                    <MenuOption
                      onSelect={() => setAudioSpeed(0.75)}
                      style={styles.speedMenuOption}
                      text="0.75"
                    />
                    <MenuOption
                      onSelect={() => setAudioSpeed(1)}
                      style={styles.speedMenuOption}
                      text="Normal"
                    />
                    <MenuOption
                      onSelect={() => setAudioSpeed(1.25)}
                      style={styles.speedMenuOption}
                      text="1.25"
                    />
                    <MenuOption
                      onSelect={() => setAudioSpeed(1.5)}
                      style={styles.speedMenuOption}
                      text="1.5"
                    />
                    <MenuOption
                      onSelect={() => setAudioSpeed(1.75)}
                      style={styles.speedMenuOption}
                      text="1.75"
                    />
                    <MenuOption
                      onSelect={() => setAudioSpeed(2)}
                      style={styles.speedMenuOption}
                      text="2"
                    />
                  </MenuOptions>
                </Menu>
              </View>
            </View>
          </View>
        ) : (
          <C_Image uri={mediaUrl} imageStyle={styles.modalImage} />
        )}
        {categoryType !== CATEGORY_VALUE.music &&
          categoryType !== CATEGORY_VALUE.movie &&
          imageModal()}
      </TouchableOpacity>
    );
  };

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
    );
  };

  //================== Render Creator, Collection and Owner Function ==================
  const renderCreatorCollectionOwnerName = () => {
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
            navigation.push('CollectionDetail', {
              networkName: detailNFT?.network?.networkName,
              contractAddress: detailNFT?.collection?.address,
              launchpadId: detailNFT?.launchpadId,
            });
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
    );
  };

  const renderIconImage = (key, fromNFT) => {
    return (
      <>
        <Image
          style={fromNFT ? styles.creatorImage : styles.iconsImage}
          source={
            key === 'creator'
              ? artistDetail?.avatar
                ? {uri: artistDetail.avatar}
                : IMAGES.DEFAULTPROFILE
              : key === 'collection'
              ? collectCreat
                ? {uri: collectCreat.avatar}
                : IMAGES.DEFAULTPROFILE
              : key === 'owner' && ownerDataN?.avatar
              ? {uri: ownerDataN.avatar}
              : IMAGES.DEFAULTPROFILE
          }
        />
        <View>
          {!fromNFT && (
            <Text style={styles.personTypeText}>
              {key === 'creator'
                ? translate('common.creator')
                : key === 'collection'
                ? translate('wallet.common.collection')
                : key === 'owner' && translate('common.owner')}
            </Text>
          )}
          {key !== 'collection' ? (
            <Text
              numberOfLines={1}
              style={fromNFT ? styles.creatorName : styles.personName}>
              {key === 'creator' ? creatorName : key === 'owner' && ownerName}
            </Text>
          ) : (
            <View style={CommonStyles.flexRow}>
              <Text numberOfLines={1} style={styles.collectionName}>
                {collectionName}
              </Text>
              {collectCreat?.isOfficial === 1 && <VerficationIcon />}
            </View>
          )}
        </View>
      </>
    );
  };

  //================== Render Creator and NFT Name Function ==================
  const renderCreatorAndNFTName = () => {
    return (
      <>
        {!load && (
          <Text style={styles.nftTitle} ellipsizeMode="tail">
            {creatorName}
          </Text>
        )}
        {!load && (
          <Text style={styles.nftName}>
            {detailNFT ? detailNFT?.name : item?.name}
          </Text>
        )}
      </>
    );
  };

  //================== Render NFT Price and Tokens Function ==================
  const renderNFTPriceNToken = () => {
    if (detailNFT.marketNftStatus === NFT_MARKET_STATUS.NOT_ON_SALE) {
      return null;
    }

    let label, tokenIcon, price, tokenPrice, priceToUsd;
    if (
      detailNFT.marketNftStatus === NFT_MARKET_STATUS.ON_AUCTION ||
      detailNFT.marketNftStatus === NFT_MARKET_STATUS.UPCOMMING_AUCTION ||
      detailNFT.marketNftStatus === NFT_MARKET_STATUS.CANCEL_AUCTION ||
      detailNFT.marketNftStatus === NFT_MARKET_STATUS.END_AUCTION
    ) {
      label =
        detailNFT?.saleData?.auction?.highestPrice ===
        detailNFT?.saleData?.auction?.startPrice
          ? translate('common.minimumBid')
          : translate('common.highestBid');
      tokenIcon = detailNFT?.saleData?.auction?.tokenIcon;
      price = detailNFT?.saleData?.auction?.highestPrice;
      tokenPrice = detailNFT?.saleData?.auction?.tokenPrice;
      priceToUsd = detailNFT?.saleData?.auction?.priceToUsd;
    } else {
      tokenIcon = detailNFT?.saleData?.fixPrice?.tokenIcon;
      price = detailNFT?.saleData?.fixPrice?.price;
      tokenPrice = detailNFT?.saleData?.fixPrice?.tokenPrice;
      priceToUsd = detailNFT?.saleData?.fixPrice?.priceToUsd;
    }

    return (
      <View style={{paddingHorizontal: SIZE(12), paddingBottom: SIZE(5)}}>
        {label && <Text style={styles.labelText}>{label}</Text>}
        <View style={styles.priceView}>
          <Image style={styles.tokenIcon} source={{uri: tokenIcon}} />

          {!load && (
            <Text style={styles.price}>
              {price ? numberWithCommas(Number(price).toFixed(2)) : ''}
              <Text style={styles.priceUnit}>
                {` ${tokenPrice}`}
                <Text style={styles.dollarText}>
                  {priceToUsd ? ` ($${parseFloat(priceToUsd).toFixed(2)})` : ''}
                </Text>
              </Text>
            </Text>
          )}
        </View>
      </View>
    );
  };

  //================== Render Description Function ==================
  const renderDescription = () => {
    if (!load && detailNFT?.description) {
      return (
        <View>
          <Text style={styles.description}>
            {detailNFT?.description.trim()}
          </Text>
        </View>
      );
    }
    return null;
  };

  const cancelModalConfirm = () => {};
  const cancelModal = () => {
    setCancel(false);
  };
  const closeReclaimModal = () => {
    setReclaimModal(false);
  };

  const modalClose = () => {
    setCancelAuctionModal(false);
  };

  const handlePendingModal = value => {
    setTimeout(() => {
      setOpenTransactionPending(value);
    }, 500);
  };

  // console.log("🚀 ~ file: detail.js ~ line 183 ~ ~ openTransactionPending", reclaimModal, openTransactionPending)

  const reClaimApi = () => {
    setReclaimModal(false);
    handlePendingModal(true);
    const url = `${NEW_BASE_URL}/auction/${auctionId}/reclaim-nft`;
    sendRequest({
      url,
      method: 'GET',
    })
      .then(claimNFTRes => {
        console.log(
          '🚀 ~ file: detail.js ~ line 755 ~ .then ~ claimNFTRes',
          claimNFTRes,
        );
        if (claimNFTRes.messageCode) {
          // toast.error(claimNFTRes.messageCode)
          handlePendingModal(false);
        }
        if (claimNFTRes) {
          const signData = claimNFTRes.dataReturn?.signData;
          if (signData) {
            const transactionParameters = {
              nonce: signData.nonce, // ignored by MetaMask
              to: signData.to, // Required except during contract publications.
              from: signData.from, // must match user's active address.
              data: signData.data, // Optional, but used for defining smart contract creation and interaction.
              chainId: currentNetwork?.chainId, // Used to prevent transaction reuse across b
            };
            sendCustomTransaction(
              transactionParameters,
              walletAddress,
              nftTokenId,
              network?.networkName,
            )
              .then(res => {
                console.log('approve payByWallet 331', res);
                // alertWithSingleBtn('',translate('common.tansactionSuccessFull'));
                // setLoading(false);
                getNFTDetails(true);
              })
              .catch(err => {
                console.log('payByWallet_err payByWallet 339', err);
                handlePendingModal(false);
                handleTransactionError(err, translate);
              });
          }
        }
      })
      .catch(err => {
        setReclaimModal(false);
        handlePendingModal(false);
      });
  };

  const cancelAuctionApi = () => {
    setCancelAuctionModal(false);
    handlePendingModal(true);
    const url = `${NEW_BASE_URL}/auction-session/cancel/${auctionId}`;
    sendRequest({
      url,
      method: 'POST',
    })
      .then(cancelAuctionRes => {
        console.log(
          '🚀 ~ file: detail.js ~ line 759 ~ .then ~ cancelAuctionRes',
          cancelAuctionRes,
        );
        if (cancelAuctionRes?.error) {
          handlePendingModal(false);
          throw new Error(cancelAuctionRes.message);
        } else {
          const signData = cancelAuctionRes.dataReturn?.signData;
          if (signData) {
            const transactionParameters = {
              nonce: signData.nonce, // ignored by MetaMask
              to: signData.to, // Required except during contract publications.
              from: signData.from, // must match user's active address.
              data: signData.data, // Optional, but used for defining smart contract creation and interaction.
              chainId: currentNetwork?.chainId, // Used to prevent transaction reuse across b
            };
            sendCustomTransaction(
              transactionParameters,
              walletAddress,
              nftTokenId,
              network?.networkName,
            )
              .then(res => {
                console.log('approve payByWallet 331', res);
                // alertWithSingleBtn('',translate('common.tansactionSuccessFull'));
                // setLoading(false);
                getNFTDetails(true);
              })
              .catch(err => {
                console.log('payByWallet_err payByWallet 339', err);
                handlePendingModal(false);
                handleTransactionError(err, translate);
              });
          }
        }
      })
      .catch(err => {
        setCancelAuctionModal(false);
        handlePendingModal(false);
      });
  };

  const editPriceApi = () => {
    const url = `${NEW_BASE_URL}/sale-nft?saleId=${saleId}`;
    sendRequest({
      url,
      method: 'PUT',
      editedPrice,
    }).then(response => {
      console.log('edit==>', response);
    });
  };

  const editPriceModal = () => {
    const tokenName = detailNFT?.saleData?.fixPrice?.tokenPrice;
    return (
      <View style={styles.modalContainer}>
        <Modal isVisible={priceEdit}>
          <View style={styles.editPriceContainner}>
            <View style={styles.editPriceHeaderView}>
              <Text style={styles.editPriceText}>
                {translate('common.editPrice')}
              </Text>

              <TouchableOpacity onPress={() => setPriceEdit(false)}>
                <Image source={cancelImg} style={styles.cancelButton} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputWrapperView}>
              <TextInput
                value={editedPrice}
                keyboardType="numeric"
                style={styles.inputField}
                onChangeText={text => setEditedPrice(text)}
                maxLength={10}
              />

              <View style={styles.tokenView}>
                <Text style={styles.tokenText}>{tokenName}</Text>
              </View>
            </View>

            <View style={styles.editPriceGroupBButtonView}>
              <GroupButton
                leftText={translate('common.change')}
                leftDisabled={false}
                leftLoading={false}
                onLeftPress={() => editPriceApi()}
                rightStyle={styles.editPriceGroupButton}
                rightTextStyle={styles.editPriceGroupButtonText}
                rightHide
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  const handlePlaceBidAuth = async () => {
    try {
      setIsChecking(true);
      const url = `${NEW_BASE_URL}/auction/${auctionId}/place-bid`;
      const data = {
        price: Number(editedPrice),
      };
      const placeBidRes = await sendRequest({
        url,
        method: 'POST',
        data,
      });
      console.log(
        '🚀 ~ file: detail.js ~ line 980 ~ .then ~ placeBidRes',
        placeBidRes,
      );
      setIsChecking(false);
      if (placeBidRes?.messageCode) {
        setErrorMessage(placeBidRes?.messageCode);
        // throw new Error(placeBidRes?.messageCode)
      } else {
        setPlaceABid(false);
        handlePendingModal(true);
        const approveData = placeBidRes?.dataReturn?.approveData;
        console.log(
          '🚀 ~ file: detail.js ~ line 991 ~ //.then ~ approveData',
          approveData,
        );
        let approved = true;
        let noncePlus = 0;
        if (approveData) {
          try {
            const transactionParameters = {
              nonce: approveData.nonce, // ignored by MetaMask
              to: approveData.to, // Required except during contract publications.
              from: approveData.from, // must match user's active address.
              data: approveData.data, // Optional, but used for defining smart contract creation and interaction.
              chainId: currentNetwork?.chainId, // Used to prevent transaction reuse across b
            };

            const txnResult = await sendCustomTransaction(
              transactionParameters,
              walletAddress,
              nftTokenId,
              network?.networkName,
            );
            console.log(
              '🚀 ~ file: detail.js ~ line 1005 ~ .then ~ txnResult',
              txnResult,
            );

            if (txnResult) {
              noncePlus = 1;
              // toast.success(t('APPROVE_TOKEN_SUCCESS'))
            }
          } catch (error) {
            approved = false;
            handlePendingModal(false);
            // toast.error(t('APPROVE_TOKEN_FAIL'))
          }
        }
        const signData = placeBidRes?.dataReturn?.signData;
        const isEditBit = placeBidRes?.dataReturn?.isEditBit;
        if (signData && approved) {
          try {
            const transactionParameters = {
              nonce: signData.nonce + noncePlus, // ignored by MetaMask
              gasPrice: signData.gasPrice, // customizable by user during MetaMask confirmation.
              gasLimit: signData.gas, // customizable by user during MetaMask confirmation.
              to: signData.to, // Required except during contract publications.
              from: signData.from, // must match user's active address.
              data: signData.data, // Optional, but used for defining smart contract creation and interaction.
              chainId: currentNetwork?.chainId, // Used to prevent transaction reuse across b
            };
            console.log(
              '🚀 ~ file: detail.js ~ line 1035 ~ //.then ~ transactionParameters',
              transactionParameters,
            );

            sendCustomTransaction(
              transactionParameters,
              walletAddress,
              nftTokenId,
              network?.networkName,
            )
              .then(res => {
                console.log('approve payByWallet 331', res);
                // alertWithSingleBtn('',translate('common.tansactionSuccessFull'));
                // setLoading(false);
                getNFTDetails(true);
              })
              .catch(err => {
                console.log('payByWallet_err payByWallet 339', err);
                handlePendingModal(false);
                handleTransactionError(err, translate);
              });
          } catch (error) {
            setIsChecking(false);
            handlePendingModal(false);
            handleTransactionError(error, translate);
          }
        }
      }
    } catch (error) {
      console.log(
        '🚀 ~ file: detail.js ~ line 1074 ~ handlePlaceBidAuth ~ err',
        err,
      );
      closeBidModal();
      handleTransactionError(error, t);
      handlePendingModal(false);
    }
  };

  const openBidModal = () => {
    setPlaceABid(true);
  };
  const closeBidModal = () => {
    setErrorMessage('');
    setEditedPrice('');
    setPlaceABid(false);
  };

  const onPlaceBid = maxPrice => {
    const highestPrice = Number(detailNFT?.saleData?.auction?.highestPrice);
    const bidPrice = editedPrice ? editedPrice : maxPrice;

    if (!validatePrice(bidPrice, highestPrice)) {
      // setEditedPrice(bidPrice.toString())
      setErrorMessage(
        'The new bid amount have to be grater than 5% the highest bid amount',
      );
      handlePendingModal(false);
      console.log('1091 ???????');
    } else {
      console.log('1093 <<<<<?>>>>>');
      setErrorMessage('');
      handlePlaceBidAuth();
    }
  };

  const placeABidModal = () => {
    const tokenName = detailNFT?.saleData?.auction?.tokenPrice;
    const highestPrice = Number(detailNFT?.saleData?.auction?.highestPrice);
    let maxPrice = Number(
      Number(highestPrice + highestPrice * AMOUNT_BID_HIGHER).toFixed(6),
    );

    return (
      <Modal isVisible={placeABid}>
        <View style={styles.placeAbbidView}>
          <View style={styles.PlaceAbidHeaderview}>
            <Text style={styles.bidtext}>{translate('common.placeABid')}</Text>
            <TouchableOpacity onPress={closeBidModal}>
              <Image source={cancelImg} style={styles.cancelimg} />
            </TouchableOpacity>
          </View>

          <Text style={styles.priceText}>{translate('common.price')}</Text>

          <View style={{marginVertical: SIZE(35), marginTop: SIZE(15)}}>
            <View style={styles.inputWrapperView1}>
              <TextInput
                value={editedPrice ? editedPrice : maxPrice.toString()}
                keyboardType="numeric"
                style={styles.inputField}
                onChangeText={text => setEditedPrice(text)}
                maxLength={10}
              />

              <View style={styles.tokenView}>
                <Text style={styles.tokenText}>{tokenName}</Text>
              </View>
            </View>
            {errorMessage !== '' && (
              <Text style={styles.errorText1}>{errorMessage}</Text>
            )}
          </View>

          <View style={styles.placeAbidgroupButtonView}>
            <GroupButton
              leftText={translate('common.Confirm')}
              leftDisabled={isChecking}
              leftLoading={isChecking}
              onLeftPress={() => {
                onPlaceBid(maxPrice);
              }}
              rightText={translate('common.topUp')}
              rightDisabled={false}
              rightLoading={false}
              onRightPress={() => {}}
              rightStyle={styles.rightGroupButton}
              rightTextStyle={styles.rightGroupButtonText}
            />
          </View>
        </View>
      </Modal>
    );
  };

  //===================Sell NFT Modal ===========

  const onSelectTimeAuction = () => {
    setSellData({
      ...sellData,
      saleType: saleType.TIMEAUTION,
      startTime: new Date(new Date().getTime() + 5 * 60 * 1000),
      closeTime: new Date(new Date().getTime() + 20 * 60 * 1000),
    });
  };

  const handlePutOnsale = async () => {
    try {
      console.log('🚀 ~ file: detail.js ~ line 1246 ~ ~ ~');
      // setIsLoading(true)
      setSellVisible(false);
      handlePendingModal(true);
      const url = `${NEW_BASE_URL}/sale-nft/put-on-sale`;
      console.log('🚀 ~ file: detail.js ~ line 1266 ~ ~ ~', url);

      const data = {
        price: Number(sellData.fixedPrice),
        quantity: 1,
        networkTokenId: Number(sellData.basePrice),
        nftId: nftId,
      };
      console.log('🚀 ~ file: detail.js ~ line 1264 ~  ~ data', data);

      const resPutOnsale = await sendRequest({
        url,
        method: 'POST',
        data,
      });
      console.log(
        '🚀 ~ file: detail.js ~ line 1249 ~ .then ~ resPutOnsale',
        resPutOnsale,
      );

      const approveAllData = resPutOnsale?.approveAllData;
      const signData = resPutOnsale?.dataReturn?.signData;
      // const approveAllData = resPutOnsale?.approveAllData
      let approved = true;
      let noncePlus = 0;
      if (approveAllData) {
        try {
          const transactionParameters = {
            nonce: approveAllData.nonce, // ignored by MetaMask
            to: approveAllData.to, // Required except during contract publications.
            from: approveAllData.from, // must match user's active address.
            data: approveAllData.data, // Optional, but used for defining smart contract creation and interaction.
            chainId: currentNetwork?.chainId, // Used to prevent transaction reuse across b
          };
          const txnResult = await sendCustomTransaction(
            transactionParameters,
            walletAddress,
            nftTokenId,
            network?.networkName,
          );
          if (txnResult) {
            noncePlus = 1;
            // toast.success(t('APPROVE_NFT_SUCCESS'))
          }
        } catch (error) {
          console.log('🚀 ~ file: detail.js ~ line 1300 ~ ~ error', error);
          approved = false;
          // setIsLoading(false)
          // toast.error(t('APPROVE_NFT_FAIL'))
        }
      }
      if (signData && approved) {
        try {
          const transactionParameters = {
            nonce: signData.nonce + noncePlus, // ignored by MetaMask
            to: signData.to, // Required except during contract publications.
            from: signData.from, // must match user's active address.
            gasPrice: signData?.gasPrice, // customizable by user during
            gasLimit: signData?.gas, // customizable by user during
            data: signData.data, // Optional, but used for defining smart contract creation and interaction.
            chainId: currentNetwork?.chainId, // Used to prevent transaction reuse across b
          };

          sendCustomTransaction(
            transactionParameters,
            walletAddress,
            nftTokenId,
            network?.networkName,
          )
            .then(res => {
              console.log('approve payByWallet 331', res);
              // alertWithSingleBtn('',translate('common.tansactionSuccessFull'));
              // setLoading(false);
              getNFTDetails(true);
            })
            .catch(err => {
              console.log('payByWallet_err payByWallet 339', err);
              handlePendingModal(false);
              handleTransactionError(err, translate);
            });
        } catch (error) {
          console.log('🚀 ~ file: detail.js ~ line 1340 ~ ~ error', error);
          // setIsLoading(false)
          // toast.error(error.message)
        }
      }
    } catch (error) {
      console.log('🚀 ~ file: detail.js ~ line 1345 ~  ~ error', error);
      // setIsLoading(false)
      // toast.error(error.message)
    }
  };

  const getTokenName = id => {
    let result = '';
    if (currentNetwork) {
      const currentToken = tokenList?.find(item => item.value === id);
      result = currentToken?.label;
    }
    return result;
  };

  const handlePutOnAuction = async () => {
    try {
      // setIsLoading(true);
      setSellVisible(false);
      handlePendingModal(true);
      const url = `${NEW_BASE_URL}/auction-session`;
      console.log('🚀 ~ file: detail.js ~ line 1266 ~ ~ ~', url);

      const data = {
        startPrice: Number(sellData.startPrice),
        receiveToken: getTokenName(sellData.basePrice),
        // receiveToken: value,
        startTime: new Date(sellData.startTime),
        endTime: new Date(sellData.closeTime),
        nftId: nftId,
      };
      console.log('🚀 ~ file: index.tsx ~ line 254 ~ data ~ ', data);

      const resPutOnAuction = await sendRequest({
        url,
        method: 'POST',
        data,
      });
      console.log(
        '🚀 ~ file: detail.js ~ line 1390 ~ ~ resPutOnAuction',
        resPutOnAuction,
      );

      // const resPutOnAuction = await nftServices.putOnAuction(dataCreateAuction);
      // const approveAllData = resPutOnAuction?.approveAllData
      const signData = resPutOnAuction?.signData;
      if (signData) {
        try {
          const transactionParameters = {
            nonce: signData.nonce, // ignored by MetaMask
            to: signData.to, // Required except during contract publications.
            from: signData.from, // must match user's active address.
            gasPrice: signData?.gasPrice, // customizable by user during
            gasLimit: signData?.gas, // customizable by user during
            data: signData.data, // Optional, but used for defining smart contract creation and interaction.
            chainId: currentNetwork?.chainId, // Used to prevent transaction reuse across b
          };

          sendCustomTransaction(
            transactionParameters,
            walletAddress,
            nftTokenId,
            network?.networkName,
          )
            .then(res => {
              console.log('approve payByWallet 331', res);
              // alertWithSingleBtn('',translate('common.tansactionSuccessFull'));
              // setLoading(false);
              getNFTDetails(true);
            })
            .catch(err => {
              console.log('payByWallet_err payByWallet 339', err);
              handlePendingModal(false);
              handleTransactionError(err, translate);
            });
        } catch (error) {
          setIsLoading(false);
          // toast.error(error.message)
        }
      }
    } catch (error) {
      console.log('🚀 ~ file: detail.js ~ line 1345 ~  ~ error', error);
      // setIsLoading(false)
      // toast.error(error.message)
    }
  };

  const onSell = () => {
    console.log('🚀 ~ file: detail.js ~ line 1232 ~  ~ sellData', sellData);
    if (!isValidate()) {
      console.log('🚀 ~ file: detail.js ~ line 1391 ~ ~ INVALID_DATA');
      // toast.error(t('INVALID_DATA'))
    } else {
      console.log(
        '🚀 ~ file: detail.js ~ line 1394 ~ ~ sellData.saleType',
        sellData.saleType,
        sellData.saleType === saleType.FIXEDPRICE,
      );
      if (sellData.saleType === saleType.FIXEDPRICE) {
        // handlePutOnSaleAuth();
        handlePutOnsale();
      } else {
        // handlePutOnAuctionAuth();
        handlePutOnAuction();
      }
    }
  };

  const isValidate = () => {
    const error = {
      fixedPrice: '',
      closeTime: '',
      startTime: '',
      startPrice: '',
    };

    let isSuccess = true;
    if (!sellData.basePrice) {
      isSuccess = false;
    }
    if (sellData.saleType === saleType.TIMEAUTION) {
      const {closeTime, startTime, startPrice} = sellData;

      if (!startTime || startTime < Date.now()) {
        error.startTime = 'ERROR_INVALID_OPEN_TIME_AUTION1';
        isSuccess = false;
      }
      if (!closeTime || closeTime < Date.now() || closeTime < startTime) {
        error.closeTime = 'ERROR_INVALID_CLOSE_TIME_AUTION1';
        isSuccess = false;
      }
      if (!startPrice || startPrice < 0) {
        error.startPrice = 'ERROR_INVALID_PRICE_AUTION';
        isSuccess = false;
      }
    } else {
      if (Number(sellData.fixedPrice) <= 0) {
        error.fixedPrice = 'ERROR_EMPTY_NFT_FIX_PRICE';
        isSuccess = false;
      }
    }
    setSellData({
      ...sellData,
      error: error,
    });

    return isSuccess;
  };

  const sellNftModal = () => {
    return (
      <Modal isVisible={sellVisible}>
        <View style={styles.sellModalView}>
          <View style={styles.sellModalHeaderView}>
            <Text style={styles.sellNftText}>{'Sell NFT'}</Text>

            <TouchableOpacity onPress={() => setSellVisible(false)}>
              <Image source={cancelImg} style={styles.cancelimg} />
            </TouchableOpacity>
          </View>

          <Text style={styles.saleTypeText}>
            {translate('wallet.common.saleType') + ' --> ' + sellData.saleType}
          </Text>

          <View style={styles.sellGroupButtonView}>
            <GroupButton
              leftText={'Fixed Price'}
              leftDisabled={false}
              leftLoading={false}
              onLeftPress={() => {
                setSellData({
                  ...sellData,
                  saleType: saleType.FIXEDPRICE,
                });
              }}
              rightText={'Time Auction'}
              rightDisabled={false}
              rightLoading={false}
              onRightPress={() => {
                onSelectTimeAuction();
              }}
              rightStyle={
                sellData.saleType === saleType.FIXEDPRICE
                  ? styles.sellRightGroupButton
                  : styles.sellLeftGroupButton
              }
              rightTextStyle={
                sellData.saleType === saleType.FIXEDPRICE
                  ? styles.sellRightGroupButtonText
                  : styles.sellLeftGroupButtonText
              }
              leftStyle={
                sellData.saleType === saleType.FIXEDPRICE
                  ? styles.sellLeftGroupButton
                  : styles.sellRightGroupButton
              }
              leftTextStyle={
                sellData.saleType === saleType.FIXEDPRICE
                  ? styles.sellLeftGroupButtonText
                  : styles.sellRightGroupButtonText
              }
            />
          </View>

          <Text style={[styles.saleTypeText, {textTransform: 'capitalize'}]}>
            {sellData.saleType === saleType.FIXEDPRICE
              ? translate('common.fixedPrice')
              : 'Time Auction'}
          </Text>

          {sellData.saleType === saleType.FIXEDPRICE ? (
            <View style={{paddingHorizontal: SIZE(8)}}>
              <View style={styles.sellInputFieldView}>
                <TextInput
                  value={sellData.fixedPrice}
                  onChangeText={value => {
                    if (validateNumber(value).status) {
                      setSellData({
                        ...sellData,
                        fixedPrice: value,
                      });
                    }
                  }}
                  style={styles.sellInputField}
                />
                <View style={{zIndex: 1}}>
                  <DropDownPicker
                    open={open}
                    value={value}
                    items={tokenList}
                    setOpen={setOpen}
                    maxHeight={60}
                    setValue={setValue}
                    setItems={setTokenList}
                    dropDownContainerStyle={styles.sellDropDownContainer}
                    style={styles.sellTokenPicker}
                    placeholder={'Select Here'}
                    selectedItemLabelStyle={{backgroundColor: Colors.BLACK2}}
                  />
                </View>
              </View>

              {sellData.error.fixedPrice !== '' && (
                <Text style={styles.errorText1}>
                  {sellData.error.fixedPrice}
                </Text>
              )}

              {/* <TokenInput
                  value={sellInput}
                  onChangeText={setSellInput}
                  // tokenName={'BUSD'}
                  // dropdownValue={tokenList && tokenList[0]?.value}
                  dropdownValue={value}
                  open={open}
                  setOpen={setOpen}
                  setValue={setValue}
                  Items={tokenList}
                  setItems={setTokenList}
                  isDropdownVisible={true}
                  style={{marginHorizontal: 28}}
                /> */}
            </View>
          ) : (
            <View style={{paddingHorizontal: SIZE(8)}}>
              <View style={styles.opneTimeView}>
                <View style={{flex: 1 / 2}}>
                  <Text style={styles.openTimeText}>
                    {translate('wallet.common.openTime')}
                  </Text>
                  <TouchableOpacity
                    style={styles.openTimeField}
                    onPress={() => {
                      setHandleDate({
                        open: true,
                        for: 'open',
                      });
                    }}>
                    <Text style={styles.showTime}>
                      {moment(sellData?.startTime).format('MM/DD/YYYY hh:mm a')}
                    </Text>
                  </TouchableOpacity>

                  {sellData.error.startTime !== '' && (
                    <Text style={styles.errorText1}>
                      {sellData.error.startTime}
                    </Text>
                  )}
                </View>

                <View style={{flex: 1 / 2, marginLeft: SIZE(10)}}>
                  <Text style={styles.openTimeText}>
                    {translate('wallet.common.closeTime')}
                  </Text>

                  <TouchableOpacity
                    style={styles.openTimeField}
                    onPress={() => {
                      setHandleDate({
                        open: true,
                        for: 'close',
                      });
                    }}>
                    <Text style={styles.showTime}>
                      {moment(sellData?.closeTime).format('MM/DD/YYYY hh:mm a')}
                    </Text>
                  </TouchableOpacity>

                  {sellData.error.closeTime !== '' && (
                    <Text style={styles.errorText1}>
                      {sellData.error.closeTime}
                    </Text>
                  )}
                </View>
              </View>

              <Text style={styles.minPriceText}>{'Min Price'}</Text>
              <View style={styles.sellInputFieldView}>
                <TextInput
                  style={styles.sellInputField}
                  onChangeText={value => {
                    if (validateNumber(value).status) {
                      setSellData({
                        ...sellData,
                        startPrice: value,
                      });
                    }
                  }}
                  value={sellData.startPrice}
                />
                <View style={{zIndex: 1}}>
                  <DropDownPicker
                    open={open}
                    value={value}
                    items={tokenList}
                    setOpen={setOpen}
                    maxHeight={60}
                    setValue={setValue}
                    setItems={setTokenList}
                    // dropDownContainerStyle={styles.sellDropDownContainer}
                    style={styles.sellTokenPicker}
                    placeholder={'Select Here'}
                    selectedItemLabelStyle={{backgroundColor: Colors.BLACK2}}
                  />
                </View>
              </View>

              {sellData.error.startPrice !== '' && (
                <Text style={styles.errorText1}>
                  {sellData.error.startPrice}
                </Text>
              )}
            </View>
          )}
          <Fee
            royaltyFee={detailNFT?.royalty}
            style={{paddingHorizontal: SIZE(8)}}
          />

          <View style={styles.sellGroupBButtonView}>
            <GroupButton
              leftText={'Sell item'}
              leftDisabled={false}
              leftLoading={false}
              onLeftPress={() => onSell()}
              rightStyle={styles.editPriceGroupButton}
              rightTextStyle={styles.editPriceGroupButtonText}
              rightHide
            />
          </View>
        </View>
      </Modal>
      // </View>
    );
  };

  //==================  ==================

  const closeModal = () => {
    if (modalVisible) {
      setModalVisible(false);
    } else {
      setCheckOut(false);
    }
  };

  const handleMakeOffer = async () => {
    setIsChecking(true);
    // callback()
    const url = `${NEW_BASE_URL}/sale-nft/make-offer`;
    const submitData = {
      ...offerData,
      expried: Math.floor(offerData.expried / 1000), // to second
      totalPrice: Number(offerData.totalPrice),
      error: undefined,
    };
    console.log(
      '🚀 ~ file: index.tsx ~ line 123 ~ onMakeOffer ~ submitData',
      submitData,
    );
    const resOffer = await sendRequest({
      url,
      method: 'POST',
      data,
    });

    if (resOffer?.messageCode) {
      setIsChecking(false);
      // setError(t(resOffer?.messageCode));
    } else {
      setIsChecking(false);
      // setClose()
      handlePendingModal(true);
      const approveData = resOffer?.dataReturn?.approveData;
      let approved = true;
      let noncePlus = 0;
      if (approveData) {
        try {
          const transactionParameters = {
            nonce: approveData.nonce, // ignored by MetaMask
            to: approveData.to, // Required except during contract publications.
            from: approveData.from, // must match user's active address.
            data: approveData.data, // Optional, but used for defining smart contract creation and interaction.
            chainId: currentNetwork?.chainId, // Used to prevent transaction reuse across b
          };

          const txnResult = await sendCustomTransaction(
            transactionParameters,
            walletAddress,
            nftTokenId,
            network?.networkName,
          );
          console.log(
            '🚀 ~ file: index.tsx ~ line 205 ~  ~ txnResult',
            txnResult,
          );

          if (txnResult) {
            noncePlus = 1;
            // toast.success(t('APPROVE_TOKEN_SUCCESS'));
          }
        } catch (error) {
          console.log('🚀 ~ file: index.tsx ~ line 201 ~  ~ error', error);
          approved = false;
          // setOpen()
          // toast.error(t('APPROVE_TOKEN_FAIL'))
          handlePendingModal(false);
        }
      }
      const signData = res?.dataReturn?.signData;
      console.log('🚀 ~ file: index.tsx ~ line 219 ~  ~ signData', signData);
      if (signData && approved) {
        try {
          const transactionParameters = {
            nonce: signData.nonce + noncePlus, // ignored by MetaMask
            to: signData.to, // Required except during contract publications.
            from: signData.from, // must match user's active address.
            data: signData.data, // Optional, but used for defining smart contract creation and interaction.
            chainId: currentNetwork?.chainId, // Used to prevent transaction reuse across b
          };

          sendCustomTransaction(
            transactionParameters,
            walletAddress,
            nftTokenId,
            network?.networkName,
          )
            .then(res => {
              console.log('approve payByWallet 331', res);
              // alertWithSingleBtn('',translate('common.tansactionSuccessFull'));
              // setLoading(false);
              getNFTDetails(true);
            })
            .catch(err => {
              console.log('payByWallet_err payByWallet 339', err);
              handlePendingModal(false);
              handleTransactionError(err, translate);
            });
        } catch (error) {
          console.log('🚀 ~ file: index.tsx ~ line 230 ~  ~ error', error);
          // setOpen()
          handleTransactionError(error, translate);
          handlePendingModal(false);
        }
      }
    }
  };

  const isOfferValidate = () => {
    const error = {...offerData.error};
    let isSuccess = true;
    if (offerData.expried < Date.now()) {
      console.log('VAOOVAOVOV VALIDATE');
      error.expried = 'TIME_EXPIRED_OFFER_ERROR';
      isSuccess = false;
    }
    if (Number(offerData.totalPrice) <= 0) {
      error.totalPrice = 'PRICE_OFFER_ERROR';
      isSuccess = false;
    }
    if (offerData.totalPrice === undefined) {
      error.totalPrice = 'ERROR_EMPTY_NFT_FIX_PRICE';
      isSuccess = false;
    }

    if (Number(offerData.totalPrice) > 0 && offerData.expried > Date.now()) {
      error.totalPrice = '';
      isSuccess = true;
    }
    if (!offerData.receiveToken) {
      isSuccess = true;
    }

    setOfferData({
      ...offerData,
      error: error,
    });
    return isSuccess;
  };

  const onMakeOffer = () => {
    console.log(isOfferValidate());
    if (!isOfferValidate()) {
      // toast.error('INVALID_OFFER_DATA')
      console.log('🚀 ~ file: detail.js ~ line 1779 ~ ~ INVALID_OFFER_DATA');
    } else if (!isCheckService) {
      setIsTopUpError(true);
      // setError('PLEASE_TICK_AGREE_SERVICE');
    } else {
      setIsTopUpError(false);
      handleMakeOffer();
    }
  };

  const ModalBody = () => {
    const tokenName = detailNFT?.saleData?.fixPrice?.tokenPrice;

    return (
      <Modal isVisible={modalVisible ? modalVisible : checkOut}>
        <View style={styles.mainview}>
          <View style={styles.headerview}>
            <Text style={styles.bidtext}>
              {modalVisible
                ? translate('common.makeAnOffer')
                : translate('common.completeCheckOut')}
            </Text>

            <TouchableOpacity
              onPress={() => {
                closeModal();
              }}>
              <Image
                style={styles.headerCancelButton}
                source={Images.cancelIcon}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.itemText}>{translate('common.ITEM')}</Text>

          <View style={styles.userView}>
            <View style={styles.imageTextView}>
              <C_Image uri={thumbnailUrl} imageStyle={styles.userImage} />

              <Text style={styles.amountText}>{detailNFT?.name}</Text>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.curancyInputChange}>
                {modalVisible ? (
                  <TextInput
                    value={offerData.totalPrice}
                    keyboardType="numeric"
                    style={styles.curancyInput}
                    onChangeText={value => {
                      const error = {...offerData.error};
                      error.totalPrice = '';

                      if (validateNumber(value).status) {
                        setOfferData({
                          ...offerData,
                          error: error,
                          totalPrice: value,
                        });
                      }
                    }}
                    maxLength={10}
                  />
                ) : (
                  <Text style={styles.curancyInputPrice}>
                    {numberWithCommas(Number(price).toFixed(3))}
                  </Text>
                )}
              </View>

              <View style={[styles.currencyView, {zIndex: 1}]}>
                {modalVisible ? (
                  <DropDownPicker
                    open={open}
                    value={value}
                    items={tokenList}
                    setOpen={setOpen}
                    maxHeight={60}
                    setValue={setValue}
                    setItems={setTokenList}
                    dropDownContainerStyle={styles.sellDropDownContainer}
                    style={[
                      styles.sellTokenPicker,
                      {
                        width: wp(24),
                      },
                    ]}
                    placeholder={'Select Here'}
                    selectedItemLabelStyle={{
                      backgroundColor: Colors.BLACK2,
                    }}
                  />
                ) : (
                  <Text style={styles.tokenName}>{tokenName}</Text>
                )}
              </View>
            </View>
          </View>

          <View style={styles.breakLine} />
          {modalVisible ? (
            <>
              <Text style={styles.expirationText}>
                {translate('common.offerExpiration')}
              </Text>

              <TouchableOpacity
                style={styles.numberView}
                onPress={() => {
                  setHandleDate({
                    open: true,
                    for: 'offer',
                  });
                }}>
                <Text style={styles.dateText}>
                  {moment(offerData?.expried).format('MM/DD/YYYY hh:mm a')}
                </Text>
              </TouchableOpacity>
            </>
          ) : null}
          <Text style={styles.feeText}>{translate('common.fee')}</Text>

          {!isTopUpError ? (
            <>
              <View style={styles.royaltyFeeView}>
                <Text>{translate('common.royaltyFee')}</Text>

                <Text style={styles.priceInPercent}>
                  {modalVisible
                    ? `${toFixCustom(
                        ((Number(offerData?.totalPrice) || 0) *
                          Number(detailNFT?.royalty)) /
                          100,
                      )} ${offerData?.receiveToken} (${Number(
                        detailNFT?.royalty,
                      )}%)`
                    : `${toFixCustom(
                        (price * Number(detailNFT.royalty)) / 100,
                      )} ${tokenName} (${Number(detailNFT.royalty)}%)`}
                </Text>
              </View>

              <View style={styles.royaltyFeeView}>
                <Text>{translate('common.serviceFee')}</Text>
                <Text style={styles.priceInPercent}>
                  {modalVisible
                    ? `${toFixCustom(
                        ((Number(offerData?.totalPrice) || 0) * SERVICE_FEE) /
                          100,
                      )} ${offerData?.receiveToken} (${SERVICE_FEE}%)`
                    : `${toFixCustom(
                        Number((price * SERVICE_FEE) / 100),
                      )} ${tokenName} (${SERVICE_FEE}%)`}
                </Text>
              </View>
            </>
          ) : (
            <View style={styles.feeErrorView}>
              <Text style={styles.errorText}>
                {'Fiat plugin not installed on Moralis!'}
              </Text>

              <TouchableOpacity onPress={() => setIsTopUpError(false)}>
                <Image
                  style={styles.headerCancelButton}
                  source={Images.cancelIcon}
                />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.breakLine} />

          <View style={styles.willPayView}>
            <Text>{translate('common.youWillPay')}</Text>
            <Text style={styles.nftPrice}>
              {modalVisible
                ? `${toFixCustom(offerData?.totalPrice) || 0} ${
                    offerData?.receiveToken
                  }`
                : `${toFixCustom(price)} ${tokenName}`}
            </Text>
          </View>

          <View style={styles.breakLine} />

          <View style={styles.checkBoxView}>
            <Checkbox
              isCheck={isCheckService}
              iconSize={wp('7%')}
              onChecked={() => setCheckService(!isCheckService)}
            />
            <Text style={styles.footerText}>
              {translate('common.byCheckingTheBox')}{' '}
              <Text style={styles.termsText}>
                {translate('wallet.common.termsServices')}
              </Text>
            </Text>
          </View>

          {isCheckError && (
            <View style={{marginTop: 10}}>
              <Text style={styles.errorText}>
                {modalVisible
                  ? 'This field is require. It must be greater than 0'
                  : 'Please tick to agree service button to send transaction.'}
              </Text>
            </View>
          )}

          <View style={styles.makkeOfferGroupButtonView}>
            <GroupButton
              leftText={translate('common.Confirm')}
              leftDisabled={isChecking}
              leftLoading={isChecking}
              onLeftPress={() => {
                if (!isCheckService) {
                  setIsCheckError(true);
                } else {
                  setIsCheckError(false);
                  onMakeOffer();
                }
              }}
              rightText={translate('common.topUp')}
              rightDisabled={false}
              rightLoading={false}
              onRightPress={() => {}}
              rightStyle={styles.rightGroupButton}
              rightTextStyle={styles.rightGroupButtonText}
            />
          </View>
        </View>
      </Modal>
    );
  };

  const onClickMakeOffer = () => {
    setModalVisible(true);
    setOfferData({
      ...offerData,
      expried: new Date(new Date().getTime() + DAY14),
    });
  };
  //================== Render Group Button Function ==================

  const renderContentAction = () => {
    switch (detailNFT?.marketNftStatus) {
      case NFT_MARKET_STATUS.NOT_ON_SALE:
        return <NotOnSaleAction />;
      case NFT_MARKET_STATUS.ON_FIX_PRICE:
        return <OnFixPriceAction />;
      case NFT_MARKET_STATUS.ON_AUCTION:
        return <OnAuctionAction />;
      case NFT_MARKET_STATUS.CANCEL_AUCTION:
      case NFT_MARKET_STATUS.END_AUCTION:
        return <EndAuctionAction />;
      default:
        return <UpCommingAuctionAction />;
    }
  };

  const NotOnSaleAction = () => {
    if (compareAddress(walletAddress, ownerAddress)) {
      return (
        <View style={styles.buybutton}>
          <GroupButton
            leftText={translate('common.sell')}
            leftDisabled={false}
            leftLoading={false}
            onLeftPress={() => {
              setSellVisible(true);
            }}
            rightHide
          />
        </View>
      );
    }
    return (
      <View style={styles.buybutton}>
        <GroupButton
          leftText={translate('common.makeOffer')}
          leftDisabled={false}
          leftLoading={false}
          onLeftPress={() => {
            onClickMakeOffer();
          }}
          rightHide
        />
      </View>
    );
  };

  const OnFixPriceAction = () => {
    if (compareAddress(walletAddress, ownerAddress)) {
      return (
        <View style={styles.buybutton}>
          <GroupButton
            leftText={translate('common.cancelResell')}
            leftDisabled={false}
            leftLoading={false}
            onLeftPress={() => {
              setCancel(true);
            }}
            rightText={translate('common.editPrice')}
            rightDisabled={false}
            rightLoading={false}
            onRightPress={() => {
              setPriceEdit(true);
            }}
            rightStyle={styles.rightButton}
            rightTextStyle={styles.rightButtonText}
          />
        </View>
      );
    }
    return (
      <View style={styles.buybutton}>
        <GroupButton
          leftText={translate('common.buy')}
          leftDisabled={false}
          leftLoading={false}
          onLeftPress={() => {
            setCheckOut(true);
          }}
          rightText={translate('common.makeOffer')}
          rightDisabled={false}
          rightLoading={false}
          onRightPress={() => {
            onClickMakeOffer();
          }}
          rightStyle={styles.rightButton}
          rightTextStyle={styles.rightButtonText}
        />
      </View>
    );
  };

  const BidInfo = ({status}) => {
    const [isWaiting, setIsWaiting] = useState(false);
    const auction = detailNFT?.saleData?.auction;
    const startTime = auction?.startTime;
    const endTime = auction?.endTime;

    const nowTimeStamp = Date.now();
    const startTimeStamp = new Date(startTime).getTime();
    const endTimeStamp = new Date(endTime).getTime();

    const finalTime =
      nowTimeStamp < startTimeStamp ? startTimeStamp : endTimeStamp;

    const endCoundownTime = (finalTime - nowTimeStamp) / 1000;

    const callbackCoundown = () => {
      setIsWaiting(true);
      setTimeout(() => {
        getNFTDetails(true);
      }, 50000);
    };

    const CountdownTime = () => {
      return (
        <View>
          <CountDown
            size={18}
            until={endCoundownTime}
            onFinish={() => callbackCoundown()}
            digitStyle={styles.countDownDigit}
            digitTxtStyle={styles.countDownText}
            separatorStyle={styles.countDownText}
            timeToShow={['D', 'H', 'M', 'S']}
            timeLabels={{d: null, h: null, m: null, s: null}}
            showSeparator
          />
        </View>
      );
    };

    const renderCoundown = () => {
      if (status === NFT_MARKET_STATUS.UPCOMMING_AUCTION) {
        return (
          <View style={CommonStyles.rowAlign}>
            {isWaiting ? (
              <Text style={styles.marginRight}>
                {translate('common.auctionBeingUpdatedPleasewait')}
              </Text>
            ) : (
              <>
                <Text style={styles.marginRight}>
                  {translate('common.auctionStartIn')}:
                </Text>
                <CountdownTime />
              </>
            )}
          </View>
        );
      }
      if (status === NFT_MARKET_STATUS.ON_AUCTION) {
        return (
          <View style={CommonStyles.rowAlign}>
            {isWaiting ? (
              <Text style={styles.marginRight}>
                {translate('common.auctionBeingUpdatedPleasewait')}
              </Text>
            ) : (
              <>
                <Text style={styles.marginRight}>
                  {translate('common.auctionEndIn')}:
                </Text>
                <CountdownTime />
              </>
            )}
          </View>
        );
      }
      return null;
    };

    return (
      <View style={{paddingTop: 5, paddingBottom: 10}}>
        {renderCoundown()}
        {auction?.highestBidder ? (
          <Text style={{paddingTop: SIZE(10)}}>
            {translate('common.highhestBidder')}:{' '}
            {auction?.highestBidder.slice(0, 7) + '...'}
          </Text>
        ) : null}
      </View>
    );
  };

  const OnAuctionAction = () => {
    return (
      <View>
        <BidInfo status={NFT_MARKET_STATUS.ON_AUCTION} />
        {compareAddress(walletAddress, ownerAddress) ? (
          <View style={CommonStyles.flexRow}>
            <GroupButton
              leftText={translate('common.cancelAuction')}
              leftDisabled={false}
              leftLoading={false}
              onLeftPress={() => {
                setCancelAuctionModal(true);
              }}
              rightHide
            />
          </View>
        ) : (
          <View style={CommonStyles.flexRow}>
            <GroupButton
              leftText={translate('common.placeABid')}
              leftDisabled={false}
              leftLoading={false}
              onLeftPress={() => {
                setPlaceABid(true);
              }}
              rightHide
            />
          </View>
        )}
      </View>
    );
  };

  const EndAuctionAction = () => {
    return (
      <View>
        <BidInfo status={NFT_MARKET_STATUS.CANCEL_AUCTION} />
        {compareAddress(walletAddress, ownerAddress) ? (
          <View style={CommonStyles.flexRow}>
            <GroupButton
              leftText={translate('common.reclaimNFT')}
              leftDisabled={false}
              leftLoading={false}
              onLeftPress={() => {
                setReclaimModal(true);
              }}
              rightHide
            />
          </View>
        ) : (
          <View style={CommonStyles.flexRow}>
            <GroupButton
              leftText={translate('common.auctionEnd')}
              leftDisabled={true}
              leftLoading={false}
              onLeftPress={() => {}}
              rightHide
            />
          </View>
        )}
      </View>
    );
  };

  const UpCommingAuctionAction = () => {
    return (
      <View>
        <BidInfo status={NFT_MARKET_STATUS.UPCOMMING_AUCTION} />
        {compareAddress(walletAddress, ownerAddress) ? (
          <GroupButton
            leftText={translate('common.cancelAuction')}
            leftDisabled={false}
            leftLoading={false}
            onLeftPress={() => {
              setCancelAuctionModal(true);
            }}
            rightHide
          />
        ) : null}
      </View>
    );
  };

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
  const noDataRender = history => {
    return (
      <Cell
        style={styles.emptyData(history)}
        data={translate('common.noDataFound')}
      />
    );
  };

  const renderBidNTradingHistory = history => {
    let listData =
      history === 'bid'
        ? sellDetails
        : history === 'offers'
        ? offerList
        : tradingTableData;
    return (
      <NFTDetailDropdown
        title={
          history === 'bid'
            ? translate('wallet.common.bidHistory')
            : history === 'offers'
            ? 'Offers'
            : translate('common.tradingHistory')
        }
        containerChildStyles={{
          height:
            listData?.length === 0
              ? history === 'trading'
                ? hp(28)
                : hp(19)
              : listData?.length < 5
              ? hp(16) +
                hp(4) *
                  (history === 'trading' && listData.length <= 3
                    ? 3
                    : listData?.length)
              : hp(35.7),
        }}
        icon={
          history === 'bid'
            ? historyImg
            : history === 'offers'
            ? tradingImg
            : detailsImg
        }>
        {history === 'trading' && (
          <Filters
            value={filterTableValue}
            setValue={setFilterTableValue}
            setData={setFilterTableList}
            data={filterTableList}
          />
        )}
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          // nestedScrollEnabled={true}
          style={{marginVertical: hp(2)}}>
          <Table borderStyle={styles.cellBorderStyle}>
            <Row
              data={
                history === 'trading' ? tradingTableHead : bidHistoryTableHead
              }
              style={styles.head}
              textStyle={styles.text}
              widthArr={
                history === 'trading'
                  ? [200, 130, 180, 180, 200]
                  : [130, 180, 180, 200]
              }
            />
            {history === 'bid'
              ? sellDetails?.length > 0
                ? sellDetails?.map((rowData, rowIndex) => {
                    return (
                      <TableWrapper key={rowIndex} style={CommonStyles.flexRow}>
                        {rowData?.map((cellData, cellIndex) => {
                          return renderCell(cellIndex, cellData, rowIndex);
                        })}
                      </TableWrapper>
                    );
                  })
                : noDataRender()
              : history === 'offers'
              ? offerList?.length > 0
                ? offerList?.map((rowData, rowIndex) => {
                    let temprowData = rowData.slice(0, 4);
                    let iconUri = rowData.find((e, i) => i === 4);
                    return (
                      <TableWrapper key={rowIndex} style={CommonStyles.flexRow}>
                        {temprowData?.map((cellData, cellIndex) => {
                          return renderCell(
                            cellIndex,
                            cellData,
                            rowIndex,
                            iconUri,
                          );
                        })}
                      </TableWrapper>
                    );
                  })
                : noDataRender()
              : tradingTableData.length > 0
              ? tradingTableData?.map((rowData, rowIndex) => {
                  return (
                    <TableWrapper key={rowIndex} style={CommonStyles.flexRow}>
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
                              (cellIndex == 2 || cellIndex == 3) &&
                              cellData !== 'Null Address'
                                ? renderAddress(cellData)
                                : cellData
                            }
                            textStyle={styles.text}
                            width={wid}
                          />
                        );
                      })}
                    </TableWrapper>
                  );
                })
              : noDataRender(history)}
          </Table>
        </ScrollView>
      </NFTDetailDropdown>
    );
  };

  const renderAddress = cellData => {
    return (
      <TouchableOpacity
        disabled={!cellData}
        onPress={() => navigation.push('ArtistDetail', {id: cellData})}>
        <Text numberOfLines={1} style={[styles.text, styles.themeColor]}>
          {formatAddress(cellData)}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderCell = (index, cellData, rowIndex, iconUri) => {
    return (
      <Cell
        key={rowIndex}
        data={
          index === 0 && iconUri ? (
            <View style={CommonStyles.rowAlign}>
              <Image style={styles.networkIcon} source={{uri: iconUri}} />
              <Text>{cellData}</Text>
            </View>
          ) : index === 1 ? (
            renderAddress(cellData)
          ) : (
            cellData
          )
        }
        borderStyle={styles.cellBorderStyle}
        textStyle={styles.text}
        width={index === 0 ? 130 : index === 1 ? 180 : index === 2 ? 180 : 200}
      />
    );
  };

  const showContractAddress = item => {
    return typeof item?.collection === 'object'
      ? item?.collection?.address
      : item?.collection
      ? item?.collection?.substring(0, 5) +
        ' ... ' +
        item.collection.slice([item.collection.length - 4])
      : '';
  };

  //===================== Render Creator NFTDetailDropdown Function =======================
  const renderCreatorNFTDetailDropdown = () => {
    return (
      <NFTDetailDropdown title={translate('common.creator')} icon={detailsImg}>
        <TouchableOpacity
          onPress={() => {
            if (!disableCreator) {
              onProfile(false);
            }
          }}
          style={styles.personType}>
          {renderIconImage('creator', true)}
        </TouchableOpacity>

        {detailNFT?.creator?.description ? (
          <TextView style={[styles.rowText, {marginTop: SIZE(10)}]}>
            {detailNFT?.creator?.description}
          </TextView>
        ) : null}
        {renderSocialLinks()}
      </NFTDetailDropdown>
    );
  };

  const renderSocialLinks = () => {
    let twitterFullLink = twitterLink(detailNFT?.creator?.twitterLink);
    return (
      <View style={styles.socialLinksWrap}>
        {detailNFT?.creator?.twitterLink ? (
          <TouchableOpacity
            style={styles.marginRight}
            hitSlop={hitSlop}
            onPress={() => Linking.openURL(twitterFullLink)}>
            <TwitterIcon />
          </TouchableOpacity>
        ) : null}
        {detailNFT?.creator?.instagramLink ? (
          <TouchableOpacity
            hitSlop={hitSlop}
            style={{marginRight: 6}}
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
        {renderDetail(
          'wallet.common.contractAddress',
          'address',
          showContractAddress(),
        )}
        {renderDetail('wallet.common.nftId', '', nftTokenId)}
        {renderDetail('wallet.common.tokenStandard', '', 'ERC-721')}
        {renderDetail(
          'wallet.common.blockChainType',
          'blockChainType',
          network?.networkName,
        )}
      </NFTDetailDropdown>
    );
  };
  const renderDetail = (translateKey, key, value) => {
    let translateWord = translateKey;
    return (
      <View style={styles.rowContainer}>
        <TextView style={styles.rowText}>{translate(translateWord)}</TextView>
        <TextView
          style={
            key === ''
              ? styles.rowText
              : key === 'blockChainType'
              ? [styles.rowText, {textTransform: 'uppercase'}]
              : [styles.rowTextcontractaddress, {color: Colors.themeColor}]
          }
          ellipsizeMode="middle"
          numberOfLines={1}>
          {value}
        </TextView>
      </View>
    );
  };

  //=============== Render More from this collection Function ===============
  const renderMoreCollection = () => {
    return (
      <NFTDetailDropdown
        title={translate('wallet.common.collectionHint')}
        icon={detailsImg}
        containerStyles={{width: wp(100)}}
        containerChildStyles={styles.containerChildStyles}>
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
              leftTextStyle={{color: Colors.BLUE4}}
              onLeftPress={() =>
                navigation.push('CollectionDetail', {
                  networkName: detailNFT?.network?.networkName,
                  contractAddress: detailNFT?.collection?.address,
                  launchpadId: detailNFT?.launchpadId,
                })
              }
              rightHide
            />
          </>
        ) : (
          <View style={styles.sorryMessageCont}>
            <Text style={styles.sorryMessage}>{translate('common.noNFT')}</Text>
          </View>
        )}
      </NFTDetailDropdown>
    );
  };

  const renderItem = ({item}) => {
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
    );
  };

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
    );
  };

  //=================== Other Functions =====================
  let disableCreator = false;
  //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  let ownerName = ownerDataN?.name?.trim()
    ? ownerDataN.name
    : ownerDataN?.address?.includes('0x')
    ? ownerDataN.address.substring(0, 6)
    : '---';

  let creatorName = artistDetail?.name?.trim()
    ? artistDetail.name
    : artistDetail?.address?.includes('0x')
    ? artistDetail.address.substring(0, 6)
    : '---';

  let collectionName = collectCreat?.name
    ? collectCreat.name
    : collectCreat?.address?.includes('0x')
    ? collectCreat.address.substring(0, 6)
    : '---';

  //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const getRealtedNFT = async () => {
    let page = 1;
    let limit = 6;
    let networkId = network?.networkId;
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
        networkId,
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
    let url = `${NEW_BASE_URL}/sale-nft/offer-list/${nftId}`;
    sendRequest({
      url,
      method: 'GET',
    })
      .then(res => {
        if (res?.length > 0) {
          let tempList = [];

          res?.map(item => {
            let temp = [
              `${Number(item?.price)} ${item?.receiveToken}`,
              item.fromUser?.address,
              getDateString(item.createdAt ? item.createdAt : Date.now()),
              item.expired * 1000 > Date.now()
                ? timeSince(new Date(item.expired * 1000))
                : 'Expired',
              item?.networkTokenIcon,
            ];
            tempList.push(temp);
          });

          setOfferList(tempList);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const getHistory = (history, sort) => {
    let page = 1;
    let limit = 5;
    let bidSort = 3;
    let payload =
      history === 'bid'
        ? {
            url: `${NEW_BASE_URL}/sale-nft/bid-history?page=${page}&limit=${limit}&nftId=${nftId}&sort=${bidSort}`,
            method: 'GET',
          }
        : {
            url: `${NEW_BASE_URL}/sale-nft/trading-history`,
            method: 'POST',
            data: {
              page: 1,
              limit: 30,
              nftId: nftId,
              sort,
            },
          };
    sendRequest(payload)
      .then(res => {
        if (res?.items?.length > 0) {
          if (history === 'bid') {
            let tempList = [];

            res?.items?.map(item => {
              let temp = [
                `${Number(item?.price)} ${item?.receiveToken}`,
                item?.fromUser?.userWallet?.address,
                moment(item?.createdAt).format('YYYY/MM/DD hh:mm:ss'),
                getExpirationDate(item?.expired),
              ];
              tempList.push(temp);
            });

            setSellDetails(tempList);
          } else {
            let tradingList = [];
            let filterList = [];

            res?.items?.map(item => {
              let from = item?.fromUser?.userWallet?.address;
              let to = item?.toUser?.userWallet?.address;

              if (item.action === SORT_TRADING_HISTORY.BUY_NFT) {
                from = item?.toUser?.userWallet?.address;
                to = item?.fromUser?.userWallet?.address;
              }
              let temp = [
                getEventByValue(item?.action),
                item?.price && item?.receiveToken
                  ? Number(item?.price) + ' ' + item?.receiveToken
                  : '',
                getFromAddress(from, item?.action),
                getToAddress(to, item?.action),
                moment(item?.createdAt).format('YYYY/MM/DD hh:mm:ss'),
              ];
              tradingList.push(temp);
              filterList.push(getEventByValue(item?.action));
            });
            setTradingList(res?.items);
            setTradingTableData(tradingList);
            setFilterTableList(FILTER_TRADING_HISTORY_OPTIONS);
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

  const onProfile = ownerStatus => {
    if (ownerStatus) {
      if (ownerN) {
        navigation.push('ArtistDetail', {id: ownerN});
      }
    } else {
      if (artist) {
        navigation.push('ArtistDetail', {id: artist});
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
      setDetailNFT(nftData);
      if (typeof setNftItem == 'function') {
        let nftItem = {
          ...item,
          isLike: nftData?.isLike,
          totalLike: nftData?.totalLike,
        };
        setNftItem(nftItem);
      }
    }
  };

  const closeSuccess = () => {
    setSuccessModalVisible(false);
    setLoad(true);
  };

  return (
    <>
      <SafeAreaView style={styles.mainContainer}>
        {renderAppHeader()}
        <AppBackground isBusy={load}>
          <ScrollView showsVerticalScrollIndicator={false} ref={scrollRef}>
            {renderBannerImageVideo()}
            {categoryType === CATEGORY_VALUE.movie
              ? !playVideo && renderHeartIcon()
              : renderHeartIcon()}
            {!load && renderCreatorCollectionOwnerName()}
            {renderCreatorAndNFTName()}
            {renderDescription()}
            {renderNFTPriceNToken()}

            <View style={styles.bottomView}>
              {!load && renderContentAction()}
            </View>

            {renderCreatorNFTDetailDropdown()}
            {renderDetailNFTDetailDropdown()}
            {renderBidNTradingHistory('bid')}
            {renderBidNTradingHistory('offers')}
            {renderBidNTradingHistory('trading')}
            {renderMoreCollection()}

            {editPriceModal()}
            {ModalBody()}
            {placeABidModal()}
            {sellNftModal()}

            <TransactionPending
              isVisible={openTransactionPending}
              setVisible={setOpenTransactionPending}
            />
            <ShowModal
              isVisible={cancelAuctionModal}
              title={translate('common.cancelAuction')}
              description={translate('common.areYouWantCancelAuction')}
              closeModal={modalClose}
              onRightPress={cancelAuctionApi}
            />
            <ShowModal
              isVisible={reclaimModal}
              title={translate('common.reclaimNFT')}
              description={translate('common.areYouWantReclaimNFT')}
              closeModal={closeReclaimModal}
              onRightPress={reClaimApi}
            />
            <ShowModal
              isVisible={cancel}
              title={translate('common.cancelResell')}
              description={translate(
                'common.cancellingYourlistingWillUnPublish',
              )}
              closeModal={cancelModal}
              onRightPress={cancelModalConfirm}
            />

            <DatePicker
              modal
              open={handleDate.open}
              minimumDate={new Date()}
              date={
                handleDate.for === 'open'
                  ? sellData.startTime
                  : handleDate.for === 'close'
                  ? sellData.closeTime
                  : offerData.expried
              }
              onConfirm={date => {
                if (handleDate.for === 'open') {
                  setSellData({
                    ...sellData,
                    startTime: date,
                  });
                } else if (handleDate.for === 'close') {
                  setSellData({
                    ...sellData,
                    closeTime: date,
                  });
                } else {
                  setOfferData({
                    ...offerData,
                    expried: date,
                  });
                }
                setHandleDate({
                  open: false,
                  for: '',
                });
              }}
              onCancel={() => {
                setHandleDate({
                  open: false,
                  for: '',
                });
              }}
            />
          </ScrollView>
        </AppBackground>
      </SafeAreaView>
      {/* {renderPaymentMethod()}
      {renderPaymentNow()} 
      {renderTabModal()}
      {renderAppModal()} */}
    </>
  );
};

export default DetailScreen;
