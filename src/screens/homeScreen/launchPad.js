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
                item.status !==  "comingSoon" ? navigation.push('CollectionDetail', {
                        isBlind: item.isBlind,
                        collectionId: item._id,
                        isHotCollection: item.isHotCollection
                    }): null;
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
