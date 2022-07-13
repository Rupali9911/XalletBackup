import React, { useState } from 'react';
import { TouchableOpacity, View, Text, Image, Platform } from 'react-native';
import { C_Image } from '../../components';
import styles from './styles';
import { SIZE, SVGS, AWARD_GOLD, AWARD_BRONZE, AWARD_SILVER, AWARD_SPECIAL } from 'src/constants';
import insertComma from '../../utils/insertComma';
import { basePriceTokens } from '../../web3/config/basePriceTokens';
import { basePriceTokens as availableTokens } from '../../web3/config/availableTokens';
import { SvgUri } from 'react-native-svg';
import { translate } from '../../walletUtils';
import { handleLikeDislike } from '../../store/actions/nftTrendList';
import { useDispatch, useSelector } from 'react-redux';
import FixedTouchableHighlight from '../../components/FixedTouchableHighlight'

export default function NFTItem(props) {
  const dispatch = useDispatch();

  // ======================= Props Destructing =======================
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
    screenName,
    isStore,
  } = props;

  // ======================= SVGS Destructing =======================
  const { PolygonIcon, Ethereum, BitmapIcon, HeartWhiteIcon, HeartActiveIcon } = SVGS;

  // =============== Getting data from reducer ========================
  const { selectedLanguageItem } = useSelector(state => state.LanguageReducer);

  //================== Components State Declaration ===================  
  const [isDisable, setIsDisable] = useState(false)

  //================== Render Me Collection Images Function ===================
  const renderMeCollection = () => {
    return (
      <FixedTouchableHighlight
        onLongPress={onLongPress}
        onPress={onPress}
        style={styles.listItem}>
        <C_Image
          uri={getImageUri()}
          type={item?.type}
          imageStyle={styles.listImage}
        />
      </FixedTouchableHighlight>
    )
  }

  //======== Render NFT Collection Items Collection Images Function ============
  const renderNFTCollectionItem = (isCollection) => {
    return (
      <FixedTouchableHighlight
        // disabled={isDisable}
        onLongPress={onLongPress}
        onPress={onPress}
        style={styles.collectionListItem}>
        <View style={styles.listItemContainer}>
          {renderHeartIcon()}
          {renderCollectionImageNvideo(isCollection)}
          {renderCollectionWrapper(isCollection)}
        </View>
      </FixedTouchableHighlight>
    )
  }

  //================== Render Heart Icon Function ===================
  const renderHeartIcon = () => {
    return (
      <TouchableOpacity
        onPress={() => dispatch(handleLikeDislike(item, index, screenName))}
        style={styles.likeButton}>
        {item.like ? <HeartActiveIcon /> : <HeartWhiteIcon />}
      </TouchableOpacity>
    )
  }

  //================== Render Collection List Image/video Function ===================
  const renderCollectionImageNvideo = (isCollection) => {
    return (
      <View>
        <C_Image
          type={isCollection ? isBlind ? uriType : item?.type : uriType}
          uri={getImageUri()}
          imageStyle={Platform.OS === "ios" ? (checkVideoUrl ? styles.collectionListVideo : styles.collectionListImage) : styles.collectionListImage}
        />
      </View>
    )
  }

  //================== Render Collection wrapper Function ======================
  const renderCollectionWrapper = (isCollection) => {
    if (isCollection) {
      return (
        <View style={isBlind ? styles.collectionWrapperBlind : styles.collectionWrapper}>
          {renderNameNcreatorName(true)}
          {renderPriceNcurrencyIconContainer(true)}
          {/* {isBlind && <View style={styles.Line} />} */}
          {isBlind && item?.newpriceTraded ?
            renderChainViewColumn(true)
            :
            <View
              style={styles.chainView1}>
              {chainType(iconNftChain)}
              <View style={styles.endTimeView}>
                {item.newprice && item.newprice?.endTime ? (
                  new Date(item.newprice.endTime) < new Date().getTime() ? (
                    item.price ? renderEndTimeView() : null) : (
                    <Text
                      style={styles.auctionTimeRemainText}>
                      {getAuctionTimeRemain(item)}
                    </Text>
                  )
                ) : (
                  <>
                    {item?.lastpriceTraded ? renderEndTimeViewLastPrice() : null}
                  </>
                )}
              </View>
            </View>}
        </View>
      )
    } else {
      return (
        <View style={styles.collectionWrapper}>
          {renderNameNcreatorName(false)}
          {renderPriceNcurrencyIconContainer(false)}
          {renderChainViewColumn(false)}
        </View>
      )
    }
  }

  //================== Render Name and Creator Name Function ===================
  const renderNameNcreatorName = (isCollection) => {
    if (isCollection) {
      return (
        <>
          <Text numberOfLines={1}>{isBlind ? item?.metaData ? item?.metaData.name : item.name : item.name}</Text>
          <Text
            numberOfLines={1}
            style={isBlind ? styles.titleText2 : styles.titleText}>
            {getCreatorName()}
          </Text>
        </>
      )
    } else {
      return (
        <>
          <Text numberOfLines={1}>{item.metaData?.name}</Text>
          <Text
            numberOfLines={1}
            style={styles.titleText}>
            {getCreatorName()}
          </Text>
        </>
      )
    }
  }

  //================== Render Price and Currency Icons Function ===================
  const renderPriceNcurrencyIconContainer = (isCollection) => {
    return (
      <View
        style={styles.newPrice}>
        {item.newprice &&
          item.newprice.endTime &&
          new Date(item.newprice.endTime) < new Date().getTime() ? (
          <Text
            style={isCollection ? styles.AuctionText : styles.auctionEnded}>
            {translate('common.auctionended')}
          </Text>
        ) : item?.price ? renderPriceNcurrencyIcons(isCollection) : (
          <Text
            style={isCollection ? styles.soldOutText : styles.soldOutText1}>
            {translate('common.soldout')}
          </Text>
        )}
      </View>
    )
  }

  const renderPriceNcurrencyIcons = (isCollection) => {
    if (isCollection) {
      return (
        <View style={styles.priceView}>
          <Text
            style={styles.priceText}>
            {item?.baseCurrency === 'ALIA'
              ? insertComma(parseFloat(item?.price, true).toFixed(0))
              : item?.price % 1 != 0 ?
                insertComma(parseFloat(item?.price, true).toFixed(2)) :
                insertComma(parseFloat(item?.price, true).toFixed(0))
            }
          </Text>
          {renderIcon()}
        </View>
      )
    } else {
      return (
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
      )
    }
  }

  const renderIcon = () => {
    const baseCurrency = item?.baseCurrency ? item.baseCurrency : item?.newprice?.baseCurrency ? item.newprice.baseCurrency : 0
    const nftChain = item?.nftChain ? item?.nftChain : item?.newprice?.mainChain
    const uri = nftCurrencyIcon(baseCurrency, nftChain);
    if (uri) {
      if (uri?.split('.')[uri?.split('.').length - 1] === 'svg')
        return (
          <SvgUri
            uri={nftCurrencyIcon(baseCurrency, nftChain)}
            width={SIZE(12)}
            height={SIZE(12)}
          />
        );
      else return <Image source={{ uri: uri }} />;
    }
  };

  //================== Render Chain view column Function ===================
  const renderChainViewColumn = (isCollection) => {
    if (isCollection) {
      return (
        <View
          style={styles.chainViewColumn}>
          <View style={{ marginBottom: 5, marginHorizontal: 5 }}>
            {chainType(iconNftChain)}
          </View>
          {/* <View style={styles.endTimeView}> */}
          <View style={styles.endTimeView}>
            <Text
              style={styles.lastText}>
              Last:{' '}
            </Text>
            <Text
              style={styles.lastPriceText}>
              {item?.newpriceTraded?.PirceC
                ? insertComma(
                  parseFloat(
                    item?.newpriceTraded?.priceConversion,
                    // item?.lastpriceTraded,
                    true,
                  ).toFixed(0),
                )
                : item?.price ?
                  insertComma(item.price, true) :
                  insertComma(item?.newpriceTraded?.priceConversion, true)
              }
            </Text>
            <Text style={styles.lastPriceText}>{lastCurrency[0]?.key}</Text>
            {/* </View> */}
          </View>
        </View>
      )
    } else {
      return (
        <View
          style={styles.chainView}>
          <View style={{ flexDirection: 'row' }}>
            {chainType(item?.nftChain)}
            {item.isForAward ? <Image style={styles.awadImage} source={{ uri: getAwardsIcon(item?.award_type) }} /> : null}
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
      )
    }
  }

  //================== Render End Time View Function ===================
  const renderEndTimeView = () => {
    return (
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
    )
  }

  //================== Render End Time View Last Price Function ===================
  const renderEndTimeViewLastPrice = () => {
    return (
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
          (~{selectedLanguageItem.language_name !== "ja" ? "$" : null}
          {
            getDollarPrice(
              item?.lastpriceTraded,
              item?.lastCurrencyTraded)
          }
          {selectedLanguageItem.language_name === "ja" ? " ドル" : null}
          )
        </Text> */}
      </View>
    )
  }

  //================== Other Functions ===================
  const getImageUri = () => {
    let imageUri = isStore ? image ?
      image : item.thumbnailUrl !== undefined || item.thumbnailUrl ? item.thumbnailUrl : item.metaData?.image
      : isMeCollection ? (item.iconImage ? item.iconImage : null)
        : item.thumbnailUrl !== undefined || item.thumbnailUrl
          ? item.thumbnailUrl : isBlind ? item.metaData?.thumbnft : item.metaData?.image;
    return imageUri
  }

  let mediaUrl = item?.metaData?.image;
  let uriType, checkVideoUrl;
  if (mediaUrl) {
    uriType = mediaUrl.split('.')[mediaUrl.split('.').length - 1];
    checkVideoUrl = uriType === 'mp4' || uriType === 'MP4' || uriType === 'mov' || uriType === 'MOV';
  }

  let lastCurrency = availableTokens.filter(
    token => item?.newpriceTraded?.mainChain == token?.chain && item?.newpriceTraded?.baseCurrency == token.order
  );

  let iconNftChain = isBlind ?
    item?.newpriceTraded ?
      item?.Chain ? item.Chain : item?.mainTokenId?.toString().split("-")[0] :
      item?.nftChain ? item.nftChain : item?.mainTokenId?.toString().split("-")[0] :
    item?.mainTokenId ? item?.mainTokenId?.toString().split("-")[0]
      : item?.nftChain ? item.nftChain : ''

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
    let search = basePriceTokens.find(
      token => token.order === CurrencyFlag && token.chain === chainTypeFlag,
    )
    if (found) {
      return found.icon;
    } else if (search) {
      return search.icon
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

  const getCreatorName = () => {
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
    return creatorName
  }

  // =================== Start Commented Code =================================
  // const getDollarPrice = async (price = Number(price), baseCurrency) => {
  //   let finalPrice = '';
  //   let i;
  //   switch (nftChain) {
  //     case 'Binance':
  //       i = 0
  //       break;
  //     case 'polygon':
  //       i = 1
  //       break;
  //     case 'ethereum':
  //       i = 2
  //       break;
  //   }

  //   let currencyPrices = await priceInDollars(data?.user?.role === 'crypto' ? wallet?.address : blockChainConfig[i]?.walletAddressForNonCrypto)
  //   switch (baseCurrency) {
  //     case "BNB":
  //       finalPrice = price * currencyPrices?.BNB;
  //       break;

  //     case "ALIA":
  //       finalPrice = price * currencyPrices?.ALIA;
  //       break;

  //     case "ETH":
  //       finalPrice = price * currencyPrices?.ETH;
  //       break;

  //     case "MATIC":
  //       finalPrice = price * currencyPrices?.MATIC;
  //       break;

  //     default:
  //       finalPrice = price * 1;
  //       break;
  //   }
  //   return insertComma(parseFloat(finalPrice, true).toFixed(2))
  // };

  // let creatorName = item.creatorObj && item.creatorObj[0]
  // ? item.creatorObj[0].title
  // ? item.creatorObj[0].title
  // : item.creatorObj[0].username.includes('0x') ?
  // item.creatorObj[0].username.substring(0, 6) :
  // item.creatorObj[0].username
  // : ""
  // =================== End Commented Code =================================

  //=====================(Main return Function)=============================
  return (
    <>
      {isMeCollection ? renderMeCollection() : isCollection ? renderNFTCollectionItem(true) : renderNFTCollectionItem(false)}
    </>
  );
}
