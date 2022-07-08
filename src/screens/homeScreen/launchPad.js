import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
    FlatList,
    StatusBar,
    View,
} from 'react-native';
import { networkType } from "../../common/networkType";
import { colors } from '../../res';
import styles from './styles';
import LaunchPadItemData from "../LaunchPadDetail/LaunchPadItemData";
import { launchpadData } from "../LaunchPadDetail/launchpadData";
const LaunchPad = () => {
    const navigation = useNavigation();
    const renderItem = ({ item }) => {
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
                collectionId={item._id}
                disabled={(networkType === "testnet" || item.status === "comingSoon") ? true : false}
                onPress={() => {
                    console.log('========Launch tab =>', item);
                    if (item.status !== "comingSoon") {
                        if (item.blind) {
                            console.log('========Launch tab => blind1 75', { isBlind: true, collectionId: item._id, isHotCollection: false })
                            navigation.push('CollectionDetail', { isBlind: true, collectionId: item._id, isHotCollection: false });
                        } else {
                            console.log("========Launch tab => ~ line 79", { isBlind: false, collectionId: item._id, isHotCollection: true })
                            navigation.push('CollectionDetail', { isBlind: false, collectionId: item._id, isHotCollection: true });
                        }
                    }
                }}
            />
        );
    };
    return (
        <View style={styles.trendCont}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor={colors.white}
            />
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

export default React.memo(LaunchPad);
