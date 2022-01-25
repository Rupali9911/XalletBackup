import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import AppBackground from '../../components/appBackground';
import { C_Image } from '../../components';
import { getHotCollectionDetail } from '../../store/actions/hotCollectionAction';
import { SIZE, widthPercentageToDP as wp, responsiveFontSize as RF } from '../../common/responsiveFunction';
import ImageSrc from '../../constants/Images';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Collections from './collections';
import { colors, fonts } from '../../res';

const Tab = createMaterialTopTabNavigator();

function CollectionDetail(props) {

  const { route } = props;
  const { collectionId } = route.params;
  const [collection, setCollection] = useState({});
  const [loading, setLoading] = useState(true);
  const [descTab, setDescTab] = useState(true);
  const [collectionType, setCollectionType] = useState(0);
  const [collectionAddress, setCollectionAddress] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    getCollection();
  }, []);

  const getCollection = async () => {
    const collectionArray = await getHotCollectionDetail(collectionId);
    setCollectionAddress(collectionArray.data.data[0].collectionAddress);
    setCollection(collectionArray.data.data[0]);
    setLoading(false);
  };

  return (
    <AppBackground isBusy={loading}>
      <ScrollView>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonWrap}>
          <Image style={styles.backIcon} source={ImageSrc.backArrow} />
        </TouchableOpacity>
        <C_Image
          uri={collection?.bannerImage}
          type={'jpg'}
          imageStyle={styles.bannerImage}
        />
        <View style={styles.bannerIconWrap}>
          <Image
            source={{ uri: collection?.iconImage }}
            style={styles.bannerIcon}
          />
        </View>

        <View>
          <Text style={styles.collectionName}>{collection?.collectionName}</Text>
          <View style={styles.collectionTable}>
            <View style={styles.collectionTableRow}>
              <Text style={styles.collectionTableRowText}>{collection?.nftCount}</Text>
              <Text style={styles.collectionTableRowDec}>items</Text>
            </View>
            <View style={styles.collectionTableRow}>
              <Text style={styles.collectionTableRowText}>{collection?.owners}</Text>
              <Text style={styles.collectionTableRowDec}>Owners</Text>
            </View>
            <View style={styles.collectionTableRow}>
              <View style={{ flexDirection: 'row' }}>
                <Image source={ImageSrc.etherium} style={styles.cryptoIcon} />
                <Text style={styles.collectionTableRowText}>{Number(collection?.floorPrice).toFixed(2)}</Text>
              </View>
              <Text style={styles.collectionTableRowDec}>Floor price</Text>
            </View>
            <View style={styles.collectionTableRow}>
              <View style={{ flexDirection: 'row' }}>
                <Image source={ImageSrc.etherium} style={styles.cryptoIcon} />
                <Text style={styles.collectionTableRowText}>{collection?.volTraded}</Text>
              </View>
              <Text style={styles.collectionTableRowDec}>Volume Traded</Text>
            </View>
          </View>
        </View>

        <View style={styles.descriptionTabWrapper}>
          <TouchableOpacity
            onPress={() => setDescTab(true)}
            style={[styles.descriptionTab, {
              borderColor: descTab ? '#eee' : 'transparent',
              borderBottomColor: descTab ? 'transparent' : '#eee',
            }]}
          >
            <Text style={styles.descriptionTabText}>Collection</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDescTab(false)}
            style={[styles.descriptionTab, {
              borderColor: !descTab ? '#eee' : 'transparent',
              borderBottomColor: !descTab ? 'transparent' : '#eee',
            }]}
          >
            <Text style={styles.descriptionTabText}>Creator</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.description}>
          <ScrollView>
            <Text style={styles.descriptionText}>
              {descTab ? collection?.collectionDesc : collection?.userInfo.description}
            </Text>
          </ScrollView>
        </View>

        <View style={{ flex: 1 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={() => setCollectionType(0)}
                style={[
                  styles.tabBarItem,
                  { borderTopColor: collectionType === 0 ? colors.BLUE4 : 'white' },
                ]}>
                <Text style={[
                  styles.tabBarLabel,
                  { color: collectionType === 0 ? colors.BLUE4 : colors.GREY1 },
                ]}>
                  On Sale
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCollectionType(1)}
                style={[
                  styles.tabBarItem,
                  { borderTopColor: collectionType === 1 ? colors.BLUE4 : 'white' },
                ]}>
                <Text style={[
                  styles.tabBarLabel,
                  { color: collectionType === 1 ? colors.BLUE4 : colors.GREY1 },
                ]}>
                  Not on sale
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCollectionType(2)}
                style={[
                  styles.tabBarItem,
                  { borderTopColor: collectionType === 2 ? colors.BLUE4 : 'white' },
                ]}>
                <Text style={[
                  styles.tabBarLabel,
                  { color: collectionType === 2 ? colors.BLUE4 : colors.GREY1 },
                ]}>
                  Owned
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCollectionType(3)}
                style={[
                  styles.tabBarItem,
                  { borderTopColor: collectionType === 3 ? colors.BLUE4 : 'white' },
                ]}>
                <Text style={[
                  styles.tabBarLabel,
                  { color: collectionType === 3 ? colors.BLUE4 : colors.GREY1 },
                ]}>
                  Gallery
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {collectionAddress && (
            <Collections
              collectionAddress={collectionAddress}
              collectionType={collectionType}
            />
          )}
        </View>
      </ScrollView>
    </AppBackground>
  )
};

export default CollectionDetail;