import React, { useState } from 'react';
import { TouchableOpacity, View, Text, Image, Platform } from 'react-native';
import { C_Image } from '../../components';
import styles from './styles';
import {SIZE, SVGS, AWARD_GOLD, AWARD_BRONZE, AWARD_SILVER, AWARD_SPECIAL, COLORS} from 'src/constants';
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
    screenName
  } = props;

  const { PolygonIcon, Ethereum, BitmapIcon, HeartWhiteIcon, HeartActiveIcon } =
    SVGS;

  const dispatch = useDispatch();
  const [isDisable, setIsDisable] = useState(false)
  const { selectedLanguageItem } = useSelector(state => state.LanguageReducer);

  let imageUri = isMeCollection ? (item.iconImage ? item.iconImage : null)
    : item.thumbnailUrl !== undefined || item.thumbnailUrl
      ? item.thumbnailUrl : item.metaData?.image;

  let mediaUrl = item?.metaData?.image ;

  const chainType = type => {
    if (item.isForAward) return <Ethereum />; //Hardcoded as per web requirements
    if (type === 'polygon') return <PolygonIcon />;
    if (type === 'ethereum') return <Ethereum />;
    if (type === 'binance') return <BitmapIcon />;
  };

  const nftCurrencyIcon = (CurrencyFlag, chainType) => {
    if (item.isForAward) return basePriceTokens[1].icon; //Hardcoded as per web requirements
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

    const getAwardsIcon = (awardType) => {
        switch (awardType) {
            case "GOLD_Award":
                return AWARD_GOLD
            case "BRONZE_Award":
                return AWARD_BRONZE
            case "SILVER_Award":
                return AWARD_SILVER
            case "Special_Award":
                return AWARD_SPECIAL
            default:
                return AWARD_SPECIAL
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
  if (mediaUrl) {
    uriType = mediaUrl.split('.')[mediaUrl.split('.').length - 1];
    checkVideoUrl = uriType === 'mp4' || uriType === 'MP4' || uriType === 'mov' || uriType === 'MOV';
  }
  // console.log(item.name, "/////////")
  return (
    <>
      {isMeCollection ? (
        <TouchableOpacity
          onLongPress={onLongPress}
          onPress={onPress}
          style={styles.listItem}>
          <C_Image
            uri={imageUri}
            type={item?.type}
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
              onPress={() => dispatch(handleLikeDislike(item, index, screenName))}
              style={styles.likeButton}>
              {item.like ? <HeartActiveIcon /> : <HeartWhiteIcon />}
            </TouchableOpacity>
            <View>
              <C_Image
                type={item?.type}
                uri={imageUri}
                imageStyle={Platform.OS === "ios" ? (checkVideoUrl ? styles.collectionListVideo : styles.collectionListImage) : styles.collectionListImage}
              />
            </View>
            <View style={styles.collectionWrapper}>
              <Text numberOfLines={1}>{item.name}</Text>
              <View
                style={styles.titleView}>
                <Text
                  numberOfLines={1}
                  style={styles.titleText}>
                  {item.creatorObj && item.creatorObj[0]
                    ? item.creatorObj[0].title
                      ? item.creatorObj[0].title
                      : item.creatorObj[0].username.includes('0x') ?
                        item.creatorObj[0].username.substring(0, 6) :
                        item.creatorObj[0].username
                      : ""}
                </Text>
                {item.newprice &&
                  item.newprice.endTime &&
                  new Date(item.newprice.endTime) < new Date().getTime() ? (
                  <Text
                    style={styles.AuctionText}>
                    {translate('common.auctionended')}
                  </Text>
                ) : item?.price ? (
                  <View style={styles.priceView}>
                    <Text
                      style={styles.priceText}>
                      {item?.baseCurrency === 'ALIA'
                        ? insertComma(parseFloat(item?.price, true).toFixed(0))
                        : insertComma(item?.price, true)}
                    </Text>
                    {renderIcon()}
                  </View>
                ) : (
                  <Text
                    style={styles.soldOutText}>
                    {translate('common.soldout')}
                  </Text>
                )}
              </View>
              <View
                style={styles.chainView}>
                {chainType(item.nftChain)}
                <View style={styles.endTimeView}>
                  {item.newprice && item.newprice?.endTime ? (
                    new Date(item.newprice.endTime) < new Date().getTime() ? (
                      item.price ? (
                        <View
                          style={styles.endTimeView}>
                          <Text
                            numberOfLines={1}
                            style={styles.priceText1}>
                            {
                              insertComma(parseFloat(item?.price, true).toFixed(0))
                            }
                          </Text>
                          {renderIcon()}
                        </View>
                      ) : null
                    ) : (
                      <Text
                        style={styles.auctionTimeRemainText}>
                        {getAuctionTimeRemain(item)}
                      </Text>
                    )
                  ) : (
                    <>
                      {item?.lastpriceTraded ? (
                        <View style={styles.endTimeView}>
                          <Text
                            style={styles.lastText}>
                            Last:{' '}
                          </Text>
                          <Text
                            style={styles.lastPriceText}>
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
              onPress={() => dispatch(handleLikeDislike(item, index, screenName))}
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
                <Text
                    numberOfLines={1}
                    style={styles.titleText}>
                    {item.creatorObj && item.creatorObj[0]
                        ? item.creatorObj[0].title
                            ? item.creatorObj[0].title
                            : item.creatorObj[0].username.includes('0x') ?
                                item.creatorObj[0].username.substring(0, 6) :
                                item.creatorObj[0].username
                        : ""}
                </Text>
              <View
                style={styles.newPrice}>
                {item.newprice &&
                  item.newprice.endTime &&
                  new Date(item.newprice.endTime) < new Date().getTime() ? (
                  <Text
                    numberOfLines={1}
                    style={styles.auctionEnded}>
                    {translate('common.auctionended')}
                  </Text>
                ) : item?.price ? (
                  <View style={styles.endTimeView}>
                    <Text
                      numberOfLines={1}
                      style={styles.priceText1}>
                      {
                       // insertComma(parseFloat(item?.price, true).toFixed(2))
                          item?.price < 1
                            ? Math.round((item?.price) * 100) / 100
                                ? Math.round((item?.price) * 100) / 100
                                : insertComma(parseFloat(item?.price, true).toFixed(2))
                            : insertComma(parseFloat(item?.price, true).toFixed(0))
                            // : insertComma(item?.price, true)
                      }
                    </Text>
                    {renderIcon()}
                  </View>
                ) : (
                    <Text
                        style={styles.soldOutText1}>
                        {translate('common.soldout')}
                    </Text>
                )}
              </View>
              <View
                style={styles.chainView}>
                <View style={{flexDirection: 'row'}}>
                {chainType(item?.nftChain)}
                  {item.isForAward ? <Image style={styles.awadImage} source={{uri: getAwardsIcon(item?.award_type)}} /> : null}
                  </View>
                <View style={styles.endTimeView}>
                  {item.newprice && item.newprice?.endTime ? (
                    new Date(item.newprice.endTime) < new Date().getTime() ? (
                      item.price ? (
                        <View
                          style={styles.endTimeView}>
                          <Text
                            numberOfLines={1}
                            style={styles.priceText1}>
                            {
                              insertComma(parseFloat(item?.price, true).toFixed(0))
                            }
                          </Text>
                          {renderIcon()}
                        </View>
                      ) : null
                    ) : (
                      <Text
                        style={styles.auctionTimeRemainText}>
                        {getAuctionTimeRemain(item)}
                      </Text>
                    )
                  ) : (
                    <>
                      {item?.lastpriceTraded ? (
                        <View
                          style={styles.endTimeView}>
                          <Text
                            style={styles.lastText}>
                            Last:{' '}
                          </Text>
                          <Text
                            style={styles.lastPriceText}>
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
