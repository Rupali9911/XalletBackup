import React ,{useEffect}from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import _ from 'lodash';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
    RefreshControl
} from 'react-native';
import Hyperlink from 'react-native-hyperlink';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import { COLORS, FONT, FONTS, SIZE, SVGS } from 'src/constants';
import { Container, RowWrap, SpaceView } from 'src/styles/common.styles';
import { SmallBoldText, SmallNormalText } from 'src/styles/text.styles';
import {
  responsiveFontSize as RF,
  widthPercentageToDP as wp,
} from '../../common/responsiveFunction';
import { AppHeader, C_Image } from '../../components';
import { fonts } from '../../res';
import {languageArray, translate} from '../../walletUtils';
import {
  DescriptionView,
  EditButton,
  EditButtonText,
  SmallText,
  UserImageView,
  WebsiteLink,
} from './styled';
import Collection from "./collection";
import NFTCreated from './nftCreated';
import NFTOwned from './nftOwned';
import Draft from './draft';
import colors from "../../res/colors";
import {upateUserData,loadFromAsync} from "../../store/reducer/userReducer";
import {getAllLanguages, setAppLanguage} from "../../store/reducer/languageReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../../constants/Colors";

const { ConnectSmIcon, SettingIcon } = SVGS;

const Tab = createMaterialTopTabNavigator();

