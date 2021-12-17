import React, { useState } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Image } from 'react-native';
import styles from './styles';
import { images, colors, fonts } from '../../res';
import { AppHeader, LoaderIndicator } from '../../components';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Colors from '../../constants/Colors';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
  responsiveFontSize as RF,
} from '../../common/responsiveFunction';
import CommonStyles from "../../constants/styles";
import { translate } from '../../walletUtils';

import Collection from './collection';
import Filter from './filter';
import NFTList from './nftList';
import UploadNFT from './uploadNft';

const CreateNFTScreen = ({ route, navigation }) => {

  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'Collection', title: "Collection" },
    { key: 'NFTList', title: "NFT List" },
    { key: 'UploadNFT', title: "Upload NFT" },
    { key: 'Filter', title: "Filter" },
  ]);

  const _renderScene = ({ route, jumpTo, position }) => {
    switch (route.key) {
      case 'Collection':
        return <Collection changeLoadingState={(e) => setLoading(e)} />;
      case 'NFTList':
        return <NFTList position={index} changeLoadingState={(e) => setLoading(e)} />;
      case 'UploadNFT':
        return <UploadNFT changeLoadingState={(e) => setLoading(e)} />;
      case 'Filter':
        return <Filter changeLoadingState={(e) => setLoading(e)} />;
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
          onIndexChange={index => setIndex(index)}
        />

        {/* <Tab.Navigator
         
            tabStyle: {
              
            },
            labelStyle: {
              
            },
            indicatorStyle: {
              borderBottomColor: colors.BLUE4,
              height: 1,
            },
          }}>
          <Tab.Screen name={'Collection'} initialParams={{ changeLoadingState: (e) => setLoading(e) }} component={Collection} />
          <Tab.Screen name={'NFT List'} initialParams={{ changeLoadingState: (e) => setLoading(e) }} component={NFTList} />
          <Tab.Screen name={'Upload NFT'} initialParams={{ changeLoadingState: (e) => setLoading(e) }} component={UploadNFT} />
          <Tab.Screen name={'Filter'} initialParams={{ changeLoadingState: (e) => setLoading(e) }} component={Filter} />
        </Tab.Navigator> */}
      </View>

    </SafeAreaView>
  );
};

export default CreateNFTScreen;
