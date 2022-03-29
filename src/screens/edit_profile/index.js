import _ from 'lodash';
import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, SafeAreaView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ActionSheet from 'react-native-actionsheet';
import { Field, reduxForm } from 'redux-form';
import ImagePicker from 'react-native-image-crop-picker';
import { useSelector, useDispatch } from 'react-redux';

import { CenterWrap, SpaceView, BorderView } from 'src/styles/common.styles';
import { SIZE } from 'src/constants';
import { C_Image, LimitableInput } from 'src/components';
import { Avatar, ChangeAvatar, DoneText } from './styled';
import { translate } from '../../walletUtils';
import AppBackground from '../../components/appBackground';
import { AppHeader } from '../../components';
import {
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
} from '../../utils';
import { updateProfile, updateProfileImage } from '../../store/reducer/userReducer';
import { hp } from '../../constants/responsiveFunct';
import { Permission, PERMISSION_TYPE } from '../../utils/appPermission';
import { openSettings } from 'react-native-permissions';
import { confirmationAlert } from '../../common/function';
import { TextInput } from 'react-native-gesture-handler';

function Profile(props) {
  const { navigation, handleSubmit } = props;

  const { UserReducer } = useSelector(state => state);
  const [photo, setPhoto] = useState({ uri: UserReducer.data.user.profile_image });
  const [username, setUsername] = useState(UserReducer.data.user.username);
  const [errUsername, setErrUsername] = useState(false);
  const [title, setTitle] = useState(UserReducer.data.user.title);
  const [errTitle, setErrTitle] = useState(false);
  const [email, setEmail] = useState(UserReducer.data.user.email);
  const [errEmail, setErrEmail] = useState(false);
  const [website, setWebsite] = useState(UserReducer.data.user.links?.website);
  const [errWebsite, setErrWebsite] = useState(false);
  const [discord, setDiscord] = useState(UserReducer.data.user.links?.discord);
  const [errDiscord, setErrDiscord] = useState(false);
  const [twitter, setTwitter] = useState(UserReducer.data.user.links?.twitter);
  const [errTwitter, setErrTwitter] = useState(false);
  const [youtube, setYoutube] = useState(UserReducer.data.user.links?.youtube);
  const [errYoutube, setErrYoutube] = useState(false);
  const [instagram, setInstagram] = useState(UserReducer.data.user.links?.instagram);
  const [errInstagram, setErrInstagram] = useState(false);
  const [facebook, setFacebook] = useState(UserReducer.data.user.links?.facebook);
  const [errFacebook, setErrFacebook] = useState(false);
  const [about, setAbout] = useState(UserReducer.data.user.about);
  const [errAbout, setErrAbout] = useState(false);
  const actionSheetRef = useRef(null);
  const dispatch = useDispatch();

  const OPEN_CAMERA = 0;
  const OPEN_GALLERY = 1;

  const selectActionSheet = async index => {
    const options = {
      title: 'Select Your Photo',
      storageOptions: {
        skipBackup: true,
        cropping: true,
      },
      quality: 0.5,
    };

    if (index === OPEN_CAMERA) {
      const isGranted = await Permission.checkPermission(PERMISSION_TYPE.camera);

      if (!isGranted) {
        confirmationAlert(
          translate("wallet.common.cameraPermissionHeader"),
          translate("wallet.common.cameraPermissionMessage"),
          translate("common.Cancel"),
          translate("wallet.common.settings"),
          () => openSettings(),
          () => null
        )
      } else {
        // launchCamera(options, (response) => {
        //   if (response.assets) {
        //     setPhoto(response.assets[0]);
        //   }
        // });
        ImagePicker.openCamera({
          height: 180,
          width: 512,
          cropping: true,
        }).then(image => {
          if (image.height <= 180 && image.width <= 512) {
            let temp = {
              image: image,
              path: image.path,
              uri: image.sourceURL,
              type: image.mime,
              fileName: image.filename
            }
            setPhoto(temp)
          }
        })
      }
    } else if (index === OPEN_GALLERY) {
      // launchImageLibrary(options, (response) => {
      //   if (response.assets) {
      //     setPhoto(response.assets[0]);
      //   }
      // });
      ImagePicker.openPicker({
        mediaType: "photo",
        height: 180,
        width: 512,
        cropping: true
      }).then(image => {
        if (image.height <= 180 && image.width <= 512) {
          let temp = {
            image: image,
            path: image.path,
            uri: image.sourceURL,
            type: image.mime,
            fileName: image.filename
          }
          setPhoto(temp)
        }
      })
    }
  }

  const onSave = () => {

    let validateNum = 0;
    if (maxLength50(username)) {
      setErrUsername(maxLength50(username));
    } else {
      validateNum++;
    }

    if (maxLength50(title)) {
      setErrTitle(maxLength50(title));
    } else {
      validateNum++;
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

    if (maxLength100(facebook)) {
      setErrFacebook(maxLength100(facebook));
    } else {
      if (validateFacebookURL(facebook)) {
        setErrFacebook(validateFacebookURL(facebook));
      } else {
        validateNum++;
      }
    }

    if (maxLength200(about)) {
      setErrAbout(maxLength200(about));
    } else {
      validateNum++;
    }

    const req_body = {
      username,
      title,
      crypto: true,
      email,
      website,
      discord,
      twitter,
      youtube,
      instagram,
      facebook,
      about
    }

    if (validateNum === 10) {

      if (photo.uri !== UserReducer.data.user.profile_image) {
        let formData = new FormData();
        formData.append('profile_image', { uri: photo.uri, name: photo.fileName, type: photo.type });
        dispatch(updateProfileImage(formData));
      }
  
      dispatch(updateProfile(req_body, () => navigation.goBack()));
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
            <TouchableOpacity onPress={() => actionSheetRef.current.show()}>
              <ChangeAvatar>
                {translate("wallet.common.changeprofilephoto")}
              </ChangeAvatar>
            </TouchableOpacity>
            <SpaceView mTop={SIZE(17)} />
          </CenterWrap>
          <BorderView />
          <LimitableInput
            value={username}
            onChange={(text) => { setUsername(text); setErrUsername(false); }}
            label={translate("common.UserName")}
            placeholder={translate("common.UserName")}
            validate={[maxLength50]}
            editable={false}
            error={errUsername}
          />
          <LimitableInput
            value={title}
            onChange={(text) => { setTitle(text); setErrTitle(false); }}
            label={translate("common.artistname")}
            placeholder={translate("common.artistname")}
            validate={[maxLength50]}
            error={errTitle}
          />
          <LimitableInput
            value={email}
            onChange={(text) => { setEmail(text); setErrEmail(false); }}
            label={translate("common.email")}
            placeholder={translate("common.email")}
            validate={[maxLength50, validateEmail]}
            error={errEmail}
          />
          <LimitableInput
            value={website}
            onChange={(text) => { setWebsite(text); setErrWebsite(false) }}
            label={translate("common.website")}
            placeholder={translate("common.website")}
            validate={[maxLength100, validateWebsiteURL]}
            error={errWebsite}
          />
          <LimitableInput
            value={discord}
            onChange={(text) => { setDiscord(text); setErrDiscord(false); }}
            label={translate("common.discord")}
            placeholder={translate("common.discord")}
            validate={[maxLength100, validateDiscordURL]}
            error={errDiscord}
          />
          <LimitableInput
            value={twitter}
            onChange={(text) => { setTwitter(text); setErrTwitter(false); }}
            label={translate("common.twitter")}
            placeholder={translate("common.twitter")}
            validate={[maxLength100, validateTwitterURL]}
            error={errTwitter}
          />
          <LimitableInput
            value={youtube}
            onChange={(text) => { setYoutube(text); setErrYoutube(false); }}
            label={translate("common.youtube")}
            placeholder={translate("common.youtube")}
            validate={[maxLength100, validateYoutubeURL]}
            error={errYoutube}
          />
          <LimitableInput
            value={instagram}
            onChange={(text) => { setInstagram(text); setErrInstagram(false); }}
            label={translate("common.instagram")}
            placeholder={translate("common.instagram")}
            validate={[maxLength100, validateInstagramURL]}
            error={errInstagram}
          />
          <LimitableInput
            value={facebook}
            onChange={(text) => { setFacebook(text); setErrFacebook(false); }}
            label={translate("common.facebook")}
            placeholder={translate("common.facebook")}
            validate={[maxLength100, validateFacebookURL]}
            error={errFacebook}
          />
          <SpaceView mTop={SIZE(12)} />
          <LimitableInput
            multiLine
            value={about}
            onChange={(text) => { setAbout(text); setErrAbout(false); }}
            label={translate("wallet.common.aboutMe")}
            placeholder={translate("wallet.common.aboutMe")}
            validate={[maxLength200]}
            error={errAbout}
          />
        </KeyboardAwareScrollView>

        <ActionSheet
          ref={actionSheetRef}
          title={translate("wallet.common.choosePhoto")}
          options={[translate("wallet.common.takePhoto"), translate("wallet.common.choosePhotoFromGallery"), translate("wallet.common.cancel")]}
          cancelButtonIndex={2}
          onPress={selectActionSheet}
        />
      </SafeAreaView>
    </AppBackground>
  )
}

export default Profile;
