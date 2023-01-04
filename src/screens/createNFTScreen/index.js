import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { TabBar, TabView } from 'react-native-tab-view';
import { AppHeader, LoaderIndicator } from '../../components';
import { colors, fonts } from '../../res';
import styles from './styles';

import {
  responsiveFontSize as RF, widthPercentageToDP as wp
} from '../../common/responsiveFunction';
import { translate } from '../../walletUtils';

import { useSelector } from 'react-redux';
import Collection from './collection';
import CollectionList from './CollectionList';
import { TabModal } from './components';
import NFTList from './nftList';
import UploadNFT from './uploadNft';

const CreateNFTScreen = ({ route }) => {

  const routeParams = route.params;
  const isNonCrypto = useSelector(state => state.UserReducer?.userData?.isNonCrypto);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalItem, setModalItem] = useState(null);
  const [modalScreen, setModalScreen] = useState("");

  const [dateVisible, setDateVisible] = useState(false);
  const [miniDate, setMiniDate] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [nftListDefault, setnftListDefault] = useState(null);
  const [nftItem, setnftItem] = useState(null);
  const [collectionData, setCollectionData] = useState(null);

  const [index, setIndex] = useState(0);
  const routes = isNonCrypto === 0 ?
    [
      { key: 'CollectionList', title: translate("common.collectionList") },
      { key: 'CreateCollection', title: translate("common.createCollection") },
      { key: 'NFTList', title: translate("wallet.common.NFTList") },
      { key: 'UploadNFT', title: translate("common.CreateNFT") },
    ] :
    [
      { key: 'NFTList', title: translate("wallet.common.NFTList") },
      { key: 'UploadNFT', title: translate("wallet.common.uploadNFT") },
    ];
  const navigation = useNavigation();
  const ShowModalAction = (v, screenName) => {
    setModalItem(null)
    setDate("")
    setModalScreen(screenName)
    setModalData(v)
    setModalVisible(true);
    setnftListDefault(null)
  }
  const collection = routeParams?.data;

  const onViewCollection = () => {
    navigation.navigate('CollectionDetail', { collectionId: routeParams.data?._id, isBlind: false, isHotCollection: true, isSeries: false })
  }

  const _renderScene = ({ route, jumpTo, position }) => {
    switch (route.key) {
      case 'CollectionList':
        return <CollectionList
          modalItem={modalItem}
          modalScreen={modalScreen}
          switchEditNFT={(data) => {
            setCollectionData(data)
            setIndex(1)
          }}
          showModal={(v) => ShowModalAction(v, "collectionList")}
          position={index}
          nftListDefault={nftListDefault}
          changeLoadingState={(e) => setLoading(e)} />;
      case 'CreateCollection':
        return <Collection
          position={index}
          collectionData={collectionData}
          routeParams={routeParams}
          changeLoadingState={(e) => setLoading(e)}
        />;
      case 'NFTList':
        return <NFTList
          modalItem={modalItem}
          dropDowntitle={modalData}
          modalScreen={modalScreen}
          switchEditNFT={(data) => {
            setnftItem(data)
            setIndex(3)
          }}
          showModal={(v) => ShowModalAction(v, "nftList")}
          position={index}
          nftListDefault={nftListDefault}
          changeLoadingState={(e) => setLoading(e)} />;
      case 'UploadNFT':
        return <UploadNFT
          datePickerPress={(v) => {
            setMiniDate(v)
            setDate("")
            setModalScreen("uploadNFT")
            setDateVisible(true)
          }}
          datePickerData={date}
          modalItem={modalItem}
          modalScreen={modalScreen}
          showModal={(v) => ShowModalAction(v, "uploadNFT")}
          position={index}
          nftItem={nftItem}
          switchToNFTList={(v, collect) => {
            setnftListDefault({ name: v, collect: collect })
            setIndex(2)
          }}
          changeLoadingState={(e) => setLoading(e)} />;
      default:
        return null;
    }
  };

  const renderTabBar = (props) => {
    return (
      <TabBar
        {...props}
        renderLabel={({ route, focused, color }) => (
          <Text style={{
            color,
            fontSize: RF(1.4),
            textAlign: "center",
            fontFamily: fonts.ARIAL_BOLD,
            textTransform: 'none',
            marginHorizontal: 0
          }}>
            {route.title}
          </Text>
        )}
        tabStyle={{
          paddingHorizontal: wp('1.3%'),
        }}
        indicatorStyle={{ backgroundColor: colors.BLUE4 }}
        style={{
          boxShadow: 'none',
          elevation: 0,
          shadowOpacity: 0,
          backgroundColor: colors.GREY8,
        }}
        inactiveColor={colors.BLUE7}
        activeColor={colors.BLUE4}
      />
    )
  }

  let renderTitle = index == 0 ? translate("common.collectionList") :
    index == 1 ? translate("common.createCollection") :
      index == 2 ? translate("wallet.common.NFTList") : translate("common.CreateNFT");

  return (
    <View style={styles.mainContainer}>
      {loading ? <LoaderIndicator /> : null}
      <SafeAreaView style={styles.mainContainer}>
        <AppHeader
          title={renderTitle}
          showBackButton
          containerStyle={{ backgroundColor: colors.white }}
        />
        <View style={styles.sectionContainer}>
          <TabView
            renderTabBar={renderTabBar}
            navigationState={{ index, routes }}
            renderScene={_renderScene}
            onIndexChange={(i) => {
              setModalData(null);
              setModalItem(null);
              setnftListDefault(null)
              setnftItem(null)
              setCollectionData(null)
              setModalScreen("");
              setIndex(i);
            }}
          />

        </View>
        {
          modalData ?
            <TabModal
              modalProps={{
                isVisible: modalVisible,
                onBackdropPress: () => {
                  setModalItem("closed")
                  setModalVisible(false)
                }
              }}
              data={modalData}
              title={modalData.title}
              itemPress={(v) => {
                setModalItem(v)
                setModalVisible(false)
              }}
              renderItemName={modalData.hasOwnProperty("itemToRender") ? modalData.itemToRender : null}
            />
            : null
        }
        {dateVisible &&
          <DatePicker
            modal={modalScreen}
            open={dateVisible}
            date={miniDate}
            mode="datetime"
            minimumDate={miniDate}
            androidVariant={"iosClone"}
            onConfirm={date => {
              setDate(date)
              setDateVisible(false)
            }}
            onCancel={() => {
              setDate("closed")
              setDateVisible(false)
            }
            }
          />}
      </SafeAreaView>
    </View>
  );
};

export default CreateNFTScreen;
