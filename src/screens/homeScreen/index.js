import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, FlatList, AppState, Image, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import PushNotification from 'react-native-push-notification';
import { useDispatch, useSelector } from 'react-redux';
import { openSettings } from 'react-native-permissions';
import { responsiveFontSize as RF, heightPercentageToDP as hp, SIZE, widthPercentageToDP as wp } from '../../common/responsiveFunction';
import { C_Image, DetailModal, Loader, AppHeader } from '../../components';
import AppModal from '../../components/appModal';
import NotificationActionModal from '../../components/notificationActionModal';
import SuccessModal from '../../components/successModal';
import ImageSrc from '../../constants/Images';
import { colors, fonts } from '../../res';
import { changeScreenName } from '../../store/actions/authAction';
import { getAllArtist, getNFTList, nftListReset, nftLoadStart, pageChange } from '../../store/actions/nftTrendList';
import { updateCreateState } from '../../store/reducer/userReducer';
import { translate } from '../../walletUtils';
import AwardsNFT from './awards';
import Favorite from './favorite';
import NewNFT from './newNFT';
import styles from './styles';

const Tab = createMaterialTopTabNavigator();

const Hot = () => {
  const { ListReducer } = useSelector(state => state);
  const [modalData, setModalData] = useState();
  const [isModalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    dispatch(nftLoadStart());
    dispatch(nftListReset());
    getNFTlist(1);
    dispatch(pageChange(1));

  }, []);

  const getNFTlist = useCallback((page, limit) => {
    dispatch(getNFTList(page, limit));
  }, []);

  const refreshFunc = () => {
    dispatch(nftListReset());
    getNFTlist(1);
    dispatch(pageChange(1));
  };

  const renderFooter = () => {
    if (!ListReducer.nftListLoading) return null;
    return <ActivityIndicator size="small" color={colors.themeR} />;
  };

  const renderItem = ({ item }) => {
    let findIndex = ListReducer.nftList.findIndex(x => x.id === item.id);
    if (item.metaData) {
      let imageUri = item.thumbnailUrl !== undefined || item.thumbnailUrl ? item.thumbnailUrl : item.metaData.image;
      return (
        <TouchableOpacity
          onLongPress={() => {
            setModalData(item);
            setModalVisible(true);
          }}
          onPress={() => {
            dispatch(changeScreenName('Hot'));
            navigation.navigate('DetailItem', { index: findIndex });
          }}
          style={styles.listItem}>
          <C_Image
            type={item.metaData.image.split('.')[item.metaData.image.split('.').length - 1]}
            uri={imageUri}
            imageStyle={styles.listImage} />

        </TouchableOpacity>
      );
    }
  };

  const memoizedValue = useMemo(() => renderItem, [ListReducer.nftList]);

  return (
    <View style={styles.trendCont}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      {ListReducer.page === 1 && ListReducer.nftListLoading ? (
        <Loader />
      ) : ListReducer.nftList.length !== 0 ? (
        <FlatList
          data={ListReducer.nftList}
          horizontal={false}
          numColumns={3}
          initialNumToRender={15}
          onRefresh={() => {
            dispatch(nftLoadStart());
            refreshFunc();
          }}
          scrollEnabled={!isModalVisible}
          refreshing={ListReducer.page === 1 && ListReducer.nftListLoading}
          renderItem={memoizedValue}
          onEndReached={() => {
            if (
              !ListReducer.nftListLoading &&
              ListReducer.nftList.length !== ListReducer.totalCount
            ) {
              let num = ListReducer.page + 1;
              getNFTlist(num);
              dispatch(pageChange(num));
            }
          }}
          onEndReachedThreshold={0.4}
          keyExtractor={(v, i) => 'item_' + i}
          ListFooterComponent={renderFooter}
        />
      ) : (
        <View style={styles.sorryMessageCont}>
          <Text style={styles.sorryMessage}>{translate('common.noNFT')}</Text>
        </View>
      )}
      {modalData && (
        <DetailModal
          data={modalData}
          isModalVisible={isModalVisible}
          toggleModal={() => setModalVisible(false)}
        />
      )}
    </View>
  );
};


