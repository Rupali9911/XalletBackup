import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, Text, Image, TouchableOpacity, Platform } from 'react-native';
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
import { NEW_BASE_URL } from '../../common/constants';
import { alertWithSingleBtn } from '../../utils';
import sendRequest from '../../helpers/AxiosApiRequest';
import { getUploadData, putCollectionMedia } from '../../utils/uploadMediaS3';
import { sendCustomTransaction } from '../wallet/functions/transactionFunctions';
import TransactionPending from "../../components/Popup/transactionPending"

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

const Collection = ({ changeLoadingState, routeParams, position, collectionData }) => {

  const navigation = useNavigation();
  const toastRef = useRef(null);

  // =============== Getting data from reducer ========================
  const { userData } = useSelector(state => state.UserReducer);
  const { networkType } = useSelector(state => state.WalletReducer);
  const { networks } = useSelector(state => state.NetworkReducer);

  //================== Components State Defination ===================
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
  const [currentNetwork, setCurrentNetwork] = useState({});
  const [openTransactionPending, setOpenTransactionPending] = useState(false);

  //==================== Global Variables =======================
  const walletAddress = userData?.userWallet?.address;
  let MarketPlaceAbi = '';
  let MarketContractAddress = '';
  let providerUrl = '';
  let gasFee = "";
  let gasLimit = "";

  // if (networkType.value === 'polygon') {
  //   MarketPlaceAbi = blockChainConfig[1].marketConConfig.abi;
  //   MarketContractAddress = blockChainConfig[1].marketConConfig.add;
  //   providerUrl = blockChainConfig[1].providerUrl;
  //   gasFee = 30
  //   gasLimit = 6000000
  // } else if (networkType.value === 'binance') {
  //   MarketPlaceAbi = blockChainConfig[0].marketConConfig.abi;
  //   MarketContractAddress = blockChainConfig[0].marketConConfig.add;
  //   providerUrl = blockChainConfig[0].providerUrl;
  //   gasFee = 10
  //   gasLimit = 6000000
  // } else if (networkType.value === 'ethereum') {
  //   MarketPlaceAbi = blockChainConfig[2].marketConConfig.abi;
  //   MarketContractAddress = blockChainConfig[2].marketConConfig.add;
  //   providerUrl = blockChainConfig[2].providerUrl;
  //   gasFee = 10 // for this api etherscan
  //   gasLimit = 6000000
  // }

  //===================== UseEffect Function =========================
  useEffect(() => {
    if (position === 1) {
      changeLoadingState(false);
      cleanCollection();
      const selectedNetwork = networks?.find(item => item?.name === networkType?.name);
      if (selectedNetwork) {
        setCurrentNetwork(selectedNetwork);
      }
      if (routeParams && routeParams.name == "collection") {
        let collectData = routeParams.data;
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
      } else if (collectionData) {
        updateCollectionData(collectionData)
      }
    }
  }, [position])

  const updateCollectionData = async (item) => {
    try {
      const res = await sendRequest({
        url: `${NEW_BASE_URL}/collections/collectionId`,
        method: 'GET',
        params: {
          networkName: item?.network?.name,
          contractAddress: item?.contractAddress,
          isUpdate: 1
        }
      })
      if (res && res?.id) {
        if (res?.userId === userData?.id && res?.type === 4) {
          setCollectionName(res?.name);
          setCollectionSymbol(res?.symbol);
          setCollectionDes(res?.description);
          setCollectionAdd(item?.contractAddress)
          setBannerImage({ path: res?.bannerImage });
          setIconImage({ path: res?.iconImage });
          setScreenStatus("created");
          // setCurrent(res)
        }
        changeLoadingState(false)
      }
    } catch {
      changeLoadingState(false);
      console.log(e, "nftlist collectionList error");
    } finally {
      // changeLoadingState(false);
    }
  }

  const onPhoto = (v) => {
    ImagePicker.openPicker({
      mediaType: "photo",
      width: v == "banner" ? 1600 : 512,
      height: v == "banner" ? 300 : 512,
      cropping: true
    }).then(image => {
      if (v == "banner") {
        if (image.height <= 300 && image.width <= 1600) {
          if (image.size > 100 * 1024 * 1024) {
            updateImageState(null, true, v)
          } else {
            updateImageState(image, false, v)
          }
        } else {
          updateImageState(null, true, v)
        }
      } else {
        if (image.height <= 512 && image.width <= 512) {
          if (image.size > 100 * 1024 * 1024) {
            updateImageState(null, true, v)
          } else {
            updateImageState(image, false, v)
          }
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

  //====================== Create New Collection Function =======================
  const createCollection = async () => {
    setOpenTransactionPending(true)
    const data = getData()
    const res = await sendRequest({
      url: `${NEW_BASE_URL}/collections`,
      method: 'POST',
      data
    })
    if (res.collection && res.dataReturn?.signData) {
      handleUploadMedia(res.collection.id);
      await mintCollection(res.dataReturn.signData);
      cleanCollection();
    } else {
      setOpenTransactionPending(false)
      alertWithSingleBtn(translate('common.error'), '');
    }
  }

  const getData = () => {
    return {
      name: collectionName,
      description: collectionDes,
      symbol: collectionSymbol,
      networkId: networkType?.id,
    }
  }

  const cleanCollection = () => {
    setCollectionName("");
    setCollectionSymbol("");
    setCollectionDes("");
    setCollectionAdd("")
    setBannerImage(null);
    setIconImage(null);
  }

  // ============== Handle Upload Media Function ========================
  const handleUploadMedia = async (collectionId) => {
    if (screenStatus === 'new') {
      if (bannerImage && iconImage) {
        // For banner image
        const urlBanner = await getUploadData({
          mediaFile: bannerImage,
          collectionId: collectionId,
          userId: userData.id,
          type: 'collection_cover'
        })
        if (urlBanner && urlBanner?.upload_url) {
          await putCollectionMedia({
            mediaFile: bannerImage,
            uploadUrl: urlBanner?.upload_url,
            collectionId: collectionId,
            type: 'banner',
          })
        }

        // For icon image
        const urlIcon = await getUploadData({
          mediaFile: iconImage,
          collectionId: collectionId,
          userId: userData.id,
          type: 'collection'
        })
        if (urlBanner && urlBanner?.upload_url) {
          await putCollectionMedia({
            mediaFile: iconImage,
            uploadUrl: urlIcon?.upload_url,
            collectionId: collectionId,
            type: 'cover',
          })
        }
      }
    } else if (screenStatus === 'created') {
      // For update banner image
      if (bannerImage && bannerImage.mime) {
        const urlBanner = await getUploadData({
          mediaFile: bannerImage,
          collectionId: collectionId,
          userId: userData.id,
          type: 'collection_cover'
        })
        if (urlBanner && urlBanner?.upload_url) {
          await putCollectionMedia({
            mediaFile: bannerImage,
            uploadUrl: urlBanner?.upload_url,
            collectionId: collectionId,
            type: 'banner',
          })
        }
      }

      // For icon image
      if (iconImage && iconImage.mime) {
        const urlIcon = await getUploadData({
          mediaFile: iconImage,
          collectionId: collectionId,
          userId: userData.id,
          type: 'collection'
        })
        if (urlIcon && urlIcon?.upload_url) {
          await putCollectionMedia({
            mediaFile: iconImage,
            uploadUrl: urlIcon?.upload_url,
            collectionId: collectionId,
            type: 'cover',
          })
        }
      }
    }
  }

  //=================== Mint Collection Function ==================
  const mintCollection = async (signData) => {
    const transactionParameters = {
      nonce: signData.nonce,
      from: signData.from,
      to: signData.to,
      data: signData.data,
      chainId: currentNetwork?.chainId,
    }
    sendCustomTransaction(
      transactionParameters,
      walletAddress,
      null,
      currentNetwork?.name,
    )
      .then(res => {
        alertWithSingleBtn('', translate('common.tansactionSuccessFull'));
        setOpenTransactionPending(false)
      })
      .catch(err => {
        console.log('payByWallet_err payByWallet 339', err);
        setOpenTransactionPending(false)
        if (typeof err === 'string' && err.includes('transaction underpriced')) {
          alertWithSingleBtn(
            translate('wallet.common.alert'),
            translate('common.blanceLow'),
          );
        } else {
          alertWithSingleBtn(translate('common.error'), '');
        }
      });
  }

  //================== End Create Collection Function ======================

  //====================== Edit/Update Old Collection Function =======================
  const saveEditAsDraftCollection = async () => {
    changeLoadingState(true);
    await handleUploadMedia(collectionData?.id);
    const data = getUpdatedData()
    try {
      const res = await sendRequest({
        url: `${NEW_BASE_URL}/collections/${collectionData?.id}`,
        method: 'PUT',
        data
      })
      if (res) {
        setTimeout(() => {
          cleanCollection();
          changeLoadingState(false);
          alertWithSingleBtn(
            "Success Message",
            screenStatus == "draft" ?
              "Collection Draft Edit Successfully" :
              screenStatus == "created" ?
                "Collection Edit Successfully" :
                "Collection Save as Draft Successfully"
          );
        }, 2000)
      }
    } catch (error) {
      changeLoadingState(false);
      alertWithSingleBtn(
        translate("wallet.common.alert"),
        translate("wallet.common.error.networkFailed")
      );
    }
  }

  const getUpdatedData = () => {
    return {
      description: collectionDes,
    }
  }

  const editDisable = () => {
    if (routeParams && routeParams.name == "collection" && routeParams.status == "created") {
      let collectData = routeParams.data;
      let des = collectData?.collectionDesc == collectionDes;
      let bannerImg = collectData?.bannerImage == (bannerImage?.path ? bannerImage.path : bannerImage);
      let iconImg = collectData?.iconImage == (iconImage?.path ? iconImage.path : iconImage);

      if (collectData && (des && bannerImg && iconImg)) {
        return true;
      } else {
        return !disable;
      }
    } else if (collectionData && screenStatus == "created") {
      let des = collectionData?.description == collectionDes;
      let bannerImg = collectionData?.bannerImage == (bannerImage?.path ? bannerImage.path : bannerImage);
      let iconImg = collectionData?.iconImage == (iconImage?.path ? iconImage.path : iconImage);
      if (collectionData && (des && bannerImg && iconImg)) {
        return true;
      } else {
        return !disable;
      }
    } else {
      return !disable;
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
            <Text style={styles.cardfieldCount}>{collectionDes?.length} / 1000</Text>
            <CardField
              inputProps={{
                editable: !disableAll,
                placeholder: translate("wallet.common.typeSomething"),
                multiline: true,
                value: collectionDes,
                maxLength: 1000,
                onChangeText: e => collectionDes.length <= 100 ? setCollectionDes(e.slice(0, 1000)) : null
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
                label={translate("wallet.common.upload")}
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
                label={translate("wallet.common.upload")}
              />
            </View>
          </CardCont>
          <View style={styles.saveBtnGroup}>
            <CardButton
              onPress={screenStatus === "new" ? createCollection : saveEditAsDraftCollection}
              label={screenStatus === "new" ? translate("common.createbut") : translate("common.save")}
              buttonCont={{ width: '48%', backgroundColor: editDisable() ? '#rgba(59,125,221,0.5)' : colors.BLUE6 }}
              disable={screenStatus === "new" || screenStatus === "draft" ? !disable : editDisable()}
            />
            <CardButton
              onPress={screenStatus === "new" ? cleanCollection : () => navigation.goBack()}
              border={!disable ? '#rgba(59,125,221,0.5)' : colors.BLUE6}
              buttonCont={{ width: '48%' }}
              label={translate("common.Cancel")}
              disable={!disable}
            />
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
      <Toast config={toastConfig} ref={toastRef} />
      <TransactionPending
        isVisible={openTransactionPending}
        setVisible={setOpenTransactionPending}
      />
    </View>
  );
};

export default React.memo(Collection);

