import React, {useEffect, useState} from 'react';
import {View, Text, Platform, TouchableOpacity} from 'react-native';
import {C_Image} from '../../components';
import styles from './styles';
import {SIZE, SVGS} from 'src/constants';
import {translate} from '../../walletUtils';
import FixedTouchableHighlight from '../../components/FixedTouchableHighlight';
import {Verifiedcollections} from '../../components/verifiedCollection';
import {IMAGES} from '../../constants';
import {SvgWithCssUri} from 'react-native-svg';
import {ImagekitType} from '../../common/ImageConstant';
const {VerficationIcon} = SVGS;

export default function LaunchPadItemData(props) {
  // ======================= Props destructing =======================
  const {
    bannerImage,
    chainType,
    items,
    iconImage,
    collectionName,
    creatorInfo,
    status,
    onPress,
    creator,
    network,
    count,
    blind,
    isCollection,
    cryptoAllowed,
    disabled,
    isOfficial,
    collectionId,
  } = props;

  // ======================= State Declaration =======================
  const [onPressButton, setOnPressButton] = useState(false);

  // ======================= UseEffect Function =======================
  useEffect(() => {
    if (onPressButton) {
      onPress();
      setTimeout(() => {
        setOnPressButton(false);
      }, 1000);
    }
  }, [onPressButton]);

  // ======================= Render Banner Image Function =======================
  let uriType = bannerImage?.split('.')[bannerImage?.split('.').length - 1];
  const checkVideoUrl =
    uriType === 'mp4' ||
    uriType === 'MP4' ||
    uriType === 'mov' ||
    uriType === 'MOV';
  const renderBannerImage = () => {
    return (
      <View>
        <C_Image
          size={ImagekitType.BANNER}
          uri={bannerImage}
          imageStyle={
            Platform.OS === 'ios'
              ? checkVideoUrl
                ? styles.collectionListVideo
                : styles.collectionListImage
              : styles.collectionListImage
          }
        />
      </View>
    );
  };

  // ======================= Render Banner Icon Image Function =======================
  const renderBannerIconImage = () => {
    return (
      <C_Image
        style={styles.userIconLoader}
        size={ImagekitType.AVATAR}
        uri={iconImage}
        imageStyle={styles.iconImage}
      />
    );
  };

  // ======================= Render Verified Collection Function =======================
  const renderVerifiedCollection = () => {
    return <VerficationIcon />;
  };

  // ======================= Render Collection and ByUser Function =======================
  const renderCollectionNbyUserName = () => {
    return (
      <View style={styles.bottomCenterWrap}>
        <View style={styles.mainNftText}>
          <Text numberOfLines={1} style={styles.collectionName}>
            {collectionName}
          </Text>
          {renderVerifiedCollection()}
        </View>
        {!isCollection && (
          <Text style={styles.byUser}>{`by ${getByUser()}`}</Text>
        )}
      </View>
    );
  };

  const getByUser = () => {
    // if (creator) return creator;
    // if (creatorInfo[0].title) return creatorInfo[0].title;
    // if (creatorInfo[0].role === ‘crypto’) {
    //   return creatorInfo[0].username.slice(0, 6);
    // } else {
    //   return creatorInfo[0].username;
    // }
    let creatorName =
      creatorInfo && typeof creatorInfo[0] === 'object'
        ? creatorInfo[0]?.role === 'crypto'
          ? creatorInfo[0]?.title?.trim()
            ? creatorInfo[0].title
            : creatorInfo[0]?.name?.trim()
            ? creatorInfo[0].name
            : creatorInfo[0]?.username?.trim()
            ? creatorInfo[0].username
            : creator
            ? creator
            : ''
          : creatorInfo[0]?.username?.trim()
          ? creatorInfo[0].username
          : creatorInfo[0]?.name?.trim()
          ? creatorInfo[0].name
          : creatorInfo[0]?.title?.trim()
          ? creatorInfo[0].title
          : creator
          ? creator
          : ''
        : creator
        ? creator
        : '';
    return creatorName;
  };

  // ======================= Render Chain Icon and Status Function =======================
  const renderChainIconNstatus = () => {
    return (
      <View style={styles.bottomWrap}>
        <View style={styles.renderchainstyle}>{renderChain()}</View>
        {count <= 1 ? (
          <Text style={styles.nftCount}>
            {count ? count : 0} {translate('common.ITEM')}
          </Text>
        ) : (
          <Text style={styles.nftCount}>
            {count ? count : 0} {translate('common.ITEMS')}
          </Text>
        )}
        <Text style={styles.statusText}>
          {collectionName === 'NFTDuel - Astroboy x Japan'
            ? translate('common.COMING_SOON')
            : status === 1
            ? translate('common.ongoinglaunch')
            : ''}
        </Text>
      </View>
    );
  };

  // const renderChain = () => {
  //     if (blind) {
  //         return (
  //             <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: Platform.OS === 'android' ? SIZE(0) : SIZE(5) }}>
  //                 <BitmapIcon style={{ marginRight: SIZE(8) }} />
  //                 <PolygonIcon style={{ marginRight: SIZE(8) }} />
  //                 <Ethereum />
  //             </View>
  //         );
  //     } else
  //         if (isCollection) {
  //             return (
  //                 <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: Platform.OS === 'android' ? SIZE(0) : SIZE(5) }}>
  //                     {cryptoAllowed?.binance && <BitmapIcon style={{ marginRight: SIZE(10) }} />}
  //                     {cryptoAllowed?.polygon && <PolygonIcon style={{ marginRight: SIZE(8) }} />}
  //                     {cryptoAllowed?.ethereum && <Ethereum />}
  //                 </View>
  //             );
  //         } else {
  //             //return chainIcon(chainType);
  //             return chainTypeIcon(chainType)
  //         }
  // };

  const renderChain = () => {
    return (
      <View style={styles.renderchainstyle}>
        {network.map((item, index) => {
          if (item.networkName !== 'XANACHAIN') {
            return (
              <SvgWithCssUri
                key={index}
                uri={item.image}
                width={SIZE(18)}
                height={SIZE(18)}
                style={{marginTop: '20%'}}
              />
            );
          } else {
            return (
              <C_Image
                key={index}
                imageStyle={{
                  height: SIZE(18),
                  width: SIZE(18),
                  marginTop: '20%',
                }}
                uri={item.image}
                size={ImagekitType.AVATAR}
              />
            );
          }
        })}
      </View>
    );
  };

  // const chainTypeIcon = type => {
  //     return (
  //         <FlatList
  //             data={type}
  //             horizontal={true}
  //             contentContainerStyle={styles.chaintypeflatlist}
  //             keyExtractor={(item) => item.id}
  //             renderItem={({ item, index }) => {

  //                 if (item.type === 'polygon') {
  //                     return <PolygonIcon style={{ marginHorizontal: 5 }} />;
  //                 }
  //                 if (item.type === 'ethereum') {
  //                     return <Ethereum style={{ marginHorizontal: 5 }} />;
  //                 }
  //                 if (item.type === 'binance') {
  //                     return <BitmapIcon style={{ marginHorizontal: 5 }} />;
  //                 }
  //             }}

  //         />
  //     )
  // };

  // const chainIcon = type => {
  //     if (type === 'polygon') {
  //         return <PolygonIcon />;
  //     }
  //     if (type === 'ethereum') {
  //         return <Ethereum />;
  //     }
  //     if (type === 'binance') {
  //         return <BitmapIcon />;
  //     }
  // };

  //=====================(Other Supporting Function)=============================
  const handleOnPress = () => {
    setOnPressButton(true);
  };

  //=====================(Main return Function)=============================
  return (
    <TouchableOpacity
      activeOpacity={1}
      disabled={disabled}
      onPress={handleOnPress}
      style={styles.collectionListItem}>
      <View style={styles.listItemContainer}>
        {renderBannerImage()}
        <View style={styles.collectionWrapper}>
          {renderBannerIconImage()}
          {renderCollectionNbyUserName()}
          {renderChainIconNstatus()}
        </View>
      </View>
    </TouchableOpacity>
  );
}
