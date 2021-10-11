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
import { handleLikeDislike } from '../../store/actions/nftTrendList';
import { translate } from '../../walletUtils';
import { alertWithSingleBtn } from '../../utils';

const { width } = Dimensions.get('window');
const langObj = getLanguage();
const Web3 = require("web3");

const {
  CommentIcon,
  HeartIcon,
  ShareIcon,
  BookMarkIcon,
  PlayButtonIcon
} = SVGS;

const nftItem = ({ item, index }) => {

  const dispatch = useDispatch();

  const { AuthReducer } = useSelector(state => state);
  const [owner, setOwner] = useState('----');
  const [ownerImage, setOwnerImage] = useState();
  const [ownerData, setOwnerData] = useState();
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
  let tokenId = params.length > 1 ? params[1] : params[0];
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

  useEffect(() => {
    let web3 = new Web3(providerUrl);
    let MarketPlaceContract = new web3.eth.Contract(
      MarketPlaceAbi,
      MarketContractAddress
    );

    MarketPlaceContract.methods
      .getNonCryptoOwner(tokenId)
      .call(async (err, res) => {
        if (res) {
          let profileUrl = networkType === 'mainnet' ?
            `https://api.xanalia.com/user/get-public-profile?userId=${res}` :
            `https://testapi.xanalia.com/user/get-public-profile?userId=${res}`
          let profile = await axios.get(profileUrl);
          if (profile.data) {
            setOwnerData(profile.data.data);
            setOwner(profile.data.data.username);
            setOwnerImage(profile.data.data.profile_image);
          }
        } else if (!res) {
          lastOwnerOfNFT();
        } else if (err) {
        }
      });
  }, []);

  const lastOwnerOfNFT = () => {
    let web3 = new Web3(providerUrl);
    let MarketPlaceContract = new web3.eth.Contract(
      MarketPlaceAbi,
      MarketContractAddress
    );

    MarketPlaceContract.methods.ownerOf(tokenId).call((err, res) => {
      let ownerAddress = res;
      MarketPlaceContract.methods.getSellDetail(tokenId).call((err, res) => {
        if (res[0] !== '0x0000000000000000000000000000000000000000') {
          setOwner(res[0]);
        } else {
          setOwner(ownerAddress);
        }
      });
    })
  }

  const getTockendetailsApi = async () => {

    let body_data = {
      tokenId: item.tokenId,
      networkType: networkType,
      type: "2D",
      chain: chainType
    }

    if (accountKey) {
      body_data.owner = accountKey;
    }

    let fetch_data_body = {
      method: 'POST',
      body: JSON.stringify(body_data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }

    fetch(`${BASE_URL}/getDetailNFT`, fetch_data_body)
      .then(response => response.json())
      .then((res) => {
        if (res.data.length > 0 && res.data !== "No record found") {
          const data = res.data[0];

          setArtist(data.returnValues.to);

          let req_data = {
            owner: data.returnValues.to,
            token: 'HubyJ*%qcqR0'
          };

          let body = {
            method: 'POST',
            body: JSON.stringify(req_data),
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
          }
          fetch(`${BASE_URL}/getProfile`, body)
            .then(response => response.json())
            .then(res => {
              if (res.data) {
                setArtistData(res.data);
                res.data.username && setArtist(res.data.username);
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

  const fileType = item.metaData.image.split('.')[item.metaData.image.split('.').length - 1];

  const onProfile = (isOwner) => {
    if (isOwner) {
      if (ownerData) {
        navigation.navigate('ArtistDetail', { data: ownerData });
      } else {
        navigation.navigate('ArtistDetail', {
          data: {
            id: owner,
          }
        });
      }
    } else {
      if (artistData) {
        navigation.navigate('ArtistDetail', { data: artistData });
      } else {
        navigation.navigate('ArtistDetail', {
          data: {
            id: artist,
          }
        });
      }
    }
  }

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
              chain: item.chain
            });
        }}>
        {
          fileType !== 'mp4' && fileType !== 'mov' ?
            <C_Image uri={item.thumbnailUrl} imageStyle={styles.modalImage} />
            :
            <View style={styles.modalImage}>
              <C_Image uri={item.thumbnailUrl} imageStyle={styles.modalImage} />
              <Video
                key={tokenId}
                ref={refVideo}
                source={{ uri: item.metaData.image }}
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
                    <TouchableOpacity onPress={() => setPlay(true)}>
                      <PlayButtonIcon width={SIZE(100)} height={SIZE(100)} />
                    </TouchableOpacity>
                  </View>
                </View>
              }
            </View>
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
            <TouchableOpacity onPress={() => dispatch(handleLikeDislike(item, index))} >
              <HeartIcon />
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