const HomeScreen = ({ navigation }) => {
  const { artistList, artistLoading } = useSelector(state => state.ListReducer);
  const { showSuccess } = useSelector(state => state.UserReducer);
  const {requestAppId} = useSelector(state => state.WalletReducer);
  const dispatch = useDispatch();
  const { passcode } = useSelector(state => state.AsyncReducer);

  const [modalVisible, setModalVisible] = useState(showSuccess);
  const [isSuccessVisible, setSuccessVisible] = useState(showSuccess);
  const [isNotificationVisible, setNotificationVisible] = useState(false);

  const appStateChange = (nextAppState) => {
    var pass = passcode;
    if (nextAppState === "active" && pass) {
      navigation.navigate("PasscodeScreen", { screen: "active" })
    }
  }

  useEffect(() => {
    AppState.addEventListener('change', appStateChange);
    // dispatch(getAllArtist());

    if(requestAppId){
      navigation.navigate("Connect", { appId: requestAppId });
    }

  }, [requestAppId]);

  const checkPermissions = async () => {
    PushNotification.checkPermissions(async ({ alert }) => {
      if (!alert) {
        setNotificationVisible(true);
      } else {
        setModalVisible(false);
      }
    });
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>

        <AppHeader
          title={translate("common.home")}
          showRightComponent={(
            <View style={styles.headerMenuContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Certificate')}
                hitSlop={{ top: 5, bottom: 5, left: 5 }}>
                <Image source={ImageSrc.scanIcon} style={styles.headerMenu} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Create')}
                hitSlop={{ top: 5, bottom: 5, left: 5 }}>
                <Image source={ImageSrc.addIcon} style={styles.headerMenu} />
              </TouchableOpacity>
            </View>
          )}
        />

        <View>
          {
            artistLoading ?
              <View style={{ width: "100%", height: hp("12%"), justifyContent: "center", alignItems: "center" }} >
                <ActivityIndicator size="small" color={colors.themeR} />
              </View> :
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {artistList &&
                  artistList.length !== 0 ?
                  artistList.map((item, index) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          const id = item.role === 'crypto' ? item.username : item._id;
                          navigation.navigate('ArtistDetail', { id: id });
                        }}
                        key={`_${index}`}>
                        <View style={styles.userCircle}>
                          <C_Image
                            uri={item.profile_image}
                            type={item.profile_image}
                            imageType="profile"
                            imageStyle={{ width: '100%', height: '100%' }}
                          />
                        </View>
                        <Text numberOfLines={1} style={styles.userText}>
                          {item.username}
                        </Text>
                      </TouchableOpacity>
                    );
                  }) : null
                }
              </ScrollView>
          }
        </View>
        {showSuccess ? null : (
          <Tab.Navigator
            tabBarOptions={{
              activeTintColor: colors.BLUE4,
              inactiveTintColor: colors.GREY1,
              style: {
                boxShadow: 'none',
                elevation: 0,
                borderTopColor: '#EFEFEF',
                borderTopWidth: 1,
                shadowOpacity: 0,
              },
              tabStyle: {
                height: SIZE(40),
                paddingHorizontal: wp('1%'),
                justifyContent: 'center',
              },
              labelStyle: {
                fontSize: RF(1.4),
                fontFamily: fonts.SegoeUIRegular,
                textTransform: 'capitalize',
              },
              indicatorStyle: {
                borderBottomColor: colors.BLUE4,
                height: 1,
                marginBottom: SIZE(39),
              },
            }}>
            <Tab.Screen name={'Awards 2021'} component={AwardsNFT} />
            <Tab.Screen
              name={translate('common.hot')}
              component={Hot}
            />
            <Tab.Screen
              name={translate('common.following')}
              component={NewNFT}
            />
            <Tab.Screen
              name={translate('common.Discover')}
              component={Favorite}
            />
          </Tab.Navigator>
        )}
      </SafeAreaView>
      <AppModal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        {isSuccessVisible ? (
          <SuccessModal
            onClose={() => setModalVisible(false)}
            onDonePress={() => {
              setSuccessVisible(false);
              checkPermissions();
              dispatch(updateCreateState());
            }}
          />
        ) : null}
        {isNotificationVisible ? (
          <NotificationActionModal
            onClose={() => setModalVisible(false)}
            onDonePress={() => {
              setModalVisible(false);
              openSettings();
            }}
          />
        ) : null}
      </AppModal>
    </>
  );
};

export default HomeScreen;
