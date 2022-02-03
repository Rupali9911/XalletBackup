import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, Text, Image, TouchableOpacity } from 'react-native';
import { colors } from '../../res';
import ImagePicker from 'react-native-image-crop-picker';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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

const Collection = ({ changeLoadingState, routeParams, position }) => {

  const navigation = useNavigation();

  const [collectionName, setCollectionName] = useState("");
  const [collectionSymbol, setCollectionSymbol] = useState("");
  const [collectionDes, setCollectionDes] = useState("");
  const [collectionAdd, setCollectionAdd] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  const [iconImage, setIconImage] = useState(null);
  const [errorBanner, setErrorBanner] = useState(false);
  const [errorIcon, setErrorIcon] = useState(false);

  const [disableAll, setDisableAll] = useState(false);

  const [error, setError] = useState("");

  const [screenStatus, setScreenStatus] = useState("new");

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

  useEffect(() => {
    if (position == 0) {
      if (routeParams && routeParams.name == "collection") {
        let collectData = routeParams.data;
        console.log(collectData)
        setScreenStatus(routeParams.status);
        setCollectionName(collectData.collectionName);
        setCollectionSymbol(collectData.collectionSymbol);
        setCollectionDes(collectData.collectionDesc);
        setCollectionAdd(collectData.collectionAddress);
        setBannerImage({ path: collectData.bannerImage });
        setIconImage({ path: collectData.iconImage })
        if (collectData.chainType !== networkType.value) {
          let networktype = collectData.chainType.toLowerCase() == "binance" ?
            translate("common.BinanceNtwk") :
            collectData.chainType.toLowerCase() == "polygon" ?
              translate("common.polygon") : translate("common.ethereum");
          setError(translate("wallet.common.collectionChangeNetwork", { networkType: networktype }))
        } else {
          collectData.collectionName.toLowerCase() == "xanalia" ?
            setDisableAll(true) : setDisableAll(false);
        }
      }

    }
  }, [position])

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
      text1: translate("common.addressCopied"),
      topOffset: hp('10%'),
      visibilityTime: 500,
      autoHide: true,
    });
    Clipboard.setString(collectionAdd);
  };

  const uploadFileToStorage = async (bannerImage, iconImage, key1, key2, userToken) => {
    const headers = {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${userToken}`,
    };

    let formDataFile = new FormData();

    if (iconImage.hasOwnProperty("mime")) {
      formDataFile.append(key2, { uri: iconImage.path, name: iconImage.path.split("/").pop(), type: iconImage.mime });
    }
    if (bannerImage.hasOwnProperty("mime")) {
      formDataFile.append(key1, { uri: bannerImage.path, name: bannerImage.path.split("/").pop(), type: bannerImage.mime });
    }

    var res = null;

    if (formDataFile.getParts().length !== 0) {

      const fileUrl = `${BASE_URL}/user/upload-collection-image`;
      res = await axios
        .post(fileUrl, formDataFile, {
          headers: headers,
        })
        .then(res => {
          if (res.data.success) {
            let imageObj = { ...res.data.data };
            for (var key in imageObj) {
              if (imageObj[key] === "") {
                if (key === "banner_image") {
                  imageObj[key] = bannerImage.path;
                } else {
                  imageObj[key] = iconImage.path;
                }
              }
            }
            return imageObj;
          } else {
            changeLoadingState(false);
            alertWithSingleBtn(
              translate("wallet.common.alert"),
              translate("wallet.common.error.networkFailed")
            );
            return false;
          }
        })
        .catch(err => {
          changeLoadingState(false);
          if (err.response.status === 401) {
            alertWithSingleBtn(
              translate("wallet.common.alert"),
              translate("common.sessionexpired")
            );
          }
          alertWithSingleBtn(
            translate("wallet.common.alert"),
            translate("wallet.common.error.networkFailed")
          );
          return false;
        });
    } else {
      res = {
        banner_image: bannerImage.path,
        icon_image: iconImage.path
      }
    }

    return res;
  }

  const saveDraftCollection = async () => {
    const publicAddress = wallet.address;
    const privKey = wallet.privateKey;
    changeLoadingState(true);
    if (publicAddress && data.token) {

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
      ).then(async (transactionData) => {

        if (transactionData.success) {

          const { collectionAddress, transactionHash } = transactionData.data;
          setCollectionAdd(collectionAddress);
          console.log(collectionAddress, "transactionData")

          let res = await uploadFileToStorage(
            bannerImage,
            iconImage,
            'banner_image',
            'icon_image',
            data.token
          );

          if (res) {

            let editDraftUrl = `${BASE_URL}/user/edit-collection-draft`;

            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            axios.defaults.headers.post['Content-Type'] = 'application/json';

            let editDraftObj = {
              collectionName,
              collectionDesc: collectionDes,
              bannerImage: res.banner_image,
              iconImage: res.icon_image,
              collectionSymbol,
              chainType: networkType.value,
              requestId: routeParams.data._id
            };

            axios.post(editDraftUrl, editDraftObj)
              .then(collectionData => {
                console.log(collectionData, "collectionData edit save success")

                if (collectionData.data.success) {

                  let url = `${BASE_URL}/user/change-collection-status-draft`;
                  let statusObj = {
                    collectionDraftId: routeParams.data._id,
                    transctionHash: transactionHash,
                    chainType: networkType.value,
                    collectionAddress: collectionAddress,
                  };

                  axios.post(url, statusObj)
                    .then(draftSaveRes => {
                      console.log(draftSaveRes, "draftSaveRes save success")
                      changeLoadingState(false);

                      if (draftSaveRes.data.success) {

                        navigation.goBack();
                        alertWithSingleBtn(
                          "Success Message",
                          "Draft Collection Saved Successfully"
                        );

                      } else {
                        alertWithSingleBtn(
                          translate("wallet.common.alert"),
                          translate("wallet.common.error.apiFailed")
                        )
                      }

                    })
                    .catch(e => {
                      changeLoadingState(false);
                      console.log(e.response, "draftSaveRes data to database error");
                      alertWithSingleBtn(
                        translate("wallet.common.alert"),
                        translate("wallet.common.error.networkFailed")
                      );
                    })

                } else {
                  changeLoadingState(false);
                  alertWithSingleBtn(
                    translate("wallet.common.alert"),
                    translate("wallet.common.error.apiFailed")
                  )
                }

              })
              .catch(e => {
                changeLoadingState(false);
                console.log(e.response, "uploading draft collection data to database error");
                alertWithSingleBtn(
                  translate("wallet.common.alert"),
                  translate("wallet.common.error.networkFailed")
                );
              })
          }
        }

      })
        .catch(e => {
          changeLoadingState(false);
          console.log("testing collection error", e)
          alertWithSingleBtn(
            translate("wallet.common.alert"),
            translate("wallet.common.insufficientFunds")
          );
        })
    }
  }

  const saveCollection = () => {
    const publicAddress = wallet.address;
    const privKey = wallet.privateKey;
    changeLoadingState(true);
    if (publicAddress && data.token) {

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
      ).then(async (transactionData) => {
        if (transactionData.success) {

          const { collectionAddress } = transactionData.data;
          setCollectionAdd(collectionAddress);
          console.log(collectionAddress, "transactionData")

          let res = await uploadFileToStorage(
            bannerImage,
            iconImage,
            'banner_image',
            'icon_image',
            data.token
          );

          if (res) {

            let url = `${BASE_URL}/user/create-collection`

            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            axios.defaults.headers.post['Content-Type'] = 'application/json';

            let obj = {
              collectionAddress,
              collectionName,
              collectionDesc: collectionDes,
              bannerImage: res.banner_image,
              iconImage: res.icon_image,
              collectionSymbol,
              chainType: networkType.value,
            };

            axios.post(url, obj)
              .then(collectionData => {
                changeLoadingState(false);
                console.log(collectionData, "collectionData success")

                if (collectionData.data.success) {
                  cancel()
                  alertWithSingleBtn(
                    "Success Message",
                    "Collection Created Successfully"
                  );
                } else {
                  alertWithSingleBtn(
                    translate("wallet.common.alert"),
                    translate("wallet.common.error.apiFailed")
                  )
                }

              })
              .catch(e => {
                changeLoadingState(false);
                console.log(e.response, "uploading collection data to database");
                alertWithSingleBtn(
                  translate("wallet.common.alert"),
                  translate("wallet.common.error.networkFailed")
                );
              })
          }
        }
      }).catch(e => {
        changeLoadingState(false);
        console.log("testing collection error", e.response)
        alertWithSingleBtn(
          translate("wallet.common.alert"),
          translate("wallet.common.insufficientFunds")
        );
      })
    }
  }

  const saveEditAsDraftCollection = async () => {
    changeLoadingState(true);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

    let res = await uploadFileToStorage(
      bannerImage,
      iconImage,
      'banner_image',
      'icon_image',
      data.token
    );

    if (res) {

      let url = screenStatus == "created" ?
        `${BASE_URL}/user/edit-collection` :
        screenStatus == "draft" ?
          `${BASE_URL}/user/edit-collection-draft` :
          `${BASE_URL}/user/create-collection-draft`;

      let obj = {
        collectionName,
        collectionDesc: collectionDes,
        bannerImage: res.banner_image,
        iconImage: res.icon_image,
        collectionSymbol,
        chainType: networkType.value
      };

      if (screenStatus == "draft") {
        obj.requestId = routeParams.data._id
      }
      if (screenStatus == "created") {
        obj.collectionAddress = collectionAdd
      }

      axios.defaults.headers.post['Content-Type'] = 'application/json';

      axios.post(url, obj)
        .then(collectionData => {
          changeLoadingState(false);
          console.log(collectionData, "save as draft or edit")
          if (collectionData.data.success) {
            screenStatus == "draft" || screenStatus == "created" ?
              navigation.goBack() : cancel();
            alertWithSingleBtn(
              "Success Message",
              screenStatus == "draft" ?
                "Collection Draft Edit Successfully" :
                screenStatus == "created" ?
                  "Collection Edit Successfully" :
                  "Collection Save as Draft Successfully"
            );
          } else {
            alertWithSingleBtn(
              translate("wallet.common.alert"),
              translate("wallet.common.error.apiFailed")
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
  }

  let disable = collectionName && collectionSymbol && collectionDes && bannerImage && iconImage && !error && !disableAll;
  return (
    <View style={styles.childCont}>

      <ScrollView
        showsVerticalScrollIndicator={false}>
        <KeyboardAwareScrollView extraScrollHeight={hp('2%')}>

          {
            error ?
              <Text style={styles.error}>{error}</Text>
              : null
          }

          <CardCont>
            <CardLabel>{translate("wallet.common.collectionName")}</CardLabel>
            <CardField
              contStyle={{ backgroundColor: screenStatus == "created" ? colors.GREY10 : colors.white }}
              inputProps={{ editable: screenStatus !== "created", value: collectionName, onChangeText: e => setCollectionName(e) }}
            />
          </CardCont>

          <CardCont>
            <CardLabel>{translate("wallet.common.collectionSymbol")}</CardLabel>
            <CardField
              contStyle={{ backgroundColor: screenStatus == "created" ? colors.GREY10 : colors.white }}
              inputProps={{ editable: screenStatus !== "created", value: collectionSymbol, onChangeText: e => setCollectionSymbol(e) }}
            />
          </CardCont>

          <CardCont>
            <CardLabel>{translate("wallet.common.collectionDes")}</CardLabel>
            <Text style={styles.cardfieldCount}>{collectionDes.length} / 150</Text>
            <CardField
              inputProps={{
                editable: !disableAll,
                placeholder: translate("wallet.common.typeSomething"),
                multiline: true,
                value: collectionDes,
                onChangeText: e => collectionDes.length <= 150 ? setCollectionDes(e.slice(0, 150)) : null
              }}
              contStyle={{ height: hp('20%'), backgroundColor: disableAll ? colors.GREY10 : colors.white }}
            />
          </CardCont>

          <CardCont>
            <CardLabel>{translate("wallet.common.contractAddress")}</CardLabel>
            <CardField
              contStyle={{ backgroundColor: colors.GREY10 }}
              inputProps={{ editable: false, value: collectionAdd }}
            />
            <CardButton
              buttonCont={{ backgroundColor: !collectionAdd ? '#rgba(59,125,221,0.5)' : colors.BLUE6 }}
              disable={!collectionAdd}
              onPress={copyToClipboard} label={translate("wallet.common.copy")}
            />
          </CardCont>

          <CardCont style={styles.imageMainCard}>
            <TouchableOpacity onPress={() => !disableAll ? onPhoto("banner") : null} activeOpacity={disableAll ? 1 : 0.5} style={styles.cardImageCont}>
              <Image
                resizeMode='cover'
                resizeMethod='scale'
                style={styles.completeImage}
                source={bannerImage ? { uri: bannerImage.path } : IMAGES.imagePlaceholder}
              />
            </TouchableOpacity>
            <View style={styles.bannerCardCont}>
              <CardLabel>{translate("wallet.common.bannerImage")}</CardLabel>
              <Text style={{ ...styles.bannerDes, color: errorBanner ? "red" : colors.BLACK2 }}>{translate("wallet.common.maxSize")} 1600 * 300</Text>
              <CardButton
                buttonCont={[styles.changeBtn, { backgroundColor: disableAll ? '#rgba(59,125,221,0.5)' : colors.BLUE6 }]}
                onPress={() => onPhoto("banner")}
                disable={disableAll}
                label={translate("common.change")}
              />
            </View>
          </CardCont>

          <CardCont style={styles.imageMainCard}>
            <TouchableOpacity onPress={() => !disableAll ? onPhoto("icon") : null} activeOpacity={disableAll ? 1 : 0.5} style={styles.cardImageCont}>
              <Image
                resizeMode='cover'
                resizeMethod='scale'
                style={styles.completeImage}
                source={iconImage ? { uri: iconImage.path } : IMAGES.imagePlaceholder}
              />
            </TouchableOpacity>
            <View style={styles.bannerCardCont}>
              <CardLabel>{translate("wallet.common.iconImage")}</CardLabel>
              <Text style={{ ...styles.bannerDes, color: errorIcon ? "red" : colors.BLACK2 }}>{translate("wallet.common.maxSize")} 512 * 512</Text>
              <CardButton
                onPress={() => onPhoto("icon")}
                buttonCont={[styles.changeBtn, { backgroundColor: disableAll ? '#rgba(59,125,221,0.5)' : colors.BLUE6 }]}
                disable={disableAll}
                label={translate("common.change")}
              />
            </View>
          </CardCont>
          {
            (screenStatus === "new" || screenStatus === "draft") &&
            <CardButton
              border={!disable ? '#rgba(59,125,221,0.5)' : colors.BLUE6}
              label={screenStatus === "new" ? translate("wallet.common.saveAsDraft") : translate("wallet.common.editDraft")}
              onPress={saveEditAsDraftCollection}
              disable={!disable}
              buttonCont={{ marginBottom: 0 }}
            />
          }

          <View style={styles.saveBtnGroup}>
            <CardButton
              onPress={screenStatus === "new" ? saveCollection :
                screenStatus === "draft" ? saveDraftCollection : saveEditAsDraftCollection}
              label={screenStatus === "new" || screenStatus === "draft" ? translate("common.save") : translate("wallet.common.edit")}
              buttonCont={{ width: '48%', backgroundColor: !disable ? '#rgba(59,125,221,0.5)' : colors.BLUE6 }}
              disable={!disable}
            />
            <CardButton
              onPress={screenStatus === "new" ? cancel : () => navigation.goBack()}
              border={!disable ? '#rgba(59,125,221,0.5)' : colors.BLUE6}
              buttonCont={{ width: '48%' }}
              label={translate("common.Cancel")}
              disable={!disable}
            />
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
      <Toast config={toastConfig} ref={toastRef} />

    </View>
  );
};

export default Collection;
