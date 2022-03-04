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
  const { bannerImage, chainType, items, iconImage, collectionName, creatorInfo, onPress, creator, blind } = props;

  const chainIcon = (type) => {
    if (type === 'polygon') return <PolygonIcon />
    if (type === 'ethereum') return <Ethereum />
    if (type === 'binance') return <BitmapIcon />
  };

  const getByUser = () => {
    if (creator) return creator;
    if (creatorInfo[0].title) return creatorInfo[0].title;
    if (creatorInfo[0].role === 'crypto') {
      return creatorInfo[0].username.slice(0, 6);
    } else {
      return creatorInfo[0].username;
    }
  }

  const renderChain = () => {
    if (blind) {
      return (
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <BitmapIcon style={{ marginRight: SIZE(8)}} />
          <PolygonIcon style={{ marginRight: SIZE(8)}} />
          <Ethereum />
        </View>
      );
    } else {
      return chainIcon(chainType);
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
            <Text numberOfLines={1} style={styles.collectionName}>{collectionName}</Text>
            <Text style={styles.byUser}>{`by ${getByUser()}`}</Text>
          </View>
          <View style={styles.bottomWrap}>
            {renderChain()}
            <Text style={{ fontSize: SIZE(12), color: '#8e9bba' }}>
              { `${items} ` + translate('common.itemsCollection')}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}
