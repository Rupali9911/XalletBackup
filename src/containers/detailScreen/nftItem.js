import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Config from "react-native-config";
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
const Web3 = require('web3');

import MarketPlaceAbi from "../../web3/MarketPlaceAbi";
import MarketContractAddress from "../../web3/MarketContractAddress";
import ApproveAbi from "../../web3/ApproveAbi";
import ApproveAdd from "../../web3/ApproveAdd";
import { networkType } from "../../web3/networkType.js";

import insertComma from '../../utils/insertComma';
import { trimZeroFromTheEnd } from '../../utils/trimZeroFromValue';
import { showActualValue } from '../../utils/showActualValue';
import { divideNo } from '../../utils/divideByEighteen';

import { handleLikeDislike } from '../../store/actions/nftTrendList';
import styles from './styles';
import { images, colors } from '../../res';
import { C_Image } from '../../components';

const { width } = Dimensions.get('window');

const nftItem = ({ item }) => {

  const { AuthReducer } = useSelector(state => state);
  const [price, setPrice] = useState('');
  const [lastPrice, setLastPrice] = useState('');
  const [owner, setOwner] = useState('');
  const [priceNFT, setPriceNFT] = useState('');
  const [priceNFTString, setPriceNFTString] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [sellDetails, setSellDetails] = useState();
  const [loaderFor, setLoaderFor] = useState('Buy');

  const navigation = useNavigation();
  const accountKey = AuthReducer.accountKey;
  const connector = AuthReducer.connector;

  const getTockendetailsApi = async () => {
    // let oldNFTS = getState().ListReducer.nftList;


    let body_data = {
      tokenId: parseInt(item.tokenId),
      networkType: 'mainnet',
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

    fetch(`${Config.BASE_URL}/getDetailNFT`, fetch_data_body)
      .then(response => response.json())
      .then((res) => {
        if (res.data.length > 0 && res.data !== "No record found") {
          setLastPrice(res.data[0].lastPrice);
          lastOwnerOfNFT(res.data[0]);
        } else if (res.data.data === "No record found") {
          alert('No record found');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  let web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
  let MarketPlaceContract = new web3.eth.Contract(
    MarketPlaceAbi,
    MarketContractAddress
  );

  const lastOwnerOfNFT = (item) => {


    let tokenId = item.tokenId;
    let data = item;

    MarketPlaceContract.methods.ownerOf(tokenId).call((err, res) => {
      // if (!err && data.owner_address) {
      //   data.owner_address = res;
      MarketPlaceContract.methods.getSellDetail(tokenId).call((err, res) => {
        // console.log('====', res);
        console.log('=========res', res)
        if (!err) {
          setPriceNFT(res[1] / 1e18);
          setPriceNFTString(res[1]);
          if (res[0] === '0x0000000000000000000000000000000000000000') {
            setOwner(item.owner_address);
          } else {
            setOwner(res[0]);
          }
        }
      })
      // }
    });
  }

  const getNFTSellDetails = (id) => {

    let body_data = {
      tokenId: id.toString(),
    }

    let fetch_data_body = {
      method: 'POST',
      body: JSON.stringify(body_data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }

    fetch(`${Config.BASE_URL}/getHistory`, fetch_data_body)
      .then(response => response.json())
      .then((res) => {
        if (res.data.length > 0) {
          // console.log(res.data.data);
          setSellDetails(res.data);
        } else {
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleBuyCall = (MarketPlaceContract, approvalContract, id, acc) => {
    // console.log(acc[0], id)
    approvalContract.methods.balanceOf(acc[0]).call((err, res) => {
      if (!err) {
        // console.log(parseInt(res) / Math.pow(10, 18));
        if (parseInt(res) / Math.pow(10, 18) === 0) {
          // this.setState({ loaderFor: "" });
        } else {
          MarketPlaceContract.methods
            .buyNFT(MarketContractAddress, id, acc[0])
            .send({ from: acc[0] })
            .then((res) => {
              lastOwnerOfNFT();
              getNFTSellDetails(item.tokenId);
              // this.setState({
              //   isApproved: false,
              //   isOwner: true,
              //   priceNFT: null,
              //   priceNFTString: "",
              //   loaderFor: "",
              // });
            })
            .catch((err) => {
              setLoading(false);
              // console.log("err in buyNFTItem", err);
            });
        }
      } else {
        // console.log("err in balanceOf", err);
        setLoading(false);
      }
    });
  }

  const handleApprove = (MarketPlaceContract, id) => {
    console.log('approve');
    // this.setState({ loaderFor: "Approve" });
    let appprovalValue =
      "115792089237316195423570985008687907853269984665640564039457";

    web3.eth
      .getAccounts()
      .then((acc) => {
        // console.log("acc[0]", acc[0]);
        let approvalContract = new web3.eth.Contract(ApproveAbi, ApproveAdd);
        approvalContract.methods
          .approve(
            MarketContractAddress,
            //this.props.metaMaskAddress,
            // web3.utils.toWei(price, "ether")
            web3.utils.toWei(appprovalValue, "ether")
          )
          .send({ from: acc[0] })
          .then((res) => {
            // console.log("res of approve", res);
            handleBuyCall(
              MarketPlaceContract,
              approvalContract,
              id,
              acc
            );
            // this.setState({ loaderFor: "", isApproved: true });
          })
          .catch((err) => {
            setLoading(false);
          });
      })
      .catch((err) => {
        setLoading(false);
        // console.log("err in gettingAccount", err);
      });
  }

  const buyNFTItem = () => {
    console.log('111==========connector');
    console.log(accountKey);
    if (accountKey) {
      let id = item.tokenId;
      let web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
      let MarketPlaceContract = new web3.eth.Contract(
        MarketPlaceAbi,
        MarketContractAddress
      );

      let approvalContract = new web3.eth.Contract(ApproveAbi, ApproveAdd);

      setLoading(true);
      setLoaderFor('Buy');

      // web3.eth
      //   .getAccounts()
      //   .then((acc) => {
      //     setLoading(true);
          // console.log('============succsss')
          approvalContract.methods
            .allowance(accountKey, MarketContractAddress)
            .call((err, res) => {
              console.log('======err', res)
              if (parseInt(res) / Math.pow(10, 18) <= 0) {
                handleApprove(MarketPlaceContract, id);
              } else {
                handleBuyCall(
                  MarketPlaceContract,
                  approvalContract,
                  id,
                  acc
                );
              }
            });
        // })
        // .catch((err) => {
        //   setLoading(false);
        //   console.log("====err", err);
        // });
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
              <TouchableOpacity onPress={() => dispatch(handleLikeDislike(item, findIndex))} >
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
              <Text numberOfLines={1} style={[styles.iconLabel, { fontWeight: "400", maxWidth: width * 0.4 }]} >{owner}</Text>
            </View>
          </View>
          <View style={{ flex: 0.8 }} >
            <Text style={styles.modalIconLabel} >Artist</Text>
            <View style={styles.iconCont} >
              <Image style={styles.profileIcon} source={images.icons.profileIcon} />
              <Text style={[styles.iconLabel, { fontWeight: "400" }]} >Queen</Text>
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
                <Text style={[styles.modalLabel, { color: colors.white }]} >{loaderFor}</Text>
              </LinearGradient>
          }
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default nftItem;