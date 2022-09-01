import _ from 'lodash';
import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, SafeAreaView, Keyboard, Platform, Text, PermissionsAndroid } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ActionSheet from 'react-native-actionsheet';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Field, reduxForm } from 'redux-form';
import ImagePicker from 'react-native-image-crop-picker';
import { useSelector, useDispatch } from 'react-redux';

import { CenterWrap, SpaceView, BorderView, RowWrap } from 'src/styles/common.styles';
import { SIZE } from 'src/constants';
import { C_Image, LimitableInput } from 'src/components';
import { Avatar, ChangeAvatar, DoneText } from './styled';
import { translate } from '../../walletUtils';
import AppBackground from '../../components/appBackground';
import { AppHeader } from '../../components';
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
import { updateProfile, updateProfileImage } from '../../store/reducer/userReducer';
import { hp } from '../../constants/responsiveFunct';
import { Permission, PERMISSION_TYPE } from '../../utils/appPermission';
import { openSettings } from 'react-native-permissions';
import { confirmationAlert } from '../../common/function';
import { responsiveFontSize as RF } from "../../common/responsiveFunction";
import fonts from "../../res/fonts";
import colors from "../../res/colors";
import { View } from "native-base";

function Profile(props) {
  const { navigation, handleSubmit } = props;

  const { UserReducer } = useSelector(state => state);
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
  const [photo, setPhoto] = useState({ uri: UserReducer.userData.user.profile_image });
  const [username, setUsername] = useState(isNonCrypto === 0 ? UserReducer.userData.user.title : UserReducer.userData.user.username);
  const [errUsername, setErrUsername] = useState(false);
  const [email, setEmail] = useState(UserReducer.userData.user.email);
  const [errEmail, setErrEmail] = useState(false);
  const [website, setWebsite] = useState(UserReducer.userData.user.links?.website);
  const [errWebsite, setErrWebsite] = useState(false);
  const [discord, setDiscord] = useState(UserReducer.userData.user.links?.discord);
  const [errDiscord, setErrDiscord] = useState(false);
  const [twitter, setTwitter] = useState(UserReducer.userData.user.links?.twitter);
  const [errTwitter, setErrTwitter] = useState(false);
  const [youtube, setYoutube] = useState(UserReducer.userData.user.links?.youtube);
  const [errYoutube, setErrYoutube] = useState(false);
  const [instagram, setInstagram] = useState(UserReducer.userData.user.links?.instagram);
  const [errInstagram, setErrInstagram] = useState(false);
  const [about, setAbout] = useState(UserReducer.userData.user.about);
  const [errAbout, setErrAbout] = useState(false);
  const actionSheetRef = useRef(null);
  //const [conformpermission,setConformpermission]=useState(true)
  const dispatch = useDispatch();

  const [showPermission, setShowPermission] = useState(false);


  const OPEN_CAMERA = 0;
  const OPEN_GALLERY = 1;

  const selectActionSheet = async index => {
    const options = {
      title: 'Select Your Photo',
      storageOptions: {
        skipBackup: true,
        cropping: true,
        privateDirectory: true
      },
      quality: 0.5,
    };

    if (index === OPEN_CAMERA) {

      ImagePicker.openCamera({
        height: 512,
        width: 512,
        cropping: true
      }).then(image => {
        console.log('Response from camera', image)
        if (image.height <= 512 && image.width <= 512) {
          let filename = Platform.OS === 'android' ? image.path.substring(image.path.lastIndexOf('/') + 1) : image.filename ? image.filename : image.path.substring(image.path.lastIndexOf('/') + 1)
          let uri = Platform.OS === 'android' ? image.path : image.sourceURL

          let temp = {
            path: image.path,
            uri: uri,
            type: image.mime,
            fileName: filename,
            image: image
          }
          setPhoto(temp)
        }
      }).catch(async e => {
        console.log('Error from openCamera', e, e.code)
        if (e.code && (e.code === 'E_NO_CAMERA_PERMISSION' || e.code === 'E_PICKER_CANNOT_RUN_CAMERA_ON_SIMULATOR')) {
          // const isGranted = await Permission.checkPermission(PERMISSION_TYPE.camera);
          // if (isGranted===false) {
          confirmationAlert(
            translate("wallet.common.cameraPermissionHeader"),
            translate("wallet.common.cameraPermissionMessage"),
            translate("common.Cancel"),
            translate("wallet.common.settings"),
            () => openSettings(),
            () => null
          )
          // }
        }
      })
    } else if (index === OPEN_GALLERY) {
      ImagePicker.openPicker({
        mediaType: "photo",
        height: 512,
        width: 512,
        cropping: true
      }).then(image => {
        console.log('Response from storage', image)

        if (image.height <= 512 && image.width <= 512) {

          let filename = Platform.OS === 'android' ? image.path.substring(image.path.lastIndexOf('/') + 1) : image.filename

          let uri = Platform.OS === 'android' ? image.path : image.sourceURL

          let temp = {
            path: image.path,
            uri: uri,
            type: image.mime,
            fileName: filename,
            image: image
          }
          setPhoto(temp)
        }
      }).catch(async e => {
        console.log('Error from openPicker', e)
        if (e.code && e.code === 'E_NO_LIBRARY_PERMISSION') {
          // const isGranted = await Permission.checkPermission(PERMISSION_TYPE.storage);
          // if (isGranted === false) {
          confirmationAlert(
            translate("wallet.common.storagePermissionHeader"),
            translate("wallet.common.storagePermissionMessage"),
            translate("common.Cancel"),
            translate("wallet.common.settings"),
            () => openSettings(),
            () => null
          )
          // }
        }
      })
    }
  }

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
        title: username,
        crypto: true,
        email,
        website,
        discord,
        twitter,
        youtube,
        instagram,
        about
      } :
      {
        username,
        crypto: false,
        email,
        website,
        discord,
        twitter,
        youtube,
        instagram,
        about
        // firstName,
        // lastName,
        // address,
        // phoneNumber,
        // title,
        // facebook,
        // zoomLink,
      }

    if (validateNum === 8) {
      if (photo?.uri !== UserReducer.userData.user.profile_image) {
        let formData = new FormData();
        formData.append('profile_image', { uri: photo?.path ? photo.path : photo.uri, name: photo?.fileName, type: photo?.type });

        console.log('formData', formData._parts)
        dispatch(updateProfileImage(formData)).then(() => {
          dispatch(updateProfile(req_body, () => navigation.goBack()));
        })
          .catch((err) => {
            dispatch(updateProfile(req_body, () => navigation.goBack()));
          });
      } else {
        dispatch(updateProfile(req_body, () => navigation.goBack()));
      }
    }
  }


  return (
    <AppBackground isBusy={UserReducer.loading}>
      <SafeAreaView style={{ flex: 1 }}>
        <AppHeader
          title={translate("wallet.common.profileSettings")}
          showBackButton
          showRightButton={true}
          onPressRight={onSave}
          rightButtonComponent={<DoneText>{translate("wallet.common.done")}</DoneText>}
        />

        <KeyboardAwareScrollView extraScrollHeight={hp('7%')}>
          <CenterWrap>
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
          </CenterWrap>
          <BorderView />

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
            value={username && username.trimStart().replace(/\s\s+/g, ' ')}
            onChange={(text) => { setUsername(text); setErrUsername(false); }}
            label={translate("common.UserName")}
            placeholder={translate("common.UserName")}
            validate={[maxLength50, validateUserName]}
            editable={true}
            error={errUsername}
          />
          {UserReducer.userData.user?.isNonCrypto === 1 &&
            <LimitableInput
              value={email && email.trimStart()}
              onChange={(text) => { setEmail(text); setErrEmail(false); }}
              label={translate("common.email")}
              placeholder={translate("common.email")}
              validate={[maxLength50, validateEmail]}
              error={errEmail}
              editable={false}
            />}
          <LimitableInput
            value={website && website.trimStart()}
            onChange={(text) => { setWebsite(text); setErrWebsite(false) }}
            label={translate("common.website")}
            placeholder={translate("common.website")}
            validate={[maxLength100, validateWebsiteURL]}
            error={errWebsite}
          />
          <LimitableInput
            value={discord && discord.trimStart()}
            onChange={(text) => { setDiscord(text); setErrDiscord(false); }}
            label={translate("common.discord")}
            placeholder={translate("common.discord")}
            validate={[maxLength100, validateDiscordURL]}
            error={errDiscord}
          />
          <LimitableInput
            value={twitter && twitter.trimStart()}
            onChange={(text) => { setTwitter(text); setErrTwitter(false); }}
            label={translate("common.twitter")}
            placeholder={translate("common.twitter")}
            validate={[maxLength100, validateTwitterURL]}
            error={errTwitter}
          />
          <LimitableInput
            value={youtube && youtube.trimStart()}
            onChange={(text) => { setYoutube(text); setErrYoutube(false); }}
            label={translate("common.youtube")}
            placeholder={translate("common.youtube")}
            validate={[maxLength100, validateYoutubeURL]}
            error={errYoutube}
          />
          <LimitableInput
            value={instagram && instagram.trimStart()}
            onChange={(text) => { setInstagram(text); setErrInstagram(false); }}
            label={translate("common.instagram")}
            placeholder={translate("common.instagram")}
            validate={[maxLength100, validateInstagramURL]}
            error={errInstagram}
          />
          {UserReducer.userData.user?.isNonCrypto === 0 &&
            <LimitableInput
              value={email}
              onChange={(text) => { setEmail(text); setErrEmail(false); }}
              label={translate("common.email")}
              placeholder={translate("common.email")}
              validate={[maxLength50, validateEmail]}
              error={errEmail}
              editable={true}
            />}
          <SpaceView mTop={SIZE(12)} />
          <LimitableInput
            multiLine
            value={about && about.trimStart()}
            onChange={(text) => { setAbout(text.slice(0, 200)); setErrAbout(false); }}
            label={translate("wallet.common.aboutMe")}
            placeholder={translate("wallet.common.aboutMe")}
            validate={[maxLength200]}
            error={errAbout}
            maxLength={200}
            about={about}
          />
        </KeyboardAwareScrollView>

        <ActionSheet
          ref={actionSheetRef}
          title={translate("wallet.common.choosePhoto")}
          options={[translate("wallet.common.takePhoto"), translate("wallet.common.choosePhotoFromGallery"), translate("wallet.common.cancel")]}
          cancelButtonIndex={2}
          onPress={selectActionSheet}
        />

        {showPermission ? showpermissionalert() : null}
      </SafeAreaView>
    </AppBackground>
  )
}

export default Profile;
