import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {FlatList, StatusBar, Text, View} from 'react-native';
import {colors} from '../../res';
import CollectionItem from '../../components/CollectionItem';
import {translate} from '../../walletUtils';
import styles from './styles';
import {getCollectionData} from './launchpadJson';

const CollectionTap = props => {
  const navigation = useNavigation();

  //================== Components State Declaration ===================
  const [collectionList, setCollectionList] = useState([]);

  //===================== UseEffect Function =========================
  useEffect(() => {
    let temp = getCollectionData(props?.collectionName);
    setCollectionList(temp);
  }, []);

  // ===================== Render Hot Collectio NFT Flatlist ===================================
  const renderHotCollectioNFTList = () => {
    return (
      <FlatList
        data={collectionList}
        horizontal={false}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        legacyImplementation={false}
        nestedScrollEnabled={true}
        />
    );
  };

  // ===================== Render No NFT Function ===================================
  const renderNoNFT = () => {
    return (
      <View style={styles.sorryMessageCont}>
        <Text style={styles.sorryMessage}>
          {translate('common.noDataFound')}
        </Text>
      </View>
    );
  };

  //=================== Flatlist Functions ====================
  const keyExtractor = (item, index) => {
    return 'item_' + index;
  };

  const renderItem = ({item}) => {
    return (
      <CollectionItem
        bannerImage={item.bannerImage}
        creator={item.owner}
        chainType={item.chainType}
        items={item.items}
        iconImage={item.iconImage}
        collectionName={item.name}
        creatorInfo={item.creatorInfo}
        blind={item.blind}
        isHotCollection={item.isHot}
        count={item.totalNft}
        verified={item.isOfficial}
        network={item.network}
        collectionTab={true}
        colId={item._id}
        onPress={() => {
          navigation.push('CollectionDetail', {
            networkName: item?.network?.networkName,
            contractAddress: item?.contractAddress,
            launchpadId: null,
          });
        }}
      />
    );
  };

  return (
    <View style={styles.trendCont}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      {collectionList !== 0 ? renderHotCollectioNFTList() : renderNoNFT()}
    </View>
  );
};

export default React.memo(CollectionTap);
