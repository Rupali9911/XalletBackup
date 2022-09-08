import _ from 'lodash';
import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, SafeAreaView, Keyboard, Text, Button, TextInput, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ActionSheet from 'react-native-actionsheet';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Field, reduxForm } from 'redux-form';
import ImagePicker from 'react-native-image-crop-picker';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-native-modal'

import { CenterWrap, SpaceView, BorderView, RowWrap } from 'src/styles/common.styles';
import { SIZE, SVGS } from 'src/constants';
import { C_Image, LimitableInput } from 'src/components';
import { Avatar, ChangeAvatar, DoneText } from './styled';
import { translate } from '../../walletUtils';
import AppBackground from '../../components/appBackground';
import { AppHeader, GroupButton } from '../../components';
import {
  maxLength13,
  maxLength20,
  maxLength50,
  maxLength100,
  maxLength200,
  validateEmail,
  validateWebsiteURL,
  validateDiscordURL,
  validateTwitterURL,
  validateYoutubeURL,
  validateInstagramURL,
  validateFacebookURL,
  validateZoomLinkURL,
  validateUserName
} from '../../utils';
import userReducer, { updateProfile, updateProfileImage, updateUserData } from '../../store/reducer/userReducer';
import { hp } from '../../constants/responsiveFunct';
import { Permission, PERMISSION_TYPE } from '../../utils/appPermission';
import { openSettings } from 'react-native-permissions';
import { confirmationAlert } from '../../common/function';
import { responsiveFontSize as RF } from "../../common/responsiveFunction";
import fonts from "../../res/fonts";
import colors from "../../res/colors";
import { View } from "native-base";
import Colors from '../../constants/Colors';
import { COLORS } from '../../constants';
import ButtonInputContainer from '../../components/buttonInputContainer'
import sendRequest from '../../helpers/AxiosApiRequest';
import { NEW_BASE_URL } from '../../common/constants';
// import { TextInput } from 'react-native-paper';
const { TwitterIconNew, InstagramIcon, ArtistSvg, ArtistSvgI } = SVGS;

