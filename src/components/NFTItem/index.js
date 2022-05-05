import React, { useState } from 'react';
import { TouchableOpacity, View, Text, Image, Platform } from 'react-native';
import { C_Image } from '../../components';
import styles from './styles';
import { SIZE, SVGS } from 'src/constants';
import insertComma from '../../utils/insertComma';
import { basePriceTokens } from '../../web3/config/basePriceTokens';
import { SvgUri } from 'react-native-svg';
import { translate } from '../../walletUtils';
import { handleLikeDislike } from '../../store/actions/nftTrendList';
import { useDispatch, useSelector } from 'react-redux';
import { blockChainConfig } from '../../web3/config/blockChainConfig';

export default function NFTItem(props) {
  const {
    item,
    image,
    onPress,
    onLongPress,
    isCollection,
    index,
    isMeCollection,
    isBlind,
    nftChain,
  } = props;

  const { PolygonIcon, Ethereum, BitmapIcon, HeartWhiteIcon, HeartActiveIcon } =
    SVGS;

  const dispatch = useDispatch();
  const [isDisable, setIsDisable] = useState(false)
  const { selectedLanguageItem } = useSelector(state => state.LanguageReducer);

  let imageUri = isMeCollection ? (item.iconImage ? item.iconImage : null)
    : item.thumbnailUrl !== undefined || item.thumbnailUrl
      ? item.thumbnailUrl : item.metaData?.image;

  const chainType = type => {
    if (type === 'polygon') return <PolygonIcon />;
    if (type === 'ethereum') return <Ethereum />;
    if (type === 'binance') return <BitmapIcon />;
  };

  const nftCurrencyIcon = (CurrencyFlag, chainType) => {
    let chainTypeFlag = chainType;
    let found = basePriceTokens.find(
      token => token.value === CurrencyFlag && token.chain === chainTypeFlag,
    );
    if (found) {
      return found.icon;
    }
  };

  const renderIcon = () => {
    const uri = nftCurrencyIcon(item?.baseCurrency, item?.nftChain);
    if (uri) {
      if (uri?.split('.')[uri?.split('.').length - 1] === 'svg')
        return (
          <SvgUri
            uri={nftCurrencyIcon(item?.baseCurrency, item?.nftChain)}
            width={SIZE(12)}
            height={SIZE(12)}
          />
        );
      else return <Image source={{ uri: uri }} />;
    }
  };

  const getAuctionTimeRemain = item => {
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
          return translate('common.bidDeadLine') + ' ' + days + ' ' + translate('common.daysleft');
        } else if (hours > 0) {
          return translate('common.bidDeadLine') + ' ' + hours + ' ' + translate('common.hoursLeft');
        } else if (mins > 0) {
          return translate('common.bidDeadLine') + ' ' + mins + ' ' + translate('common.minutesLeft');
        } else if (secs > 0) {
          return translate('common.bidDeadLine') + ' ' + secs + ' ' + translate('common.secondsLeft');
        } else {
          return translate('common.bidDeadLine') + ' ' + ` ${hours}:${mins}:${secs} `;
        }
      }
    }
    return null;
  };

  const getDollarPrice = async (price = Number(price), baseCurrency) => {
    let finalPrice = '';
    let i;
    switch (nftChain) {
      case 'Binance':
        i = 0
        break;
      case 'polygon':
        i = 1
        break;
      case 'ethereum':
        i = 2
        break;
    }

    let currencyPrices = await priceInDollars(data?.user?.role === 'crypto' ? wallet?.address : blockChainConfig[i]?.walletAddressForNonCrypto)
    switch (baseCurrency) {
      case "BNB":
        finalPrice = price * currencyPrices?.BNB;
        break;

      case "ALIA":
        finalPrice = price * currencyPrices?.ALIA;
        break;

      case "ETH":
        finalPrice = price * currencyPrices?.ETH;
        break;

      case "MATIC":
        finalPrice = price * currencyPrices?.MATIC;
        break;

      default:
        finalPrice = price * 1;
        break;
    }
    return insertComma(parseFloat(finalPrice, true).toFixed(2))
  };

  let uriType, checkVideoUrl;
  if (imageUri) {
    uriType = imageUri.split('.')[imageUri.split('.').length - 1];
    checkVideoUrl = uriType === 'mp4' || uriType === 'MP4' || uriType === 'mov' || uriType === 'MOV';
  }

  let creatorName = item?.creatorObj && typeof item?.creatorObj[0] === 'object' ?
    item.creatorObj[0]?.role === 'crypto' ?
      item.creatorObj[0]?.title?.trim() ? item.creatorObj[0].title :
        item.creatorObj[0]?.name?.trim() ? item.creatorObj[0].name :
          item.creatorObj[0]?.username?.trim() ? item.creatorObj[0].username.includes('0x') ?
            item.creatorObj[0].username.substring(0, 6) : item.creatorObj[0].username :
            item.creatorObj[0]?._id ? item.creatorObj[0]._id : ""

      : item.creatorObj[0]?.username?.trim() ? item.creatorObj[0].username :
        item.creatorObj[0]?.name?.trim() ? item.creatorObj[0].name :
          item.creatorObj[0]?.title?.trim() ? item.creatorObj[0].title :
            item.creatorObj[0]?._id ? item.creatorObj[0]._id : ""
    : item?.creatorObj && item?.creatorObj[0]?._id ? item.creatorObj[0]._id : ""

  // let creatorName = item.creatorObj && item.creatorObj[0]
  // ? item.creatorObj[0].title
  // ? item.creatorObj[0].title
  // : item.creatorObj[0].username.includes('0x') ?
  // item.creatorObj[0].username.substring(0, 6) :
  // item.creatorObj[0].username
  // : ""

  // console.log("🚀 ~ file: line 143 ~ NFTItem ~ item", item, creatorName)
  return (
    <>
      {isMeCollection ? (
        <TouchableOpacity
          onLongPress={onLongPress}
          onPress={onPress}
          style={styles.listItem}>
          <C_Image
            uri={imageUri}
            type={uriType}
            imageStyle={styles.listImage}
          />
        </TouchableOpacity>
      ) : isCollection ? (
        <TouchableOpacity
          // disabled={isDisable}
          onLongPress={onLongPress}
          onPress={onPress}
          style={styles.collectionListItem}>
          <View style={styles.listItemContainer}>
            <TouchableOpacity
              onPress={() => dispatch(handleLikeDislike(item, index))}
              style={styles.likeButton}>
              {item.like ? <HeartActiveIcon /> : <HeartWhiteIcon />}
            </TouchableOpacity>
            <View>
              <C_Image
                type={uriType}
                uri={imageUri}
                imageStyle={Platform.OS === "ios" ? (checkVideoUrl ? styles.collectionListVideo : styles.collectionListImage) : styles.collectionListImage}
              />
            </View>
            <View style={styles.collectionWrapper}>
              <Text numberOfLines={1}>{item.name}</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text
                  numberOfLines={1}
                  style={{ fontSize: SIZE(12) }}>
                  {creatorName}
                </Text>
                {item.newprice &&
                  item.newprice.endTime &&
                  new Date(item.newprice.endTime) < new Date().getTime() ? (
                  <Text
                    style={{
                      color: '#60C083',
                      fontSize: SIZE(12),
                      marginVertical: SIZE(10),
                    }}>
                    {translate('common.auctionended')}
                  </Text>
                ) : item?.price ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text
                      style={{
                        color: '#60c083',
                        marginVertical: SIZE(10),
                        marginRight: SIZE(2),
                        fontSize: SIZE(12),
                      }}>
                      {item?.baseCurrency === 'ALIA'
                        ? insertComma(parseFloat(item?.price, true).toFixed(0))
                        : insertComma(item?.price, true)}
                    </Text>
                    {renderIcon()}
                  </View>
                ) : (
                  <Text
                    style={{
                      color: '#60C083',
                      fontSize: SIZE(12),
                      marginVertical: SIZE(10),
                    }}>
                    {translate('common.soldout')}
                  </Text>
                )}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                {chainType(item.nftChain)}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {item.newprice && item.newprice?.endTime ? (
                    new Date(item.newprice.endTime) < new Date().getTime() ? (
                      item.price ? (
                        <View
                          style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Text
                            numberOfLines={1}
                            style={{
                              color: '#60c083',
                              marginRight: SIZE(2),
                              fontSize: SIZE(12),
                            }}>
                            {
                              insertComma(parseFloat(item?.price, true).toFixed(0))
                            }
                          </Text>
                          {renderIcon()}
                        </View>
                      ) : null
                    ) : (
                      <Text
                        style={{
                          fontSize: SIZE(12),
                          color: '#8E9BBA',
                        }}>
                        {getAuctionTimeRemain(item)}
                      </Text>
                    )
                  ) : (
                    <>
                      {item?.lastpriceTraded ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Text
                            style={{
                              color: '#aaa',
                              fontSize: SIZE(10),
                            }}>
                            Last:{' '}
                          </Text>
                          <Text
                            style={{
                              color: '#aaa',
                              marginRight: SIZE(2),
                              fontSize: SIZE(10),
                            }}>
                            {item?.lastCurrencyTraded === 'ALIA'
                              ? insertComma(
                                parseFloat(
                                  item?.lastpriceTraded,
                                  true,
                                ).toFixed(0),
                              )
                              : insertComma(item?.lastpriceTraded, true)}
                          </Text>
                          {/* <Text
                            style={{
                              color: '#aaa',
                              fontSize: SIZE(10)
                            }}>
                            {item?.lastCurrencyTraded}
                            (~{selectedLanguageItem.language_name !=="ja" ?"$" : null}
                                {
                                getDollarPrice(
                                  item?.lastpriceTraded,
                                  item?.lastCurrencyTraded)
                                } 
                                {selectedLanguageItem.language_name ==="ja" ?" ドル" : null}
                              )
                          </Text> */}
                        </View>
                      ) : (
                        null
                      )}
                    </>
                  )}
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          // disabled={isDisable}
          onLongPress={onLongPress}
          onPress={onPress}
          style={styles.collectionListItem}>
          <View style={styles.listItemContainer}>
            <TouchableOpacity
              onPress={() => dispatch(handleLikeDislike(item, index))}
              style={styles.likeButton}>
              {item.like ? <HeartActiveIcon /> : <HeartWhiteIcon />}
            </TouchableOpacity>
            <View>
              <C_Image
                type={uriType}
                uri={imageUri}
                imageStyle={Platform.OS === "ios" ? (checkVideoUrl ? styles.collectionListVideo : styles.collectionListImage) : styles.collectionListImage}
              />
            </View>
            <View style={styles.collectionWrapper}>
              <Text numberOfLines={1}>{item.metaData?.name}</Text>
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text
                  numberOfLines={1}
                  style={{ fontSize: SIZE(12) }}>
                  {creatorName}
                </Text>
                {item.newprice &&
                  item.newprice.endTime &&
                  new Date(item.newprice.endTime) < new Date().getTime() ? (
                  <Text
                    numberOfLines={1}
                    style={{
                      color: '#60C083',
                      fontSize: SIZE(12),
                    }}>
                    {translate('common.auctionended')}
                  </Text>
                ) : item?.price ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text
                      numberOfLines={1}
                      style={{
                        color: '#60c083',
                        marginRight: SIZE(2),
                        fontSize: SIZE(12),
                      }}>
                      {
                        insertComma(parseFloat(item?.price, true).toFixed(2))
                      }
                    </Text>
                    {renderIcon()}
                  </View>
                ) : (
                  <Text
                    style={{
                      color: '#60C083',
                      fontSize: SIZE(12),
                    }}>
                    {translate('common.soldout')}
                  </Text>
                )}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                {chainType(item?.nftChain)}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {item.newprice && item.newprice?.endTime ? (
                    new Date(item.newprice.endTime) < new Date().getTime() ? (
                      item.price ? (
                        <View
                          style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Text
                            numberOfLines={1}
                            style={{
                              color: '#60c083',
                              marginRight: SIZE(2),
                              fontSize: SIZE(12),
                            }}>
                            {
                              insertComma(parseFloat(item?.price, true).toFixed(0))
                            }
                          </Text>
                          {renderIcon()}
                        </View>
                      ) : null
                    ) : (
                      <Text
                        style={{
                          fontSize: SIZE(12),
                          color: '#8E9BBA',
                        }}>
                        {getAuctionTimeRemain(item)}
                      </Text>
                    )
                  ) : (
                    <>
                      {item?.lastpriceTraded ? (
                        <View
                          style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Text
                            style={{
                              color: '#aaa',
                              fontSize: SIZE(12),
                            }}>
                            Last:{' '}
                          </Text>
                          <Text
                            style={{
                              color: '#aaa',
                              marginRight: SIZE(2),
                              fontSize: SIZE(12),
                            }}>
                            {item?.lastCurrencyTraded === 'ALIA'
                              ? insertComma(
                                parseFloat(
                                  item?.lastpriceTraded,
                                  true,
                                ).toFixed(0),
                              )
                              : insertComma(item?.lastpriceTraded, true)}
                          </Text>
                          {renderIcon()}
                        </View>
                      ) : null}
                    </>
                  )}
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </>
  );
}
