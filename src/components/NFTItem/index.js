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
  const { item, image, onPress, onLongPress, isCollection, index, isMeCollection } = props;

  const {
    PolygonIcon,
    Ethereum,
    BitmapIcon,
    HeartWhiteIcon,
    HeartActiveIcon,
  } = SVGS;

  const dispatch = useDispatch();

  let imageUri =
    (item.thumbnailUrl !== undefined || item.thumbnailUrl)
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
    if (uri?.split('.')[uri?.split('.').length - 1] === 'svg')
      return <SvgUri uri={nftCurrencyIcon(item?.baseCurrency, item?.nftChain)} width={SIZE(12)} height={SIZE(12)} />
    else return <Image source={{ uri: uri }} />
  }

  const getAuctionTimeRemain = (item) => {
    if (item.newprice && item.newprice.endTime) {
      const diff =
        new Date(item.newprice.endTime).getTime() - new Date().getTime();
      if (diff <= 0) {
        return null;
      } else {
        let days = parseInt(diff / (1000 * 60 * 60 * 24));
        let hours = parseInt(diff / (1000 * 60 * 60));
        let mins = parseInt(diff / (1000 * 60));
        let secs = parseInt(diff / 1000);

        if (days > 0) {
          return (
            <Text style={{
              fontSize: SIZE(12),
              color: '#8E9BBA',
            }}>
              {`${days} Days Left`}
            </Text>
          );
        }
        // else  if (hours > 0) {
        //     return hours + " hours left";
        //   }
        //  else if (mins > 0) {
        //     return mins + " minutes left";
        //   }
        //  else if (secs > 0) {
        //     return secs + " seconds left";
        //   }
        else {
          return (
            <Text style={{
              fontSize: SIZE(12),
              color: '#8E9BBA',
            }}>{`Bid Dead Line ${hours}:${mins}:${secs} `}
            </Text>
          );
        }
      }
    }
    return null;
  };

  return (
    <>
        {isMeCollection ?
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
            </TouchableOpacity> :
        isCollection ?
            <TouchableOpacity
                onLongPress={onLongPress}
                onPress={onPress}
                style={styles.collectionListItem}>
                <View style={styles.listItemContainer}>
                    <TouchableOpacity
                        onPress={() => dispatch(handleLikeDislike(item, index))}
                        style={styles.likeButton}
                    >
                        {item.like ? <HeartActiveIcon/> : <HeartWhiteIcon/>}
                    </TouchableOpacity>
                    <View>
                        <C_Image
                            type={
                                imageUri.split('.')[
                                imageUri.split('.').length - 1
                                    ]
                            }
                            uri={imageUri}
                            imageStyle={styles.collectionListImage}
                        />
                    </View>
                    <View style={styles.collectionWrapper}>
                        <Text>{item.name}</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>

                            {
                                item.newprice && item.newprice.endTime && new Date(item.newprice.endTime) < new Date().getTime() ?
                                    <Text style={{
                                        color: '#60C083',
                                        fontSize: SIZE(12),
                                        marginVertical: SIZE(10)
                                    }}>{translate('common.auctionended')}</Text>
                                    :
                                    item?.price ? (
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style={{
                                                color: '#60c083',
                                                marginVertical: SIZE(10),
                                                marginRight: SIZE(2),
                                                fontSize: SIZE(12)
                                            }}>
                                                {
                                                    item?.baseCurrency === "ALIA" ?
                                                        insertComma(parseFloat(item?.price, true).toFixed(0)) :
                                                        insertComma(item?.price, true)
                                                }
                                            </Text>
                                            {renderIcon()}
                                        </View>
                                    ) : (
                                        <Text style={{
                                            color: '#60C083',
                                            fontSize: SIZE(12),
                                            marginVertical: SIZE(10)
                                        }}>{translate('common.soldout')}</Text>
                                    )
                            }
                        </View>
                        {chainType(item.nftChain)}
                    </View>
                </View>
            </TouchableOpacity>
            :<TouchableOpacity
                        onLongPress={onLongPress}
                        onPress={onPress}
                        style={styles.collectionListItem}>
                        <View style={styles.listItemContainer}>
                            <TouchableOpacity
                                onPress={() => dispatch(handleLikeDislike(item, index))}
                                style={styles.likeButton}
                            >
                                {item.like ? <HeartActiveIcon/> : <HeartWhiteIcon/>}
                            </TouchableOpacity>
                            <View>
                                <C_Image
                                    type={
                                        imageUri?.split('.')[
                                        imageUri?.split('.').length - 1
                                            ]
                                    }
                                    uri={imageUri}
                                    imageStyle={styles.collectionListImage}
                                />
                            </View>
                            <View style={styles.collectionWrapper}>
                                <Text numberOfLines={1}>{item.metaData?.name}</Text>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <Text numberOfLines={1} style={{fontSize: SIZE(12), marginVertical: SIZE(10), width: SIZE(80)}}>
                                        {item.creatorObj && item.creatorObj[0]
                                            ? item.creatorObj[0].title
                                                ? item.creatorObj[0].title
                                                : item.creatorObj[0].username
                                            : ""}
                                    </Text>
                                    {
                                        item.newprice && item.newprice.endTime && new Date(item.newprice.endTime) < new Date().getTime() ?
                                            <Text
                                                numberOfLines={1}
                                                style={{
                                                    color: '#60C083',
                                                    fontSize: SIZE(12),
                                                    marginVertical: SIZE(10)
                                                }}>{translate('common.auctionended')}</Text>
                                            :
                                            item?.price ? (
                                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                    <Text
                                                        numberOfLines={1}
                                                        style={{
                                                            color: '#60c083',
                                                            marginVertical: SIZE(10),
                                                            marginRight: SIZE(2),
                                                            fontSize: SIZE(12)
                                                        }}>
                                                        {
                                                            item?.baseCurrency === "ALIA" ?
                                                                insertComma(parseFloat(item?.price, true).toFixed(0)) :
                                                                insertComma(item?.price, true)
                                                        }
                                                    </Text>
                                                    {renderIcon()}
                                                </View>
                                            ) : (
                                                <Text style={{
                                                    color: '#60C083',
                                                    fontSize: SIZE(12),
                                                    marginVertical: SIZE(10)
                                                }}>{translate('common.soldout')}</Text>
                                            )
                                    }
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    {chainType(item?.nftChain)}
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        {
                                            item.newprice && item.newprice?.endTime ? (
                                                new Date(item.newprice.endTime) < new Date().getTime() ? (
                                                    item.price ? (
                                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                            <Text
                                                                numberOfLines={1}
                                                                style={{
                                                                    color: '#60c083',
                                                                    marginRight: SIZE(2),
                                                                    fontSize: SIZE(12)
                                                                }}>
                                                                {
                                                                    item?.baseCurrency === "ALIA" ?
                                                                        insertComma(parseFloat(item?.price, true).toFixed(0)) :
                                                                        insertComma(item?.price, true)
                                                                }
                                                            </Text>
                                                            {renderIcon()}
                                                        </View>
                                                    ) : null
                                                ) : (
                                                    getAuctionTimeRemain(item)
                                                )
                                            ) : (
                                                <>
                                                    {
                                                        item?.lastpriceTraded ? (
                                                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                                <Text
                                                                style={{
                                                                    color: '#aaa',
                                                                    fontSize: SIZE(12)
                                                                }}>Last: </Text>
                                                                <Text style={{
                                                                    color: '#aaa',
                                                                    marginRight: SIZE(2),
                                                                    fontSize: SIZE(12)
                                                                }}>
                                                                    {
                                                                        item?.lastCurrencyTraded === "ALIA" ?
                                                                            insertComma(parseFloat(item?.lastpriceTraded, true).toFixed(0)) :
                                                                            insertComma(item?.lastpriceTraded, true)
                                                                    }
                                                                </Text>
                                                                {renderIcon()}
                                                            </View>
                                                        ) : null
                                                    }
                                                </>
                                            )
                                        }
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
      }
    </>
  );
}
