import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import styles from './styles';
import { colors, fonts } from '../../res';
import { AppHeader, LoaderIndicator } from '../../components';
import { TabView, TabBar } from 'react-native-tab-view';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation } from '@react-navigation/native';

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
import { useSelector } from 'react-redux';

const CreateNFTScreen = ({ route }) => {

  const routeParams = route.params;
  const userRole = useSelector(state => state.UserReducer?.data?.user?.role);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalItem, setModalItem] = useState(null);
  const [modalScreen, setModalScreen] = useState("");

  const [dateVisible, setDateVisible] = useState(false);
  const [miniDate, setMiniDate] = useState(new Date());
  const [date, setDate] = useState("");
  const [nftListDefault, setnftListDefault] = useState(null);
  const [nftItem, setnftItem] = useState(null);

  const [index, setIndex] = useState(0);
  const routes = userRole === 'crypto' ?
    [
      { key: 'Collection', title: translate("wallet.common.collection") },
      { key: 'NFTList', title: translate("wallet.common.NFTList") },
      { key: 'UploadNFT', title: translate("wallet.common.uploadNFT") },
      { key: 'Filter', title: translate("wallet.common.filter") },
    ] :
    [
      { key: 'NFTList', title: translate("wallet.common.NFTList") },
      { key: 'UploadNFT', title: translate("wallet.common.uploadNFT") },
      { key: 'Filter', title: translate("wallet.common.filter") },
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
    navigation.navigate('CollectionDetail', { collectionId: routeParams.data?._id })
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
          switchEditNFT={(data) => {
            setnftItem(data)
            setIndex(2)
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
            textAlign: "center",
            fontFamily: fonts.ARIAL_BOLD,
            textTransform: 'none',
            marginHorizontal: 0
          }}>
            {route.title}
          </Text>
        )}
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

  let renderTitle = index == 0 ? translate("wallet.common.collection") :
    index == 1 ? translate("wallet.common.NFTList") :
      index == 2 ? translate("wallet.common.uploadNFT") : translate("wallet.common.filter");

  return (
    <View style={styles.mainContainer}>
      {loading ? <LoaderIndicator /> : null}
      <SafeAreaView style={styles.mainContainer}>
        <AppHeader
          title={translate("common.CreateNFT")}
          showBackButton
          containerStyle={{ backgroundColor: colors.white }}
        />
        <View style={styles.sectionContainer}>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>{renderTitle}</Text>
            {routeParams?.status === 'created' &&
              <TouchableOpacity onPress={onViewCollection} style={styles.collectionButton}>
                <Text style={styles.collectionButtonLabel}>{translate('common.viewCollection')}</Text>
              </TouchableOpacity>
            }
          </View>
          <Text style={styles.titleDes}>{translate("common.createbut")} / {renderTitle}</Text>

          <TabView
            renderTabBar={renderTabBar}
            navigationState={{ index, routes }}
            renderScene={_renderScene}
            onIndexChange={(i) => {
              setModalData(null);
              setModalItem(null);
              setnftListDefault(null)
              setnftItem(null)
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
    </View>
  );
};

export default CreateNFTScreen;
