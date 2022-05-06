import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native';
import Video from 'react-native-fast-video';
import { basePriceTokens } from '../../web3/config/availableTokens';
import { blockChainConfig, CDN_LINK } from '../../web3/config/blockChainConfig';
import { useDispatch, useSelector } from 'react-redux';
import { C_Image } from 'src/components';
import { IMAGES, SIZE, SVGS } from 'src/constants';
import { RowBetweenWrap, SpaceView } from 'src/styles/common.styles';
import { SmallBoldText } from 'src/styles/text.styles';
import { BASE_URL } from '../../common/constants';
import { networkType } from '../../common/networkType';
import { handleLikeDislike } from '../../store/actions/nftTrendList';
import { translate } from '../../walletUtils';
import styles from './styles';
import { numberWithCommas } from '../../utils';
import InViewPort from '@coffeebeanslabs/react-native-inviewport';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { alertWithSingleBtn } from "../../common/function";
import { hp } from '../../constants/responsiveFunct';
import Images from '../../constants/Images';

const { width } = Dimensions.get('window');

const Web3 = require('web3');

const {
  CommentIcon,
  HeartIcon,
  HeartActiveIcon,
  ShareIcon,
  BookMarkIcon,
  PlayButtonIcon,
  ThreeDotsVerticalIcon,
} = SVGS;

