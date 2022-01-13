import React, { useState, useRef } from 'react';
import { View, ScrollView, Text, Image, TouchableOpacity } from 'react-native';
import { colors } from '../../res';
import ImagePicker from 'react-native-image-crop-picker';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import Clipboard from '@react-native-clipboard/clipboard';

import styles from './styles';
import { CardCont, CardField, CardLabel, CardButton } from './components';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../common/responsiveFunction';
import { IMAGES } from '../../constants';
import { translate } from '../../walletUtils';
import axios from 'axios';
import { BASE_URL } from '../../common/constants';
import { alertWithSingleBtn } from '../../utils';
import { blockChainConfig } from '../../web3/config/blockChainConfig';
import { createColection } from '../wallet/functions';

const toastConfig = {
  my_custom_type: ({ text1, props, ...rest }) => (
    <View
      style={{
        paddingHorizontal: wp('20%'),
        borderRadius: wp('10%'),
        paddingVertical: hp('2%'),
        backgroundColor: colors.GREY5,
      }}>
      <Text style={{ color: colors.white, fontWeight: 'bold' }}>{text1}</Text>
    </View>
  ),
};

const Collection = ({ changeLoadingState }) => {

  const [collectionName, setCollectionName] = useState("testing collection binance2");
  const [collectionSymbol, setCollectionSymbol] = useState("NFT");
  const [collectionDes, setCollectionDes] = useState("testing collection binance description");
  const [collectionAdd, setCollectionAdd] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  const [iconImage, setIconImage] = useState(null);
  const [errorBanner, setErrorBanner] = useState(false);
  const [errorIcon, setErrorIcon] = useState(false);

  const toastRef = useRef(null);

  const { wallet, data } = useSelector(
    state => state.UserReducer
  );
  const { networkType } = useSelector(
    state => state.WalletReducer
  );

  let MarketPlaceAbi = '';
  let MarketContractAddress = '';
  let providerUrl = '';

  let gasFee = "";
  let gasLimit = "";

  if (networkType.value === 'polygon') {
    MarketPlaceAbi = blockChainConfig[1].marketConConfig.abi;
    MarketContractAddress = blockChainConfig[1].marketConConfig.add;
    providerUrl = blockChainConfig[1].providerUrl;
    gasFee = 30
    gasLimit = 6000000
  } else if (networkType.value === 'binance') {
    MarketPlaceAbi = blockChainConfig[0].marketConConfig.abi;
    MarketContractAddress = blockChainConfig[0].marketConConfig.add;
    providerUrl = blockChainConfig[0].providerUrl;
    gasFee = 10
    gasLimit = 6000000
  } else if (networkType.value === 'ethereum') {
    MarketPlaceAbi = blockChainConfig[2].marketConConfig.abi;
    MarketContractAddress = blockChainConfig[2].marketConConfig.add;
    providerUrl = blockChainConfig[2].providerUrl;
    gasFee = 10 // for this api etherscan
    gasLimit = 6000000
  }

  const onPhoto = (v) => {
    ImagePicker.openPicker({
      mediaType: "photo",
    }).then(image => {
      if (v == "banner") {
        if (image.height <= 300 && image.width <= 1600) {
          updateImageState(image, false, v)
        } else {
          updateImageState(null, true, v)
        }
      } else {
        if (image.height <= 512 && image.width <= 512) {
          updateImageState(image, false, v)
        } else {
          updateImageState(null, true, v)
        }
      }
    });
  }

  const updateImageState = (image, bool, v) => {
    if (v == "banner") {
      setBannerImage(image)
      setErrorBanner(bool)
    } else {
      setIconImage(image)
      setErrorIcon(bool)
    }
  }

  const cancel = () => {
    setCollectionName("");
    setCollectionSymbol("");
    setCollectionAdd("");
    setCollectionDes("");
    setBannerImage(null);
    setIconImage(null);
  }

  const copyToClipboard = () => {
    toastRef.current.show({
      type: 'my_custom_type',
      text1: "Collection Address Copied",
      topOffset: hp('10%'),
      visibilityTime: 500,
      autoHide: true,
    });
    Clipboard.setString(collectionAdd);
  };

  const saveCollection = async () => {
    const publicAddress = wallet.address;
    const privKey = wallet.privateKey;
    changeLoadingState(true);
    if (publicAddress && data.token) {

      // axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      // let formData = new FormData();
      // formData.append('banner_image', { uri: bannerImage.path, name: bannerImage.path.split("/").pop(), type: bannerImage.mime });
      // formData.append('icon_image', { uri: iconImage.path, name: iconImage.path.split("/").pop(), type: iconImage.mime });

      // axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';

      // await axios.post(`${BASE_URL}/user/upload-collection-image`, formData)
      //   .then(res => {
      //     if (res.data.success) {

            createColection(
              publicAddress,
              privKey,
              networkType.value,
              providerUrl,
              MarketPlaceAbi,
              MarketContractAddress,
              gasFee,
              gasLimit,
              collectionName,
              collectionSymbol
            ).then(transactionData => {
// 10,
              // 600000,
              if (transactionData.success) {

                let url = `${BASE_URL}/user/create-collection`;
                axios.defaults.headers.post['Content-Type'] = 'application/json';

                const { collectionAddress } = transactionData.data;

                console.log(collectionAddress,transactionData , "transactionData" )
                setCollectionAdd(collectionAddress);
                    changeLoadingState(false);

                // let obj = {
                //   collectionAddress,
                //   collectionName,
                //   collectionDesc: collectionDes,
                //   bannerImage: res.data.data.banner_image,
                //   iconImage: res.data.data.icon_image,
                //   collectionSymbol,
                //   chainType: networkType.value,
                // };
                // console.log(obj , "obj" )


                // axios.post(url, obj)
                //   .then(collectionData => {
                //     changeLoadingState(false);
                //     console.log(collectionData , "collectionData success" )

                //     if (collectionData.data.success) {
                //       alertWithSingleBtn(
                //         "Success Message",
                //         "Collection Created Successfully"
                //       );
                //     } else {
                //       alertWithSingleBtn(
                //         "Failed",
                //         "Something Went Wrong!"
                //       )
                //     }

                //   })
                //   .catch(e => {
                //     changeLoadingState(false);
                //     console.log(e.response, "uploading collection data to database");
                //     alertWithSingleBtn(
                //       translate("wallet.common.alert"),
                //       translate("wallet.common.error.networkFailed")
                //     );
                //   })

              }

            }).catch(e => {
              changeLoadingState(false);
              console.log("testing collection error", e.response)
              alertWithSingleBtn(
                translate("wallet.common.alert"),
                String(e)
              );
            })

          // } else {
          //   changeLoadingState(false);
          //   alertWithSingleBtn(
          //     translate("wallet.common.alert"),
          //     translate("wallet.common.error.networkFailed")
          //   );

          // }

        // })
        // .catch(err => {
        //   changeLoadingState(false);
        //   if (err.response.status === 401) {
        //     alertWithSingleBtn(
        //       translate("wallet.common.alert"),
        //       translate("common.sessionexpired")
        //     );
        //   }
        //   alertWithSingleBtn(
        //     translate("wallet.common.alert"),
        //     translate("wallet.common.error.networkFailed")
        //   );
        // });

    }

  }

  const saveAsDraftCollection = async() => {
    changeLoadingState(true);

    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    let formData = new FormData();
    formData.append('banner_image', { uri: bannerImage.path, name: bannerImage.path.split("/").pop(), type: bannerImage.mime });
    formData.append('icon_image', { uri: iconImage.path, name: iconImage.path.split("/").pop(), type: iconImage.mime });

    axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';

    await axios.post(`${BASE_URL}/user/upload-collection-image`, formData)
      .then(res => {
        if (res.data.success) {

          let url = `${BASE_URL}/user/create-collection-draft`;

          let obj = {
            collectionName,
            collectionDesc: collectionDes,
            bannerImage: res.data.data.banner_image,
            iconImage: res.data.data.icon_image,
            collectionSymbol,
            chainType: networkType.value,
          };
          axios.defaults.headers.post['Content-Type'] = 'application/json';

          axios.post(url, obj)
            .then(collectionData => {
              changeLoadingState(false);
              console.log(collectionData, "save as draft")
              if (collectionData.data.success) {
                cancel()
                alertWithSingleBtn(
                  "Success Message",
                  "Collection Save as Draft Successfully"
                );
              } else {
                alertWithSingleBtn(
                  "Failed",
                  "Something Went Wrong!"
                )
              }

            })
            .catch(e => {
              changeLoadingState(false);
              console.log(e, "uploading collection data to database");
              alertWithSingleBtn(
                translate("wallet.common.alert"),
                translate("wallet.common.error.networkFailed")
              );
            })
        }

      }).catch(e => {
        changeLoadingState(false);
        console.log("testing collection error", e)
        alertWithSingleBtn(
          translate("wallet.common.alert"),
          translate("wallet.common.error.networkFailed")
        );
      })
  }

  let disable = collectionName && collectionSymbol && collectionDes && bannerImage && iconImage;
  return (
    <View style={styles.childCont}>

      <ScrollView showsVerticalScrollIndicator={false}>
        <CardCont>
          <CardLabel>Collection Name</CardLabel>
          <CardField
            inputProps={{ value: collectionName, onChangeText: e => setCollectionName(e) }}
          />
        </CardCont>

        <CardCont>
          <CardLabel>Collection Symbol</CardLabel>
          <CardField
            inputProps={{ value: collectionSymbol, onChangeText: e => setCollectionSymbol(e) }}
          />
        </CardCont>

        <CardCont>
          <CardLabel>Collection description</CardLabel>
          <Text style={styles.cardfieldCount}>{collectionDes.length} / 150</Text>
          <CardField
            inputProps={{ placeholder: 'Type Something', multiline: true, value: collectionDes, onChangeText: e => collectionDes.length < 150 ? setCollectionDes(e) : null }}
            contStyle={{ height: hp('20%') }}
          />
        </CardCont>

        <CardCont>
          <CardLabel>Contract Address</CardLabel>
          <CardField
            contStyle={{ backgroundColor: colors.GREY10 }}
            inputProps={{ editable: false, value: collectionAdd }}
          />
          <CardButton disable={collectionAdd !== "" ? false : true} onPress={copyToClipboard} label="Copy" />
        </CardCont>

        <CardCont style={styles.imageMainCard}>
          <TouchableOpacity onPress={() => onPhoto("banner")} activeOpacity={0.5} style={styles.cardImageCont}>
            <Image
              resizeMode='cover'
              resizeMethod='scale'
              style={styles.completeImage}
              source={bannerImage ? { uri: bannerImage.path } : IMAGES.imagePlaceholder}
            />
          </TouchableOpacity>
          <View style={styles.bannerCardCont}>
            <CardLabel>Banner Image</CardLabel>
            <Text style={{ ...styles.bannerDes, color: errorBanner ? "red" : colors.BLACK2 }}>Max Size 1600 * 300</Text>
            <CardButton onPress={() => onPhoto("banner")} buttonCont={styles.changeBtn} label="Change" />
          </View>
        </CardCont>

        <CardCont style={styles.imageMainCard}>
          <TouchableOpacity onPress={() => onPhoto("icon")} activeOpacity={0.5} style={styles.cardImageCont}>
            <Image
              resizeMode='cover'
              resizeMethod='scale'
              style={styles.completeImage}
              source={iconImage ? { uri: iconImage.path } : IMAGES.imagePlaceholder}
            />
          </TouchableOpacity>
          <View style={styles.bannerCardCont}>
            <CardLabel>Icon Image</CardLabel>
            <Text style={{ ...styles.bannerDes, color: errorIcon ? "red" : colors.BLACK2 }}>Max Size 512 * 512</Text>
            <CardButton onPress={() => onPhoto("icon")} buttonCont={styles.changeBtn} label="Change" />
          </View>
        </CardCont>

        <CardButton
          border={!disable ? '#rgba(59,125,221,0.5)' : colors.BLUE6}
          label="Save as Draft"
          onPress={saveAsDraftCollection}
          disable={!disable}
          buttonCont={{ marginBottom: 0 }}
        />
        <View style={styles.saveBtnGroup}>
          <CardButton
            onPress={saveCollection}
            label="Save"
            buttonCont={{ width: '48%', backgroundColor: !disable ? '#rgba(59,125,221,0.5)' : colors.BLUE6 }}
            // disable={!disable}
          />
          <CardButton
            onPress={cancel}
            border={!disable ? '#rgba(59,125,221,0.5)' : colors.BLUE6}
            buttonCont={{ width: '48%' }}
            label="Cancel"
            disable={!disable}
          />
        </View>
      </ScrollView>
      <Toast config={toastConfig} ref={toastRef} />

    </View>
  );
};

export default Collection;
