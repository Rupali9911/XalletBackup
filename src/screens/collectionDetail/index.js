import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import AppBackground from '../../components/appBackground';
import {C_Image} from '../../components';
import {getHotCollectionDetail} from '../../store/actions/hotCollectionAction';
import ImageSrc from '../../constants/Images';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Collections from './collections';
import {colors, fonts} from '../../res';
import {translate} from '../../walletUtils';
import {useSelector} from 'react-redux';
import {SVGS} from 'src/constants';

const Tab = createMaterialTopTabNavigator();
const {TwiiterIcon, FacebookIcon, InstagramIcon} = SVGS;

function CollectionDetail(props) {
  const {route} = props;
  const {collectionId} = route.params;
  const [collection, setCollection] = useState({});
  const [loading, setLoading] = useState(true);
  const [descTab, setDescTab] = useState(true);
  const [collectionType, setCollectionType] = useState(0);
  const [collectionAddress, setCollectionAddress] = useState(null);
  const navigation = useNavigation();
  const {selectedLanguageItem} = useSelector(state => state.LanguageReducer);

  useEffect(() => {
    getCollection();
  }, []);

  const getCollection = async () => {
    try {
      const collectionArray = await getHotCollectionDetail(collectionId);
      setCollectionAddress(collectionArray?.data.data[0].collectionAddress);
      setCollection(collectionArray?.data.data[0]);
      setLoading(false);
    } catch (err) {
      console.error(err.message);
      setLoading(false);
    }
  };

  return (
    <AppBackground isBusy={loading}>
      <ScrollView>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButtonWrap}>
          <Image style={styles.backIcon} source={ImageSrc.backArrow} />
        </TouchableOpacity>
        <C_Image
          uri={collection?.bannerImage}
          type={'jpg'}
          imageStyle={styles.bannerImage}
        />
        <View
          style={{
            alignItems: 'center',
            marginRight: 10,
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            zIndex: 2,
          }}>
          {collection?.userInfo?.links?.twitter ? (
            <TouchableOpacity
              style={{marginRight: 10}}
              onPress={() =>
                Linking.openURL(collection?.userInfo?.links?.twitter)
              }>
              <TwiiterIcon />
            </TouchableOpacity>
          ) : null}
          {collection?.userInfo?.links?.instagram ? (
            <TouchableOpacity
              style={{marginRight: 6}}
              onPress={() =>
                Linking.openURL(collection?.userInfo?.links?.instagram)
              }>
              <InstagramIcon />
            </TouchableOpacity>
          ) : null}
          {collection?.userInfo?.links?.facebook ? (
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(collection?.userInfo?.links?.facebook)
              }>
              <FacebookIcon />
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={styles.bannerIconWrap}>
          <Image
            source={{uri: collection?.iconImage}}
            style={styles.bannerIcon}
          />
        </View>

        <View>
          <Text style={styles.collectionName}>
            {collection?.collectionName}
          </Text>
          <View style={styles.collectionTable}>
            <View style={styles.collectionTableRow}>
              <Text style={styles.collectionTableRowText}>
                {collection?.nftCount}
              </Text>
              <Text style={styles.collectionTableRowDec}>
                {translate('common.itemsCollection')}
              </Text>
            </View>
            <View style={styles.collectionTableRow}>
              <Text style={styles.collectionTableRowText}>
                {collection?.owners}
              </Text>
              <Text style={styles.collectionTableRowDec}>
                {translate('common.owners')}
              </Text>
            </View>
            <View style={styles.collectionTableRow}>
              <View style={{flexDirection: 'row'}}>
                <Image source={ImageSrc.etherium} style={styles.cryptoIcon} />
                <Text style={styles.collectionTableRowText}>
                  {Number(collection?.floorPrice).toFixed(2)}
                </Text>
              </View>
              <Text style={styles.collectionTableRowDec}>
                {translate('common.floorPrice')}
              </Text>
            </View>
            <View style={styles.collectionTableRow}>
              <View style={{flexDirection: 'row'}}>
                <Image source={ImageSrc.etherium} style={styles.cryptoIcon} />
                <Text style={styles.collectionTableRowText}>
                  {Number(collection?.volTraded).toFixed(2)}
                </Text>
              </View>
              <Text style={styles.collectionTableRowDec}>
                {translate('common.volumeTraded')}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.descriptionTabWrapper}>
          <TouchableOpacity
            onPress={() => setDescTab(true)}
            style={[
              styles.descriptionTab,
              {
                borderColor: descTab ? '#eee' : 'transparent',
                borderBottomColor: descTab ? 'transparent' : '#eee',
              },
            ]}>
            <Text style={styles.descriptionTabText}>
              {translate('common.collected')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDescTab(false)}
            style={[
              styles.descriptionTab,
              {
                borderColor: !descTab ? '#eee' : 'transparent',
                borderBottomColor: !descTab ? 'transparent' : '#eee',
              },
            ]}>
            <Text style={styles.descriptionTabText}>
              {translate('common.creator')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.description}>
          <ScrollView>
            <Text style={styles.descriptionText}>
              {descTab
                ? collection?.collectionDesc
                : collection.userInfo[
                    `${selectedLanguageItem.language_name}_about`
                  ] || collection.userInfo.about}
            </Text>
          </ScrollView>
        </View>

        <View style={{flex: 1}}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => setCollectionType(0)}
                style={[
                  styles.tabBarItem,
                  {
                    borderTopColor:
                      collectionType === 0 ? colors.BLUE4 : 'white',
                  },
                ]}>
                <Text
                  style={[
                    styles.tabBarLabel,
                    {color: collectionType === 0 ? colors.BLUE4 : colors.GREY1},
                  ]}>
                  {translate('common.onSale')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCollectionType(1)}
                style={[
                  styles.tabBarItem,
                  {
                    borderTopColor:
                      collectionType === 1 ? colors.BLUE4 : 'white',
                  },
                ]}>
                <Text
                  style={[
                    styles.tabBarLabel,
                    {color: collectionType === 1 ? colors.BLUE4 : colors.GREY1},
                  ]}>
                  {translate('common.notforsale')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCollectionType(2)}
                style={[
                  styles.tabBarItem,
                  {
                    borderTopColor:
                      collectionType === 2 ? colors.BLUE4 : 'white',
                  },
                ]}>
                <Text
                  style={[
                    styles.tabBarLabel,
                    {color: collectionType === 2 ? colors.BLUE4 : colors.GREY1},
                  ]}>
                  {translate('common.owned')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCollectionType(3)}
                style={[
                  styles.tabBarItem,
                  {
                    borderTopColor:
                      collectionType === 3 ? colors.BLUE4 : 'white',
                  },
                ]}>
                <Text
                  style={[
                    styles.tabBarLabel,
                    {color: collectionType === 3 ? colors.BLUE4 : colors.GREY1},
                  ]}>
                  {translate('common.gallery')}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          {collectionAddress && (
            <Collections
              collectionAddress={collectionAddress}
              collectionType={collectionType}
              collectionId={collectionId}
            />
          )}
        </View>
      </ScrollView>
    </AppBackground>
  );
}

export default CollectionDetail;