function Profile({ navigation, connector }) {

  const { UserReducer } = useSelector(state => state);
    const dispatch = useDispatch();

  const id = UserReducer?.wallet?.address || UserReducer?.data?.user?.username;
  const { about, title, links, username,role } = UserReducer?.data?.user;
    // useEffect(() => {
    //     // Update the document title using the browser API
    //     UserReducer.data.user.profile_image,
    //     UserReducer.data.user.about,
    //     UserReducer.data.user.title,
    //     UserReducer.data.user.links,
    //     UserReducer.data.user.username,
    //     UserReducer.data.user.role
    // });

  const renderTabView = () => {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: COLORS.BLUE2,
          tabBarInactiveTintColor: COLORS.BLACK5,
          tabBarStyle: {
            boxShadow: 'none',
            elevation: 0,
            borderBottomColor: '#EFEFEF',
            borderBottomWidth: 1,

          },
          tabBarItemStyle: {
            height: SIZE(42),
            marginTop: SIZE(-10),

          },
          tabBarLabelStyle: {
            fontSize: FONT(12),
            textTransform: 'none',
          },
          tabBarIndicatorStyle: {
            backgroundColor: COLORS.BLUE4,
            height: 2,
          }
        }}>
        <Tab.Screen
          name={translate('wallet.common.profileCreated')}
          component={NFTCreated}
          initialParams={{ id: id }}
        />
        <Tab.Screen
          name={translate('wallet.common.owned')}
          component={NFTOwned}
          initialParams={{ id: id }}
        />
       {role === 'crypto' && <Tab.Screen
          name={translate('wallet.common.collection')}
          component={Collection}
          initialParams={{ id: id }}
        />}
        {role === 'crypto' && <Tab.Screen
          name={translate('common.saveAsDraft')}
          component={Draft}
          initialParams={{ id: id }}
        />}
      </Tab.Navigator>
    );
  };

    const loadAllData = async () => {
        await AsyncStorage.getAllKeys((err, keys) => {
            if (keys.length !== 0) {
                AsyncStorage.multiGet(keys, (err, values) => {
                    let asyncData = {};
                    values.map(result => {
                        let name = result[0].replace(/[^a-zA-Z ]/g, '');
                        let value = JSON.parse(result[1]);
                        asyncData[name] = value;
                    });
                    dispatch(loadFromAsync(asyncData));
                });
                AsyncStorage.setItem("@asyncPassCalled", JSON.stringify(true));

            } else {
                dispatch(loadFromAsync());
                AsyncStorage.setItem("@asyncPassCalled", JSON.stringify(true));
            }
        });

    }
    const [refreshing, setRefreshing] = React.useState(false);
    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }
    const onRefresh = () => {
        setRefreshing(true);
        //console.log("######################updating data through Refresh control",loadAllData())

        wait(4000).then(() =>{ loadAllData(),setRefreshing(false)})

    }

  return (
    <Container>
        <ScrollView
            contentContainerStyle={styles.scrollView}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={Colors.themeColor}
                />
            }
        >
      <AppHeader
        title={translate('wallet.common.myPage')}
        showRightButton
        // showBackButton
        rightButtonComponent={
          <SettingIcon width={SIZE(23)} height={SIZE(23)} />
        }
        onPressRight={() =>
          navigation.navigate('Setting', { connector: connector })
        }
      />
      <View
        style={{
          width: '100%',
          paddingHorizontal: SIZE(14),
          flexDirection: 'row',
        }}>
        <UserImageView>
          <C_Image
            uri={UserReducer.data.user.profile_image}
            imageStyle={{
              width: '100%',
              height: '100%',
            }}
            imageType="profile"
          />
        </UserImageView>
        <View style={{
          flex: 1, justifyContent: "center",
          alignItems: "flex-end", paddingLeft: wp("4")
        }}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <View style={{ alignItems: 'center', width: wp("17") }}>
              <Text style={styles.countLabel1}>{'0'}</Text>
              <SmallText>{translate('wallet.common.post')}</SmallText>
            </View>
            <View style={{ alignItems: 'center', width: wp("17") }}>
              <Text style={styles.countLabel1}>{'0'}</Text>
              <SmallText>{translate('common.followers')}</SmallText>
            </View>
            <View style={{ alignItems: 'center', width: wp("17") }}>
              <Text style={styles.countLabel1}>{'0'}</Text>
              <SmallText>{translate('common.following')}</SmallText>
            </View>
          </View>
        </View>
      </View>
      <DescriptionView>
        <SpaceView mTop={SIZE(12)} />
        <SmallBoldText>{title || username}</SmallBoldText>
        <SpaceView mTop={SIZE(8)} />
        {!_.isEmpty(about) && (
          <ScrollView style={{ maxHeight: SIZE(70), padding: 5}}>
            <Hyperlink
              onPress={(url, text) => Linking.openURL(url)}
              linkStyle={{ color: COLORS.BLUE2 }}>
              <SmallNormalText>{about}</SmallNormalText>
            </Hyperlink>
          </ScrollView>
        )}
        <SpaceView mTop={SIZE(8)} />
        {links && !_.isEmpty(links.website) && (
          <TouchableOpacity
            onPress={() => {
              links.website.includes('://')
                ? Linking.openURL(links.website)
                : Linking.openURL(`https://${links.website}`);
            }}>
            <RowWrap>
              <ConnectSmIcon />
              <WebsiteLink>
                {links.website.includes('://')
                  ? links.website.split('/')[2]
                  : links.website}
              </WebsiteLink>
            </RowWrap>
          </TouchableOpacity>
        )}
      </DescriptionView>
      <SpaceView mTop={SIZE(14)} />
      <RowWrap>
        <SpaceView mLeft={SIZE(15)} />
        <EditButton onPress={() => navigation.navigate('EditProfile')}>
          <EditButtonText>{translate('wallet.common.edit')}</EditButtonText>
        </EditButton>
        <SpaceView mRight={SIZE(15)} />
      </RowWrap>
      <SpaceView mTop={SIZE(16)} />
      {renderTabView()}
        </ScrollView>
    </Container>
  );
}

export default Profile;

const styles = StyleSheet.create({
  listItem: {
    height: wp('100%') / 3 - wp('0.5%'),
    marginVertical: wp('0.3'),
    marginHorizontal: wp('0.3'),
    width: wp('100%') / 3 - wp('0.5%'),
  },
  listImage: {
    height: '100%',
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  sorryMessageCont: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sorryMessage: {
    fontSize: 15,
    fontFamily: fonts.SegoeUIRegular,
  },
  trendCont: {
    backgroundColor: 'white',
    flex: 1,
  },
  headerTitle: {
    fontSize: RF(2),
    fontFamily: fonts.PINGfANG_SBOLD,
    lineHeight: RF(2.1),
  },
  countLabel1: {
    fontSize: FONT(16),
    color: COLORS.BLACK1,
    fontFamily: FONTS.PINGfANG_SBOLD,
  },
    scrollView: {
        flex: 1,

    },
});
