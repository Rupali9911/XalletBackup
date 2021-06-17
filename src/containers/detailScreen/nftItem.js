import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
const Web3 = require('web3');

import { networkType } from "../../common/networkType";
import { BASE_URL, PROVIDER_URL } from '../../common/constants';
import MarketPlaceAbi from "../../web3/MarketPlaceAbi";
import MarketContractAddress from "../../web3/MarketContractAddress";
import ApproveAbi from "../../web3/ApproveAbi";

import insertComma from '../../utils/insertComma';
import { trimZeroFromTheEnd } from '../../utils/trimZeroFromValue';
import { showActualValue } from '../../utils/showActualValue';
import { divideNo } from '../../utils/divideByEighteen';

import { handleLikeDislike } from '../../store/actions/nftTrendList';
import styles from './styles';
import { images, colors } from '../../res';
import { C_Image } from '../../components';

const { width } = Dimensions.get('window');

const nftItem = ({ item, index }) => {

  const dispatch = useDispatch();

  const { AuthReducer } = useSelector(state => state);
  const [lastPrice, setLastPrice] = useState('----');
  const [owner, setOwner] = useState('----');
  const [artist, setArtist] = useState('----');
  const [priceNFTString, setPriceNFTString] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [loaderFor, setLoaderFor] = useState(true);

  const navigation = useNavigation();
  const accountKey = AuthReducer.accountKey;

  const getTockendetailsApi = async () => {

    let body_data = {
      tokenId: parseInt(item.tokenId),
      networkType: networkType,
      type: "2d",
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

          if (data.newprice) {
            setPriceNFTString(data.newprice.price);
            setOwner(data.newprice.seller);
          } else {
            setLoaderFor(false);
          }

          setArtist(data.returnValues.to);
          setLastPrice(data.lastPrice);

          // lastOwnerOfNFT(data);

        } else if (res.data.data === "No record found") {
          alert('No record found');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const buyNFTItem = () => {
    if (!loaderFor) {
      return;
    }

    if (accountKey) {

    } else {
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
      <View style={styles.bgImageCont} >
        <C_Image uri={item.metaData.image} imageStyle={styles.bgImage} />
        <View style={[styles.bgImageCont, { backgroundColor: colors.black_opacity(0.8) }]} />
      </View>
      <C_Image uri={item.metaData.image} imageStyle={styles.modalImage} />

      <View style={styles.bottomModal} >
        <View style={styles.modalLabelCont} >
          <Text style={styles.modalLabel} >{item.metaData.name}</Text>
          {
            AuthReducer.accountKey ?
              <TouchableOpacity onPress={() => dispatch(handleLikeDislike(item, index))} >
                <Image style={styles.heartIcon} source={item.like == 1 ? images.icons.heartA : images.icons.heart} />
              </TouchableOpacity> : null
          }
        </View>

        <View style={styles.modalSectCont} >
          <View style={{ flex: 1 }} >
            <Text style={styles.modalIconLabel} >Current price</Text>
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
                    : "TBA"
                }
              </Text>
            </View>
          </View>
          <View style={{ flex: 0.8 }} >
            <Text style={styles.modalIconLabel} >Last price</Text>
            <View style={styles.iconCont} >
              <Image style={styles.iconsImage} source={images.icons.pIcon} />
              <Text style={styles.iconLabel} >{lastPrice}</Text>
            </View>
          </View>
        </View>
        <View style={styles.separator} />
        <View style={styles.modalSectCont} >
          <View style={{ flex: 1 }} >
            <Text style={styles.modalIconLabel} >Owner</Text>
            <View style={styles.iconCont} >
              <Image style={styles.profileIcon} source={images.icons.profileIcon} />
              <Text numberOfLines={1} style={[styles.iconLabel, { fontWeight: "400", maxWidth: width * 0.4 }]}>{owner}</Text>
            </View>
          </View>
          <View style={{ flex: 0.8 }} >
            <Text style={styles.modalIconLabel} >Artist</Text>
            <View style={styles.iconCont} >
              <Image style={styles.profileIcon} source={images.icons.profileIcon} />
              <Text numberOfLines={1} style={[styles.iconLabel, { fontWeight: "400", maxWidth: width * 0.4 }]} >{artist}</Text>
            </View>
          </View>
        </View>
        <View style={styles.separator} />
        <Text style={styles.description} >{item.metaData.description}</Text>
        <TouchableOpacity>
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
                    loaderFor ? "BUY" : "SOLD OUT"
                  }
                </Text>
              </LinearGradient>
          }
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default nftItem;