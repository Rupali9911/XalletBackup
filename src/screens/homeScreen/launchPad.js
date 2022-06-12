import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
    ActivityIndicator,
    FlatList,
    StatusBar,
    Text,
    View,
    TouchableOpacity,
    Linking
} from 'react-native';
import {networkType} from "../../common/networkType";
import {colors} from '../../res';

import styles from './styles';
import LaunchPadItemData from "../LaunchPadDetail/LaunchPadItemData";
import {launchpadData} from "../LaunchPadDetail/launchpadData";


const LaunchPad = () => {
    const navigation = useNavigation();
    const renderItem = ({item}) => {
      return (
            <LaunchPadItemData
                bannerImage={item.bannerImage}
                chainType={item.chainType || 'polygon'}
                items={item.items}
                iconImage={item.iconImage}
                collectionName={item.collectionName}
                creator={item.creator}
                status={item.status}
                creatorInfo={item.creatorInfo}
                blind={item.blind}
                disabled={(networkType === "testnet" || item.status ===  "comingSoon") ? true : false}
                onPress={() => {
                    console.log('LaunchPad ========', item);
//<<<<<<< HEAD

           //         item.collectionName === 'NFTART AWARD 2021' ? Linking.openURL('https://testnet.xanalia.com/xanalia_nftart_award_2021') : navigation.push('CollectionDetail', {
// =======
                  item.collectionName === 'NFTART AWARD 2021' ? Linking.openURL('https://www.xanalia.com/xanalia_nftart_award_2021') : item.status !==  "comingSoon" ? navigation.push('CollectionDetail', {
// >>>>>>> ce88bf819e0785f28bfcaf86baf49f7f4ff833c4
                        isBlind: true,
                        collectionId: item._id,
                        isHotCollection: false
                    }):null
                //: null;
                    //navigation.push('CollectionDetail', { isBlind: true, collectionId: item._id, isHotCollection: false });

                    //   if (item.redirect) {
                    //   navigation.push('CollectionDetail',
                    //   {
                    //     isBlind: false,
                    //     collectionId: item._id,
                    //     isHotCollection: true,
                    //     isStore: item.redirect,
                    //   });
                    // } else if (item.blind) {
                    //   console.log('LaunchPad ========collection tab => blind1', item.blind, item.collectionId)
                    //   navigation.push('CollectionDetail', { isBlind: true, collectionId: item.collectionId, isHotCollection: false });
                    // } else {
                    //   navigation.push('CollectionDetail', { isBlind: false, collectionId: item._id, isHotCollection: true });
                    // }

                }}
            />
        );
    };
    return (
// <<<<<<< HEAD
// // <<<<<<< HEAD
// =======
// >>>>>>> ce88bf819e0785f28bfcaf86baf49f7f4ff833c4
        <View style={styles.trendCont}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.white}/>
            <FlatList
                data={launchpadData}
                horizontal={false}
                numColumns={2}
                renderItem={renderItem}
                keyExtractor={(v, i) => 'item_' + i}
                pagingEnabled={false}
                legacyImplementation={false}
            />
{/*=======*/}
{/*      <LaunchPadItemData*/}
{/*        bannerImage={item.bannerImage}*/}
{/*        chainType={item.chainType || 'polygon'}*/}
{/*        items={item.items}*/}
{/*        iconImage={item.iconImage}*/}
{/*        collectionName={item.collectionName}*/}
{/*        creator={item.creator}*/}
{/*        status={item.status}*/}
{/*        creatorInfo={item.creatorInfo}*/}
{/*        blind={item.blind}x*/}
{/*        onPress={() => {*/}
{/*          console.log('LaunchPad ========', item);*/}
{/*          if(item.status && item.status !== 'comingSoon'){*/}
{/*            navigation.push('CollectionDetail', { isBlind: true, collectionId: item._id, isHotCollection: false });*/}
{/*          }*/}

{/*>>>>>>> e1d15eed61ad117c53f8ba8c34986887501ac7b6*/}



        </View>
    );
};

export default LaunchPad;
