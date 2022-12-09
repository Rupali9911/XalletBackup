import _ from 'lodash';
import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  SafeAreaView,
  Keyboard,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector, useDispatch} from 'react-redux';
import Modal from 'react-native-modal';
import {SpaceView} from 'src/styles/common.styles';
import {SIZE, SVGS} from 'src/constants';
import {LimitableInput} from 'src/components';
import {translate} from '../../walletUtils';
import AppBackground from '../../components/appBackground';
import {AppHeader, GroupButton} from '../../components';
import {
  maxLength32,
  maxLength50,
  maxLength100,
  maxLength200,
  validateEmail,
  validateWebsiteURL,
  validateDiscordURL,
  validateTwitterURL,
  validateYoutubeURL,
  validateInstagramURL,
  validateUserName,
} from '../../utils';
import userReducer, {
  setToastMsg,
  updateProfile,
  verifyEmail,
  getUserData,
} from '../../store/reducer/userReducer';
import {hp} from '../../constants/responsiveFunct';
import {View} from 'native-base';
import Colors from '../../constants/Colors';
import {COLORS} from '../../constants';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
const {InstagramIcon, ArtistSvg, ArtistSvgI, SuccessIcon, ErrorIcon, InfoIcon} =
  SVGS;

function Profile(props) {
  const {navigation, handleSubmit} = props;
  const {UserReducer} = useSelector(state => state);
  const isNonCrypto = useSelector(
    state => state.UserReducer?.userData?.user?.isNonCrypto,
  );
  const [editProfileData, setEditProfileData] = useState({});
  const [errUsername, setErrUsername] = useState(false);
  const [errEmail, setErrEmail] = useState(false);
  const [errWebsite, setErrWebsite] = useState(false);
  const [errDiscord, setErrDiscord] = useState(false);
  const [errTwitter, setErrTwitter] = useState(false);
  const [errYoutube, setErrYoutube] = useState(false);
  const [errInstagram, setErrInstagram] = useState(false);
  const [errAbout, setErrAbout] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [msgModal, setMsgModal] = useState(false);
  const [msg, setMsg] = useState('');
  const [disable, setDisable] = useState(true);
  const [firstTime, setFirstTime] = useState(false);
  const [infoTwitter, setInfoTwitter] = useState(false);
  const [infoEmail, setInfoEmail] = useState(false);
  const [showVerifyEmail, setShowVerifyEmail] = useState(false);

  const dispatch = useDispatch();
  let id = UserReducer.userData?.userWallet?.address;
  const selectedLanguageItem = useSelector(
    state => state.LanguageReducer?.selectedLanguageItem?.language_name,
  );
  const toastMsg = UserReducer.toastMsg;

  useEffect(() => {
    if (toastMsg) {
      renderMessageModal(toastMsg.msg);
      toastMsg.error ? setShowVerifyEmail(false) : setShowVerifyEmail(true);
    }
  }, [toastMsg]);

  useEffect(() => {
    setEditProfileData({
      username:
        isNonCrypto === 0
          ? UserReducer.userData.title
          : UserReducer.userData.userName,
      email: UserReducer.userData.email,
      twitter: UserReducer.userData.twitterSite,
      website: UserReducer.userData.website,
      discord: UserReducer.userData.discordSite,
      youtube: UserReducer.userData.youtubeSite,
      instagram: UserReducer.userData.instagramSite,
      about: UserReducer.userData.description,
      beforeTwitter: UserReducer.userData.twitterSite,
      beforeEmail: UserReducer.userData.email,
    });
  }, [UserReducer?.userData]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(getUserData(id));
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (
      editProfileData.username ||
      editProfileData.twitter ||
      editProfileData.email ||
      editProfileData.website ||
      editProfileData.youtube ||
      editProfileData.discord ||
      editProfileData.instagram ||
      editProfileData.about
    ) {
      if (firstTime) {
        setDisable(false);
      } else {
        setFirstTime(true);
      }
    }
  }, [
    editProfileData.username,
    editProfileData.twitter,
    editProfileData.email,
    editProfileData.website,
    editProfileData.youtube,
    editProfileData.discord,
    editProfileData.instagram,
    editProfileData.about,
  ]);
  const renderArtistModal = () => {
    return (
      <View style={styles.contentView}>
        <Modal
          backdropColor="#000000"
          backdropOpacity={0.6}
          onBackdropPress={() => {
            setIsVisible(false);
          }}
          isVisible={isVisible}
          transparent={true}>
          <View style={styles.artistModalView}>
            <ArtistSvg />
            <Text style={styles.artistTitle}>
              {translate('common.ARTIST_BTN_REQUEST')}
            </Text>
            <Text style={styles.artistDescription}>
              {translate('common.ARTIST_DESCRIPTION_LINE_1')}
            </Text>
            <Text style={[styles.artistDescription, {marginBottom: SIZE(28)}]}>
              {translate('common.ARTIST_DESCRIPTION_LINE_2')}
            </Text>
            <View style={styles.infoView}>
              <ArtistSvgI />
              <Text style={styles.infoTitle}>
                {' ' + translate('common.ARTIST_NOTE')}
              </Text>
            </View>
            <GroupButton
              style={styles.artistGroupView}
              onLeftPress={() => setIsVisible(false)}
              leftStyle={styles.artistLeft}
              leftTextStyle={styles.groupLeftTitle}
              leftText={translate('common.OK')}
              rightHide
            />
          </View>
        </Modal>
      </View>
    );
  };

  const messageModal = () => {
    return (
      <View style={styles.msgModalContent}>
        <Modal isVisible={msgModal} style={styles.msgModal}>
          <View style={styles.msgModalView}>
            {toastMsg?.error ? (
              <ErrorIcon width={20} height={20} />
            ) : (
              <SuccessIcon width={20} height={20} />
            )}
            <Text style={styles.msgModalText}>{msg}</Text>
          </View>
        </Modal>
      </View>
    );
  };
  const renderMessageModal = msg => {
    setMsg(msg);
    setMsgModal(true);
    setTimeout(() => {
      setMsg('');
      setMsgModal(false);
      dispatch(setToastMsg(null));
    }, 3000);
  };

  const onSave = () => {
    let validateNum = 0;
    if (maxLength32(editProfileData.username)) {
      setErrUsername(maxLength32(editProfileData.username));
    } else {
      if (validateUserName(editProfileData.username)) {
        setErrUsername(validateUserName(editProfileData.username));
      } else {
        validateNum++;
      }
    }
    if (maxLength50(editProfileData.email)) {
      setErrEmail(maxLength50(editProfileData.email));
    } else {
      if (validateEmail(editProfileData.email)) {
        setErrEmail(validateEmail(editProfileData.email));
      } else {
        validateNum++;
      }
    }
    if (maxLength100(editProfileData.website)) {
      setErrWebsite(maxLength100(editProfileData.website));
    } else {
      if (validateWebsiteURL(editProfileData.website)) {
        setErrWebsite(validateWebsiteURL(editProfileData.website));
      } else {
        validateNum++;
      }
    }
    if (maxLength100(editProfileData.discord)) {
      setErrDiscord(maxLength100(editProfileData.discord));
    } else {
      if (validateDiscordURL(editProfileData.discord)) {
        setErrDiscord(validateDiscordURL(editProfileData.discord));
      } else {
        validateNum++;
      }
    }
    if (maxLength100(editProfileData.twitter)) {
      setErrTwitter(maxLength100(editProfileData.twitter));
    } else {
      if (validateTwitterURL(editProfileData.twitter)) {
        setErrTwitter(validateTwitterURL(editProfileData.twitter));
      } else {
        validateNum++;
      }
    }
    if (maxLength100(editProfileData.youtube)) {
      setErrYoutube(maxLength100(editProfileData.youtube));
    } else {
      if (validateYoutubeURL(editProfileData.youtube)) {
        setErrYoutube(validateYoutubeURL(editProfileData.youtube));
      } else {
        validateNum++;
      }
    }
    if (maxLength100(editProfileData.instagram)) {
      setErrInstagram(maxLength100(editProfileData.instagram));
    } else {
      if (validateInstagramURL(editProfileData.instagram)) {
        setErrInstagram(validateInstagramURL(editProfileData.instagram));
      } else {
        validateNum++;
      }
    }
    if (maxLength200(editProfileData.about)) {
      setErrAbout(maxLength200(editProfileData.about));
    } else {
      validateNum++;
    }
    const req_body =
      isNonCrypto === 0
        ? {
            description: editProfileData.about,
            discordSite: editProfileData.discord,
            email: editProfileData.email || undefined,
            instagramSite: editProfileData.instagram,
            twitterSite: editProfileData.twitter,
            title: editProfileData.username,
            website: editProfileData.website,
            youtubeSite: editProfileData.youtube,
            zoomMail: '',
          }
        : {
            description: editProfileData.about,
            discordSite: editProfileData.discord,
            email: editProfileData.email || undefined,
            instagramSite: editProfileData.instagram,
            twitterSite: editProfileData.twitter,
            userName: editProfileData.username,
            website: editProfileData.website,
            youtubeSite: editProfileData.youtube,
            zoomMail: '',
          };
    if (validateNum === 8) {
      dispatch(updateProfile(req_body, id));
      setEditProfileData({
        ...editProfileData,
        beforeTwitter: editProfileData.twitter,
        beforeEmail: editProfileData.email,
      });
      setDisable(true);
    }
  };

  const handleChangeInstagram = text => {
    setEditProfileData({
      ...editProfileData,
      instagram: text,
    });
    if (validateInstagramURL(text)) {
      setErrInstagram(validateInstagramURL(text));
    } else {
      setErrInstagram(false);
    }
  };

  const verifyEmailId = (email, selectedLanguageItem) => {
    dispatch(verifyEmail(email, selectedLanguageItem));
    dispatch(
      setToastMsg({error: false, msg: translate('common.LABEL_EMAIL_SUCCESS')}),
    );
  };

  const infoModal = (title, opened, onClick) => {
    return (
      <View style={styles.infoPPopUpView}>
        <Text style={styles.label}>{translate(title)}</Text>
        <TouchableOpacity onPress={() => onClick(true)}>
          <Menu opened={opened}>
            <MenuTrigger />
            <MenuOptions optionsContainerStyle={styles.menuOption}>
              <MenuOption>
                <Text style={{color: '#FFFFFF'}} onPress={() => onClick(false)}>
                  {translate('common.PROFILE_SAVE_MSG')}
                </Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
          <InfoIcon style={styles.infoIcon} />
        </TouchableOpacity>
      </View>
    );
  };
  const twitterInfoPopUp = info => {
    setInfoTwitter(info);
    setTimeout(() => {
      setInfoTwitter(false);
    }, 5000);
  };

  const emailInfoPopUp = info => {
    setInfoEmail(info);
    setTimeout(() => {
      setInfoEmail(false);
    }, 5000);
  };
  return (
    <AppBackground isBusy={UserReducer.loading}>
      <SafeAreaView style={styles.contentView}>
        <AppHeader
          title={translate('wallet.common.profileSettings')}
          showBackButton
        />
        <KeyboardAwareScrollView>
          <LimitableInput
            singleLine={false}
            multiLine
            value={
              editProfileData.username &&
              editProfileData.username.trimStart().replace(/\s\s+/g, ' ')
            }
            onChange={text => {
              setEditProfileData({...editProfileData, username: text});
              setErrUsername(false);
            }}
            label={translate('common.UserName')}
            placeholder={translate('common.PLACEHOLDER_USERNAME')}
            validate={[maxLength32, validateUserName]}
            editable={true}
            error={errUsername}
          />
          <View style={styles.mainView}>
            {infoModal('common.twitter', infoTwitter, twitterInfoPopUp)}
            <View style={styles.inputView}>
              <TextInput
                style={[
                  styles.verifiedView,
                  {
                    maxWidth:
                      UserReducer.userData.twitterVerified === 0
                        ? '80%'
                        : '88%',
                  },
                ]}
                placeholderTextColor="grey"
                value={editProfileData.twitter}
                onChangeText={text => {
                  setEditProfileData({...editProfileData, twitter: text});
                  setErrTwitter(false);
                }}
                placeholder={translate('common.PLACEHOLDER_TWITTER')}
              />
              <TouchableOpacity
                disabled={
                  UserReducer?.userData?.twitterVerified === 0 &&
                  editProfileData.twitter &&
                  editProfileData.beforeTwitter &&
                  editProfileData.twitter === editProfileData.beforeTwitter
                    ? false
                    : true
                }
                style={
                  UserReducer?.userData?.twitterVerified === 0 &&
                  editProfileData.twitter &&
                  editProfileData.beforeTwitter &&
                  editProfileData.twitter === editProfileData.beforeTwitter
                    ? styles.verifyBtnActive
                    : styles.verifyBtn
                }
                onPress={() => {
                  navigation.navigate('WebView');
                }}>
                <Text style={styles.verifyBtnTitle}>
                  {UserReducer.userData.twitterVerified === 0
                    ? translate('common.BTN_TWITTER_REQUEST')
                    : translate('common.BTN_EMAIL_APPROVED')}
                </Text>
              </TouchableOpacity>
            </View>
            {errTwitter && <Text style={styles.errorMsg}>{errTwitter}</Text>}
          </View>
          {UserReducer?.userData?.isNonCrypto === 1 && (
            <LimitableInput
              multiLine
              singleLine={false}
              value={editProfileData.email && editProfileData.email.trimStart()}
              onChange={text => {
                setEditProfileData({...editProfileData, email: text});
                setErrEmail(false);
              }}
              label={translate('common.email')}
              placeholder={translate('common.PLACEHOLDER_EMAIL')}
              validate={[maxLength50, validateEmail]}
              error={errEmail}
              editable={false}
            />
          )}
          {UserReducer?.userData?.isNonCrypto === 0 && (
            <View style={styles.mainView}>
              {infoModal('common.userEmail', infoEmail, emailInfoPopUp)}
              <View style={styles.inputView}>
                <TextInput
                  style={[
                    styles.verifiedView,
                    {
                      maxWidth:
                        UserReducer.userData.emailVerified === 0
                          ? '80%'
                          : '88%',
                    },
                  ]}
                  placeholderTextColor="grey"
                  value={editProfileData.email}
                  onChangeText={text => {
                    setEditProfileData({...editProfileData, email: text});
                    setErrEmail(false);
                  }}
                  placeholder={translate('common.PLACEHOLDER_EMAIL')}
                />
                <TouchableOpacity
                  disabled={
                    UserReducer?.userData?.emailVerified === 0 &&
                    showVerifyEmail &&
                    editProfileData.email &&
                    editProfileData.beforeEmail &&
                    editProfileData.email === editProfileData.beforeEmail
                      ? false
                      : true
                  }
                  style={
                    UserReducer?.userData?.emailVerified === 0 &&
                    showVerifyEmail &&
                    editProfileData.email &&
                    editProfileData.beforeEmail &&
                    editProfileData.email === editProfileData.beforeEmail
                      ? styles.verifyBtnActive
                      : styles.verifyBtn
                  }
                  onPress={() => {
                    verifyEmailId(editProfileData.email, selectedLanguageItem);
                  }}>
                  <Text style={styles.verifyBtnTitle}>
                    {editProfileData.email === editProfileData.beforeEmail &&
                    UserReducer.userData.emailVerified === 1
                      ? translate('common.BTN_EMAIL_APPROVED')
                      : translate('common.BTN_TWITTER_REQUEST')}
                  </Text>
                </TouchableOpacity>
              </View>
              {errEmail && <Text style={styles.errorMsg}>{errEmail}</Text>}
            </View>
          )}
          <LimitableInput
            multiLine
            singleLine={false}
            value={
              editProfileData.website && editProfileData.website.trimStart()
            }
            onChange={text => {
              setEditProfileData({...editProfileData, website: text});
              setErrWebsite(false);
            }}
            label={translate('common.website')}
            placeholder={translate('common.PLACEHOLDER_WEBSITE')}
            validate={[maxLength100, validateWebsiteURL]}
            error={errWebsite}
          />
          <LimitableInput
            multiLine
            singleLine={false}
            value={
              editProfileData.youtube && editProfileData.youtube.trimStart()
            }
            onChange={text => {
              setEditProfileData({...editProfileData, youtube: text});
              setErrYoutube(false);
            }}
            label={translate('common.youtube')}
            placeholder={translate('common.PLACEHOLDER_YOUTUBE')}
            validate={[maxLength100, validateYoutubeURL]}
            error={errYoutube}
          />
          <LimitableInput
            multiLine
            singleLine={false}
            value={
              editProfileData.discord && editProfileData.discord.trimStart()
            }
            onChange={text => {
              setEditProfileData({...editProfileData, discord: text});
              setErrDiscord(false);
            }}
            label={translate('common.discord')}
            placeholder={translate('common.PLACEHOLDER_DISCORD')}
            validate={[maxLength100, validateDiscordURL]}
            error={errDiscord}
          />
          <View style={styles.mainView}>
            <Text style={styles.label}>{translate('common.instagram')}</Text>
            <View style={styles.inputView}>
              <View style={styles.iconConatainer}>
                <InstagramIcon style={styles.InstagramIcon} />
              </View>
              <TextInput
                style={styles.instagramView}
                placeholderTextColor="grey"
                value={editProfileData.instagram}
                onChangeText={handleChangeInstagram}
                placeholder={translate('common.PLACEHOLDER_INSTAGRAM')}
              />
            </View>
            {errInstagram && (
              <Text style={styles.errorMsg}>{errInstagram}</Text>
            )}
          </View>
          <GroupButton
            style={styles.groupBtnView}
            onLeftPress={() => setIsVisible(true)}
            leftStyle={styles.groupBtnLeft}
            leftTextStyle={styles.groupLeftTitle}
            leftText={translate('common.ARTIST_LABEL')}
            rightHide
          />
          <SpaceView style={styles.spaceView} />
          <LimitableInput
            multiLine
            limit
            style={styles.limitableInput}
            value={editProfileData.about && editProfileData.about.trimStart()}
            onChange={text => {
              setEditProfileData({
                ...editProfileData,
                about: text.slice(0, 200),
              });
              setErrAbout(false);
            }}
            label={translate('common.bio')}
            placeholder={translate('common.PLACEHOLDER_DESCRIPTION')}
            validate={[maxLength200]}
            error={errAbout}
            maxLength={200}
            about={editProfileData.about}
          />
          <GroupButton
            leftDisabled={disable}
            onLeftPress={() => onSave()}
            style={styles.groupBtnView}
            leftStyle={styles.groupBtnLeft}
            leftTextStyle={styles.groupLeftTitle}
            leftText={translate('common.BTN_SAVE_CHANGE')}
            rightHide
          />
          {messageModal()}
          {renderArtistModal()}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </AppBackground>
  );
}