const nftItem = ({ item, index, minHeight, screenName }) => {
  const dispatch = useDispatch();
  const { AuthReducer } = useSelector(state => state);
  const { data, wallet } = useSelector(state => state.UserReducer);

  const [creatorAddress, setCreatorAddress] = useState("");

  const [isPlay, setPlay] = useState(false);
  const [isLike, setLike] = useState(item.like);
  const [singleNFT, setSingleNFT] = useState({});
  const [priceNFT, setPriceNFT] = useState('');
  const [priceNFTString, setPriceNFTString] = useState('');
  const [discount, setDiscount] = useState(false);
  const [discountValue, setDiscountValue] = useState('');
  const [availableTokens, setAvailableTokens] = useState([]);
  const [isContractOwner, setIsContractOwner] = useState(false);
  const [isForAward, setIsForAward] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [ownerAddress, setOwnerAddress] = useState('');
  const [textShown, setTextShown] = useState(false);
  const [lengthMore, setLengthMore] = useState(false);
  const navigation = useNavigation();
  const refVideo = useRef(null);
  const refVideoPlay = useRef(null);

  // haris change these states
  const [nonCryptoOwnerId, setNonCryptoOwnerId] = useState('');

  const [artistRole, setArtistRole] = useState('');
  const [collectCreat, setcollectCreat] = useState(null)


  const [ownerData, setOwnerData] = useState();
  const [owner, setOwner] = useState('----');

  const [artist, setArtist] = useState('----');
  const [artistData, setArtistData] = useState();

  const [nftDetail, setNFTDetail] = useState();
  const [isArtistProfile, setisArtistProfile] = useState(true);
  const [loader, setLoader] = useState(false);

  const nft = item.tokenId || item.collectionAdd;
  let params = nft.toString().split('-');
  let chainType,
    tokenId,
    collectionAddress,
    ERC721Abi,
    ERC721Address,
    MarketPlaceAbi,
    MarketContractAddress,
    providerUrl,
    walletAddressForNonCrypto;

  if (params.length > 2) {
    chainType = params[0];
    collectionAddress = params[1];
    tokenId = params[2];

    let getBlockChainConfig = blockChainConfig.find(v => v.key.toLowerCase() === chainType.toLowerCase());
    ERC721Abi = getBlockChainConfig.erc721ConConfig.abi;
    ERC721Address = getBlockChainConfig.erc721ConConfig.add;
    MarketPlaceAbi = getBlockChainConfig.marketConConfig.abi
    MarketContractAddress = getBlockChainConfig.marketConConfig.add;
    providerUrl = getBlockChainConfig.providerUrl;

    walletAddressForNonCrypto = networkType === "testnet"
      ? chainType === "binance"
        ? "0x61598488ccD8cb5114Df579e3E0c5F19Fdd6b3Af"
        : "0x9b6D7b08460e3c2a1f4DFF3B2881a854b4f3b859"
      : "0xac940124f5f3b56b0c298cca8e9e098c2cccae2e";

  }

  useEffect(() => {
    if (chainType) {

      const getDetail = async () => {
        await getTokenDetailsApi();
      }

      let web3 = new Web3(providerUrl);
      let MarketPlaceContract = new web3.eth.Contract(
        MarketPlaceAbi,
        MarketContractAddress,
      );

      setLoader(true)
      if (MarketPlaceContract.methods.getNonCryptoOwner) {
        MarketPlaceContract.methods
          .getNonCryptoOwner(collectionAddress, tokenId)
          .call(async (err, res) => {
            if (res) {
              setNonCryptoOwnerId(res)
              getOwnerDetailsById(res);
              await getTokenDetailsApi(false);
            } else if (!res) {
              await getTokenDetailsApi();
            } else if (err) {
            }
          });
      } else {
        getDetail()
      }
    }
  }, []);

  useEffect(() => {
  }, [nftDetail]);

  const getOwnerDetailsById = async (id) => {
    const profileUrl = `${BASE_URL}/user/get-public-profile?userId=${id}`;
    try {
      let profile = await axios.get(profileUrl);
      setLoader(false)
      // console.log(profile, "non_crypto", item.metaData.name)
      setOwnerData(profile?.data?.data)
      setOwner(id);
      setArtistRole('non_crypto')
    } catch (err) { }
  };

  const getPublicProfile = async (id, type) => {
    const userId = id?.toLowerCase();
    let profileUrl = type
      ? `${BASE_URL}/user/get-public-profile?publicAddress=${userId}`
      : `${BASE_URL}/user/get-public-profile?userId=${userId}`;
    // setOwnerId(userId);
    let profile = await axios.get(profileUrl);
    // console.log(profile.data.success, "userIduserIduserIduserId")
    if (profile.data.success) {
      // console.log(profile?.data?.data, "crypto")
      setOwnerData(profile.data.data);
      setArtistRole("crypto")
      setLoader(false)
      setOwner(userId);
      // setOwner(profile?.data?.data?.title ? profile?.data?.data?.title : profile?.data?.data?.username);
      // setOwnerImage(profile.data.data.profile_image);
    } else {
      setOwner(userId);
    }

  };

  const lastOwnerOfNFT = () => {
    let web3 = new Web3(providerUrl);
    let ERC721Contract = new web3.eth.Contract(ERC721Abi, collectionAddress);
    let MarketPlaceContract = new web3.eth.Contract(
      MarketPlaceAbi,
      MarketContractAddress,
    );
    ERC721Contract.methods.ownerOf(tokenId).call((err, res) => {
      let ownerAddress = res;
      if (!err) {
        MarketPlaceContract.methods
          .getSellDetail(collectionAddress, tokenId)
          .call((err, res) => {
            // console.log(res[0] !== '0x0000000000000000000000000000000000000000', "///////")
            if (res[0] !== '0x0000000000000000000000000000000000000000') {
              getPublicProfile(res[0], true);
            } else {
              getPublicProfile(ownerAddress, true);
            }
          });
      }
    });
  };
  const lastOwnerOfNFTNonCrypto = nonCryptoOwner => {
    let _data = singleNFT;
    let web3 = new Web3(providerUrl);
    let ERC721Contract = new web3.eth.Contract(ERC721Abi, collectionAddress);
    // console.log("lastOwnerOfNFTNonCrypto")
    let MarketPlaceContract = new web3.eth.Contract(
      MarketPlaceAbi,
      MarketContractAddress,
    );
    ERC721Contract.methods.ownerOf(tokenId).call((err, res) => {
      if (!err) {
        _data.owner_address = res;
        // console.log('owner_address', res, tokenId);
        MarketPlaceContract.methods
          .getSellDetail(collectionAddress, tokenId)
          .call(async (err, res) => {
            // console.log(
            //   'MarketPlaceContract_res',
            //   res,
            //   err,
            //   tokenId,
            //   MarketContractAddress,
            // );

            if (!err) {
              let priceOfNft = res[1] / 1e18;
              if (wallet?.address) {
                // console.log(res[0] === "0x0000000000000000000000000000000000000000", "////")
                if (res[0] === '0x0000000000000000000000000000000000000000') {
                  setPriceNFT(priceOfNft);
                  setPriceNFTString(res[1]);

                  setIsContractOwner(
                    res[0].toLowerCase() === wallet.address.toLowerCase() ||
                      (res[0].toLowerCase() ===
                        walletAddressForNonCrypto.toLowerCase() &&
                        nonCryptoOwnerId.toLowerCase() === data.user._id)
                      ? true
                      : false,
                  );
                  setIsOwner(
                    (_data?.owner_address?.toLowerCase() ===
                      data?.user?._id?.toLowerCase() &&
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
              // setOwnerAddress(nonCryptoOwner);
            }
          });
      }
    });
  };

  const getCollectionByAddress = (collect) => {
    let url = `${BASE_URL}/xanalia/collection-info?collectionAddr=${collect}`

    axios
      .get(url)
      .then((response) => {
        if (response.data) {
          setcollectCreat(response.data.data)
        }
      })
      .catch((err) => { });
  }

  const getDiscount = () => {
    let web3 = new Web3(providerUrl);
    let MarketPlaceContract = new web3.eth.Contract(
      MarketPlaceAbi,
      MarketContractAddress,
    );
    MarketPlaceContract.methods.adminDiscount &&
      MarketPlaceContract.methods.adminDiscount().call((err, res) => {
        setDiscountValue(res ? res / 10 : 0);
      });
  };
  const getNFTDetails = async obj => {
    let _MarketPlaceAbi = ERC721Abi;
    let _MarketContractAddress = collectionAddress;

    let web3 = new Web3(providerUrl);

    if (obj.tokenId.toString().split('-')[2]) {
      let nftChain = obj.tokenId.toString().split('-')[0];
      let collectionAdd = obj.tokenId.toString().split('-')[1];
      let nftId = obj.tokenId.toString().split('-')[2];

      obj.chainType = nftChain ? nftChain : '';
      obj.polygonId = '';
      obj.collection = collectionAdd;
      obj.collectionAdd = obj.tokenId;
      obj.tokenId = nftId;
    }

    // console.log(MarketContractAddress);

    let MarketPlaceContract = new web3.eth.Contract(
      _MarketPlaceAbi,
      _MarketContractAddress,
    );

    let nftObj = {
      image: obj.metaData.image,
      description: obj.metaData.description,
      title: obj.metaData.name,
      type: obj.metaData.properties.type,
      price: obj.price,
      rating: obj.rating,
      like: obj.like,
      author: obj.returnValues.to,
      _id: obj._id,
      // thumbnailUrl : obj.thumbnailUrl
      thumbnailUrl: obj?.thumbnailUrl,
      imageForVideo: obj?.metaData?.thumbnft
        ? obj?.metaData?.thumbnft
        : obj?.thumbnailUrl,
      newprice: obj.newprice,
      approval: obj.approval,
      buyTxHash: obj?.buyTxHash ? obj?.buyTxHash : "",

      offchain: obj?.offchain ? obj?.offchain : false,
      collectionOffChainId: obj?.returnValues?.collection
        ? obj?.returnValues?.collection
        : "",

      seriesId: obj?.seriesId
        ? obj?.seriesId
        : "",
      secondarySales: obj.secondarySales ? true : false,

      lastTradeType: obj.newprice2 && obj.newprice2?.type === 'auction' ? "auction" : "sell"
    };

    nftObj.id = obj.tokenId;
    nftObj.collection = _MarketContractAddress;
    nftObj.collectionAdd = obj.collectionAdd;
    nftObj.nftChain = obj.chainType;

    nftObj.logoImg = `${CDN_LINK}/logo-v2.svg`;
    nftObj.price = nftObj.price ? nftObj.price : '';

    // console.log("nftObj", nftObj);

    await MarketPlaceContract.methods
      .ownerOf(nftObj.id)
      .call(function (err, res) {
        // console.log('res', res);
        if (!err) {
          nftObj.owner_address = res;
        }
      });

    return nftObj;
  };
  const getTokenDetailsApi = async (isCryptoOwner = true) => {
    let category = '2D';
    let data = {
      tokenId: nft,
      networkType: networkType,
      type: category,
      chain: chainType,
    };
    if (wallet?.address) {
      data.owner = wallet.address
    }
    let fetch_data_body = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    // console.log("getTokenDetailsApi")
    // console.log('/xanalia/getDetailNFT called')
    await fetch(`${BASE_URL}/xanalia/getDetailNFT`, fetch_data_body)
      .then(response => response.json())
      .then(async res => {
        if (res.data.length > 0 && res.data !== 'No record found') {
          const temp = res.data[0];

          setNFTDetail(temp)
          if (temp.offchain) {
            setisArtistProfile(false)
          }

          const getDetails = res?.data;
          if (
            getDetails &&
            getDetails[0] &&
            getDetails[0]?.newprice &&
            getDetails[0]?.newprice?.seller.includes('0x')
          ) {
            getNFTDiscount(
              getDetails[0]?.newprice?.seller,
              getDetails[0]?.newprice?.tokenId,
            );
            getDiscount();
          }

          let newData = await getNFTDetails(res.data[0]);
          setLike(newData.like)
          // console.log(newData, "newDatanewDatanewData")
          let collection = newData.offchain
            ? newData.collectionOffChainId
            : newData.collectionAdd.toString().split("-")[1];
          getCollectionByAddress(collection);
          if (newData.newprice && newData.newprice.allowedCurrencies) {
            let currArray = newData.newprice.allowedCurrencies.split('');
            let availableTokens = basePriceTokens.filter(
              token =>
                token.chain === chainType &&
                currArray.includes(token.order.toString()),
            );
            // console.log('availableTokens', availableTokens);
            setAvailableTokens(availableTokens);
          } else {
            setAvailableTokens([]);
          }
          setSingleNFT(newData);
          setCreatorAddress(newData.author)
          setIsForAward(
            res?.data[0]?.award
              ? res?.data[0]?.award
              : res?.data[1]?.award
                ? res?.data[1]?.award
                : false,
          );
          let req_data = {
            owner: temp?.returnValues?.to?.toLowerCase(),
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
          fetch(`${BASE_URL}/xanalia/getProfile`, body)
            .then(response => response.json())
            .then(res => {
              // console.log(res.data, "///////", item.metaData.name)
              if (res.data) {
                setArtist(temp?.returnValues?.to?.toLowerCase());
                setArtistData(res.data);
              }
            });
          if (isCryptoOwner) {
            lastOwnerOfNFT();
          } else {
            // console.log("aaaaaaaa")
            lastOwnerOfNFTNonCrypto();
          }

          //       // checkNFTOnAuction();
        } else if (res.data === 'No record found') {
          console.log('res.data.data', res.data, "getDetailNFT_res");
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  const getNFTDiscount = id => {
    let web3 = new Web3(providerUrl);
    let MarketPlaceContract = new web3.eth.Contract(
      MarketPlaceAbi,
      MarketContractAddress,
    );
    MarketPlaceContract.methods.adminOwner &&
      MarketPlaceContract.methods.adminOwner(id).call((err, res) => {
        setDiscount(res);
      });
  };

  const onTextLayout = useCallback(e => {
    if (
      e.nativeEvent.lines.length >= 2 &&
      e.nativeEvent.lines[1].width > width - SIZE(40)
    )
      setLengthMore(true);
  }, []);

  const onProfile = isOwner => {
    if (isOwner) {
      if (owner !== "----" && owner) navigation.push('ArtistDetail', { id: owner });
    } else {
      if (artist !== "----" && artist) navigation.push('ArtistDetail', { id: artist });
    }
  };

  // it's temporary fix
  const videoUri = nftDetail ?
    nftDetail?.metaData?.image :
    item ? item?.metaData?.image?.replace('nftdata', 'nftData') : item?.thumbnailUrl;
  const imageUri = item?.thumbnailUrl;

  const image = item.metaData.image || item.thumbnailUrl;
  const fileType = videoUri ? videoUri?.split('.')[videoUri?.split('.').length - 1] : '';

  let disableCreator = false;

  let artistName = artistData && typeof artistData === 'object' ?
    artistData?.role === 'crypto' ?
      artistData?.title?.trim() ? artistData.title :
        artistData?.name?.trim() ? artistData.name :
          artistData?.username?.trim() ? artistData.username :
            (artist === '0x913d90bf7e4A2B1Ae54Bd5179cDE2e7cE712214A'.toLowerCase()
              || artist === '0xf45C0d38Df3eac6bf6d0fF74D53421Dc34E14C04'.toLowerCase()
              || artist === '0x77FFb287573b46AbDdcEB7F2822588A847358933'.toLowerCase()
              || artist === '0xfaae9d5b6f4779689bd273ab30f78beab3a0fc8f'.toLowerCase())
              ? (
                disableCreator = true,
                collectCreatData?.creator
              ) : artist ? artist?.substring(0, 6) : ""
      : artistData?.username?.trim() ? artistData.username :
        artistData?.name?.trim() ? artistData.name :
          artistData?.title?.trim() ? artistData.title : artist ? artist?.substring(0, 6) : ""
    : artist ? artist?.substring(0, 6) : ""

  // console.log("🚀 ~ file: nftItem.js ~ line 571", artistData, '</>', artist, '>>>>')
  // console.log("🚀 ~ file: nftItem.js ~ line 572 ~ nftItem ~ artistName", artistName)

  let ownerName = ownerData && typeof ownerData === 'object' ?
    ownerData?.role === 'crypto' ?
      ownerData?.title?.trim() ? ownerData.title :
        ownerData?.name?.trim() ? ownerData.name :
          ownerData?.username?.trim() ? ownerData.username : owner ? owner.substring(0, 6) : ""
      : ownerData?.username?.trim() ? ownerData.username :
        ownerData?.name?.trim() ? ownerData.name :
          ownerData?.title?.trim() ? ownerData.title : owner ? owner.substring(0, 6) : ""
    : owner ? owner.substring(0, 6) : ""

  // console.log("🚀 ~ file: nftItem.js ~ line 573", ownerData, '</>', owner, '>>>>')
  // console.log("🚀 ~ file: nftItem.js ~ line 574 ~ nftItem ~ ownerName", ownerName)

  // let ownerName = ownerData ? (
  //   ownerData.role === 'crypto' ?
  //     ownerData.title ?
  //       ownerData.title :
  //       owner.includes("0x")
  //         ? owner.substring(0, 6)
  //         : owner.substring(0, 6) :
  //     ownerData.role === 'non_crypto' ?
  //       ownerData.username ?
  //         ownerData.username : ""
  //       : owner) :
  //   owner

  // let artistName = artistData && artist
  //   ? artist.includes("0x")
  //     ? artistData.hasOwnProperty("title") && artistData.title ?
  //       artistData.title
  //       : (artist === '0x913d90bf7e4A2B1Ae54Bd5179cDE2e7cE712214A'.toLowerCase()
  //         || artist === '0xf45C0d38Df3eac6bf6d0fF74D53421Dc34E14C04'.toLowerCase()
  //         || artist === '0x77FFb287573b46AbDdcEB7F2822588A847358933'.toLowerCase())
  //         ? (
  //           disableCreator = true,
  //           collectCreat?.creator
  //         )
  //         : artist.substring(0, 6)
  //     : artistData === "No record found" ?
  //       artist.substring(0, 6) :
  //       artistData.hasOwnProperty("username") && artistData.username ?
  //         artistData.username.substring(0, 6) : artist.substring(0, 6)
  //   : artist.substring(0, 6)

  return (
    <>
      {
        loader ?
          <View style={[styles.mainLoaderView, { minHeight: minHeight ? hp(78) : 200 }]}>
            {/* <ActivityIndicator size={"small"} /> */}
            <Image source={Images.loadergif} />
          </View>
          :
          <View>
            <View style={styles.modalSectCont}>
              <TouchableOpacity
                onPress={() => {
                  if (!disableCreator) {
                    onProfile(false)
                  }
                }
                }
                style={styles.iconCont}>
                <Image
                  style={styles.profileIcon}
                  source={artistData && artistData.hasOwnProperty("profile_image") && artistData.profile_image ? { uri: artistData.profile_image } : IMAGES.DEFAULTPROFILE}
                />
                <View>
                  <Text style={styles.modalIconLabel}>
                    {translate('common.creator')}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={[styles.iconLabel, { maxWidth: Platform.OS === 'ios' ? width * 0.35 : width * 0.4 }]}
                  >
                    {artistName}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={owner == "----" && owner ? true : false}
                onPress={() => onProfile(true)}
                style={styles.iconCont}>
                <Image
                  style={styles.profileIcon}
                  source={ownerData && ownerData.hasOwnProperty("profile_image") && ownerData.profile_image ? { uri: ownerData.profile_image } : IMAGES.DEFAULTPROFILE}
                />
                <View>
                  <Text style={styles.modalIconLabel}>
                    {translate('common.owner')}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={[styles.iconLabel, { maxWidth: width * 0.35 }]}>
                    {ownerName}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <InViewPort onChange={(isVisible) => {
              if (!isVisible) {
                setPlay(false);
              }
            }}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  // chainType && (
                  isPlay
                    ? setPlay(!isPlay)
                    : navigation.navigate('CertificateDetail', {
                      owner: owner,
                      ownerData: ownerData,
                      artistId: artist,
                      collectCreat: collectCreat,
                      artistData: artistData,
                      video: videoUri,
                      fileType: fileType,
                      item: item,
                      index: index,
                    })
                }}>
                {fileType === 'mp4' ||
                  fileType === 'MP4' ||
                  fileType === 'mov' || fileType === 'movie' ||
                  fileType === 'MOV' ? (
                  <View style={styles.modalImage}>
                    <Video
                      key={tokenId}
                      ref={refVideo}
                      source={{ uri: videoUri }}
                      playInBackground={false}
                      paused={!isPlay}
                      resizeMode={'cover'}
                      onLoad={() => refVideo.current.seek(0)}
                      onEnd={() => {
                        setPlay(false);
                        refVideoPlay.current = true;
                      }}
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
                          <TouchableOpacity onPress={() => {
                            if (refVideoPlay.current) {
                              refVideo.current.seek(0);
                            }
                            refVideoPlay.current = false;
                            setPlay(true);
                          }}>
                            <PlayButtonIcon width={SIZE(100)} height={SIZE(100)} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                ) : (
                  <C_Image uri={imageUri} imageStyle={styles.modalImage} />
                )}
              </TouchableOpacity>
            </InViewPort>
            <View
              style={{
                width: '100%',
                alignSelf: 'center',
                paddingTop: SIZE(17),
                paddingHorizontal: SIZE(14),
              }}>
              <RowBetweenWrap>
                <View style={styles.buttons}>
                  <TouchableOpacity
                    onPress={() => {
                      dispatch(handleLikeDislike(item, index, screenName));
                    }}>
                    {isLike ? <HeartActiveIcon /> : <HeartIcon />}
                  </TouchableOpacity>
                  {/* <SpaceView mRight={SIZE(15)} />
                  <TouchableOpacity>
                    <CommentIcon />
                  </TouchableOpacity>
                  <SpaceView mRight={SIZE(15)} />
                  <TouchableOpacity>
                    <ShareIcon />
                  </TouchableOpacity> */}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {/* <TouchableOpacity style={{ marginRight: 8 }}>
                    <BookMarkIcon />
                  </TouchableOpacity> */}
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
              </RowBetweenWrap>
              <SpaceView mTop={SIZE(8)} />
              <SmallBoldText>{`${numberWithCommas(item.rating)} ${translate('common.Likes')}`}</SmallBoldText>
              <SpaceView mTop={SIZE(6)} />
              <Text style={styles.modalLabel}>{item.metaData.name}</Text>
              <View style={styles.separator} />
              <View>
                <Text onTextLayout={onTextLayout} numberOfLines={textShown ? null : 2} style={styles.description}>
                  {item.metaData.description}
                  {lengthMore && textShown && (
                    <TouchableOpacity activeOpacity={1} style={styles.readLessWrap} onPress={() => setTextShown(false)}>
                      <Text style={styles.readMore}>{translate('common.Readless')}</Text>
                    </TouchableOpacity>
                  )}
                </Text>
                {lengthMore && !textShown && (
                  <TouchableOpacity activeOpacity={1} style={styles.readMoreWrap} onPress={() => setTextShown(true)}>
                    <Text style={styles.threeDot}>{'...'}</Text>
                    <Text style={styles.readMore}>{translate('common.Readmore')}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
      }
    </>
  );
};

export default nftItem;
