import React from 'react';
import { TouchableOpacity, View, Text, Image } from 'react-native';
import { C_Image } from '../../components';
import styles from './styles';
import { SIZE, SVGS } from 'src/constants';
import insertComma from '../../utils/insertComma';
import { basePriceTokens } from '../../web3/config/availableTokens';
import { SvgUri } from 'react-native-svg';
import { translate } from '../../walletUtils';
import { handleLikeDislike } from '../../store/actions/nftTrendList';
import { useDispatch } from 'react-redux';

export default function NFTItem(props) {
  const { item, image, onPress, onLongPress, isCollection, index } = props;

  const {
    PolygonIcon,
    Ethereum,
    BitmapIcon,
    HeartWhiteIcon,
    HeartActiveIcon,
  } = SVGS;

  const dispatch = useDispatch();

  let imageUri =
    item.thumbnailUrl !== undefined || item.thumbnailUrl
      ? item.thumbnailUrl
      : item.metaData?.image;

  const chainType = (type) => {
    if (type === 'polygon') return <PolygonIcon />
    if (type === 'ethereum') return <Ethereum />
    if (type === 'binance') return <BitmapIcon />
  };

  const nftCurrencyIcon = (CurrencyFlag, chainType) => {
    let chainTypeFlag = chainType;
    let found = basePriceTokens.find(
      token => token.name === CurrencyFlag && token.chain === chainTypeFlag
    );
    if (found) {
      return found.image
    }
  };

  const renderIcon = () => {
    const uri = nftCurrencyIcon(item?.baseCurrency, item?.nftChain);
    if (uri.split('.')[uri.split('.').length - 1] === 'svg')
      return <SvgUri uri={nftCurrencyIcon(item?.baseCurrency, item?.nftChain)} width={SIZE(12)} height={SIZE(12)} />
    else return <Image source={{ uri: uri }} />
  }

  return (
    <>
      {!isCollection ?
        <TouchableOpacity
          onLongPress={onLongPress}
          onPress={onPress}
          style={styles.listItem}>
          <C_Image
            uri={image}
            type={
              item?.metaData?.image?.split('.')[
              item?.metaData?.image?.split('.')?.length - 1
              ]
            }
            imageStyle={styles.listImage}
          />
        </TouchableOpacity>
        :
        <TouchableOpacity
          onPress={onPress}
          style={styles.collectionListItem}>
          <View style={styles.listItemContainer}>
            <TouchableOpacity
              onPress={() => dispatch(handleLikeDislike(item, index))}
              style={styles.likeButton}
            >
              {item.like == 0 ? <HeartActiveIcon /> : <HeartWhiteIcon />}
            </TouchableOpacity>
            <C_Image
              type={
                item.metaData?.image.split('.')[
                item.metaData?.image.split('.').length - 1
                ]
              }
              uri={imageUri}
              imageStyle={styles.collectionListImage}
            />
            <View style={styles.collectionWrapper}>
              <Text>{item.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>

                {
                  item.newprice && item.newprice.endTime && new Date(item.newprice.endTime) < new Date().getTime() ?
                    <Text style={{ color: '#60C083', fontSize: SIZE(12) }}>{translate('common.auctionended')}</Text>
                    :
                    item?.price ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#60c083', marginVertical: SIZE(10), marginRight: SIZE(2), fontSize: SIZE(12) }}>
                          {
                            item?.baseCurrency === "ALIA" ?
                              insertComma(parseFloat(item?.price, true).toFixed(0)) :
                              insertComma(item?.price, true)
                          }
                        </Text>
                        {renderIcon()}
                      </View>
                    ) : (
                      <Text style={{ color: '#60C083', fontSize: SIZE(12) }}>{translate('common.soldout')}</Text>
                    )
                }
              </View>
              {chainType(item.nftChain)}
            </View>
          </View>
        </TouchableOpacity >}
    </>
  );
}
