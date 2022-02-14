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
import getLanguage from '../../utils/languageSupport';
import { translate } from '../../walletUtils';
import styles from './styles';
import { numberWithCommas } from '../../utils';
import { colors } from '../../res';

const { width } = Dimensions.get('window');
const langObj = getLanguage();

const Web3 = require('web3');

const {
  CommentIcon,
  HeartIcon,
  HeartActiveIcon,
  ShareIcon,
  BookMarkIcon,
  PlayButtonIcon,
} = SVGS;

const nftItem = ({ item, index, isCollection }) => {
  const dispatch = useDispatch();
  const { AuthReducer } = useSelector(state => state);
  const { data, wallet } = useSelector(state => state.UserReducer);
  const [owner, setOwner] = useState('----');
  const [ownerId, setOwnerId] = useState('');
  const [ownerImage, setOwnerImage] = useState();
  const [ownerData, setOwnerData] = useState();
  const [artistId, setArtistId] = useState();
  const [artist, setArtist] = useState('----');
  const [artistData, setArtistData] = useState();
  const [creatorImage, setCreatorImage] = useState();
  const [isPlay, setPlay] = useState(false);
  const refVideo = useRef(null);
  const [singleNFT, setSingleNFT] = useState({});
  const [priceNFT, setPriceNFT] = useState('');
  const [priceNFTString, setPriceNFTString] = useState('');
  const [discount, setDiscount] = useState(false);
  const [discountValue, setDiscountValue] = useState('');
  const [availableTokens, setAvailableTokens] = useState([]);
  const [isContractOwner, setIsContractOwner] = useState(false);
  const [isForAward, setIsForAward] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [nonCryptoOwnerId, setNonCryptoOwnerId] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [textShown, setTextShown] = useState(false);
  const [lengthMore, setLengthMore] = useState(false);
  const navigation = useNavigation();

  let MarketPlaceAbi = '';
  let MarketContractAddress = '';

  let ERC721Abi = '';
  let providerUrl = '';

  let params = item.tokenId.toString().split('-');
  let tokenId =
    params.length > 2 ? params[2] : params.length > 1 ? params[1] : params[0];
  let chainType = params.length > 1 ? params[0] : 'polygon';
  let collectionAddress = params.length > 2 ? params[1] : null;
  if (chainType === 'polygon') {
    MarketPlaceAbi = blockChainConfig[1].marketConConfig.abi;
    MarketContractAddress = blockChainConfig[1].marketConConfig.add;
    providerUrl = blockChainConfig[1].providerUrl;
    ERC721Abi = blockChainConfig[1].erc721ConConfig.abi;
    ERC721Address = blockChainConfig[1].erc721ConConfig.add;
    collectionAddress =
      collectionAddress || blockChainConfig[1].erc721ConConfig.add;
  } else if (chainType === 'binance') {
    MarketPlaceAbi = blockChainConfig[0].marketConConfig.abi;
    MarketContractAddress = blockChainConfig[0].marketConConfig.add;
    providerUrl = blockChainConfig[0].providerUrl;
    ERC721Abi = blockChainConfig[0].erc721ConConfig.abi;
    ERC721Address = blockChainConfig[0].erc721ConConfig.add;
    collectionAddress =
      collectionAddress || blockChainConfig[0].erc721ConConfig.add;
  } else if (chainType === 'ethereum') {
    MarketPlaceAbi = blockChainConfig[2].marketConConfig.abi;
    MarketContractAddress = blockChainConfig[2].marketConConfig.add;
    providerUrl = blockChainConfig[2].providerUrl;
    ERC721Abi = blockChainConfig[2].erc721ConConfig.abi;
    ERC721Address = blockChainConfig[2].erc721ConConfig.add;
    collectionAddress =
      collectionAddress || blockChainConfig[2].erc721ConConfig.add;
  }

  const chainAvailable = () => {
    let found = false;
    for (let i = 0; i < blockChainConfig.length; i++) {
      if (blockChainConfig[i].key === chainType) {
        found = true;
        break;
      }
    }
    return found;
  };
  let walletAddressForNonCrypto = '';
  walletAddressForNonCrypto =
    networkType === 'testnet'
      ? chainType === 'binance'
        ? '0x61598488ccD8cb5114Df579e3E0c5F19Fdd6b3Af'
        : '0x9b6D7b08460e3c2a1f4DFF3B2881a854b4f3b859'
      : '0xac940124f5f3b56b0c298cca8e9e098c2cccae2e';
  useEffect(() => {
    // Get NonCryptoNFTOwner
    let web3 = new Web3(providerUrl);
    if (chainAvailable()) {
      let MarketPlaceContract = new web3.eth.Contract(
        MarketPlaceAbi,
        MarketContractAddress,
      );
      if (MarketPlaceContract.methods.getNonCryptoOwner) {
        MarketPlaceContract.methods
          .getNonCryptoOwner(collectionAddress, tokenId)
          .call(async (err, res) => {
            if (res) {
              const userId = res.toLowerCase();
              setOwnerId(userId);
              getPublicProfile(userId, false);
              getTokenDetailsApi(false);
            } else if (!res) {
              getTokenDetailsApi();
            } else if (err) {
            }
          });
      } else {
        getTokenDetailsApi();
      }
    }
  }, []);

  const getPublicProfile = async (id, type) => {
    const userId = id?.toLowerCase();
    let profileUrl = type
      ? `${BASE_URL}/user/get-public-profile?publicAddress=${userId}`
      : `${BASE_URL}/user/get-public-profile?userId=${userId}`;
    setOwnerId(userId);
    let profile = await axios.get(profileUrl);
    if (profile.data) {
      setOwnerData(profile.data.data);
      setOwner(profile?.data?.data?.username);
      setOwnerImage(profile.data.data.profile_image);
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

    let MarketPlaceContract = new web3.eth.Contract(
      MarketPlaceAbi,
      MarketContractAddress,
    );
    ERC721Contract.methods.ownerOf(tokenId).call((err, res) => {
      if (!err) {
        _data.owner_address = res;
        console.log('owner_address', res, tokenId);
        MarketPlaceContract.methods
          .getSellDetail(collectionAddress, tokenId)
          .call(async (err, res) => {
            console.log(
              'MarketPlaceContract_res',
              res,
              err,
              tokenId,
              MarketContractAddress,
            );
            // return ;
            if (!err) {
              let priceOfNft = res[1] / 1e18;
              if (wallet.address) {
                // if (priceOfNft === 0) {
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

              setOwnerAddress(nonCryptoOwner);
            }
          });
      }
    });
  };
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
        console.log('res', res);
        if (!err) {
          nftObj.owner_address = res;
        }
      });

    return nftObj;
  };
  const getTokenDetailsApi = async (isCryptoOwner = true) => {
    let category = '2D';
    let data = {
      tokenId: tokenId,
      networkType: networkType,
      type: category,
      chain: chainType,
      owner: wallet.address,
    };

    let fetch_data_body = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    fetch(`${BASE_URL}/xanalia/getDetailNFT`, fetch_data_body)
      .then(response => response.json())
      .then(async res => {
        // console.log('getDetailNFT_res', res);
        if (res.data.length > 0 && res.data !== 'No record found') {
          const temp = res.data[0];

          let req_data = {
            owner: temp?.returnValues?.to?.toLowerCase(),
            token: 'HubyJ*%qcqR0',
          };
          // setOwner(temp?.returnValues?.to?.toLowerCase());
          setArtistId(temp?.returnValues?.to?.toLowerCase());
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
              if (res.data) {
                setArtistData(res.data);
                setArtist(res.data.username || res.data.title);
                setCreatorImage(res.data.profile_image);
              }
            });
          if (isCryptoOwner) {
            lastOwnerOfNFT();
          } else {
            lastOwnerOfNFTNonCrypto();
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
          if (newData.newprice && newData.newprice.allowedCurrencies) {
            let currArray = newData.newprice.allowedCurrencies.split('');
            let availableTokens = basePriceTokens.filter(
              token =>
                token.chain === chainType &&
                currArray.includes(token.order.toString()),
            );
            console.log('availableTokens', availableTokens);
            setAvailableTokens(availableTokens);
          } else {
            setAvailableTokens([]);
          }

          setSingleNFT(newData);
          setIsForAward(
            res?.data[0]?.award
              ? res?.data[0]?.award
              : res?.data[1]?.award
                ? res?.data[1]?.award
                : false,
          );
          console.log('calling');
          //checkNFTOnAuction();
        } else if (res.data === 'No record found') {
          console.log('res.data.data', res.data);
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

  // const getTokenDetailsApi = async (isCryptoOwner = true) => {

  //   let body_data = {
  //     tokenId: item.tokenId,
  //     networkType: networkType,
  //     type: '2D',
  //     chain: chainType,
  //   };

  //   let fetch_data_body = {
  //     method: 'POST',
  //     body: JSON.stringify(body_data),
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //   };

  //   fetch(`${BASE_URL}/xanalia/getDetailNFT`, fetch_data_body)
  //     .then(response => response.json())
  //     .then(res => {
  //       if (res.data.length > 0 && res.data !== 'No record found') {
  //         const data = res.data[0];

  //         let req_data = {
  //           owner: data?.returnValues?.to?.toLowerCase(),
  //           token: 'HubyJ*%qcqR0',
  //         };
  //         setOwner(data?.returnValues?.to?.toLowerCase());
  //         setArtistId(data?.returnValues?.to?.toLowerCase());

  //         let body = {
  //           method: 'POST',
  //           body: JSON.stringify(req_data),
  //           headers: {
  //             Accept: 'application/json',
  //             'Content-Type': 'application/json',
  //           },
  //         };
  //         fetch(`${BASE_URL}/xanalia/getProfile`, body)
  //           .then(response => response.json())
  //           .then(res => {
  //             if (res.data) {
  //               setArtistData(res.data);
  //               setArtist(res.data.title || res.data.username);
  //               setCreatorImage(res.data.profile_image);
  //             }
  //           })
  //         if (isCryptoOwner) {
  //           lastOwnerOfNFT();
  //         } else {
  //           lastOwnerOfNFTNonCrypto();
  //         }
  //       } else if (res.data.data === "No record found") {
  //         alertWithSingleBtn(
  //           translate('common.error'),
  //           translate('common.norecordfound'),
  //         );
  //       }
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // };

  const onTextLayout = useCallback(e => setLengthMore(e.nativeEvent.lines.length > 2), []);

  const image = item.metaData.image || item.thumbnailUrl;
  const fileType = image ? image?.split('.')[image?.split('.').length - 1] : '';

  const onProfile = isOwner => {
    if (isOwner) {
      if (ownerId) navigation.push('ArtistDetail', { id: ownerId });
    } else {
      if (artistId) navigation.push('ArtistDetail', { id: artistId });
    }
  };
  let imageUri =
    item.thumbnailUrl !== undefined || item.thumbnailUrl
      ? item.thumbnailUrl
      : item.metaData.image;
  return (
    <View>
      <View style={styles.modalSectCont}>
        <TouchableOpacity
          onPress={() => onProfile(true)}
          style={styles.iconCont}>
          <Image
            style={styles.profileIcon}
            source={!ownerImage ? IMAGES.DEFAULTPROFILE : { uri: ownerImage }}
          />
          <View>
            <Text style={styles.modalIconLabel}>
              {translate('common.owner')}
            </Text>
            <Text
              numberOfLines={1}
              style={[styles.iconLabel, { maxWidth: width * 0.35 }]}>
              {owner}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onProfile(false)}
          style={styles.iconCont}>
          <Image
            style={styles.profileIcon}
            source={!creatorImage ? IMAGES.DEFAULTPROFILE : { uri: creatorImage }}
          />
          <View>
            <Text style={styles.modalIconLabel}>
              {translate('common.creator')}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                styles.iconLabel,
                { maxWidth: Platform.OS === 'ios' ? width * 0.35 : width * 0.4 },
              ]}>
              {artist}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          isPlay
            ? setPlay(!isPlay)
            : navigation.navigate('CertificateDetail', {
              id: item.newtokenId,
              name: item.metaData.name,
              description: item.metaData.description,
              owner: owner,
              ownerImage: ownerImage,
              creator: artist,
              creatorImage: creatorImage,
              thumbnailUrl: item.thumbnailUrl,
              video: item.metaData.image,
              fileType: fileType,
              price: item.price,
              chain: item.chain,
              ownerId: ownerId,
              artistId: artistId,
              tokenId: item.tokenId,
              ownerData: ownerData,
              artistData: artistData,
              item: item
            });
        }}>
        {fileType === 'mp4' ||
          fileType === 'MP4' ||
          fileType === 'mov' ||
          fileType === 'MOV' ? (
          <View style={styles.modalImage}>
            <Video
              key={tokenId}
              ref={refVideo}
              source={{ uri: item.metaData.image }}
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
                  <TouchableOpacity onPress={() => setPlay(true)}>
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
                dispatch(handleLikeDislike(item, index));
              }}>
              {item.like ? <HeartActiveIcon /> : <HeartIcon />}
            </TouchableOpacity>
            <SpaceView mRight={SIZE(15)} />
            <TouchableOpacity>
              <CommentIcon />
            </TouchableOpacity>
            <SpaceView mRight={SIZE(15)} />
            <TouchableOpacity>
              <ShareIcon />
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <BookMarkIcon />
          </TouchableOpacity>
        </RowBetweenWrap>
        <SpaceView mTop={SIZE(8)} />
        <SmallBoldText>{`${numberWithCommas(item.rating)} ${translate('common.Likes')}`}</SmallBoldText>
        <SpaceView mTop={SIZE(6)} />
        <Text style={styles.modalLabel}>{item.metaData.name}</Text>
        <View style={styles.separator} />
        <View>
          <Text onTextLayout={onTextLayout} numberOfLines={textShown ? null : 2} style={styles.description}>
            {item.metaData.description}
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
  );
};

export default nftItem;
