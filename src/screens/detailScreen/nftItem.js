import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, ActivityIndicator, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWalletConnect, withWalletConnect } from '@walletconnect/react-native-dapp';
import { rpcGetAccountBalance, rpcGetAccountNonce } from '../../walletconnection/rpc';

import { networkType } from "../../common/networkType";
import { BASE_URL, PROVIDER_URL } from '../../common/constants';
import getLanguage from '../../utils/languageSupport';
const langObj = getLanguage();

import insertComma from '../../utils/insertComma';
import { trimZeroFromTheEnd } from '../../utils/trimZeroFromValue';
import { showActualValue } from '../../utils/showActualValue';
import { divideNo, sanitizeHex, convertStringToHex, convertAmountToRawNumber } from '../../utils';
import { apiGetGasPrices } from '../../gas-price';

import { handleLikeDislike } from '../../store/actions/nftTrendList';
import styles from './styles';
import { images, colors } from '../../res';
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
import { DetailModal, C_Image } from 'src/components';
const Web3 = require("web3");
import { blockChainConfig } from '../../web3/config/blockChainConfig';
import axios from 'axios';
import Video from 'react-native-video';

const { width } = Dimensions.get('window');

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
  const [artist, setArtist] = useState('----');
  const [priceNFTString, setPriceNFTString] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [creatorImage, setCreatorImage] = useState();
  const [ownerImage, setOwnerImage] = useState();
  const [isPlay, setPlay] = useState(false);
  const refVideo = useRef(null);

  const navigation = useNavigation();
  const connector = useWalletConnect();
  const accountKey = AuthReducer.accountKey;

  let MarketPlaceAbi = "";
  let MarketContractAddress = "";

  let AwardAbi = "";
  let AwardContractAddress = "";
  let ApproveAbi = "";
  let ApproveAdd = "";
  let providerUrl = "";

  // console.log('=========item.tokenId', item.tokenId, '===', item.metaData.name);

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
          console.log('=====res', res)
          let profileUrl = networkType === 'mainnet' ?
            `https://api.xanalia.com/user/get-public-profile?userId=${res}` :
            `https://testapi.xanalia.com/user/get-public-profile?userId=${res}`
          let profile = await axios.get(profileUrl);
          if (profile.data) {
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
    console.log('======tokenId', tokenId);
    let web3 = new Web3(providerUrl);
    let MarketPlaceContract = new web3.eth.Contract(
      MarketPlaceAbi,
      MarketContractAddress
    );

    MarketPlaceContract.methods.ownerOf(tokenId).call((err, res) => {
      console.log('======res', res);
      let ownerAddress = res;
      MarketPlaceContract.methods.getSellDetail(tokenId).call((err, res) => {
        console.log('=======res[0]', res[0])
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
                res.data.username && setArtist(res.data.username);
                setCreatorImage(res.data.profile_image);
              }
            })

        } else if (res.data.data === "No record found") {
          alert('No record found');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const checkBalance = () => {
    // const blance = await rpcGetAccountBalance(address);
  }

  const buyNFTItem = async () => {
    setLoading(true);
    // if (!loaderFor) {
    //   return;
    // }
    console.log('========', priceNFTString);
    if (connector._accounts[0]) {

      checkBalance();

      const address = connector._accounts[0];
      const chainId = connector.chainId;
      console.log('===address', address);
      const from = address;
      const to = artist;

      // nonce
      const _nonce = await rpcGetAccountNonce(address);
      const nonce = sanitizeHex(convertStringToHex(_nonce));
      console.log('=====nonce', nonce);

      // gasPrice
      const gasPrices = await apiGetGasPrices();
      const _gasPrice = gasPrices.slow.price;
      const gasPrice = sanitizeHex(convertStringToHex(convertAmountToRawNumber(_gasPrice, 9)));
      console.log('=====gasPrice', gasPrice);

      // gasLimit
      const _gasLimit = 21000;
      const gasLimit = sanitizeHex(convertStringToHex(_gasLimit));
      console.log('=====gasLimit', gasLimit);

      // value
      const _value = 1;
      const value = sanitizeHex(convertStringToHex(_value));
      console.log('=====value', value);

      //data
      const data = '0x';

      const tx = {
        from,
        to,
        nonce,
        gasPrice,
        gasLimit,
        value,
        data
      };

      try {
        const result = connector.sendTransaction(tx);
        console.log('======result', result)
      } catch (err) {
        console.log(err);
      }

      setLoading(false);
    } else {
      setLoading(false);
      navigation.navigate('Connect');
    }
  }

  useEffect(() => {
    async function getOwnerOfNFT() {
      await getTockendetailsApi();
    };
    getOwnerOfNFT();
  }, []);

  const fileType = item.metaData.image.split('.')[item.metaData.image.split('.').length - 1];

  return (
    <View>
      <View style={styles.modalSectCont}>
        <View style={styles.iconCont}>
          <Image
            style={styles.profileIcon}
            source={!ownerImage ? IMAGES.DEFAULTPROFILE : { uri: ownerImage }} />
          <View>
            <Text style={styles.modalIconLabel} >
              {langObj.common.owner}
            </Text>
            <Text numberOfLines={1} style={[styles.iconLabel, { maxWidth: width * 0.35 }]}>
              {owner}
            </Text>
          </View>
        </View>
        <View style={styles.iconCont}>
          <Image
            style={styles.profileIcon}
            source={!creatorImage ? IMAGES.DEFAULTPROFILE : { uri: creatorImage }} />
          <View>
            <Text style={styles.modalIconLabel}>
              {langObj.common.creator}
            </Text>
            <Text numberOfLines={1} style={[styles.iconLabel, { maxWidth: Platform.OS === 'ios' ? (width * 0.35) : (width * 0.4) }]} >
              {artist}
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setPlay(!isPlay)}
        onLongPress={() => { setPlay(false); setModalVisible(true); }}>
        {
          fileType !== 'mp4' ?
            <C_Image uri={item.thumbnailUrl} imageStyle={styles.modalImage} />
            :
            <View style={styles.modalImage}>
              <Video
                ref={refVideo}
                // bufferConfig={{
                //   minBufferMs: 0,
                //   maxBufferMs: 0,
                //   bufferForPlaybackMs: 0,
                //   bufferForPlaybackAfterRebufferMs: 0
                // }}
                source={{ uri: item.metaData.image }}   // Can be a URL or a local file.
                repeat
                playInBackground={false}
                paused={!isPlay}
                resizeMode={'cover'}                                   // Store reference
                onLoad={() => refVideo.current.seek(0)}
                // onBuffer={this.onBuffer}                // Callback when remote video is buffering
                // onError={this.videoError}               // Callback when video cannot be loaded
                style={{ flex: 1 }} />
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
        }
      </TouchableOpacity>

      <View style={{
        width: '100%',
        alignSelf: "center",
        paddingTop: SIZE(17),
        paddingHorizontal: SIZE(14)
      }}>
        {
          AuthReducer.accountKey ?
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
            : null
        }
        <SpaceView mTop={SIZE(8)} />
        {
          AuthReducer.accountKey ?
            <>
              <SmallBoldText>
                {'3,589 likes'}
              </SmallBoldText>
              <SpaceView mTop={SIZE(6)} />
            </>
            : null
        }
        <Text style={styles.modalLabel} >{item.metaData.name}</Text>
        <View style={styles.separator} />
        <Text style={styles.description} >{item.metaData.description}</Text>
      </View>
      <DetailModal
        fileType={fileType}
        imageUrl={fileType !== 'mp4' ? item.thumbnailUrl : item.metaData.image}
        profileImage={!creatorImage ? IMAGES.DEFAULTPROFILE : { uri: creatorImage }}
        profileName={artist}
        isModalVisible={isModalVisible}
        toggleModal={() => setModalVisible(false)}
      />
    </View>
  )
}

export default withWalletConnect(nftItem, {
  redirectUrl: Platform.OS === 'web' ? window.location.origin : 'yourappscheme://',
  storageOptions: {
    asyncStorage: AsyncStorage,
  },
});