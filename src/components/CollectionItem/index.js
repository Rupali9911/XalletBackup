import React, { useEffect } from 'react';
import { TouchableOpacity, View, Text, Image, Platform } from 'react-native';
import { C_Image } from '../../components';
import styles from './styles';
import { SIZE, SVGS } from 'src/constants';
import { translate } from '../../walletUtils';

const { PolygonIcon, Ethereum, BitmapIcon } = SVGS;

var isFirstPressDone= false;
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
    blind,
    isCollection,
    cryptoAllowed,
  } = props;
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
      : creator ? creator : ""
    return creatorName;
  }
  // console.log("🚀 ~ file: index.js ~ line 34 ~ getByUser ~ creatorInfo", creatorInfo, getByUser())

  let uriType = bannerImage?.split('.')[bannerImage?.split('.').length - 1];
  const checkVideoUrl =
    uriType === 'mp4' ||
    uriType === 'MP4' ||
    uriType === 'mov' ||
    uriType === 'MOV';

  const renderChain = () => {
    if (blind) {
      return (
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <BitmapIcon style={{ marginRight: SIZE(8) }} />
          <PolygonIcon style={{ marginRight: SIZE(8) }} />
          <Ethereum />
        </View>
      );
    } else if (isCollection) {
      return (
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          {cryptoAllowed?.binance && <BitmapIcon style={{ marginRight: SIZE(8) }} />}
          {cryptoAllowed?.polygon && <PolygonIcon style={{ marginRight: SIZE(8) }} />}
          {cryptoAllowed?.ethereum && <Ethereum />}
        </View>
      );
    } else {
      return chainIcon(chainType);
    }
  };

  const handleOnPress = () => {
    if(!isFirstPressDone){
      onPress();
      isFirstPressDone=true;
    }else{
      isFirstPressDone=false;
    }
  }
  
  return (
    <TouchableOpacity onPress={handleOnPress} style={styles.collectionListItem}>
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
          <C_Image
            type={bannerImage?.split('.')[bannerImage?.split('.').length - 1]}
            uri={iconImage}
            imageStyle={styles.iconImage}
          />
          <View style={styles.bottomCenterWrap}>
            <Text numberOfLines={1} style={styles.collectionName}>
              {collectionName}
            </Text>
            {!isCollection && (
              <Text style={styles.byUser}>{`by ${getByUser()}`}</Text>
            )}
          </View>
          <View style={styles.bottomWrap}>
            {/* {!isCollection ? renderChain() : <View />} */}
            {renderChain()}
            <Text style={{ fontSize: SIZE(12), color: '#8e9bba' }}>
              {`${items} ` + translate('common.itemsCollection')}
              <Text style={{ marginRight: 50 }}>
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
