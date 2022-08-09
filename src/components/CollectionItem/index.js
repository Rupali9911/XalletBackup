import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, Image, Platform } from 'react-native';
import { C_Image } from '../../components';
import styles from './styles';
import { SIZE, SVGS } from 'src/constants';
import { translate } from '../../walletUtils';
import CommonStyles from '../../constants/styles';
import FixedTouchableHighlight from '../../components/FixedTouchableHighlight'
import { Verifiedcollections } from '../verifiedCollection';
import { COLORS, IMAGES } from '../../constants';
const { NewPolygonIcon, Ethereum, BitmapIcon,VerficationIcon } = SVGS;

export default function CollectionItem(props) {
  const {
    bannerImage,
    chainType,
    items,
    iconImage,
    collectionName,
    creatorInfo,
    onPress,
    creator,
    network,
    count,
    blind,
    isCollection,
    cryptoAllowed,
    colId
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
    let creatorName = creatorInfo && typeof creatorInfo[0] === 'object' ?
      creatorInfo[0]?.role === 'crypto' ?
        creatorInfo[0]?.title?.trim() ? creatorInfo[0].title :
          creatorInfo[0]?.name?.trim() ? creatorInfo[0].name :
            creatorInfo[0]?.username?.trim() ? creatorInfo[0].username : creator ? creator : ""
        : creatorInfo[0]?.username?.trim() ? creatorInfo[0].username :
          creatorInfo[0]?.name?.trim() ? creatorInfo[0].name :
            creatorInfo[0]?.title?.trim() ? creatorInfo[0].title : creator ? creator : ""
      : creator ? creator : collectionName ? collectionName : ""
    creatorName = creatorName?.includes('0x') ? creatorName.substring(0, 6) : creatorName;
    return creatorName;
  }

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
    if (network?.networkName === 'Ethereum') {
      return <Ethereum/>
    }
    if (network?.networkName === 'BSC') {
      return <BitmapIcon/>
    }
    if (network?.networkName === 'Polygon') {
      return <NewPolygonIcon/>
    }
  }

  const renderVerifiedCollection = () => {
    return (
            <VerficationIcon/>
    )
}

  useEffect(() => {
    if (onPressButton) {
      onPress();
      setTimeout(() => {
        setOnPressButton(false);
      }, 1000)
    }
  }, [onPressButton])

  const handleOnPress = () => {
    setOnPressButton(true);
  }

  return (
    <FixedTouchableHighlight onPress={handleOnPress} style={styles.collectionListItem}>
      <View style={styles.listItemContainer}>
        <View>
          <C_Image
            type={uriType}
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
              type={bannerImage?.split('.')[bannerImage?.split('.').length - 1]}
              uri={iconImage}
              imageStyle={styles.iconImage}
            />
          </View>
          <View style={styles.bottomCenterWrap}>
            <View style={styles.bottomText}>
              <Text numberOfLines={1} style={styles.collectionName}>
                {collectionName}
              </Text>
              {renderVerifiedCollection()}
            </View>
            {!isCollection && (
              <Text style={styles.byUser}>{`by ${getByUser()}`}</Text>
            )}
          </View>
          <View style={styles.bottomWrap}>
            {/* {!isCollection ? renderChain() : <View />} */}
            {renderChain()}
            <Text style={styles.count}>{count} items</Text>
            {/* {items !== null && <Text style={{ fontSize: SIZE(12), color: '#8e9bba' }}>
              {`${items} ` + translate('common.itemsCollection')}
            </Text>} */}
          </View>
        </View>
      </View>
    </FixedTouchableHighlight>
  );
}
