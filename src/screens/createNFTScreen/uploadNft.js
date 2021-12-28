import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Image, TouchableOpacity } from 'react-native';
import { colors } from '../../res';
import ImagePicker from 'react-native-image-crop-picker';
import { useSelector } from 'react-redux';
import { createThumbnail } from "react-native-create-thumbnail";
import Video from 'react-native-fast-video';
import moment from 'moment';

import styles from './styles';
import { CardCont, CardField, CardLabel, CardButton } from './components';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../common/responsiveFunction';
import { IMAGES } from '../../constants';
import { networkType as networkStatus } from "../../common/networkType";
import { fonts } from '../../res';

import axios from 'axios';
import { BASE_URL } from '../../common/constants';
import { alertWithSingleBtn } from '../../utils';
import { blockChainConfig } from '../../web3/config/blockChainConfig';
import { translate } from '../../walletUtils';

const PriceUnits = {
  ethereum: [{ order: 1, name: 'ETH' }, { order: 0, name: 'USDT' }],
  binance: [{ order: 0, name: 'ALIA' }, { order: 1, name: 'BUSD' }, { order: 2, name: 'BNB' }],
  polygon: [{ order: 0, name: 'ALIA' }, { order: 1, name: 'USDC' }, { order: 2, name: 'ETH' }, { order: 3, name: "MATIC" }]
}

const ImageType = [
  { name: "Art", type: "2D" },
  { name: "Photo", type: "portfolio" },
  { name: "GIF", type: "GIF" },
  { name: "Movie", type: "movie" },
]

const royalityData = ["2.5%", "5%", "10%"];

