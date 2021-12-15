import React, { useState, useRef } from 'react';
import { View, ScrollView, Text, Image, TouchableOpacity } from 'react-native';
import { colors } from '../../res';
import ImagePicker from 'react-native-image-crop-picker';
import { useDispatch, useSelector } from 'react-redux';

import styles from './styles';
import { CardCont, CardField, CardLabel, CardButton } from './components';
import { heightPercentageToDP as hp } from '../../common/responsiveFunction';
import { IMAGES } from '../../constants';
import { translate } from '../../walletUtils';
import Web3 from 'web3';
import axios from 'axios';
import { BASE_URL } from '../../common/constants';
import { alertWithSingleBtn } from '../../utils';

const Collection = () => {

  const [collectionName, setCollectionName] = useState("test");
  const [collectionSymbol, setCollectionSymbol] = useState("abc");
  const [collectionDes, setCollectionDes] = useState("test");
  const [bannerImage, setBannerImage] = useState(null);
  const [iconImage, setIconImage] = useState(null);
  const [errorBanner, setErrorBanner] = useState(false);
  const [errorIcon, setErrorIcon] = useState(false);

  const { wallet, data } = useSelector(
    state => state.UserReducer
  );
  const dispatch = useDispatch();


  const onPhoto = (v) => {
    ImagePicker.openPicker({
      mediaType: "photo",
    }).then(image => {
      console.log(image, image.path.split("/").pop())
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

  const saveCollection = async () => {
    const publicAddress = wallet.address;
    const privKey = wallet.privateKey;
    console.log(publicAddress, privKey)
debugger
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    let formData = new FormData();
    formData.append('banner_image', { uri: bannerImage.path, name: bannerImage.path.split("/").pop(), type: bannerImage.mime });
    formData.append('icon_image', { uri: iconImage.path, name: iconImage.path.split("/").pop(), type: iconImage.mime });

    axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
    await axios.post(`${BASE_URL}/user/upload-collection-image`, formData)
      .then(res => {
        console.log(res, "banner and icon response")
        //         dispatch(upateUserData(res.data.data));
      })
      .catch(err => {
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

  let disable = collectionName && collectionSymbol && collectionDes && bannerImage && iconImage;
  console.log(wallet, data)
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
            inputProps={{ editable: false }}
          />
          <CardButton disable label="Copy" />
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
          disable={!disable}
          buttonCont={{ marginBottom: 0 }}
        />
        <View style={styles.saveBtnGroup}>
          <CardButton
            onPress={saveCollection}
            label="Save"
            buttonCont={{ width: '48%', backgroundColor: !disable ? '#rgba(59,125,221,0.5)' : colors.BLUE6 }}
            disable={!disable}
          />
          <CardButton
            border={!disable ? '#rgba(59,125,221,0.5)' : colors.BLUE6}
            buttonCont={{ width: '48%' }}
            label="Cancel"
            disable={!disable}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Collection;
