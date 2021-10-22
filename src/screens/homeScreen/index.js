import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  responsiveFontSize as RF,
  SIZE,
  widthPercentageToDP as wp,
} from '../../common/responsiveFunction';
import {C_Image, DetailModal, Loader} from '../../components';
import AppModal from '../../components/appModal';
import NotificationActionModal from '../../components/notificationActionModal';
import SuccessModal from '../../components/successModal';
import ImageSrc from '../../constants/Images';
import {colors, fonts} from '../../res';
import {changeScreenName} from '../../store/actions/authAction';
import {
  getAllArtist,
  getNFTList,
  nftListReset,
  nftLoadStart,
  pageChange,
} from '../../store/actions/nftTrendList';
import {updateCreateState} from '../../store/reducer/userReducer';
import getLanguage from '../../utils/languageSupport';
import {translate, setI18nConfig} from '../../walletUtils';
import AwardsNFT from './awards';
import Favorite from './favorite';
import NewNFT from './newNFT';
import styles from './styles';

const langObj = getLanguage();

const Tab = createMaterialTopTabNavigator();

const Hot = () => {
  const {ListReducer} = useSelector(state => state);
  const [modalData, setModalData] = useState();
  const [isModalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { selectedLanguageItem } = useSelector(state => state.LanguageReducer);

  useEffect(() => {
    dispatch(nftLoadStart());
    dispatch(nftListReset());
    getNFTlist(1);
    dispatch(pageChange(1));

    setI18nConfig(selectedLanguageItem.language_name);
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

  const renderItem = ({item}) => {
    let findIndex = ListReducer.nftList.findIndex(x => x.id === item.id);
    if (item.metaData) {
      return (
        <TouchableOpacity
          onLongPress={() => {
            setModalData(item);
            setModalVisible(true);
          }}
          onPress={() => {
            dispatch(changeScreenName('Hot'));
            navigation.navigate('DetailItem', {index: findIndex});
          }}
          style={styles.listItem}>
          {item.thumbnailUrl !== undefined || item.thumbnailUrl ? (
            <C_Image
              type={
                item.metaData.image.split('.')[
                  item.metaData.image.split('.').length - 1
                ]
              }
              uri={item.thumbnailUrl}
              imageStyle={styles.listImage}
            />
          ) : (
            <View style={styles.sorryMessageCont}>
              <Text style={{textAlign: 'center'}}>No Image to Show</Text>
            </View>
          )}
        </TouchableOpacity>
      );
    }
  };

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
          renderItem={renderItem}
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

const HomeScreen = ({navigation}) => {
  const {ListReducer} = useSelector(state => state);
  const {wallet, isCreate} = useSelector(state => state.UserReducer);
  const dispatch = useDispatch();

  const [modalVisible, setModalVisible] = useState(isCreate);
  const [isSuccessVisible, setSuccessVisible] = useState(isCreate);
  const [isNotificationVisible, setNotificationVisible] = useState(false);

  useEffect(() => {
    dispatch(getAllArtist());
  }, []);

  const openPhoneSettings = () => {
      Linking.openSettings();
  };
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={styles.header}>
          <View style={styles.headerMenuContainer}></View>
          <Text style={styles.headerTitle}>{translate('common.home')}</Text>
          <View style={styles.headerMenuContainer}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Certificate');
              }}
              hitSlop={{top: 5, right: 5, bottom: 5, left: 5}}>
              <Image source={ImageSrc.scanIcon} style={styles.headerMenu} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Create');
              }}
              hitSlop={{top: 5, right: 5, bottom: 5, left: 5}}>
              <Image source={ImageSrc.addIcon} style={styles.headerMenu} />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {ListReducer.artistList &&
              ListReducer.artistList.map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('ArtistDetail', {data: item})
                    }
                    key={`_${index}`}>
                    <View style={styles.userCircle}>
                      <C_Image
                        uri={item.profile_image}
                        type={item.profile_image}
                        imageStyle={{width: '100%', height: '100%'}}
                      />
                    </View>
                    <Text numberOfLines={1} style={styles.userText}>
                      {item.username}
                    </Text>
                  </TouchableOpacity>
                );
              })}
          </ScrollView>
        </View>
        {isCreate ? null : (
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
              name={langObj.common.hot}
              component={Hot}
              options={{tabBarLabel: translate('common.hot')}}
            />
            <Tab.Screen
              name={langObj.common.following}
              component={NewNFT}
              options={{tabBarLabel: translate('common.following')}}
            />
            <Tab.Screen
              name={langObj.common.Discover}
              component={Favorite}
              options={{tabBarLabel: translate('common.Discover')}}
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
              setNotificationVisible(true);
              dispatch(updateCreateState());
            }}
          />
        ) : null}
        {isNotificationVisible ? (
          <NotificationActionModal
            onClose={() => setModalVisible(false)}
            onDonePress={() => {
              setModalVisible(false);
              openPhoneSettings();
            }}
          />
        ) : null}
      </AppModal>
    </>
  );
};

export default HomeScreen;
