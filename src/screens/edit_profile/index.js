import _ from 'lodash';
import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, SafeAreaView, } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ActionSheet from 'react-native-actionsheet';
import { Field, reduxForm } from 'redux-form';
import { useSelector, useDispatch } from 'react-redux';

import { CenterWrap, SpaceView, BorderView } from 'src/styles/common.styles';
import { SIZE } from 'src/constants';
import { C_Image, LimitableInput } from 'src/components';
import { Avatar, ChangeAvatar, DoneText } from './styled';
import { translate } from '../../walletUtils';
import AppBackground from '../../components/appBackground';
import { AppHeader } from '../../components';
import {
  alertWithSingleBtn,
  maxLength20,
  maxLength50,
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
import { confirmationAlert } from '../../common/function';
import { hp } from '../../constants/responsiveFunct';
import { Permission, PERMISSION_TYPE } from '../../utils/appPermission';

function Profile(props) {
  const { navigation, handleSubmit, initialize } = props;

  const { UserReducer } = useSelector(state => state);
  const [photo, setPhoto] = useState({ uri: UserReducer.data.user.profile_image });
  const actionSheetRef = useRef(null);
  const dispatch = useDispatch();

  const OPEN_CAMERA = 0;
  const OPEN_GALLERY = 1;

  useEffect(() => {
    const data = UserReducer.data.user;
    initialize({ ...data, ...data.links });
  }, []);

  const onPhoto = async () => {
    // const isGranted = await Permission.checkPermission(PERMISSION_TYPE.camera);

    // if (!isGranted) {
    //   confirmationAlert(
    //     'This feature requires camera access',
    //     'To enable access, tap Settings and turn on Camera.',
    //     'Cancel',
    //     'Settings',
    //     () => openSettings(),
    //     () => null
    //   )
    //   const isPermission = await Permission.requestPermission(PERMISSION_TYPE.camera);
    //   console.log('=======isPermission', isPermission);

    // } else {
    //   actionSheetRef.current.show();
    // }
    actionSheetRef.current.show();
  }

  const selectActionSheet = index => {
    const options = {
      title: 'Select Your Photo',
      storageOptions: {
        skipBackup: true,
        cropping: true,
      },
      quality: 0.5,
    };

    if (index === OPEN_CAMERA) {
      launchCamera(options, (response) => {
        if (response.assets) {
          setPhoto(response.assets[0]);
        }
      });
    } else if (index === OPEN_GALLERY) {
      launchImageLibrary(options, (response) => {
        if (response.assets) {
          setPhoto(response.assets[0]);
        }
      });
    }
  }

  const onSave = (props) => {
    if (photo.uri !== UserReducer.data.user.profile_image) {
      let formData = new FormData();
      formData.append('profile_image', { uri: photo.uri, name: photo.fileName, type: photo.type });
      dispatch(updateProfileImage(formData));
    }

    props = {
      about: "asdfasdf",
      crypto: true,
      discord: "https://sssadsf.com",
      email: "Paul@gmail.com",
      facebook: "https://aaaaa.com",
      instagram: "https://instagram.com",
      title: "11111",
      twitter: "https://twitter.com",
      website: "",
      youtube: "https://aaaa.com",
    }
    console.log('========props', props)
    dispatch(updateProfile(props));
  }

  return (
    <AppBackground isBusy={UserReducer.loading}>
      <SafeAreaView style={{ flex: 1 }}>
        <AppHeader
          title={translate("wallet.common.profileSettings")}
          showBackButton
          showRightButton={true}
          onPressRight={handleSubmit(onSave)}
          rightButtonComponent={<DoneText>{translate("wallet.common.done")}</DoneText>}
        />

        <KeyboardAwareScrollView extraScrollHeight={hp('7%')}>
          <CenterWrap>
            <SpaceView mTop={SIZE(10)} />
            <Avatar>
              <C_Image
                uri={photo.uri}
                imageType="profile"
                imageStyle={{ width: '100%', height: '100%' }}
              />
            </Avatar>
            <SpaceView mTop={SIZE(7)} />
            <TouchableOpacity onPress={onPhoto}>
              <ChangeAvatar>
                {translate("wallet.common.changeprofilephoto")}
              </ChangeAvatar>
            </TouchableOpacity>
            <SpaceView mTop={SIZE(17)} />
          </CenterWrap>
          <BorderView />
          <Field
            name="username"
            label={translate("common.UserName")}
            component={LimitableInput}
            placeholder={translate("common.UserName")}
            validate={[maxLength50]}
            editable={false}
          />
          <Field
            name="title"
            label={translate("common.artistname")}
            component={LimitableInput}
            placeholder={translate("common.artistname")}
            validate={[maxLength50]}
          />
          <Field
            name="email"
            label={translate("common.email")}
            component={LimitableInput}
            placeholder={translate("common.email")}
            validate={[maxLength20, validateEmail]}
          />
          <Field
            name="website"
            label={translate("common.website")}
            component={LimitableInput}
            placeholder={translate("common.website")}
            validate={[maxLength50, validateWebsiteURL]}
          />
          <Field
            name="discord"
            label={translate("common.discord")}
            component={LimitableInput}
            placeholder={translate("common.discord")}
            validate={[maxLength50, validateDiscordURL]}
          />
          <Field
            name="twitter"
            label={translate("common.twitter")}
            component={LimitableInput}
            placeholder={translate("common.twitter")}
            validate={[maxLength50, validateTwitterURL]}
          />
          <Field
            name="youtube"
            label={translate("common.youtube")}
            component={LimitableInput}
            placeholder={translate("common.youtube")}
            validate={[maxLength50, validateYoutubeURL]}
          />
          <Field
            name="instagram"
            label={translate("common.instagram")}
            component={LimitableInput}
            placeholder={translate("common.instagram")}
            validate={[maxLength50, validateInstagramURL]}
          />
          <Field
            name="facebook"
            label={translate("common.facebook")}
            component={LimitableInput}
            placeholder={translate("common.facebook")}
            validate={[maxLength50, validateFacebookURL]}
          />
          <SpaceView mTop={SIZE(12)} />
          <Field
            multiLine
            name="about"
            label={translate("wallet.common.aboutMe")}
            component={LimitableInput}
            placeholder={translate("wallet.common.aboutMe")}
            validate={[maxLength200]}
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

export default reduxForm({
  form: 'Profile' // a unique identifier for this form
})(Profile);