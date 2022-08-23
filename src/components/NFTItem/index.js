import React, { useState } from 'react';
import { TouchableOpacity, View, Text, Image, Platform } from 'react-native';
import { C_Image } from '../../components';
import styles from './styles';
import { SIZE, SVGS, AWARD_GOLD, AWARD_BRONZE, AWARD_SILVER, AWARD_SPECIAL, NFT_MARKET_STATUS } from 'src/constants';
import insertComma from '../../utils/insertComma';
import { basePriceTokens } from '../../web3/config/basePriceTokens';
import { basePriceTokens as availableTokens } from '../../web3/config/availableTokens';
import { SvgUri } from 'react-native-svg';
import { translate } from '../../walletUtils';
import { handleLikeDislike } from '../../store/actions/nftTrendList';
import { useDispatch, useSelector } from 'react-redux';
import FixedTouchableHighlight from '../../components/FixedTouchableHighlight'
import ProfileImg from '../../assets/pngs/default_profile_img.png'
import Ethereum from '../../assets/pngs/ethereum.png'
import { handleLike } from '../../screens/discover/discoverItem';

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
  const { PolygonIcon, Ethereum, BitmapIcon, HeartWhiteIconNew, HeartActiveIconNew } = SVGS;

  // =============== Getting data from reducer ========================
  const { selectedLanguageItem } = useSelector(state => state.LanguageReducer);

  //================== Components State Declaration ===================  
  const [isLike, setIsLike] = useState(Number(item.isLike))
  // const [liked,setLiked]
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
  const handleLikeMethod = async () => {
    let nftItem = {
      ...item,
      isLike: isLike,
      // totalLike: nftData?.totalLike
    };
    const nftData = await handleLike(nftItem);
    if (nftData) {
      setIsLike(!Number(nftItem.isLike))
      // console.log("🚀 ~ file: index.js ~ line 87 ~ ", item)
    }
  };


  const renderHeartIcon = () => {
    return (
      <TouchableOpacity
        onPress={() => handleLikeMethod()}
        style={styles.likeButton}>
        {isLike ? <HeartActiveIconNew /> : <HeartWhiteIconNew />}
      </TouchableOpacity>
    )
  }

  //================== Render Collection List Image/video Function ===================
  const renderCollectionImageNvideo = (isCollection) => {
    return (
      <View>
        <C_Image
          category={item.category}
          // type={isCollection ? isBlind ? uriType : item?.type : uriType}
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
          {/* {isBlind && item?.newpriceTraded ?
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
            </View>} */}
        </View>
      )
    } else {
      return (
        <View style={styles.collectionWrapper}>
          <View style={{ paddingHorizontal: SIZE(15), paddingVertical: SIZE(10), borderBottomWidth: SIZE(1), borderBottomColor: '#f0f0f0', }}>
            {renderNameNcreatorName(false)}
            {renderPriceNcurrencyIconContainer(false)}
          </View>
          <View style={{ paddingHorizontal: SIZE(15), paddingVertical: SIZE(6) }}>
            {renderbottomView()}
          </View>
        </View>
      )
    }
  }

  //================== Render Name and Creator Name Function ===================
  const renderNameNcreatorName = (isCollection) => {
    if (isCollection) {
      return (
        <View style={styles.nftName}>
          <Text numberOfLines={1}>{isBlind && item?.name}</Text>
          {/* <Text
            numberOfLines={1}
            style={isBlind ? styles.titleText2 : styles.titleText}>
            {getCreatorName()}
          </Text> */}
        </View>
      )
    } else {
      return (
        <View style={styles.nftName}>
          <Text numberOfLines={1} style={styles.titleText}>{item?.name}</Text>
          {/* <Text
            numberOfLines={1}
            style={styles.titleText}>
            {getCreatorName()}
          </Text> */}
        </View>
      )
    }
  }


  //================== Render Price and Currency Icons Function ===================
  const getSaleStatus = (marketplaceStatus, saleDataAuction) => {
    switch (marketplaceStatus) {
      case NFT_MARKET_STATUS.NOT_ON_SALE:
        return (
          <Text style={styles.statusNotOnSale}>
            {translate('common.notforsale')}
          </Text>
        )
      case NFT_MARKET_STATUS.ON_FIX_PRICE:
        return (
          <Text style={styles.statusOnSale}>
            {translate('common.onSale')}
          </Text>
        )
      case NFT_MARKET_STATUS.ON_AUCTION:
      case NFT_MARKET_STATUS.CANCEL_AUCTION:
      case NFT_MARKET_STATUS.UPCOMMING_AUCTION:
      case NFT_MARKET_STATUS.END_AUCTION:
        if (
          saleDataAuction &&
          Number(saleDataAuction.startPrice) ===
          Number(saleDataAuction.highestPrice)
        ) {
          return (
            <Text style={styles.statusOnSale}>
              {`${translate('common.min')} ${translate('common.Bids')}`}
            </Text>
          )
        }
        return (
          <Text style={styles.statusOnSale}>
            {translate('common.highestBid')}
          </Text>
        )
    }
  }


  const renderPriceNcurrencyIconContainer = (isCollection) => {
    return (
      <View
        style={styles.newPrice}>
        {/* {item.newprice &&
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
        )} */}
        {/* <Text style={item?.tokenPrice !== "" && item?.tokenPriceIcon ? styles.statusOnSale : styles.statusNotOnSale}>{item?.tokenPrice !== "" && item?.tokenPriceIcon ? 'On Sale' : 'Not On Sale'}</Text> */}
        {getSaleStatus(item?.marketNftStatus, item?.saleData?.auction)}
        {item.marketNftStatus !== NFT_MARKET_STATUS.NOT_ON_SALE && (<View style={styles.currencyInfoContainer}>
          {item.saleData?.fixPrice?.tokenPriceIcon ? <Image style={styles.tokenIcon} source={{
            uri: item.saleData?.fixPrice?.tokenPriceIcon
          }} /> : item.saleData?.auction?.tokenPriceIcon ? <Image style={styles.tokenIcon} source={{
            uri: item.saleData?.auction?.tokenPriceIcon
          }} /> : <Image style={styles.tokenIcon} source={Ethereum} />}
          <Text style={styles.price}>
            {Number(
              item.saleData?.fixPrice
                ? item.saleData?.fixPrice?.price
                : item.saleData?.auction
                  ? item.saleData?.auction?.highestPrice
                  : 0,
            )}
          </Text>
        </View>)}
      </View>
    )
  }

  // const renderPriceNcurrencyIcons = (isCollection) => {
  //   if (isCollection) {
  //     return (
  //       <View style={styles.priceView}>
  //         <Text
  //           style={styles.priceText}>
  //           {item?.baseCurrency === 'ALIA'
  //             ? insertComma(parseFloat(item?.price, true).toFixed(0))
  //             : item?.price % 1 != 0 ?
  //               insertComma(parseFloat(item?.price, true).toFixed(2)) :
  //               insertComma(parseFloat(item?.price, true).toFixed(0))
  //           }
  //         </Text>
  //         {renderIcon()}
  //       </View>
  //     )
  //   } else {
  //     return (
  //       <View style={styles.endTimeView}>
  //         <Text
  //           numberOfLines={1}
  //           style={styles.priceText1}>
  //           {
  //             // insertComma(parseFloat(item?.price, true).toFixed(2))
  //             item?.price < 1
  //               ? Math.round((item?.price) * 100) / 100
  //                 ? Math.round((item?.price) * 100) / 100
  //                 : insertComma(parseFloat(item?.price, true).toFixed(2))
  //               : insertComma(parseFloat(item?.price, true).toFixed(0))
  //             // : insertComma(item?.price, true)
  //           }
  //         </Text>
  //         {renderIcon()}
  //       </View>
  //     )
  //   }
  // }

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

  const renderbottomView = () => {
    return <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <SvgUri
        uri={item?.network?.avatar}
        style={styles.tokenIcon2}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity>
          {item?.creator?.avatar ?
            <Image style={styles.creatorIcon} source={{ uri: item?.creator?.avatar }} /> :
            <Image style={styles.creatorIcon} source={ProfileImg} />}
        </TouchableOpacity>
        <View style={styles.ownerContainer}>
          <TouchableOpacity>
            {item?.owner?.avatar ?
              <Image style={styles.ownerIcon} source={{ uri: item?.owner?.avatar }} /> :
              <Image style={styles.ownerIcon} source={ProfileImg} />}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  }


  // const renderChainViewColumn = (isCollection) => {
  //   if (isCollection) {
  //     return (
  //       <View
  //         style={styles.chainViewColumn}>
  //         <View style={{ marginBottom: 5, marginHorizontal: 5 }}>
  //           {chainType(iconNftChain)}
  //         </View>
  //         {/* <View style={styles.endTimeView}> */}
  //         <View style={styles.endTimeView}>
  //           <Text
  //             style={styles.lastText}>
  //             Last:{' '}
  //           </Text>
  //           <Text
  //             style={styles.lastPriceText}>
  //             {item?.newpriceTraded?.PirceC
  //               ? insertComma(
  //                 parseFloat(
  //                   item?.newpriceTraded?.priceConversion,
  //                   // item?.lastpriceTraded,
  //                   true,
  //                 ).toFixed(0),
  //               )
  //               : item?.price ?
  //                 insertComma(item.price, true) :
  //                 insertComma(item?.newpriceTraded?.priceConversion, true)
  //             }
  //           </Text>
  //           <Text style={styles.lastPriceText}>{lastCurrency[0]?.key}</Text>
  //           {/* </View> */}
  //         </View>
  //       </View>
  //     )
  //   } else {
  //     return (
  //       <View
  //         style={styles.chainView}>
  //         <View style={{ flexDirection: 'row' }}>
  //           {chainType(item?.nftChain ? item.nftChain : iconNftChain)}
  //           {item.isForAward ? <Image style={styles.awadImage} source={{ uri: getAwardsIcon(item?.award_type) }} /> : null}
  //         </View>
  //         <View style={styles.endTimeView}>
  //           {item.newprice && item.newprice?.endTime ? (
  //             new Date(item.newprice.endTime) < new Date().getTime() ? (
  //               item.price ? (
  //                 <View
  //                   style={styles.endTimeView}>
  //                   <Text
  //                     numberOfLines={1}
  //                     style={styles.priceText1}>
  //                     {
  //                       insertComma(parseFloat(item?.price, true).toFixed(0))
  //                     }
  //                   </Text>
  //                   {renderIcon()}
  //                 </View>
  //               ) : null
  //             ) : (
  //               <Text
  //                 style={styles.auctionTimeRemainText}>
  //                 {getAuctionTimeRemain(item)}
  //               </Text>
  //             )
  //           ) : (
  //             <>
  //               {item?.lastpriceTraded ? (
  //                 <View
  //                   style={styles.endTimeView}>
  //                   <Text
  //                     style={styles.lastText}>
  //                     Last:{' '}
  //                   </Text>
  //                   <Text
  //                     style={styles.lastPriceText}>
  //                     {item?.lastCurrencyTraded === 'ALIA'
  //                       ? insertComma(
  //                         parseFloat(
  //                           item?.lastpriceTraded,
  //                           true,
  //                         ).toFixed(0),
  //                       )
  //                       : insertComma(item?.lastpriceTraded, true)}
  //                   </Text>
  //                   {renderIcon()}
  //                 </View>
  //               ) : null}
  //             </>
  //           )}
  //         </View>
  //       </View>
  //     )
  //   }
  // }

  //================== Render End Time View Function ===================
  // const renderEndTimeView = () => {
  //   return (
  //     <View
  //       style={styles.endTimeView}>
  //       <Text
  //         numberOfLines={1}
  //         style={styles.priceText1}>
  //         {
  //           insertComma(parseFloat(item?.price, true).toFixed(0))
  //         }
  //       </Text>
  //       {renderIcon()}
  //     </View>
  //   )
  // }

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
    let imageUri = image ? image : item?.mediaUrl
    return imageUri
  }

  let mediaUrl = item?.mediaUrl;
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
      item?.Chain ? item.Chain : item?.chain ? item.chain : item?.mainTokenId?.toString().split("-")[0] :
      item?.nftChain ? item.nftChain : item?.mainTokenId?.toString().split("-")[0] :
    item?.mainTokenId ? item?.mainTokenId?.toString().split("-")[0]
      : item?.nftChain ? item.nftChain : ''

  const chainType = (type) => {
    ; //Hardcoded as per web requirements
    if (type === 'Polygon') return <PolygonIcon />;
    if (type === 'Ethereum') return <Ethereum />;
    if (type === 'BSC') return <BitmapIcon />;
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
