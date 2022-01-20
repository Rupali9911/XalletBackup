import React, { useState } from 'react';
import { View, SafeAreaView, Text } from 'react-native';
import styles from './styles';
import { colors, fonts } from '../../res';
import { AppHeader, LoaderIndicator } from '../../components';
import { TabView, TabBar } from 'react-native-tab-view';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
  responsiveFontSize as RF,
} from '../../common/responsiveFunction';
import { translate } from '../../walletUtils';

import Collection from './collection';
import Filter from './filter';
import NFTList from './nftList';
import UploadNFT from './uploadNft';
import { TabModal } from './components';

const CreateNFTScreen = ({ route }) => {

  const routeParams = route.params;

  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalItem, setModalItem] = useState(null);
  const [modalScreen, setModalScreen] = useState("");

  const [dateVisible, setDateVisible] = useState(false);
  const [miniDate, setMiniDate] = useState(new Date());
  const [date, setDate] = useState("");
  const [nftListDefault, setnftListDefault] = useState(null);

  const [index, setIndex] = useState(0);
  const routes = [
    { key: 'Collection', title: "Collection" },
    { key: 'NFTList', title: "NFT List" },
    { key: 'UploadNFT', title: "Upload NFT" },
    { key: 'Filter', title: "Filter" },
  ];

  const ShowModalAction = (v, screenName) => {
    setModalItem(null)
    setDate("")
    setModalScreen(screenName)
    setModalData(v)
    setModalVisible(true);
    setnftListDefault(null)
  }

  const _renderScene = ({ route, jumpTo, position }) => {
    switch (route.key) {
      case 'Collection':
        return <Collection
          position={index}
          routeParams={routeParams}
          changeLoadingState={(e) => setLoading(e)}
        />;
      case 'NFTList':
        return <NFTList
          modalItem={modalItem}
          modalScreen={modalScreen}
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
          switchToNFTList={(v, collect) => {
            setnftListDefault({ name: v, collect: collect })
            setIndex(1)
          }}
          changeLoadingState={(e) => setLoading(e)} />;
      case 'Filter':
        return <Filter
          modalItem={modalItem}
          modalScreen={modalScreen}
          showModal={(v) => ShowModalAction(v, "filter")}
          position={index}
          changeLoadingState={(e) => setLoading(e)}
        />;
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
            fontFamily: fonts.ARIAL_BOLD,
            textTransform: 'none',
            marginHorizontal: 0
          }}>
            {route.title}
          </Text>
        )}
        contentContainerStyle={{ height: hp(6) }}
        tabStyle={{ paddingHorizontal: 0 }}
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

  return (
    <SafeAreaView style={styles.mainContainer}>
      {
        loading && <LoaderIndicator />
      }
      <AppHeader
        title={'Create NFT'}
        showBackButton
        containerStyle={{ backgroundColor: colors.white }}
      />
      <View style={styles.sectionContainer}>
        <Text style={styles.title}>Collection</Text>
        <Text style={styles.titleDes}>Create / Collection</Text>

        <TabView
          renderTabBar={renderTabBar}
          navigationState={{ index, routes }}
          renderScene={_renderScene}
          onIndexChange={(i) => {
            setModalData(null);
            setModalItem(null);
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
            data={modalData.data}
            title={modalData.title}
            itemPress={(v) => {
              setModalItem(v)
              setModalVisible(false)
            }}
            renderItemName={modalData.hasOwnProperty("itemToRender") ? modalData.itemToRender : null}
          />
          : null
      }
      <DateTimePickerModal
        isVisible={dateVisible}
        mode="datetime"
        minimumDate={miniDate}
        onConfirm={date => {
          setDate(date)
          setDateVisible(false)
        }}
        onCancel={() => {
          setDate("closed")
          setDateVisible(false)
        }
        }
      />

    </SafeAreaView>
  );
};

export default CreateNFTScreen;