function Profile(props) {
  const { navigation, handleSubmit } = props;

  const { UserReducer } = useSelector(state => state);
  // console.log(UserReducer.userData, 'data from reducer edit')
  const isNonCrypto = useSelector(state => state.UserReducer?.userData?.user?.isNonCrypto);
  // const [firstName, setFirstName] = useState(UserReducer.userData.user?.firstName);
  // const [errfirstname, setErrFirstname] = useState(false);
  // const [lastName, setLastName] = useState(UserReducer.userData.user?.lastName);
  // const [errLastname, setErrLastname] = useState(false);
  // const [address, setAddress] = useState(UserReducer.userData.user?.address);
  // const [errAddress, setErrAddress] = useState(false);
  // const [phoneNumber, setPhoneNo] = useState(UserReducer.userData.user?.phoneNumber);
  // const [errphoneNo, setErrPhoneNo] = useState(false);
  // const [facebook, setFacebook] = useState(UserReducer.userData.user.links?.facebook);
  // const [errFacebook, setErrFacebook] = useState(false);
  // const [zoomLink, setZoomLink] = useState(UserReducer.userData.user.links?.zoomLink);
  // const [errZoomLink, setErrZoomLink] = useState(false);
  // const [title, setTitle] = useState(UserReducer.userData.user.title);
  // const [errTitle, setErrTitle] = useState(false);
  const [username, setUsername] = useState(isNonCrypto === 0 ? UserReducer.userData.title : UserReducer.userData.userName);
  const [errUsername, setErrUsername] = useState(false);
  const [email, setEmail] = useState(UserReducer.userData.email);
  const [errEmail, setErrEmail] = useState(false);
  const [website, setWebsite] = useState(UserReducer.userData.website);
  const [errWebsite, setErrWebsite] = useState(false);
  const [discord, setDiscord] = useState(UserReducer.userData.discordSite);
  const [errDiscord, setErrDiscord] = useState(false);
  const [twitter, setTwitter] = useState(UserReducer.userData.twitterSite);
  const [errTwitter, setErrTwitter] = useState(false);
  const [youtube, setYoutube] = useState(UserReducer.userData.youtubeSite);
  const [errYoutube, setErrYoutube] = useState(false);
  const [instagram, setInstagram] = useState(UserReducer.userData.instagramSite);
  const [errInstagram, setErrInstagram] = useState(false);
  const [about, setAbout] = useState(UserReducer.userData.about);
  const [errAbout, setErrAbout] = useState(false);
  const [userData,setUserData] = useState()
  //const [conformpermission,setConformpermission]=useState(true)
  const dispatch = useDispatch();

  const [showPermission, setShowPermission] = useState(false);
  const [isVisible, setIsVisible] = useState(false)

  let id = UserReducer.userData.userWallet.address

  console.log(UserReducer?.userData,'data from reducer')
  
  const renderArtistModal = () => {
    return (
      <View style={{ flex: 1 }}>
        <Modal
          backdropColor="#000000"
          backdropOpacity={0.6}
          onBackdropPress={() => {
            setIsVisible(false);
          }}
          isVisible={isVisible}
          transparent={true}>
          <View style={{ paddingHorizontal: SIZE(54), paddingVertical: SIZE(30), backgroundColor: COLORS.WHITE1, alignItems: 'center', borderRadius: SIZE(7) }}>
            <ArtistSvg />
            <Text style={{ textAlign: 'center', marginVertical: SIZE(15), fontSize: SIZE(24), fontWeight: '700' }}>
              Become an Artist
            </Text>
            <Text style={{ lineHeight: SIZE(17), fontSize: SIZE(14), fontFamily: 'Arial', textAlign: 'center', marginBottom: SIZE(12) }}>
              You are only a form away from becoming an Artist on Xanalia. After winning the Artist title, you will be given a rare Blue Verification Badge that is only available to verified Artists.
            </Text>
            <Text style={{ lineHeight: SIZE(17), fontSize: SIZE(14), fontFamily: 'Arial', textAlign: 'center', marginBottom: SIZE(28) }}>
              All applications will go through several thorough screening rounds from Xanalia team to ensure the authencity of the Artist.
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <Text>
                <ArtistSvgI />
              </Text>
              <Text style={{ lineHeight: SIZE(17), marginRight: 19, fontSize: SIZE(14), fontFamily: 'Arial', textAlign: 'center', marginBottom: SIZE(22), color: COLORS.themeColor }}>
                You must input a username, upload a profile picture, verify your email address and Twitter account first.
              </Text>
            </View>
            <GroupButton
              style={{ width: '120%' }}
              onLeftPress={() => setIsVisible(false)}
              leftStyle={{ backgroundColor: '#2280e1' }}
              leftTextStyle={{ fontWeight: '600', fontSize: SIZE(14) }}
              leftText='OK'
              rightHide
            />
          </View>
        </Modal>
      </View>
    )
  }


  // const OPEN_CAMERA = 0;
  // const OPEN_GALLERY = 1;

  // const selectActionSheet = async index => {
  //   const options = {
  //     title: 'Select Your Photo',
  //     storageOptions: {
  //       skipBackup: true,
  //       cropping: true,
  //       privateDirectory: true
  //     },
  //     quality: 0.5,
  //   };

  //   if (index === OPEN_CAMERA) {

  //     ImagePicker.openCamera({
  //       height: 512,
  //       width: 512,
  //       cropping: true
  //     }).then(image => {
  //       console.log('Response from camera', image)
  //       if (image.height <= 512 && image.width <= 512) {
  //         let filename = Platform.OS === 'android' ? image.path.substring(image.path.lastIndexOf('/') + 1) : image.filename ? image.filename : image.path.substring(image.path.lastIndexOf('/') + 1)
  //         let uri = Platform.OS === 'android' ? image.path : image.sourceURL

  //         let temp = {
  //           path: image.path,
  //           uri: uri,
  //           type: image.mime,
  //           fileName: filename,
  //           image: image
  //         }
  //         setPhoto(temp)
  //       }
  //     }).catch(async e => {
  //       console.log('Error from openCamera', e, e.code)
  //       if (e.code && (e.code === 'E_NO_CAMERA_PERMISSION' || e.code === 'E_PICKER_CANNOT_RUN_CAMERA_ON_SIMULATOR')) {
  //         // const isGranted = await Permission.checkPermission(PERMISSION_TYPE.camera);
  //         // if (isGranted===false) {
  //         confirmationAlert(
  //           translate("wallet.common.cameraPermissionHeader"),
  //           translate("wallet.common.cameraPermissionMessage"),
  //           translate("common.Cancel"),
  //           translate("wallet.common.settings"),
  //           () => openSettings(),
  //           () => null
  //         )
  //         // }
  //       }
  //     })
  //   } else if (index === OPEN_GALLERY) {
  //     ImagePicker.openPicker({
  //       mediaType: "photo",
  //       height: 512,
  //       width: 512,
  //       cropping: true
  //     }).then(image => {
  //       console.log('Response from storage', image)

  //       if (image.height <= 512 && image.width <= 512) {

  //         let filename = Platform.OS === 'android' ? image.path.substring(image.path.lastIndexOf('/') + 1) : image.filename

  //         let uri = Platform.OS === 'android' ? image.path : image.sourceURL

  //         let temp = {
  //           path: image.path,
  //           uri: uri,
  //           type: image.mime,
  //           fileName: filename,
  //           image: image
  //         }
  //         setPhoto(temp)
  //       }
  //     }).catch(async e => {
  //       console.log('Error from openPicker', e)
  //       if (e.code && e.code === 'E_NO_LIBRARY_PERMISSION') {
  //         // const isGranted = await Permission.checkPermission(PERMISSION_TYPE.storage);
  //         // if (isGranted === false) {
  //         confirmationAlert(
  //           translate("wallet.common.storagePermissionHeader"),
  //           translate("wallet.common.storagePermissionMessage"),
  //           translate("common.Cancel"),
  //           translate("wallet.common.settings"),
  //           () => openSettings(),
  //           () => null
  //         )
  //         // }
  //       }
  //     })
  //   }
  // }

  const onSave = () => {
    Keyboard.dismiss()
    let validateNum = 0;

    if (maxLength50(username)) {
      setErrUsername(maxLength50(username));
    } else {
      if (validateUserName(username)) {
        setErrUsername(validateUserName(username))
      } else {
        validateNum++;
      }
    }
    if (maxLength50(email)) {
      setErrEmail(maxLength50(email));
    } else {
      if (validateEmail(email)) {
        setErrEmail(validateEmail(email));
      } else {
        validateNum++;
      }
    }

    if (maxLength100(website)) {
      setErrWebsite(maxLength100(website));
    } else {
      if (validateWebsiteURL(website)) {
        setErrWebsite(validateWebsiteURL(website));
      } else {
        validateNum++;
      }
    }

    if (maxLength100(discord)) {
      setErrDiscord(maxLength100(discord));
    } else {
      if (validateDiscordURL(discord)) {
        setErrDiscord(validateDiscordURL(discord));
      } else {
        validateNum++;
      }
    }

    if (maxLength100(twitter)) {
      setErrTwitter(maxLength100(twitter));
    } else {
      if (validateTwitterURL(twitter)) {
        setErrTwitter(validateTwitterURL(twitter));
      } else {
        validateNum++;
      }
    }

    if (maxLength100(youtube)) {
      setErrYoutube(maxLength100(youtube));
    } else {
      if (validateYoutubeURL(youtube)) {
        setErrYoutube(validateYoutubeURL(youtube));
      } else {
        validateNum++;
      }
    }

    if (maxLength100(instagram)) {
      setErrInstagram(maxLength100(instagram));
    } else {
      if (validateInstagramURL(instagram)) {
        setErrInstagram(validateInstagramURL(instagram));
      } else {
        validateNum++;
      }
    }
    if (maxLength200(about)) {
      setErrAbout(maxLength200(about));
    } else {
      validateNum++;
    }
    // if (maxLength20(firstName)) {
    //   setErrFirstname(maxLength50(firstName));
    // } else {
    //   validateNum++;
    // }
    // if (maxLength20(lastName)) {
    //   setErrLastname(maxLength50(lastName));
    // } else {
    //   validateNum++;
    // }
    // if (maxLength100(address)) {
    //   setErrAddress(maxLength100(address));
    // } else {
    //   validateNum++;
    // }
    // if (maxLength13(phoneNumber)) {
    //   setErrPhoneNo(maxLength13(phoneNumber));
    // } else {
    //   validateNum++;
    // }
    // if (maxLength50(title)) {
    //   setErrTitle(maxLength50(title));
    // } else {
    //   validateNum++;
    // }
    // if (maxLength100(facebook)) {
    //   setErrFacebook(maxLength100(facebook));
    // } else {
    //   if (validateFacebookURL(facebook)) {
    //     setErrFacebook(validateFacebookURL(facebook));
    //   } else {
    //     validateNum++;
    //   }
    // }
    // if (maxLength50(zoomLink)) {
    //   setErrZoomLink(maxLength50(zoomLink));
    // } else {
    //   if (validateZoomLinkURL(zoomLink)) {
    //     setErrZoomLink(validateZoomLinkURL(zoomLink));
    //   } else {
    //     validateNum++;
    //   }
    // }

    const req_body = isNonCrypto === 0 ?
      {
        description: about,
        discordSite: discord,
        // crypto: true,
        email: email,
        instagramSite: instagram,
        twitterSite: twitter,
        title: username,
        website: website,
        youtubeSite: youtube,
      } :
      {
        description: about,
        discordSite: discord,
        // crypto: true,
        email: email,
        instagramSite: instagram,
        twitterSite: twitter,
        userName: username,
        website: website,
        youtubeSite: youtube,
      }

    if (validateNum === 8) {
      dispatch(updateProfile(req_body,id))
    }
  }


  return (
    <AppBackground isBusy={UserReducer.loading}>
      <SafeAreaView style={{ flex: 1 }}>
        <AppHeader
          title={translate("wallet.common.profileSettings")}
          showBackButton
        // showRightButton={true}
        // onPressRight={onSave}
        // rightButtonComponent={<DoneText>{translate("wallet.common.done")}</DoneText>}
        />

        <KeyboardAwareScrollView extraScrollHeight={hp('7%')}>
          {/* <CenterWrap>
            <SpaceView mTop={SIZE(10)} />
            <Avatar>
              <C_Image
                uri={photo?.path ? photo.path : photo.uri}
                imageType="profile"
                imageStyle={{ width: '100%', height: '100%' }}
              />
            </Avatar>
            <SpaceView mTop={SIZE(7)} />
            <TouchableOpacity
              hitSlop={{ top: 15, bottom: 15, left: 40, right: 40 }}
              onPress={() => actionSheetRef.current.show()}>
              <ChangeAvatar>
                {translate("wallet.common.changeprofilephoto")}
              </ChangeAvatar>
            </TouchableOpacity>
            <SpaceView mTop={SIZE(17)} />
          </CenterWrap> */}

          {/* <LimitableInput
            value={firstName}
            onChange={(text) => { setFirstName(text); setErrFirstname(false); }}
            label={translate("common.firstName")}
            placeholder={translate("common.firstName")}
            validate={[maxLength20]}
            editable={true}
            error={errfirstname}
          /> <LimitableInput
            value={lastName}
            onChange={(text) => { setLastName(text); setErrLastname(false); }}
            label={translate("common.lastName")}
            placeholder={translate("common.lastName")}
            validate={[maxLength20]}
            editable={true}
            error={errLastname}
          /> <LimitableInput
            value={address}
            onChange={(text) => { setAddress(text); setErrAddress(false); }}
            label={translate("common.address")}
            placeholder={translate("common.address")}
            validate={[maxLength50]}
            editable={true}
            error={errAddress}
          /> <LimitableInput
            value={phoneNumber}
            onChange={(text) => { setPhoneNo(text); setErrPhoneNo(false); }}
            label={translate("common.phoneNumber")}
            placeholder={translate("common.phoneNumber")}
            validate={[maxLength13]}
            editable={true}
            error={errphoneNo}
          /> <LimitableInput
            value={title}
            onChange={(text) => { setTitle(text); setErrTitle(false); }}
            label={translate("common.artistname")}
            placeholder={translate("common.artistname")}
            validate={[maxLength50]}
            error={errTitle}
          />
            <LimitableInput
            value={facebook}
            onChange={(text) => { setFacebook(text); setErrFacebook(false); }}
            label={translate("common.facebook")}
            placeholder={translate("common.facebook")}
            validate={[maxLength100, validateFacebookURL]}
            error={errFacebook}
          />
            <LimitableInput
            value={zoomLink}
            onChange={(text) => { setZoomLink(text); setErrZoomLink(false); }}
            label={translate("common.zoomMail")}
            placeholder={translate("common.zoomMail")}
            validate={[maxLength50, validateEmail]}
            error={errZoomLink}
          /> */}
          <LimitableInput
            multiLine
            value={username && username.trimStart().replace(/\s\s+/g, ' ')}
            onChange={(text) => { setUsername(text); setErrUsername(false); }}
            label={translate("common.UserName")}
            placeholder={translate("common.PLACEHOLDER_USERNAME")}
            validate={[maxLength50, validateUserName]}
            editable={true}
            error={errUsername}
          />
          <View style={styles.mainView}>
            <Text style={styles.label}>{translate("common.twitter")}</Text>
            <View style={styles.inputView}>
              <View style={styles.iconConatainer}>
                <TwitterIconNew width={SIZE(24)} height={SIZE(24)} />
              </View>
              <TextInput
                style={{ padding: SIZE(12), width: '55%' }}
                placeholderTextColor="grey"
                value={twitter}
                onChange={(text) => { setTwitter(text); setErrTwitter(false); }}
                // placeholder={translate("common.twitter")}
                placeholder={translate("common.PLACEHOLDER_TWITTER")}
              />
              <TouchableOpacity style={UserReducer.userData.twitterSite ? styles.verifyBtnActive : styles.verifyBtn}>
                <Text style={{ color: '#FFFFFF', fontSize: SIZE(14), fontWeight: '700' }}>Verify twitter</Text>
              </TouchableOpacity>
            </View>
            {errTwitter && <Text style={{ fontSize: SIZE(14), fontFamily: 'Arial', color: COLORS.RED2 }}>{errTwitter}</Text>}
          </View>
          {/* <LimitableInput
            multiLine
            value={twitter && twitter.trimStart()}
            onChange={(text) => { setTwitter(text); setErrTwitter(false); }}
            label={translate("common.twitter")}
            placeholder={translate("common.twitter")}
            validate={[maxLength100, validateTwitterURL]}
            error={errTwitter}
          /> */}
          {UserReducer?.userData?.isNonCrypto === 1 &&
            <LimitableInput
              multiLine
              value={email && email.trimStart()}
              onChange={(text) => { setEmail(text); setErrEmail(false); }}
              label={translate("common.email")}
              placeholder={translate("common.PLACEHOLDER_EMAIL")}
              validate={[maxLength50, validateEmail]}
              error={errEmail}
              editable={false}
            />}
          {UserReducer?.userData?.isNonCrypto === 0 &&
            <LimitableInput
              multiLine
              value={email}
              onChange={(text) => { setEmail(text); setErrEmail(false); }}
              label={translate("common.email")}
              placeholder={translate("common.PLACEHOLDER_EMAIL")}
              validate={[maxLength50, validateEmail]}
              error={errEmail}
              editable={true}
            />}
          <LimitableInput
            multiLine
            value={website && website.trimStart()}
            onChange={(text) => { setWebsite(text); setErrWebsite(false) }}
            label={translate("common.website")}
            placeholder={translate("common.website")}
            validate={[maxLength100, validateWebsiteURL]}
            error={errWebsite}
          />
          <LimitableInput
            multiLine
            value={youtube && youtube.trimStart()}
            onChange={(text) => { setYoutube(text); setErrYoutube(false); }}
            label={translate("common.youtube")}
            placeholder={translate("common.youtube")}
            validate={[maxLength100, validateYoutubeURL]}
            error={errYoutube}
          />
          <LimitableInput
            multiLine
            value={discord && discord.trimStart()}
            onChange={(text) => { setDiscord(text); setErrDiscord(false); }}
            label={translate("common.discord")}
            placeholder={translate("common.discord")}
            validate={[maxLength100, validateDiscordURL]}
            error={errDiscord}
          />
          <View style={styles.mainView}>
            <Text style={styles.label}>{translate("common.instagram")}</Text>
            <View style={styles.inputView}>
              <View style={styles.iconConatainer}>
                <InstagramIcon width={SIZE(24)} height={SIZE(24)} />
              </View>
              <TextInput
                style={{ padding: SIZE(12), width: '90%' }}
                placeholderTextColor="grey"
                value={twitter}
                onChange={(text) => { setTwitter(text); setErrTwitter(false); }}
                // placeholder={translate("common.twitter")}
                placeholder={translate("common.PLACEHOLDER_INSTAGRAM")}
              />
            </View>
            {errInstagram && <Text style={{ fontSize: SIZE(14), fontFamily: 'Arial', color: COLORS.RED2 }}>{errInstagram}</Text>}
          </View>
          {/* <LimitableInput
            multiLine
            value={instagram && instagram.trimStart()}
            onChange={(text) => { setInstagram(text); setErrInstagram(false); }}
            label={translate("common.instagram")}
            placeholder={translate("common.instagram")}
            validate={[maxLength100, validateInstagramURL]}
            error={errInstagram}
          /> */}
          <GroupButton
            style={{ marginVertical: SIZE(10), marginTop: SIZE(30) }}
            onLeftPress={() => setIsVisible(true)}
            leftStyle={{ marginHorizontal: '5%', backgroundColor: '#0b5ed7' }}
            leftTextStyle={{ fontWeight: '600', fontSize: SIZE(14) }}
            leftText={translate("common.ARTIST_LABEL")}
            rightHide
          />
          <SpaceView mTop={SIZE(12)} />
          <LimitableInput
            multiLine
            limit
            style={{ height: 230 }}
            value={about && about.trimStart()}
            onChange={(text) => { setAbout(text.slice(0, 200)); setErrAbout(false); }}
            label={translate("common.bio")}
            // placeholder={translate("common.bio")}
            placeholder={translate("common.PLACEHOLDER_DESCRIPTION")}
            validate={[maxLength200]}
            error={errAbout}
            maxLength={200}
            about={about}
          />
          <GroupButton
            onLeftPress={() => onSave()}
            style={{ marginVertical: SIZE(10), marginTop: SIZE(30) }}
            leftStyle={{ marginHorizontal: '5%', backgroundColor: '#2280e1' }}
            leftTextStyle={{ fontWeight: '600', fontSize: SIZE(14) }}
            leftText={translate("common.BTN_SAVE_CHANGE")}
            rightHide
          />
          {renderArtistModal()}
        </KeyboardAwareScrollView>

        {/* <ActionSheet
          ref={actionSheetRef}
          title={translate("wallet.common.choosePhoto")}
          options={[translate("wallet.common.takePhoto"), translate("wallet.common.choosePhotoFromGallery"), translate("wallet.common.cancel")]}
          cancelButtonIndex={2}
          onPress={selectActionSheet}
        /> */}

        {showPermission ? showpermissionalert() : null}
      </SafeAreaView>
    </AppBackground>
  )
}

export default Profile;

const styles = StyleSheet.create({
  iconConatainer: {
    width: '7%',
    height: SIZE(40),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SIZE(10)
  },
  inputView: {
    borderColor: Colors.themeColor,
    borderWidth: SIZE(1),
    borderRadius: SIZE(7),
    height: SIZE(40),
    color: Colors.BLACK1,
    marginTop: SIZE(12),
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden'
  },
  label: {
    fontSize: SIZE(16),
    fontWeight: '700',
    color: '#212529'
  },
  mainView: {
    flexDirection: 'column',
    width: '90%',
    marginLeft: SIZE(19),
    marginTop: SIZE(20)
  },
  verifyBtn: {
    width: '35%',
    height: SIZE(38),
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: SIZE(8),
    borderTopRightRadius: SIZE(8),
  },
  verifyBtnActive: {
    width: '35%',
    height: SIZE(38),
    backgroundColor: '#2280e1',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: SIZE(8),
    borderTopRightRadius: SIZE(8),
  }
})
