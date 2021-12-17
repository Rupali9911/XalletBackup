import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, ActivityIndicator, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { networkType } from "../../common/networkType";
import { BASE_URL } from '../../common/constants';
import getLanguage from '../../utils/languageSupport';
import styles from './styles';
import {
  SVGS,
  SIZE,
  IMAGES
} from 'src/constants';
import {
  SpaceView,
  RowBetweenWrap
} from 'src/styles/common.styles';
import {
  SmallBoldText
} from 'src/styles/text.styles';
import { C_Image } from 'src/components';
import { blockChainConfig } from '../../web3/config/blockChainConfig';
import axios from 'axios';
import Video from 'react-native-fast-video';
// import Video from 'react-native-video';
import InViewPort from "@coffeebeanslabs/react-native-inviewport";

import { handleLikeDislike } from '../../store/actions/nftTrendList';
import { translate } from '../../walletUtils';
import { alertWithSingleBtn } from '../../utils';

const { width } = Dimensions.get('window');
const langObj = getLanguage();
const Web3 = require("web3");

const {
  CommentIcon,
  HeartIcon,
  HeartActiveIcon,
  ShareIcon,
  BookMarkIcon,
  PlayButtonIcon
} = SVGS;

const nftItem = ({ item, index }) => {

  const dispatch = useDispatch();

  const { AuthReducer } = useSelector(state => state);
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

  const navigation = useNavigation();
  const accountKey = AuthReducer.accountKey;

  let MarketPlaceAbi = "";
  let MarketContractAddress = "";

  let AwardAbi = "";
  let AwardContractAddress = "";
  let ApproveAbi = "";
  let ApproveAdd = "";
  let providerUrl = "";

  let params = item.tokenId.toString().split('-');
  let tokenId = params.length > 2 ? params[2] : params.length > 1 ? params[1] : params[0];
  let chainType = params.length > 1 ? params[0] : 'binance';
  let collectionAddress = params.length > 2 ? params[1] : null;

  if (chainType === 'polygon') {
    MarketPlaceAbi = blockChainConfig[1].marketConConfig.abi;
    MarketContractAddress = blockChainConfig[1].marketConConfig.add;
    providerUrl = blockChainConfig[1].providerUrl;
    ERC721Abi = blockChainConfig[1].erc721ConConfig.abi;
    ERC721Address = blockChainConfig[1].erc721ConConfig.add;
    collectionAddress = collectionAddress || blockChainConfig[1].erc721ConConfig.add;
  } else if (chainType === 'binance') {
    MarketPlaceAbi = blockChainConfig[0].marketConConfig.abi;
    MarketContractAddress = blockChainConfig[0].marketConConfig.add;
    providerUrl = blockChainConfig[0].providerUrl;
    ERC721Abi = blockChainConfig[0].erc721ConConfig.abi;
    ERC721Address = blockChainConfig[0].erc721ConConfig.add;
    collectionAddress = collectionAddress || blockChainConfig[0].erc721ConConfig.add;
  } else if (chainType === 'ethereum') {
    MarketPlaceAbi = blockChainConfig[2].marketConConfig.abi;
    MarketContractAddress = blockChainConfig[2].marketConConfig.add;
    providerUrl = blockChainConfig[2].providerUrl;
    ERC721Abi = blockChainConfig[2].erc721ConConfig.abi;
    ERC721Address = blockChainConfig[2].erc721ConConfig.add;
    collectionAddress = collectionAddress || blockChainConfig[2].erc721ConConfig.add;
  }

  console.log('params:',params,', tokenId:',tokenId,', collectionAddresss', collectionAddress);

  useEffect(() => {
    let web3 = new Web3(providerUrl);
    if (MarketPlaceAbi && MarketContractAddress && collectionAddress) {
      let MarketPlaceContract = new web3.eth.Contract(
        MarketPlaceAbi,
        MarketContractAddress
      );
      MarketPlaceContract.methods
        .getNonCryptoOwner(collectionAddress,tokenId)
        .call(async (err, res) => {
          console.log('getNonCryptoOwner_res',res);
          if (res) {
            const userId = res.toLowerCase();
            setOwnerId(userId);
            getPublicProfile(userId, false);
          } else if (!res) {
            lastOwnerOfNFT();
          } else if (err) {
          }
        });
    }
  }, []);

  const getPublicProfile = async (id, type) => {

    const userId = id.toLowerCase();

    let profileUrl = type ?
      `${BASE_URL}/user/get-public-profile?publicAddress=${userId}` :
      `${BASE_URL}/user/get-public-profile?userId=${userId}`;

    setOwnerId(userId);

    let profile = await axios.get(profileUrl);
    if (profile.data) {
      setOwnerData(profile.data.data);
      setOwner(profile.data.data.username);
      setOwnerImage(profile.data.data.profile_image);
    } else {
      setOwner(userId);
    }
  }

  const lastOwnerOfNFT = () => {
    let web3 = new Web3(providerUrl);
    let ERC721Contract = new web3.eth.Contract(
      ERC721Abi,
      collectionAddress
    );

    let MarketPlaceContract = new web3.eth.Contract(
      MarketPlaceAbi,
      MarketContractAddress
    );

    ERC721Contract.methods.ownerOf(tokenId).call((err, res) => {
      let ownerAddress = res;
      console.log('res',res);
      if (!err) {
        MarketPlaceContract.methods.getSellDetail(collectionAddress, tokenId).call((err, res) => {
          if (res[0] !== '0x0000000000000000000000000000000000000000') {
            getPublicProfile(res[0], true);
          } else {
            getPublicProfile(ownerAddress, true);
          }
        });
      }
    })
  }

  const getTockendetailsApi = async () => {

    let body_data = {
      tokenId: item.tokenId,
      networkType: networkType,
      type: "2D",
      chain: chainType
    }

    let fetch_data_body = {
      method: 'POST',
      body: JSON.stringify(body_data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }

    fetch(`${BASE_URL}/xanalia/getDetailNFT`, fetch_data_body)
      .then(response => response.json())
      .then((res) => {
        if (res.data.length > 0 && res.data !== "No record found") {
          const data = res.data[0];

          let req_data = {
            owner: data.returnValues.to.toLowerCase(),
            token: 'HubyJ*%qcqR0'
          };

          setArtistId(data.returnValues.to.toLowerCase());

          let body = {
            method: 'POST',
            body: JSON.stringify(req_data),
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
          }
          fetch(`${BASE_URL}/xanalia/getProfile`, body)
            .then(response => response.json())
            .then(res => {
              if (res.data) {
                setArtistData(res.data);
                setArtist(res.data.title || res.data.username);
                setCreatorImage(res.data.profile_image);
              }
            })

        } else if (res.data.data === "No record found") {
          alertWithSingleBtn(
            translate('common.error'),
            translate('common.norecordfound')
          )
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    async function getOwnerOfNFT() {
      await getTockendetailsApi();
    };
    getOwnerOfNFT();
  }, []);

  const image = item.metaData.image || item.thumbnailUrl;
  const fileType = image ? image.split('.')[image.split('.').length - 1] : '';

  const onProfile = (isOwner) => {
    if (isOwner) {
      if (ownerId)
        navigation.push('ArtistDetail', { id: ownerId, });
    } else {
      if (artistId)
        navigation.push('ArtistDetail', { id: artistId });
    }
  }

  let imageUri = item.thumbnailUrl !== undefined || item.thumbnailUrl ? item.thumbnailUrl : item.metaData.image;
  return (
    <View>
      <View style={styles.modalSectCont}>
        <TouchableOpacity
          onPress={() => onProfile(true)}
          style={styles.iconCont}>
          <Image
            style={styles.profileIcon}
            source={!ownerImage ? IMAGES.DEFAULTPROFILE : { uri: ownerImage }} />
          <View>
            <Text style={styles.modalIconLabel} >
              {translate("common.owner")}
            </Text>
            <Text numberOfLines={1} style={[styles.iconLabel, { maxWidth: width * 0.35 }]}>
              {owner}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onProfile(false)}
          style={styles.iconCont}>
          <Image
            style={styles.profileIcon}
            source={!creatorImage ? IMAGES.DEFAULTPROFILE : { uri: creatorImage }} />
          <View>
            <Text style={styles.modalIconLabel}>
              {translate("common.creator")}
            </Text>
            <Text numberOfLines={1} style={[styles.iconLabel, { maxWidth: Platform.OS === 'ios' ? (width * 0.35) : (width * 0.4) }]} >
              {artist}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          isPlay ? setPlay(!isPlay)
            :
            navigation.navigate('CertificateDetail', {
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
              artistData: artistData
            });
        }}>
        {
          fileType === 'mp4' || fileType === 'MP4' || fileType === 'mov' || fileType === 'MOV' ?
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
                    <TouchableOpacity onPress={() => setPlay(true)}>
                      <PlayButtonIcon width={SIZE(100)} height={SIZE(100)} />
                    </TouchableOpacity>
                  </View>
                </View>
              }
            </View>
            :
            <C_Image uri={imageUri} imageStyle={styles.modalImage} />
        }
      </TouchableOpacity>

      <View style={{
        width: '100%',
        alignSelf: "center",
        paddingTop: SIZE(17),
        paddingHorizontal: SIZE(14)
      }}>
        <RowBetweenWrap>
          <View style={styles.buttons}>
            <TouchableOpacity onPress={() => {
              dispatch(handleLikeDislike(item, index));
            }}>
              {
                item.like == 0
                  ? <HeartIcon /> :
                  <HeartActiveIcon />
              }
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
        <SmallBoldText>
          {`13,589 ${translate("common.Likes")}`}
        </SmallBoldText>
        <SpaceView mTop={SIZE(6)} />
        <Text style={styles.modalLabel} >{item.metaData.name}</Text>
        <View style={styles.separator} />
        <Text style={styles.description} >{item.metaData.description}</Text>
      </View>
    </View>
  )
}

export default nftItem;