const UploadNFT = ({
  changeLoadingState,
  position,
  showModal,
  modalItem,
  modalScreen,
  datePickerPress,
  datePickerData
}) => {

  const { wallet, data } = useSelector(
    state => state.UserReducer
  );
  const { networkType } = useSelector(
    state => state.WalletReducer
  );

  const [collectionList, setCollectionList] = useState([]);
  const [collection, setCollection] = useState(null);
  const [nftImage, setNftImage] = useState(null);
  const [imageError, setImageError] = useState("");
  const [nftImageThumb, setNftImageThumb] = useState(null);
  const [activeModal, setActiveModal] = useState("");

  const [nftName, setNftName] = useState("");
  const [nftDesc, setNftDesc] = useState("");

  const [basePrice, setBasePrice] = useState(null);
  const [otherPrice, setOtherPrice] = useState([]);

  const [imageTypeList, setImageTypeList] = useState(ImageType);
  const [nftImageType, setNftImageType] = useState(null);
  const [royality, setRoyality] = useState("2.5%");

  const [toggleButton, setToggleButton] = useState("fixPrice");
  const [fixedPrice, setFixedPrice] = useState("");
  const [startTimeDate, setStartTimeDate] = useState("");
  const [endTimeDate, setEndTimeDate] = useState("");


  //#region SmartContract
  let MarketPlaceAbi = '';
  let MarketContractAddress = '';
  let providerUrl = '';

  let gasFee = "";
  let gasLimit = "";

  let ERC721Abi = '';
  let ERC721Address = '';

  // console.log('params:', params, ', tokenId:', _tokenId, ', collectionAddresss', collectionAddress);
  if (networkType.value === 'polygon') {
    MarketPlaceAbi = blockChainConfig[1].marketConConfig.abi;
    MarketContractAddress = blockChainConfig[1].marketConConfig.add;
    providerUrl = blockChainConfig[1].providerUrl;
    ERC721Abi = blockChainConfig[1].erc721ConConfig.abi;
    ERC721Address = blockChainConfig[1].erc721ConConfig.add;
    gasFee = 30
    gasLimit = 6000000
    // collectionAddress = collectionAddress || blockChainConfig[1].erc721ConConfig.add;
    // NftApprovalAbi = blockChainConfig[1].nftApprovalConConfig.abi
  } else if (networkType.value === 'binance') {
    MarketPlaceAbi = blockChainConfig[0].marketConConfig.abi;
    MarketContractAddress = blockChainConfig[0].marketConConfig.add;
    providerUrl = blockChainConfig[0].providerUrl;
    ERC721Abi = blockChainConfig[0].erc721ConConfig.abi;
    ERC721Address = blockChainConfig[0].erc721ConConfig.add;
    gasFee = 8
    gasLimit = 6000000
    // collectionAddress = collectionAddress || blockChainConfig[0].erc721ConConfig.add;
    // NftApprovalAbi = blockChainConfig[0].nftApprovalConConfig.abi
  } else if (networkType.value === 'ethereum') {
    MarketPlaceAbi = blockChainConfig[2].marketConConfig.abi;
    MarketContractAddress = blockChainConfig[2].marketConConfig.add;
    providerUrl = blockChainConfig[2].providerUrl;
    ERC721Abi = blockChainConfig[2].erc721ConConfig.abi;
    ERC721Address = blockChainConfig[2].erc721ConConfig.add;
    gasFee = 0 // for this api etherscan
    gasLimit = 6000000
    // collectionAddress = collectionAddress || blockChainConfig[2].erc721ConConfig.add;
    // NftApprovalAbi = blockChainConfig[2].nftApprovalConConfig.abi
  }


  useEffect(() => {
    if (position == 2) {
      changeLoadingState(true)
      getCollectionList()
    }
  }, [position])

  useEffect(() => {
    if (modalScreen === "uploadNFT" && modalItem) {

      if (modalItem !== "closed") {
        if (activeModal === "collection") {
          setCollection(modalItem)
          getFiltersList(modalItem._id)
        } else if (activeModal === "basePrice") {
          setBasePrice(modalItem)
          let newPriceArr = [];
          newPriceArr.push(modalItem.name)
          setOtherPrice(newPriceArr)
        } else if (activeModal === "otherCurrency") {
          setOtherPrice(oldArray => [...oldArray, modalItem.name]);
        } else if (activeModal === "nftType") {
          setNftImageType(modalItem)
        } else if (activeModal === "royality") {
          setRoyality(modalItem)
        }
        setActiveModal("")
      } else {
        setActiveModal("")
      }
    }

  }, [modalItem])

  useEffect(() => {
    if (modalScreen === "uploadNFT" && datePickerData) {
      if (datePickerData !== "closed") {
        if (activeModal === "startTime") {
          setStartTimeDate(moment(datePickerData).format("YYYY-MM-DD HH:mm:ss"))
        } else if (activeModal === "endTime") {
          setEndTimeDate(moment(datePickerData).format("YYYY-MM-DD HH:mm:ss"))
        }
        setActiveModal("")
      } else {
        setActiveModal("")
      }
    }

  }, [datePickerData])

  const getFiltersList = (_id) => {

  }

  const getCollectionList = async () => {
    if (data.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      axios.defaults.headers.post['Content-Type'] = 'application/json';
      const url = `${BASE_URL}/user/view-collection`;
      const body = {
        page: 1,
        limit: 50,
        chainType: networkType.value,
        networkType: networkStatus
      };
      console.log(body, "collection list getting")
      axios.post(url, body)
        .then(collectionList => {
          console.log(collectionList, "collection list getting")
          if (collectionList.data.success) {
            setCollectionList(collectionList.data.data)
            if (collectionList.data.data.length !== 0) {
              let selectedCollection = collectionList.data.data.find(o => o.chainType === networkType.value);
              let selectedData = selectedCollection ? selectedCollection : collectionList.data.data[0];
              setCollection(selectedData)
              getFiltersList(selectedData._id)
              changeLoadingState(false)
            } else {
              changeLoadingState(false)
            }
          } else {
            changeLoadingState(false)
          }
        })
        .catch(e => {
          changeLoadingState(false);
          console.log(e, "nftlist collectionList error");
          alertWithSingleBtn(
            translate("wallet.common.alert"),
            translate("wallet.common.error.networkFailed")
          );
        })
    }
  };

  const cropImage = (res) => {
    ImagePicker.openCropper({
      path: res.path,
      width: 512,
      height: 512
    }).then(cropRes => {
      setNftImageThumb(cropRes)
    })
  }

  const onPhoto = () => {
    setImageError("")
    ImagePicker.openPicker({}).then(res => {
      if (res.size > 50457280) {
        setImageError("File size should not exceed 50MB")
      } else {
        if (res.mime.includes("image")) {

          if (res.height >= 512 && res.width >= 512) {
            let setImageTList = ImageType.filter(v => v.name !== "GIF" && v.name !== "Movie")
            setImageTypeList(setImageTList)
            setNftImageType(null);
            setNftImage(res)
            cropImage(res)
          } else {
            if (res.mime.includes("gif")) {
              let setImageTList = ImageType.filter(v => v.name !== "Art" && v.name !== "Photo")
              setNftImage(res)
              setImageTypeList(setImageTList)
              setNftImageType(null);
            } else {
              setImageError("Image size should be greater than 512*512")
            }

          }
        } else {
          //  space for video croping code
          setNftImage(res)
          let setImageTList = ImageType.filter(v => v.name !== "Art" && v.name !== "Photo" && v.name !== "GIF")
          setImageTypeList(setImageTList)
          setNftImageType(null);

          videoCropping(res)
        }
      }
    });
  }

  const videoCropping = (res) => {
    createThumbnail({
      url: res.path,
      timeStamp: 10000,
    })
      .then(response => {
        cropImage(response)
      })
      .catch(err => console.log({ err }));
  }

  const changeToggle = (v) => {
    setToggleButton(v)
    setFixedPrice("");
    setStartTimeDate("");
    setEndTimeDate("");
  }

  const saveDraft = () => {
    if (data.token) {
      changeLoadingState(true)

      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      let formData = new FormData();
      formData.append('image', { uri: nftImage.path, name: nftImage.path.split("/").pop(), type: nftImage.mime });

      axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';

      axios.post(`${BASE_URL}/xanalia/uploadS3`, formData)
        .then(res => {
          console.log("upload image nft", res)
          if (res.data.success) {
            let thumbnailDataFile = new FormData();
            thumbnailDataFile.append('imageName', res.data.imageName);
            thumbnailDataFile.append('image', { uri: nftImageThumb.path, name: nftImageThumb.path.split("/").pop(), type: nftImageThumb.mime });

            axios.post(`${BASE_URL}/xanalia/thumbUploadS3`, thumbnailDataFile)
              .then(res2 => {
                console.log(res2, "thumbnail url")
                if (res2.data.success) {
                  let dataToSend = {
                    collectionId: collection._id,
                    name: nftName,
                    description: nftDesc,
                    image: res.data.data,
                    thumbnailImage: res2.data.data,
                    properties: { type: nftImageType },
                    salesType: toggleButton,
                    minPrice: fixedPrice,
                    startTime:
                      toggleButton == 'timeAuction'
                        ? startTimeDate
                        : '',
                    endTime:
                      toggleButton == 'timeAuction'
                        ? endTimeDate
                        : '',
                    acceptCoins: otherPrice,
                    basePrice: basePrice.order,
                    chainType: networkType.value,
                  };

                  axios.defaults.headers.post['Content-Type'] = 'application/json';

                  axios.post(`${BASE_URL}/user/create-nft-draft`, dataToSend)
                    .then(draftRes => {

                      console.log(draftRes, "draftRes")

                      if (draftRes.data.success) {
                        alertWithSingleBtn(
                          "Success",
                          "Data save as Draft successfully!"
                        );
                      }
                      changeLoadingState(false);

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
                    });
                } else {
                  changeLoadingState(false);

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
              });
          } else {
            changeLoadingState(false)

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
        });
    }

  }

  let disableBtn = collection && nftName && nftDesc && nftImageType &&
    nftImage && nftImageThumb && basePrice &&
    (toggleButton == "timeAuction" ? (startTimeDate && endTimeDate && fixedPrice) : fixedPrice) &&
    networkType;

  return (
    <View style={styles.childCont}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <CardCont style={styles.imageMainCard}>
          <TouchableOpacity onPress={nftImage ? nftImage.mime.includes("image") ? onPhoto : null : onPhoto} activeOpacity={0.5} style={styles.cardImageCont}>
            {
              nftImage ?
                nftImage.mime.includes("image") ?
                  <Image
                    style={styles.completeImage}
                    source={{ uri: nftImage.path }}
                  /> :
                  <Video
                    source={{ uri: nftImage.path }}
                    style={styles.completeImage}
                    resizeMode="contain"
                  />
                :
                <Image
                  style={styles.completeImage}
                  source={IMAGES.imagePlaceholder}
                />
            }
          </TouchableOpacity>
          <View style={styles.cardDesCont} >
            {
              !nftImage ?
                <Text
                  style={[
                    styles.bannerDes,
                    { textAlign: 'center' },
                  ]}>
                  Browse media on your device
                </Text> : null
            }
            {
              !!imageError ?
                <Text
                  style={[
                    styles.bannerDes,
                    styles.nftImageError,
                  ]}>
                  {imageError}
                </Text> : null
            }
            {
              nftImage ?
                <>
                  <View style={styles.saveBtnGroup}>
                    <CardButton
                      label="Remove"
                      buttonCont={{ width: '48%' }}
                      onPress={() => {
                        setNftImage(null);
                        setImageError("");
                        setNftImageThumb(null);
                        setImageTypeList(ImageType)
                        setNftImageType(null)
                      }}
                    />
                    <CardButton
                      onPress={onPhoto}
                      border={colors.BLUE6}
                      buttonCont={{ width: '48%' }}
                      label="Change"
                    />
                  </View>
                  {
                    !nftImage.mime.includes("gif") ?
                      <View style={{ flexDirection: "row", marginTop: hp(2) }} >
                        <View style={styles.thumbNail} >
                          <Image source={nftImageThumb ? { uri: nftImageThumb.path } : IMAGES.imagePlaceholder} style={styles.completeImage} />
                        </View>
                        <View style={{ flex: 1, justifyContent: "center" }} >
                          <TouchableOpacity onPress={() => {
                            nftImage ? nftImage.mime.includes("image") ?
                              cropImage(nftImage) :
                              videoCropping(nftImage)
                              : null
                          }} >
                            <Text
                              style={[
                                styles.bannerDes,
                                styles.thumbnailEditButton
                              ]}>
                              Edit Thumbnail
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View> : null
                  }
                </> : null
            }

          </View>

        </CardCont>

        <CardCont>
          <CardLabel>NFT Name</CardLabel>
          <CardField
            inputProps={{ value: nftName, onChangeText: e => setNftName(e) }}
          />
          <CardLabel>Collection</CardLabel>
          <CardField
            inputProps={{ value: collection ? collection.collectionName : "" }}
            onPress={() => {
              setActiveModal("collection")
              showModal({ data: collectionList, title: "Collection List", itemToRender: "collectionName" })
            }}
            showRight
            pressable />
          <CardLabel>Description</CardLabel>
          <Text style={styles.cardfieldCount}>{nftDesc.length} / 150</Text>
          <CardField
            inputProps={{ placeholder: 'Type Something', multiline: true, value: nftDesc, onChangeText: e => nftDesc.length < 150 ? setNftDesc(e) : null }}
            contStyle={{ height: hp('15%') }}
          />
        </CardCont>

        <CardCont>
          <CardLabel>Network</CardLabel>
          <CardField inputProps={{ value: networkType.value, editable: false }} showRight />
          <CardLabel>Base Price</CardLabel>
          <CardField
            inputProps={{ value: basePrice ? basePrice.name : "Select Base Price" }}
            onPress={() => {
              setActiveModal("basePrice")
              showModal({ data: PriceUnits[networkType.value], title: "Select Base Price", itemToRender: "name" })
            }}
            pressable
            showRight
          />
          <CardLabel>Also payable in</CardLabel>
          <CardField
            inputProps={{ value: 'Select the Currency' }}
            onPress={() => {
              setActiveModal("otherCurrency")
              let priceList = [...PriceUnits[networkType.value]];

              if (otherPrice.length !== 0) {
                priceList = priceList.filter(val => !otherPrice.find(val1 => val1 === val.name))
              }
              showModal({ data: priceList, title: "Select the Currency", itemToRender: "name" })
            }}
            pressable
            showRight
          />
          {
            otherPrice.length !== 0 ?
              <View style={styles.tagCont} >

                {
                  otherPrice.map(v => {
                    if (v !== basePrice.name) {
                      return (
                        <CardButton
                          onPress={() => {
                            const removeItem = otherPrice.filter((res) => {
                              return res !== v;
                            });

                            setOtherPrice(removeItem)
                          }}
                          border={colors.BLUE6}
                          buttonCont={styles.tagItems}
                          label={v}
                        />
                      )
                    }
                  })
                }

              </View> : null
          }
        </CardCont>

        <CardCont>
          <CardLabel>NFT Type</CardLabel>
          <CardField
            inputProps={{ value: nftImageType ? nftImageType.name : 'Type' }}
            onPress={() => {
              setActiveModal("nftType")
              showModal({ data: imageTypeList, title: "NFT Type", itemToRender: "name" })
            }}
            pressable
            showRight />
          {
            collection && collection.collectionAddress.toLowerCase() == ERC721Address.toLowerCase() ?
              <>
                <CardLabel>Royality</CardLabel>
                <CardField
                  inputProps={{ value: royality }}
                  onPress={() => {
                    setActiveModal("royality")
                    showModal({ data: royalityData, title: "Royality" })
                  }}
                  pressable
                  showRight />
              </>
              : null
          }

        </CardCont>

        <CardCont>
          <CardLabel>Sale Type</CardLabel>
          <View style={styles.saveBtnGroup}>
            <CardButton
              onPress={() => changeToggle("fixPrice")}
              border={toggleButton !== "fixPrice" ? colors.BLUE6 : null}
              label="Fixed Price"
              buttonCont={{ width: '48%' }}
            />
            <CardButton
              onPress={() => changeToggle("timeAuction")}
              border={toggleButton !== "timeAuction" ? colors.BLUE6 : null}
              buttonCont={{ width: '48%' }}
              label="Auction"
            />
          </View>
        </CardCont>

        <CardCont>
          {
            toggleButton == "fixPrice" ?
              <>
                <CardLabel>Fixed Price</CardLabel>
                <CardField
                  contStyle={{ paddingRight: 0 }}
                  inputProps={{
                    value: fixedPrice,
                    onChangeText: v => setFixedPrice(v),
                    keyboardType: 'number-pad'
                  }}
                  showRight
                  rightComponent={
                    <CardButton
                      disable
                      buttonCont={{ width: '15%', borderRadius: 0 }}
                      label={basePrice ? basePrice.name : "ALIA"}
                    />
                  }
                />
              </> :
              <>
                <CardLabel >Auction Time</CardLabel>
                <CardLabel style={{ fontFamily: fonts.PINGfANG }} >Open Time</CardLabel>
                <CardField
                  inputProps={{ value: startTimeDate }}
                  onPress={() => {
                    setActiveModal("startTime")
                    setEndTimeDate("")
                    datePickerPress(new Date())
                  }}
                  pressable
                  showRight />
                <CardLabel style={{ fontFamily: fonts.PINGfANG }} >Close Time</CardLabel>
                <CardField
                  inputProps={{ value: endTimeDate }}
                  onPress={() => {
                    setActiveModal("endTime")
                    datePickerPress(startTimeDate ? new Date(startTimeDate) : new Date())
                  }}
                  pressable
                  showRight />
                <CardField
                  contStyle={{ paddingRight: 0 }}
                  inputProps={{
                    value: fixedPrice,
                    onChangeText: v => setFixedPrice(v),
                    keyboardType: 'number-pad'
                  }}
                  showRight
                  rightComponent={
                    <CardButton
                      disable
                      buttonCont={{ width: '15%', borderRadius: 0 }}
                      label={basePrice ? basePrice.name : "ALIA"}
                    />
                  }
                />
              </>
          }
        </CardCont>

        <View style={styles.saveBtnGroup}>
          <CardButton
            onPress={saveDraft}
            label="Save as Draft"
            buttonCont={{ width: '48%', backgroundColor: !disableBtn ? '#rgba(59,125,221,0.5)' : colors.BLUE6 }}
            disable={!disableBtn} />
          <CardButton
            border={colors.BLUE6}
            disable={!disableBtn}
            border={!disableBtn ? '#rgba(59,125,221,0.5)' : colors.BLUE6}
            buttonCont={{ width: '48%' }}
            label="Upload"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default UploadNFT;
