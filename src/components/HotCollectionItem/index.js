import React from 'react';
import { TouchableOpacity, View, Text, Image } from 'react-native';
import { C_Image } from '../../components';
import styles from './styles';
import { SIZE, SVGS } from 'src/constants';
import { translate } from '../../walletUtils';


const {
  PolygonIcon,
  Ethereum,
  BitmapIcon,
} = SVGS;

export default function HotcollectionItem(props) {
  const { item, onPress } = props;

  const { bannerImage, chainType, items, iconImage, collectionName, creatorInfo } = item;

  const chainIcon = (type) => {
    if (type === 'polygon') return <PolygonIcon />
    if (type === 'ethereum') return <Ethereum />
    if (type === 'binance') return <BitmapIcon />
  };

  const getByUser = () => {
    if (creatorInfo[0].title) return creatorInfo[0].title;
    if (creatorInfo[0].role === 'crypto') {
      return creatorInfo[0].username.slice(0, 6);
    } else {
      return creatorInfo[0].username;
    }
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.collectionListItem}>
      <View style={styles.listItemContainer}>
        <View>
          <C_Image
            type={
              bannerImage?.split('.')[
              bannerImage?.split('.').length - 1
              ]
            }
            uri={bannerImage}
            imageStyle={styles.collectionListImage}
          />
        </View>
        <View style={styles.collectionWrapper}>
          <C_Image
            type={bannerImage?.split('.')[bannerImage?.split('.').length - 1]}
            uri={iconImage}
            imageStyle={styles.iconImage}
          />
          <View style={styles.bottomCenterWrap}>
            <Text style={styles.collectionName}>{collectionName}</Text>
            <Text style={styles.byUser}>{`by ${getByUser()}`}</Text>
          </View>
          <View style={styles.bottomWrap}>
            {chainIcon(chainType)}
            <Text style={{ fontSize: SIZE(12), color: '#8e9bba' }}>
              { `${items} ` + translate('common.itemsCollection')}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}
