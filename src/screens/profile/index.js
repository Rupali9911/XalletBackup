import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import _, { toFinite } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Hyperlink from 'react-native-hyperlink';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS, FONT, FONTS, SIZE, SVGS } from 'src/constants';
import { Container, RowWrap, SpaceView } from 'src/styles/common.styles';
import { SmallBoldText, SmallNormalText } from 'src/styles/text.styles';
import {
  responsiveFontSize as RF,
  widthPercentageToDP as wp,
} from '../../common/responsiveFunction';
import { AppHeader, C_Image, DetailModal, Loader } from '../../components';
import NFTItem from '../../components/NFTItem';
import { colors, fonts } from '../../res';
import { changeScreenName } from '../../store/actions/authAction';
import {
  myCollectionList,
  myCollectionListReset,
  myCollectionLoadStart,
  myCollectionPageChange,
} from '../../store/actions/myCollection';
import {
  myNFTList,
  myNftListReset,
  myNftLoadStart,
  myPageChange,
} from '../../store/actions/myNFTaction';
import { translate } from '../../walletUtils';
import {
  DescriptionView,
  EditButton,
  EditButtonText,
  SmallText,
  UserImageView,
  WebsiteLink,
} from './styled';
import Collection from "./collection";
import NFT from "./nft";

import { CardButton } from "../createNFTScreen/components";
import { BASE_URL } from '../../common/constants';
import { networkType } from '../../common/networkType';
import { alertWithSingleBtn } from '../../utils';
import axios from 'axios';

const { ConnectSmIcon, SettingIcon } = SVGS;

const Tab = createMaterialTopTabNavigator();

function Profile({ navigation, connector }) {
  const isFocusedHistory = useIsFocused();
  const dispatch = useDispatch();

  const { UserReducer } = useSelector(state => state);

  const id = UserReducer.wallet.address || UserReducer.data.user.username;
  const { about, title, firstName, lastName, links, username, name } =
    UserReducer.data.user;

  const renderTabView = () => {
    return (
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: COLORS.BLUE2,
          inactiveTintColor: COLORS.BLACK5,
          style: {
            boxShadow: 'none',
            elevation: 0,
            borderBottomColor: '#EFEFEF',
            borderBottomWidth: 1,
          },
          tabStyle: {
            height: SIZE(42),
            marginTop: SIZE(-10),
          },
          labelStyle: {
            fontSize: FONT(12),
            textTransform: 'none',
          },
          indicatorStyle: {
            backgroundColor: COLORS.BLUE4,
            height: 2,
          },
        }}>
        <Tab.Screen
          name="My NFTs"
          options={{ tabBarLabel: translate('wallet.common.myNFTs') }}
          component={NFT}
          initialParams={{ id: id }}
        />
        <Tab.Screen
          name="My Collection"
          options={{ tabBarLabel: translate('common.myCollection') }}
          component={Collection}
          initialParams={{ id: id }}
        />
      </Tab.Navigator>
    );
  };

  return (
    <Container>
      <AppHeader
        title={translate('wallet.common.myPage')}
        showRightButton
        showBackButton
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
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <View
            style={{
              flexDirection: 'row',
              width: wp('50'),
              justifyContent: 'space-around',
            }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.countLabel1}>{'0'}</Text>
              <SmallText>{translate('wallet.common.post')}</SmallText>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.countLabel1}>{'0'}</Text>
              <SmallText>{translate('common.followers')}</SmallText>
            </View>
            <View style={{ alignItems: 'center' }}>
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
          <ScrollView style={{ maxHeight: SIZE(70) }}>
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
});
