import _ from 'lodash';
import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  SafeAreaView,
  Keyboard,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
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
} from '../../store/reducer/userReducer';
import {hp} from '../../constants/responsiveFunct';
import {View} from 'native-base';
import Colors from '../../constants/Colors';
import {COLORS} from '../../constants';

const {
  TwitterIconNew,
  InstagramIcon,
  ArtistSvg,
  ArtistSvgI,
  SuccessIcon,
  ErrorIcon,
} = SVGS;

function Profile(props) {
  const {navigation, handleSubmit} = props;

  const {UserReducer} = useSelector(state => state);
  const isNonCrypto = useSelector(
    state => state.UserReducer?.userData?.user?.isNonCrypto,
  );

  const [username, setUsername] = useState(
    isNonCrypto === 0
      ? UserReducer.userData.title
      : UserReducer.userData.userName,
  );
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
  const [instagram, setInstagram] = useState(
    UserReducer.userData.instagramSite,
  );
  const [errInstagram, setErrInstagram] = useState(false);
  const [about, setAbout] = useState(UserReducer.userData.about);
  const [errAbout, setErrAbout] = useState(false);
  const [beforeTwitter, setBeforeTwitter] = useState(
    UserReducer.userData.twitterSite,
  );
  const [beforeEmail, setBeforeEmail] = useState(UserReducer.userData.email);
  const [isVisible, setIsVisible] = useState(false);
  const [msgModal, setMsgModal] = useState(false);
  const [msg, setMsg] = useState('');
  const [disable, setDisable] = useState(true);
  const [firstTime, setFirstTime] = useState(false);

  const dispatch = useDispatch();
  let id = UserReducer.userData.userWallet.address;

  const toastMsg = UserReducer.toastMsg;

  useEffect(() => {
    if (toastMsg) {
      renderMessageModal(toastMsg.msg);
    }
  }, [toastMsg]);

  useEffect(() => {
    if (
      username ||
      twitter ||
      email ||
      website ||
      youtube ||
      discord ||
      instagram ||
      about
    ) {
      if (firstTime) {
        setDisable(false);
      } else {
        setFirstTime(true);
      }
    }
  }, [username, twitter, email, website, youtube, discord, instagram, about]);

  const renderArtistModal = () => {
    return (
      <View style={{flex: 1}}>
        <Modal
          backdropColor="#000000"
          backdropOpacity={0.6}
          onBackdropPress={() => {
            setIsVisible(false);
          }}
          isVisible={isVisible}
          transparent={true}>
          <View
            style={{
              paddingHorizontal: SIZE(54),
              paddingVertical: SIZE(30),
              backgroundColor: COLORS.WHITE1,
              alignItems: 'center',
              borderRadius: SIZE(7),
            }}>
            <ArtistSvg />
            <Text
              style={{
                textAlign: 'center',
                marginVertical: SIZE(15),
                fontSize: SIZE(24),
                fontWeight: '700',
              }}>
              Become an Artist
            </Text>
            <Text
              style={{
                lineHeight: SIZE(17),
                fontSize: SIZE(14),
                fontFamily: 'Arial',
                textAlign: 'center',
                marginBottom: SIZE(12),
              }}>
              You are only a form away from becoming an Artist on Xanalia. After
              winning the Artist title, you will be given a rare Blue
              Verification Badge that is only available to verified Artists.
            </Text>
            <Text
              style={{
                lineHeight: SIZE(17),
                fontSize: SIZE(14),
                fontFamily: 'Arial',
                textAlign: 'center',
                marginBottom: SIZE(28),
              }}>
              All applications will go through several thorough screening rounds
              from Xanalia team to ensure the authencity of the Artist.
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text>
                <ArtistSvgI />
              </Text>
              <Text
                style={{
                  lineHeight: SIZE(17),
                  marginRight: 19,
                  fontSize: SIZE(14),
                  fontFamily: 'Arial',
                  textAlign: 'center',
                  marginBottom: SIZE(22),
                  color: COLORS.themeColor,
                }}>
                You must input a username, upload a profile picture, verify your
                email address and Twitter account first.
              </Text>
            </View>
            <GroupButton
              style={{width: '120%'}}
              onLeftPress={() => setIsVisible(false)}
              leftStyle={{backgroundColor: '#2280e1'}}
              leftTextStyle={{fontWeight: '600', fontSize: SIZE(14)}}
              leftText="OK"
              rightHide
            />
          </View>
        </Modal>
      </View>
    );
  };

  const messageModal = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Modal
          isVisible={msgModal}
          style={{justifyContent: 'flex-end', margin: 0}}>
          <View style={styles.msgModalView}>
            {toastMsg?.error ? (
              <ErrorIcon width={SIZE(20)} height={SIZE(20)} />
            ) : (
              <SuccessIcon width={SIZE(20)} height={SIZE(20)} />
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
    if (maxLength50(username)) {
      setErrUsername(maxLength50(username));
    } else {
      if (validateUserName(username)) {
        setErrUsername(validateUserName(username));
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

    const req_body =
      isNonCrypto === 0
        ? {
            description: '',
            discordSite: discord,
            email: email || undefined,
            instagramSite: instagram,
            twitterSite: twitter,
            title: username,
            website: website,
            youtubeSite: youtube,
            zoomMail: '',
          }
        : {
            description: '',
            discordSite: discord,
            email: email || undefined,
            instagramSite: instagram,
            twitterSite: twitter,
            userName: username,
            website: website,
            youtubeSite: youtube,
            zoomMail: '',
          };
    if (validateNum === 8) {
      dispatch(updateProfile(req_body, id));
      setBeforeTwitter(twitter);
      setBeforeEmail(email);
      dispatch(
        setToastMsg({
          error: false,
          msg: translate('common.USER_SUCCESSFUL_UPDATE'),
        }),
      );
      setDisable(true);
    }
  };

  const verifyEmailId = email => {
    dispatch(verifyEmail(email));
    dispatch(
      setToastMsg({error: false, msg: translate('common.LABEL_EMAIL_SUCCESS')}),
    );
  };

  return (
    <AppBackground isBusy={UserReducer.loading}>
      <SafeAreaView style={{flex: 1}}>
        <AppHeader
          title={translate('wallet.common.profileSettings')}
          showBackButton
        />

        <ScrollView onScroll={() => Keyboard.dismiss()}>
          <LimitableInput
            multiLine
            value={username && username.trimStart().replace(/\s\s+/g, ' ')}
            onChange={text => {
              setUsername(text);
              setErrUsername(false);
            }}
            label={translate('common.UserName')}
            placeholder={translate('common.PLACEHOLDER_USERNAME')}
            validate={[maxLength50, validateUserName]}
            editable={true}
            error={errUsername}
          />
          <View style={styles.mainView}>
            <Text style={styles.label}>{translate('common.twitter')}</Text>
            <View style={styles.inputView}>
              <View style={styles.iconConatainer}>
                <TwitterIconNew width={SIZE(24)} height={SIZE(24)} />
              </View>
              <TextInput
                style={{
                  padding: SIZE(12),
                  width:
                    UserReducer.userData.twitterVerified === 0 ? '55%' : '48%',
                }}
                placeholderTextColor="grey"
                value={twitter}
                onChangeText={text => {
                  setTwitter(text);
                  setErrTwitter(false);
                }}
                placeholder={translate('common.PLACEHOLDER_TWITTER')}
              />
              <TouchableOpacity
                disabled={
                  !UserReducer.userData.twitterVerified === 0 &&
                  twitter !== beforeTwitter
                }
                style={
                  UserReducer.userData.twitterVerified === 0 &&
                  twitter === beforeTwitter
                    ? styles.verifyBtnActive
                    : styles.verifyBtn
                }
                onPress={() => {
                  navigation.navigate('WebView');
                }}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: SIZE(14),
                    fontWeight: '700',
                  }}>
                  {UserReducer.userData.twitterVerified === 0
                    ? translate('common.BTN_TWITTER_REQUEST')
                    : translate('common.BTN_TWITTER_APPROVED')}
                </Text>
              </TouchableOpacity>
            </View>
            {errTwitter && (
              <Text
                style={{
                  fontSize: SIZE(14),
                  fontFamily: 'Arial',
                  color: COLORS.RED2,
                }}>
                {errTwitter}
              </Text>
            )}
          </View>
          {UserReducer?.userData?.isNonCrypto === 1 && (
            <LimitableInput
              multiLine
              value={email && email.trimStart()}
              onChange={text => {
                setEmail(text);
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
              <Text style={styles.label}>{translate('common.userEmail')}</Text>
              <View style={styles.inputView}>
                <TextInput
                  style={{
                    padding: SIZE(12),
                    maxWidth:
                      UserReducer.userData.emailVerified === 0 ? '50%' : '62%',
                  }}
                  placeholderTextColor="grey"
                  value={email}
                  onChangeText={text => {
                    setEmail(text);
                    setErrEmail(false);
                  }}
                  placeholder={translate('common.PLACEHOLDER_EMAIL')}
                />
                <TouchableOpacity
                  disabled={
                    !UserReducer.userData.emailVerified === 0 &&
                    email !== beforeEmail
                  }
                  style={
                    UserReducer.userData.emailVerified === 0 &&
                    email === beforeEmail
                      ? styles.verifyBtnActive
                      : styles.verifyBtn
                  }
                  onPress={() => {
                    verifyEmailId(email);
                  }}>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: SIZE(14),
                      fontWeight: '700',
                    }}>
                    {UserReducer.userData.emailVerified === 0
                      ? translate('common.BTN_EMAIL_REQUEST')
                      : translate('common.BTN_EMAIL_APPROVED')}
                  </Text>
                </TouchableOpacity>
              </View>
              {errEmail && (
                <Text
                  style={{
                    fontSize: SIZE(14),
                    fontFamily: 'Arial',
                    color: COLORS.RED2,
                  }}>
                  {errEmail}
                </Text>
              )}
            </View>
          )}
          <LimitableInput
            multiLine
            value={website && website.trimStart()}
            onChange={text => {
              setWebsite(text);
              setErrWebsite(false);
            }}
            label={translate('common.website')}
            placeholder={translate('common.PLACEHOLDER_WEBSITE')}
            validate={[maxLength100, validateWebsiteURL]}
            error={errWebsite}
          />
          <LimitableInput
            multiLine
            value={youtube && youtube.trimStart()}
            onChange={text => {
              setYoutube(text);
              setErrYoutube(false);
            }}
            label={translate('common.youtube')}
            placeholder={translate('common.PLACEHOLDER_YOUTUBE')}
            validate={[maxLength100, validateYoutubeURL]}
            error={errYoutube}
          />
          <LimitableInput
            multiLine
            value={discord && discord.trimStart()}
            onChange={text => {
              setDiscord(text);
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
                <InstagramIcon width={SIZE(24)} height={SIZE(24)} />
              </View>
              <TextInput
                style={{padding: SIZE(12), width: '90%'}}
                placeholderTextColor="grey"
                value={instagram}
                onChangeText={text => {
                  setInstagram(text);
                  setErrInstagram(false);
                }}
                placeholder={translate('common.PLACEHOLDER_INSTAGRAM')}
              />
            </View>
            {errInstagram && (
              <Text
                style={{
                  fontSize: SIZE(14),
                  fontFamily: 'Arial',
                  color: COLORS.RED2,
                }}>
                {errInstagram}
              </Text>
            )}
          </View>
          <GroupButton
            style={{marginVertical: SIZE(10), marginTop: SIZE(30)}}
            onLeftPress={() => setIsVisible(true)}
            leftStyle={{marginHorizontal: '5%', backgroundColor: '#0b5ed7'}}
            leftTextStyle={{fontWeight: '600', fontSize: SIZE(14)}}
            leftText={translate('common.ARTIST_LABEL')}
            rightHide
          />
          <SpaceView mTop={SIZE(12)} />
          <LimitableInput
            multiLine
            limit
            style={{height: 230}}
            value={about && about.trimStart()}
            onChange={text => {
              setAbout(text.slice(0, 200));
              setErrAbout(false);
            }}
            label={translate('common.bio')}
            placeholder={translate('common.PLACEHOLDER_DESCRIPTION')}
            validate={[maxLength200]}
            error={errAbout}
            maxLength={200}
            about={about}
          />
          <GroupButton
            leftDisabled={disable}
            onLeftPress={() => onSave()}
            style={{marginVertical: SIZE(10), marginTop: SIZE(30)}}
            leftStyle={{marginHorizontal: '5%', backgroundColor: '#0d6efd'}}
            leftTextStyle={{fontWeight: '600', fontSize: SIZE(14)}}
            leftText={translate('common.BTN_SAVE_CHANGE')}
            rightHide
          />
          {messageModal()}
          {renderArtistModal()}
        </ScrollView>
      </SafeAreaView>
    </AppBackground>
  );
}

export default Profile;

const styles = StyleSheet.create({
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
    height: SIZE(40),
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
    height: SIZE(38),
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: SIZE(8),
    borderTopRightRadius: SIZE(8),
  },
  verifyBtnActive: {
    paddingHorizontal: SIZE(15),
    height: SIZE(38),
    backgroundColor: '#2280e1',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: SIZE(8),
    borderTopRightRadius: SIZE(8),
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
});
