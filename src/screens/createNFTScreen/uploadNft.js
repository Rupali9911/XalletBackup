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
  ethereum: ['ETH', "USDT"],
  binance: ["ALIA", "BUSD", "BNB"],
  polygon: ["ALIA", "USDC", "ETH", "MATIC"]
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

  const [basePrice, setBasePrice] = useState("");
  const [otherPrice, setOtherPrice] = useState([]);

  const [nftImageType, setNftImageType] = useState(null);
  const [royality, setRoyality] = useState("2.5%");

  const [toggleButton, setToggleButton] = useState("fixed");
  const [fixedPrice, setFixedPrice] = useState("");
  const [startTimeDate, setStartTimeDate] = useState("");
  const [endTimeDate, setEndTimeDate] = useState("");
  const [Price, setPrice] = useState("");

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
        } else if (activeModal === "basePrice") {
          setBasePrice(modalItem)
          setOtherPrice([])
        } else if (activeModal === "otherCurrency") {
          setOtherPrice(oldArray => [...oldArray, modalItem]);
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

  const getCollectionList = async () => {
    if (data.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      axios.defaults.headers.post['Content-Type'] = 'application/json';
      const url = `${BASE_URL}/user/view-collection`;
      const body = {
        page: 1,
        limit: 50,
        networkType: networkStatus,
      };
      axios.post(url, body)
        .then(collectionList => {
          if (collectionList.data.success) {
            setCollectionList(collectionList.data.data)
            if (collectionList.data.data.length !== 0) {
              let selectedCollection = collectionList.data.data.find(o => o.chainType === networkType.value);

              setCollection(selectedCollection ? selectedCollection : collectionList.data.data[0])
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
            setNftImage(res)
            cropImage(res)
          } else {
            res.mime.includes("gif") ?
              setNftImage(res)
              :
              setImageError("Image size should be greater than 512*512")
          }
        } else {
          //  space for video croping code
          setNftImage(res)
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
    setPrice("");
  }

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
            inputProps={{ value: basePrice ? basePrice : "Select Base Price" }}
            onPress={() => {
              setActiveModal("basePrice")
              showModal({ data: PriceUnits[networkType.value], title: "Select Base Price" })
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
              let index = priceList.indexOf(basePrice);
              if (index !== -1) {
                priceList.splice(index, 1);
              }
              if (otherPrice.length !== 0) {
                priceList = priceList.filter(val => !otherPrice.includes(val))
              }
              showModal({ data: priceList, title: "Select the Currency" })
            }}
            pressable
            showRight
          />
          {
            otherPrice.length !== 0 ?
              <View style={styles.tagCont} >

                {
                  otherPrice.map(v => {
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
              showModal({ data: ImageType, title: "NFT Type", itemToRender: "name" })
            }}
            pressable
            showRight />

          <CardLabel>Royality</CardLabel>
          <CardField
            inputProps={{ value: royality }}
            onPress={() => {
              setActiveModal("royality")
              showModal({ data: royalityData, title: "Royality" })
            }}
            pressable
            showRight />
        </CardCont>

        <CardCont>
          <CardLabel>Sale Type</CardLabel>
          <View style={styles.saveBtnGroup}>
            <CardButton
              onPress={() => changeToggle("fixed")}
              border={toggleButton !== "fixed" ? colors.BLUE6 : null}
              label="Fixed Price"
              buttonCont={{ width: '48%' }}
            />
            <CardButton
              onPress={() => changeToggle("auction")}
              border={toggleButton !== "auction" ? colors.BLUE6 : null}
              buttonCont={{ width: '48%' }}
              label="Auction"
            />
          </View>
        </CardCont>

        <CardCont>
          {
            toggleButton == "fixed" ?
              <>
                <CardLabel>Fixed Price</CardLabel>
                <CardField
                  contStyle={{ paddingRight: 0 }}
                  inputProps={{
                    value: fixedPrice,
                    onchangeText: v => setFixedPrice(v),
                    keyboardType: 'number-pad'
                  }}
                  showRight
                  rightComponent={
                    <CardButton
                      disable
                      buttonCont={{ width: '15%', borderRadius: 0 }}
                      label={basePrice ? basePrice : "ALIA"}
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
                    value: Price,
                    onchangeText: v => setPrice(v),
                    keyboardType: 'number-pad'
                  }}
                  showRight
                  rightComponent={
                    <CardButton
                      disable
                      buttonCont={{ width: '15%', borderRadius: 0 }}
                      label={basePrice ? basePrice : "ALIA"}
                    />
                  }
                />
              </>
          }
        </CardCont>

        <View style={styles.saveBtnGroup}>
          <CardButton label="Save as Draft" buttonCont={{ width: '48%' }} />
          <CardButton
            border={colors.BLUE6}
            buttonCont={{ width: '48%' }}
            label="Upload"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default UploadNFT;
