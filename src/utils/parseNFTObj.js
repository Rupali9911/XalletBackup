import { basePriceTokens } from "../web3/config/availableTokens";
import { CDN_LINK } from "../web3/config/blockChainConfig";

export const getBaseCurrency = (chain, order) => {
  let baseCurrency = basePriceTokens.filter(
    (token) => token.chain === chain && token.order === parseInt(order)
  );
  return baseCurrency.length > 0 ? baseCurrency[0].key : "ALIA";
};

export function parseNftObject(obj) {
  let nftObj = {
    name: obj?.metaData?.name,
    image: obj?.metaData?.image ? obj?.metaData?.image : obj?.imageUrl,
    description: obj?.metaData?.description
      ? obj?.metaData?.description
      : obj?.description,
    title: obj?.metaData?.name ? obj?.metaData?.name : obj?.artName,
    type: obj?.metaData?.properties?.type
      ? obj?.metaData?.properties?.type
      : obj?.type,
    price: obj?.price,
    like: obj?.like,
    rating: obj?.rating || obj?.rating === 0 ? obj?.rating : obj?.like_count,
    thumbnailUrl: obj?.thumbnailUrl ? obj?.thumbnailUrl : obj?.thumbnail,
    newprice: obj?.newprice,
    awardPage: obj?.metaData ? false : true,
    isForAward: obj.award ? true : false,

    currencyType:
      obj.newprice &&
        obj.newprice.currency_type &&
        obj.newprice.currency_type === "dollar"
        ? "dollar"
        : "alia",

    nftChain: obj.tokenId.toString().split("-")[0],
    id: obj.tokenId.toString().split("-")[2]
      ? obj.tokenId.toString().split("-")[2]
      : obj?._id,
    polygonId: "",
    collection: obj.tokenId.toString().split("-")[1]
      ? obj.tokenId.toString().split("-")[1]
      : "",
    collectionAdd: obj.tokenId,
    baseCurrency:
      obj.newprice && obj.newprice.baseCurrency
        ? obj.newprice.baseCurrency
        : "0",

    en_nft_name: obj?.en_nft_name,
    creatorObj: obj.creatorObj,

    lastpriceTraded: obj.newpriceTraded
      ? obj.newpriceTraded.priceConversion
      : "",
    lastCurrencyTraded:
      obj.newpriceTraded && obj.newpriceTraded.buybaseCurrency
        ? obj.newpriceTraded?.buybaseCurrency
        : obj.newpriceTraded?.currency_type === "dollar"
          ? "1"
          : "0",
    isAddedToMuseum: obj.isAddedToMuseum
  };
  nftObj.approval = obj.approval;
  nftObj.logoImg = `${CDN_LINK}/logo-v2.svg`;
  nftObj.baseCurrency = getBaseCurrency(nftObj.nftChain, nftObj.baseCurrency);
  nftObj.lastCurrencyTraded = getBaseCurrency(
    nftObj.nftChain,
    nftObj.lastCurrencyTraded
  );

  return nftObj;
}
