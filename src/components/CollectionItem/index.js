import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View, Text, Image, Platform} from 'react-native';
import {C_Image} from '../../components';
import styles from './styles';
import {SIZE, SVGS} from 'src/constants';
import {translate} from '../../walletUtils';
import CommonStyles from '../../constants/styles';
import {ImagekitType} from '../../common/ImageConstant';
const {NewPolygonIcon, Ethereum, BitmapIcon, VerficationIcon} = SVGS;

export default function CollectionItem(props) {
  const {
    bannerImage,
    chainType,
    items,
    iconImage,
    collectionTab,
    collectionName,
    creatorInfo,
    onPress,
    creator,
    network,
    count,
    isHotCollection,
    blind,
    address,
    isCollection,
    verified,
    cryptoAllowed,
    colId,
  } = props;
  const [onPressButton, setOnPressButton] = useState(false);

  const getByUser = () => {
    // if (creator) return creator;
    // if (creatorInfo[0].title) return creatorInfo[0].title;
    // if (creatorInfo[0].role === ‘crypto’) {
    //   return creatorInfo[0].username.slice(0, 6);
    // } else {
    //   return creatorInfo[0].username;
    // }
    let creatorAddress = `${creator?.address?.substring(
      0,
      6,
    )}...${creator?.address?.substring(
      creator.address.length - 4,
      creator.address.length,
    )}`;
    let creatorName = creator.name ? creator.name : creatorAddress;
    return creatorName;
  };

  let uriType = bannerImage?.split('.')[bannerImage?.split('.').length - 1];
  const checkVideoUrl =
    uriType === 'mp4' ||
    uriType === 'MP4' ||
    uriType === 'mov' ||
    uriType === 'MOV';

  // const renderChain = () => {
  //   if (
  //     blind || Array.isArray(chainType) && chainType?.length > 0 &&
  //     chainType?.includes("ethereum") && chainType?.includes("binance") &&
  //     !chainType?.includes("polygon")
  //   ) {
  //     return (
  //       <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
  //         {/* <BitmapIcon style={{ marginRight: SIZE(8) }} />
  //         <PolygonIcon style={{ marginRight: SIZE(8) }} />
  //         <Ethereum style={{ marginRight: SIZE(8) }} /> */}
  //         <Ethereum style={{ marginRight: SIZE(8) }} />
  //         <BitmapIcon />
  //       </View>
  //     );
  //   } else if (isCollection) {
  //     return (
  //       <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
  //         {cryptoAllowed?.binance && <BitmapIcon style={{ marginRight: SIZE(8) }} />}
  //         {cryptoAllowed?.polygon && <PolygonIcon style={{ marginRight: SIZE(8) }} />}
  //         {cryptoAllowed?.ethereum && <Ethereum />}
  //       </View>
  //     );
  //   } else {
  //     return chainIcon(chainType);
  //   }
  // };

  const renderChain = () => {
    return (
      <C_Image
        size={ImagekitType.AVATAR}
        imageStyle={styles.chainUserIcon}
        style={styles.chainLoaderIcon}
        uri={network?.image}
      />
    );
  };

  const renderVerifiedCollection = () => {
    return <VerficationIcon />;
  };

  useEffect(() => {
    if (onPressButton) {
      onPress();
      setTimeout(() => {
        setOnPressButton(false);
      }, 1000);
    }
  }, [onPressButton]);

  const handleOnPress = () => {
    setOnPressButton(true);
  };

  return (
    <TouchableOpacity
      onPress={handleOnPress}
      style={styles.collectionListItem}
      activeOpacity={1}>
      <View style={styles.listItemContainer}>
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
        <View style={styles.collectionWrapper}>
          <View style={CommonStyles.center}>
            <C_Image
              size={ImagekitType.AVATAR}
              uri={iconImage}
              imageStyle={styles.iconImage}
            />
          </View>
          <View style={styles.bottomCenterWrap}>
            <View style={styles.bottomText}>
              <Text numberOfLines={1} style={styles.collectionName}>
                {collectionName}
              </Text>
              {verified === 1 && renderVerifiedCollection()}
            </View>
            {!isCollection && (
              <Text style={styles.byUser}>
                {collectionTab ? `${getByUser()}` : `by ${getByUser()}`}
              </Text>
            )}
          </View>
          <View style={collectionTab ? styles.bottomWrap2 : styles.bottomWrap}>
            {/* {!isCollection ? renderChain() : <View />} */}
            {renderChain()}
            {count <= 1 ? (
              <Text style={styles.count}>
                {count ? count : 0} {translate('common.ITEM')}
              </Text>
            ) : (
              <Text style={styles.count}>
                {count ? count : 0} {translate('common.ITEMS')}
              </Text>
            )}
            {/* {items !== null && <Text style={{ fontSize: SIZE(12), color: '#8e9bba' }}>
              {`${items} ` + translate('common.itemsCollection')}
            </Text>} */}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
