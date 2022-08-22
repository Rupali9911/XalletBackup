import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect } from 'react';
import {
    FlatList,
    StatusBar,
    View,
    Text
} from 'react-native';
import {
    launchpadNftLoadStart,
    launchpadNftListReset,
    launchpadNftPageChange,
    launchpadNftLoadSuccess,
    getLaunchpadNftList
} from '../../store/actions/launchpadAction'
import { useDispatch, useSelector } from 'react-redux';
import { networkType } from "../../common/networkType";
import { colors } from '../../res';
import { Loader } from '../../components'
import styles from './styles';
import LaunchPadItemData from "../LaunchPadDetail/LaunchPadItemData";
import { translate } from '../../walletUtils';

const LaunchPad = () => {

    const dispatch = useDispatch();
    const navigation = useNavigation();

    // =============== Getting data from reducer ========================
    const { LaunchpadReducer } = useSelector(state => state);

    const isLoading = LaunchpadReducer.launchpadLoading
    const launchData = LaunchpadReducer.launchpadList
    const page = LaunchpadReducer.launchpadPage;
    const totalCount = LaunchpadReducer.launchpadTotalCount;

    const getLaunchpadNft = useCallback(
        (page, limit) => {
            dispatch(getLaunchpadNftList(page, limit))
        }, []
    )

    useEffect(() => {
        getLaunchpadNft(page, totalCount);
    }, [])

    //=================== Flatlist Functions ====================
    const handleFlatlistRefresh = () => {
        dispatch(launchpadNftLoadStart());
        handleRefresh();
    }

    const handleRefresh = () => {
        dispatch(launchpadNftListReset());
        getLaunchpadNft(page, totalCount);
        dispatch(launchpadNftPageChange(1));
    };

    // ===================== Render No NFT Function ===================================
    const renderNoNFT = () => {
        return (
            <View style={styles.sorryMessageCont}>
                <Text style={styles.sorryMessage}>{translate('common.noNFT')}</Text>
            </View>
        )
    }

    //=====================(Render Flatlist Item Function)=============================
    const renderItem = ({ item }) => {
        return (
            <LaunchPadItemData
                bannerImage={item.bannerImage}
                chainType={item.chainType || 'polygon'}
                items={item.items}
                iconImage={item.iconImage}
                collectionName={item.name}
                creator={item.owner.name}
                network={item.networks}
                count={item.totalNft}
                status={item.status}
                creatorInfo={item.owner.description}
                blind={item.blind}
                collectionId={item._id}
                disabled={(networkType === "testnet" || item.status === "comingSoon") ? true : false}
                onPress={() => {
                    navigation.push('CertificateDetail', { item: item });
                }}
            />
        );
    };

    //=====================(Main return Function)=============================
    return (
        <View style={styles.trendCont}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor={colors.white}
            />

            {isLoading ?
                <Loader />
                : launchData.length ?
                    <FlatList
                        data={launchData}
                        horizontal={false}
                        numColumns={2}
                        renderItem={launchData.length !== 0 ? renderItem : renderNoNFT()}
                        keyExtractor={(v, i) => 'item_' + i}
                        pagingEnabled={false}
                        legacyImplementation={false}
                        onRefresh={handleFlatlistRefresh}
                        refreshing={
                            LaunchpadReducer.launchpadPage === 1 &&
                            LaunchpadReducer.launchpadLoading
                        }
                    />
                    : renderNoNFT()}
        </View >
    );
};

export default React.memo(LaunchPad);
