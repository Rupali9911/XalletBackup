import React, { useState } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, Image } from 'react-native';
import styles from './styles';
import { images, colors, fonts } from '../../res';
import { AppHeader, LoaderIndicator } from '../../components';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
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

const Tab = createMaterialTopTabNavigator();

const CreateNFTScreen = ({ route, navigation }) => {

  const [loading, setLoading] = useState(false)

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

        <Tab.Navigator
          tabBarOptions={{
            activeTintColor: colors.BLUE4,
            inactiveTintColor: colors.BLUE7,
            style: {
              boxShadow: 'none',
              elevation: 0,
              shadowOpacity: 0,
              backgroundColor: colors.GREY8,
            },
            tabStyle: {
              height: hp('6%'),
              paddingHorizontal: wp('1%'),
              justifyContent: 'center',
            },
            labelStyle: {
              fontSize: RF(1.4),
              fontFamily: fonts.ARIAL_BOLD,
              textTransform: 'none',
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
        </Tab.Navigator>
      </View>

    </SafeAreaView>
  );
};

export default CreateNFTScreen;
