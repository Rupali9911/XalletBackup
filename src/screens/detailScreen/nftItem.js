import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
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

const { width } = Dimensions.get('window');

const {
  CommentIcon,
  HeartIcon,
  ShareIcon,
  BookMarkIcon,
} = SVGS;

const nftItem = ({ item, index }) => {

  const dispatch = useDispatch();

  const { AuthReducer } = useSelector(state => state);
  const [lastPrice, setLastPrice] = useState('----');
  const [owner, setOwner] = useState('----');
  const [artist, setArtist] = useState('----');
  const [priceNFTString, setPriceNFTString] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [loaderFor, setLoaderFor] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [creatorImage, setCreatorImage] = useState();
  const [ownerImage, setOwnerImage] = useState();

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

  useEffect(() => {
    let params = item.tokenId.split('-');
    let tokenId = params.length > 1 ? params[1] : params[0];
    let chainType = params[0];
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


    let web3 = new Web3(providerUrl);
    let MarketPlaceContract = new web3.eth.Contract(
      MarketPlaceAbi,
      MarketContractAddress
    );
    // MarketPlaceContract.methods.ownerOf(tokenId).call((err, res) => {
    //   if (!err) {
    //     console.log('=======')
    //     console.log(res)
    //   }
    // });
    MarketPlaceContract.methods
      .getNonCryptoOwner(tokenId)
      .call(async (err, res) => {
        if (res) {
          let profileUrl = networkType === 'mainnet' ?
            `https://api.xanalia.com/user/get-public-profile?userId=${res}` :
            `https://testapi.xanalia.com/user/get-public-profile?userId=${res}`
          let profile = await axios.get(profileUrl);
          if (profile.data) {
            setOwner(profile.data.data.username);
            setOwnerImage(profile.data.data.profile_image);
          }
        } else if (!res) {
          console.log('=======err', err);
        } else if (err) {
        }
      });
  }, []);

  const getTockendetailsApi = async () => {

    let body_data = {
      tokenId: item.tokenId,
      networkType: networkType,
      type: "2D",
      chain: "binance"
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
                setArtist(res.data.username);
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

  return (
    <View>
      {/* <View style={styles.bgImageCont} > */}
      {/* <C_Image uri={item.metaData.image} imageStyle={styles.bgImage} /> */}
      {/* <Image style={{ flex: 1 }} source={{ uri: item.metaData.image }} blurRadius={30} />
        <View style={[styles.bgImageCont, { backgroundColor: colors.black_opacity(0.4) }]} />
      </View> */}
      <View style={styles.modalSectCont}>
        <View style={styles.iconCont}>
          <Image style={styles.profileIcon} source={!ownerImage ? IMAGES.DEFAULTPROFILE : { uri: ownerImage }} />
          <View>
            <Text style={styles.modalIconLabel} >{langObj.common.owner}</Text>
            <Text numberOfLines={1} style={[styles.iconLabel, { maxWidth: width * 0.35 }]}>{owner}</Text>
          </View>
        </View>
        <View style={styles.iconCont}>
          <Image style={styles.profileIcon} source={!creatorImage ? IMAGES.DEFAULTPROFILE : { uri: creatorImage }} />
          <View>
            <Text style={styles.modalIconLabel}>{langObj.common.creator}</Text>
            <Text numberOfLines={1} style={[styles.iconLabel, { maxWidth: width * 0.3 }]} >{artist}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={() => {
        setModalVisible(true);
      }}>
        <C_Image uri={item.thumbnailUrl} imageStyle={styles.modalImage} />
      </TouchableOpacity>

      <View style={{
        width: '100%',
        alignSelf: "center",
        paddingTop: SIZE(17),
        paddingHorizontal: SIZE(14)
      }}>
        {
          !AuthReducer.accountKey ?
            <RowBetweenWrap>
              <View style={styles.buttons}>
                <TouchableOpacity onPress={() => dispatch(handleLikeDislike(item, index))} >
                  {/* <Image style={styles.heartIcon} source={item.like == 1 ? images.icons.heartA : images.icons.heart} /> */}
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

        {/* <View style={styles.modalSectCont} >
          <View style={{ flex: 1 }} >
            <Text style={styles.modalIconLabel} >{langObj.common.currentprice}</Text>
            <View style={styles.iconCont} >
              <Image style={styles.iconsImage} source={images.icons.pIcon} />
              <Text numberOfLines={1} style={[styles.iconLabel, { maxWidth: width * 0.4 }]} >
                {
                  priceNFTString !== "0" ?
                    insertComma(
                      trimZeroFromTheEnd(
                        showActualValue(
                          divideNo(priceNFTString),
                          18,
                          "string"
                        ),
                        true
                      ),
                      true
                    )
                    : langObj.common.tba
                }
              </Text>
            </View>
          </View>
          <View style={{ flex: 0.8 }} >
            <Text style={styles.modalIconLabel} >{langObj.common.lastprice}</Text>
            <View style={styles.iconCont} >
              <Image style={styles.iconsImage} source={images.icons.pIcon} />
              <Text style={styles.iconLabel} >{lastPrice}</Text>
            </View>
          </View>
        </View> */}
        <View style={styles.separator} />
        <Text style={styles.description} >{item.metaData.description}</Text>
        {/* <TouchableOpacity>
          {
            isLoading ?
              <ActivityIndicator size="large" color={colors.white} />
              :
              <LinearGradient
                onTouchEnd={buyNFTItem}
                colors={[colors.themeL, colors.themeR]}
                style={styles.modalBtn}>
                <Text style={[styles.modalLabel, { color: colors.white }]} >
                  {
                    loaderFor ? langObj.common.buy.toUpperCase() : langObj.common.notForSell.toUpperCase()
                  }
                </Text>
              </LinearGradient>
          }
        </TouchableOpacity> */}
      </View>
      <DetailModal
        imageUrl={item.thumbnailUrl}
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