export default Profile;

const styles = StyleSheet.create({
  contentView: {
    flex: 1,
  },
  iconConatainer: {
    width: '7%',
    height: SIZE(40),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SIZE(10),
  },
  inputView: {
    borderColor: Colors.themeColor,
    borderWidth: SIZE(1),
    borderRadius: SIZE(7),
    height: SIZE(50),
    color: Colors.BLACK1,
    marginTop: SIZE(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  label: {
    fontSize: SIZE(16),
    fontWeight: '700',
    color: '#212529',
  },
  mainView: {
    flexDirection: 'column',
    width: '90%',
    marginLeft: SIZE(19),
    marginTop: SIZE(20),
  },
  verifyBtn: {
    paddingHorizontal: SIZE(15),
    height: SIZE(50),
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: SIZE(5),
    borderTopRightRadius: SIZE(5),
  },
  verifyBtnTitle: {
    color: '#FFFFFF',
    fontSize: SIZE(14),
    fontWeight: '700',
  },
  verifyBtnActive: {
    paddingHorizontal: SIZE(15),
    height: SIZE(50),
    backgroundColor: '#2280e1',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: SIZE(5),
    borderTopRightRadius: SIZE(5),
  },
  msgModalView: {
    height: SIZE(80),
    backgroundColor: 'white',
    paddingHorizontal: SIZE(40),
    marginBottom: SIZE(15),
    borderRadius: SIZE(5),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  msgModalText: {
    marginLeft: SIZE(10),
    textAlign: 'center',
    fontSize: SIZE(14),
    fontFamily: 'Arial',
    color: '#757575',
  },
  errorMsg: {
    fontSize: SIZE(14),
    fontFamily: 'Arial',
    color: COLORS.RED2,
  },
  instagramView: {
    width: '90%',
    includeFontPadding: false,
  },
  groupBtnView: {
    marginVertical: SIZE(10),
    marginTop: SIZE(30),
  },
  groupBtnLeft: {
    marginHorizontal: '5%',
    backgroundColor: '#0d6efd',
  },
  groupLeftTitle: {
    fontWeight: '600',
    fontSize: SIZE(14),
  },
  spaceView: {
    marginTop: SIZE(12),
  },
  limitableInput: {
    height: 230,
    textAlignVertical: 'top',
  },
  InstagramIcon: {
    width: SIZE(24),
    height: SIZE(24),
  },
  verifiedView: {
    marginLeft: SIZE(5),
    includeFontPadding: false,
    width: '75%',
  },
  msgModalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  msgModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  artistModalView: {
    paddingHorizontal: SIZE(54),
    paddingVertical: SIZE(30),
    backgroundColor: COLORS.WHITE1,
    alignItems: 'center',
    borderRadius: SIZE(7),
  },
  artistTitle: {
    textAlign: 'center',
    marginVertical: SIZE(15),
    fontSize: SIZE(24),
    fontWeight: '700',
  },
  artistDescription: {
    lineHeight: SIZE(17),
    fontSize: SIZE(14),
    fontFamily: 'Arial',
    textAlign: 'center',
    marginBottom: SIZE(12),
  },
  infoView: {
    flexDirection: 'row',
  },
  infoTitle: {
    lineHeight: SIZE(17),
    marginRight: 19,
    fontSize: SIZE(14),
    fontFamily: 'Arial',
    textAlign: 'center',
    marginBottom: SIZE(22),
    color: COLORS.themeColor,
  },
  artistGroupView: {
    width: '120%',
  },
  artistLeft: {
    backgroundColor: '#2280e1',
  },
  infoPPopUpView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuOption: {
    width: SIZE(140),
    marginLeft: SIZE(30),
    marginTop: SIZE(-25),
    backgroundColor: Colors.BLACK1,
  },
  infoIcon: {
    marginLeft: 5,
    alignSelf: 'center',
  },
});
