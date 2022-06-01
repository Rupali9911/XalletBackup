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
                onPress={() => {
                    console.log('LaunchPad ========', item);

                    //navigation.push('CollectionDetail', { isBlind: true, collectionId: item._id, isHotCollection: false });

                    item.collectionName === 'NFTART AWARD 2021' ? Linking.openURL('https://testnet.xanalia.com/xanalia_nftart_award_2021') : navigation.push('CollectionDetail', {
                        isBlind: true,
                        collectionId: item._id,
                        isHotCollection: false
                    });

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

        </View>
    );
};

export default LaunchPad;
