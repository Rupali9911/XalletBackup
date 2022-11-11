import {useNavigation} from '@react-navigation/native';
import 'intl';
import 'intl/locale-data/jsonp/en';
import React, {useEffect, useState} from 'react';
import {
  BackHandler,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {FONT, SVGS} from 'src/constants';
import {C_Image, Loader} from '../../components';
import AppBackground from '../../components/appBackground';
import {COLORS, SIZE} from '../../constants';
import ImageSrc from '../../constants/Images';
import {fonts} from '../../res';
import {getHotCollectionDetail} from '../../store/actions/hotCollectionAction';
import {translate} from '../../walletUtils';
import styles from './styles';

import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import {NEW_BASE_URL} from '../../common/constants';
import {alertWithSingleBtn} from '../../common/function';
import {wp} from '../../constants/responsiveFunct';
import sendRequest from '../../helpers/AxiosApiRequest';
import ActivityTab from './activityTab';
import GalleryTab from './galleryTab';
import OnSaleTab from './onSaleTab';
import OwnedTab from './ownedTab';
import SoldOutTab from './soldOutTab';

import TabViewScreen from '../../components/TabView/TabViewScreen';

import {useDispatch, useSelector} from 'react-redux';

const {height} = Dimensions.get('window');

const {
  TwiiterIcon,
  FacebookIcon,
  InstagramIcon,
  ThreeDotsVerticalIcon,
  PolygonIcon,
  Ethereum,
  BitmapIcon,
  VerficationIcon,
} = SVGS;

function CollectionDetail(props) {
  const {route} = props;
  const {networkName, contractAddress, launchpadId} = route.params;
  const {NftDataCollectionReducer} = useSelector(state => state);
  const collectionList = NftDataCollectionReducer.nftDataCollectionList;
  const [collection, setCollection] = useState({});
  const [loading, setLoading] = useState(true);
  const [descTab, setDescTab] = useState(true);
  const navigation = useNavigation();

  const isLaunchPad = launchpadId ? true : false;

  const [index, setIndex] = useState(0);

  const [routes] = useState(
    !launchpadId
      ? [
          {key: 'onSale', title: translate('common.onSale')},
          {key: 'notOnSell', title: translate('common.notOnSell')},
          {key: 'owned', title: translate('wallet.common.owned')},
          {key: 'activity', title: translate('common.activity')},
        ]
      : [{key: 'gallery', title: translate('common.gallery')}],
  );

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    getCollection();
  }, [BackHandler.removeEventListener('hardwareBackPress', handleBackButton)]);

  const handleBackButton = () => {
    navigation.goBack();
    return true;
  };

  const chainIcon = type => {
    if (type === 'polygon') {
      return <PolygonIcon />;
    }
    if (type === 'ethereum') {
      return <Ethereum />;
    }
    if (type === 'binance') {
      return <BitmapIcon />;
    }
  };

  const getCollection = async () => {
    try {
      if (launchpadId) {
        const url = `${NEW_BASE_URL}/launchpad/detail`;
        sendRequest({
          url,
          params: {
            launchpadId: launchpadId,
          },
        })
          .then(res => {
            setCollection(res);
            setLoading(false);
          })
          .catch(err => console.log('err : ', err));
      } else {
        const collectionArray = await getHotCollectionDetail(
          networkName,
          contractAddress,
        );
        setCollection(collectionArray);
        setLoading(false);
      }
    } catch (err) {
      console.error(err.message);
      setCollection([]);
      setLoading(false);
    }
  };

  const renderBanner = () => {
    let bannerUrl = collection?.bannerImage;

    return (
      <View style={styles.bannerView}>
        <C_Image uri={bannerUrl} type={'jpg'} imageStyle={styles.bannerImage} />
      </View>
    );
  };

  const renderSubBanner = () => {
    let bannerUrl = collection?.iconImage;

    return (
      <View style={styles.bannerIconWrap}>
        <Image source={{uri: bannerUrl}} style={styles.bannerIcon} />
        {/* {Verifiedcollections.find((id) => id === collectionId) && (
                    <View>
                        <Image
                            style={styles.verifyIcon}
                            source={IMAGES.tweetPng}
                        />
                    </View>
                )} */}
      </View>
    );
  };

  const renderSocialLinks = () => {
    return (
      <View style={styles.socialLinksWrap}>
        {collection?.userInfo?.links?.twitter ? (
          <TouchableOpacity
            style={{marginRight: 10}}
            hitSlop={{top: 5, bottom: 5, left: 5, right: 5}}
            onPress={() =>
              Linking.openURL(collection?.userInfo?.links?.twitter)
            }>
            <TwiiterIcon />
          </TouchableOpacity>
        ) : null}
        {collection?.userInfo?.links?.instagram ? (
          <TouchableOpacity
            hitSlop={{top: 5, bottom: 5, left: 5, right: 5}}
            style={{marginRight: 6}}
            onPress={() =>
              Linking.openURL(collection?.userInfo?.links?.instagram)
            }>
            <InstagramIcon />
          </TouchableOpacity>
        ) : null}
        {collection?.userInfo?.links?.facebook ? (
          <TouchableOpacity
            hitSlop={{top: 5, bottom: 5, left: 5, right: 5}}
            onPress={() =>
              Linking.openURL(collection?.userInfo?.links?.facebook)
            }>
            <FacebookIcon />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  const renderDescription = () => {
    return (
      <>
        <View style={styles.descriptionTabWrapper}>
          <TouchableOpacity
            onPress={() => setDescTab(true)}
            style={
              descTab ? styles.descriptionTab : styles.selectedDescriptionTab
            }>
            <Text style={styles.descriptionTabText}>
              {translate('common.collected')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDescTab(false)}
            style={
              !descTab ? styles.descriptionTab : styles.selectedDescriptionTab
            }>
            <Text style={styles.descriptionTabText}>
              {translate('common.creator')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.description}>
          <ScrollView nestedScrollEnabled={true}>
            {descTab ? (
              <View>
                <Text
                  style={[styles.descriptionText, styles.descriptionTabData]}>
                  {collection.name}
                </Text>
                <Text style={styles.descriptionText}>
                  {collection?.description}
                </Text>
              </View>
            ) : (
              <View>
                <Text
                  style={[styles.descriptionText, styles.descriptionTabData]}>
                  {collection?.user?.name}
                </Text>
                <Text style={styles.descriptionText}>
                  {collection?.user?.description}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </>
    );
  };

  const renderDetailList = () => {
    let items = Number(collection?.totalNft);
    let owners = Number(collection?.totalOwner);
    let floorPrice = Number(collection?.floorPrice).toFixed(3);
    let volTraded = Number(collection?.volumeTraded).toFixed(3);

    return (
      <View style={styles.collectionTable}>
        <View style={styles.collectionTableRow}>
          <Text style={styles.collectionTableRowText}>
            {items === undefined ? '--' : items}
          </Text>
          <Text style={styles.collectionTableRowDec}>
            {translate('common.itemsCollection')}
          </Text>
        </View>
        <View style={styles.collectionTableRow}>
          <Text style={styles.collectionTableRowText}>
            {owners === undefined ? '--' : owners}
          </Text>
          <Text style={styles.collectionTableRowDec}>
            {translate('common.owners')}
          </Text>
        </View>
        <View style={styles.collectionTableRow}>
          <View style={styles.floorPriceVw}>
            <Image source={ImageSrc.etherium1} style={styles.cryptoIcon} />
            <Text style={styles.collectionTableRowText} numberOfLines={1}>
              {floorPrice}
            </Text>
          </View>
          <Text style={styles.collectionTableRowDec} numberOfLines={1}>
            {translate('common.floorPrice')}
          </Text>
        </View>
        <View style={styles.collectionTableRow}>
          <View style={styles.floorPriceVw}>
            <Image source={ImageSrc.etherium1} style={styles.cryptoIcon} />
            <Text style={styles.collectionTableRowText} numberOfLines={1}>
              {volTraded}
            </Text>
          </View>
          <Text style={styles.collectionTableRowDec} numberOfLines={1}>
            {translate('common.volumeTraded')}
          </Text>
        </View>
      </View>
    );
  };

  // ======================= Render Verified Collection Function =======================
  const renderVerifiedCollection = () => {
    return <VerficationIcon width={SIZE(20)} height={SIZE(20)} style={{left: 2}} />;
  };

  const renderTitle = () => {

    console.log('route?.params?.isLaunchPad === true || collection?.isOfficial === 1', route?.params?.isLaunchPad === true || collection?.isOfficial === 1)
    return (
      <View style={styles.mainNftText}>
        <Text numberOfLines={1} style={styles.collectionName}>
          {collection?.name}
        </Text>
        {route?.params?.isLaunchPad === true || collection?.isOfficial === 1
          ? renderVerifiedCollection()
          : null}
      </View>
    );
  };

  const renderScene = ({route}, tab) => {
    if (tab) {
      switch (route.key) {
        case 'onSale':
          return (
            <OnSaleTab
              tabTitle={translate('common.onSale')}
              collection={collection}
              tabStatus={1}
              isLaunchPad={isLaunchPad}
            />
          );
        case 'notOnSell':
          return (
            <SoldOutTab
              tabTitle={translate('common.notOnSell')}
              collection={collection}
              tabStatus={2}
              isLaunchPad={isLaunchPad}
            />
          );
        case 'owned':
          return (
            <OwnedTab
              tabTitle={translate('wallet.common.owned')}
              collection={collection}
              isLaunchPad={isLaunchPad}
            />
          );
        case 'activity':
          return (
            <ActivityTab
              tabTitle={translate('common.activity')}
              collection={collection}
            />
          );
        default:
          return null;
      }
    } else {
      switch (route.key) {
        case 'gallery':
          return (
            <GalleryTab
              tabTitle={translate('common.gallery')}
              collection={collection}
              tabStatus={3}
              isLaunchPad={isLaunchPad}
            />
          );
        default:
          return null;
      }
    }
  };

  const handleIndexChange = index => {
    setIndex(index);
  };

  const renderTabView = tab => {
    return (
      <TabViewScreen
        index={index}
        routes={routes}
        switchRoutes={r => renderScene(r, tab)}
        indexChange={i => handleIndexChange(i)}
        tabBarStyle={{
          height: SIZE(40),
          width: wp('30%'),
          paddingHorizontal: wp('1%'),
          justifyContent: 'center',
        }}
      />
    );
  };

  return (
    <AppBackground isBusy={loading}>
      <ScrollView
        nestedScrollEnabled={true}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        style={{flex: 1}}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButtonWrap}>
          <Image style={styles.backIcon} source={ImageSrc.backArrow} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Menu
            onSelect={value => {
              alertWithSingleBtn(
                translate('common.Confirm'),
                value === 1
                  ? translate('common.collectionReported')
                  : translate('common.userBlocked'),
              );
            }}>
            <MenuTrigger children={<ThreeDotsVerticalIcon />} />
            <MenuOptions>
              <MenuOption value={1}>
                <Text style={{marginVertical: 10}}>
                  {translate('common.reportCollection')}
                </Text>
              </MenuOption>
              <MenuOption value={2}>
                <Text style={{marginVertical: 10}}>
                  {translate('common.blockUser')}
                </Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>
        {renderBanner()}
        {renderSocialLinks()}
        {renderSubBanner()}

        {renderTitle()}
        {renderDetailList()}

        {/* {renderChainList()} */}
        {renderDescription()}

        <View style={{height: height / 1.5}}>
          {!loading && !isLaunchPad ? (
            renderTabView(true)
          ) : isLaunchPad && !loading ? (
            renderTabView(false)
          ) : (
            <Loader />
          )}
        </View>
      </ScrollView>
    </AppBackground>
  );
}

export default CollectionDetail;
