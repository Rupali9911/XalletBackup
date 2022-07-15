import { BASE_URL } from '../../common/constants';
import { networkType } from '../../common/networkType';
import { parseNftObject } from '../../utils/parseNFTObj';
import {
  NFT_DATA_COLLECTION_FAIL,
  NFT_DATA_COLLECTION_LIST_RESET,
  NFT_DATA_COLLECTION_START,
  NFT_DATA_COLLECTION_SUCCESS,
  NFT_DATA_COLLECTION_PAGE_CHANGE,

  NFT_BLIND_SERIES_COLLECTION_START,
  NFT_BLIND_SERIES_COLLECTION_SUCCESS,
  NFT_BLIND_SERIES_COLLECTION_LIST_RESET,
  NFT_BLIND_SERIES_COLLECTION_FAIL,
  NFT_BLIND_SERIES_COLLECTION_PAGE_CHANGE,
} from '../types';

import Big from "big.js";
const divideNo = (res) => {
  if (typeof res === "string" && res === "") {
    res = "0";
  }
  let bigNo = new Big(res);
  let bigNo1 = new Big(Math.pow(10, 18));
  let number = bigNo.div(bigNo1)?.toFixed(18);
  return number;
};

export const nftDataCollectionLoadSuccess = (data) => ({
  type: NFT_DATA_COLLECTION_SUCCESS,
  payload: data
});

export const nftDataCollectionLoadStart = (tabTitle) => ({
  type: NFT_DATA_COLLECTION_START,
  payload: tabTitle
});

export const nftDataCollectionLoadFail = () => ({
  type: NFT_DATA_COLLECTION_FAIL
});

export const nftDataCollectionListReset = () => ({
  type: NFT_DATA_COLLECTION_LIST_RESET
});

export const nftDataCollectionPageChange = (data) => ({
  type: NFT_DATA_COLLECTION_PAGE_CHANGE,
  payload: data
});


export const nftBlindSeriesCollectionLoadStart = (tabTitle) => ({
  type: NFT_BLIND_SERIES_COLLECTION_START,
  payload: tabTitle
});

export const nftBlindSeriesCollectionLoadSuccess = (data) => ({
  type: NFT_BLIND_SERIES_COLLECTION_SUCCESS,
  payload: data
});

export const nftBlindSeriesCollectionReset = () => ({
  type: NFT_BLIND_SERIES_COLLECTION_LIST_RESET,
});

export const nftBlindSeriesCollectionLoadFail = () => ({
  type: NFT_BLIND_SERIES_COLLECTION_FAIL,
});

export const nftBlindSeriesCollectionPageChange = (data) => ({
  type: NFT_BLIND_SERIES_COLLECTION_PAGE_CHANGE,
  payload: data
});

export const activityHistoryList = (page, collectionId, type, tabTitle,limit) => {
  // console.log("🚀 ~ file: nftDataCollectionAction.js ~ line 64 ~ nftDataCollectionList ~ ", page, collectionId, type, tabTitle)
  return (dispatch, getState) => {
    const data = {
      collectionId,
      filterType: type,
      limit: limit,
      networkType,
      page
    };

    const body = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    fetch(`${BASE_URL}/xanalia/getActivityHistory`, body)
      .then(response => response.json())
      .then(res => {

        console.log()
        
        if (tabTitle === 'Activity') {
          console.log("🚀 ~ file: nftDataCollectionAction.js ~ line 88 ~ return ~ res", res)
          let bids = []
          for (let i = 0; i < res.data.length; i++) {
            // console.log(res.data, '?????????????')
            // if (
            //   res.data[i].event === "SellNFT" ||
            //   res.data[i].event === "SellNFTNonCrypto"
            // ){
              // let price = res.data.data[i].returnValues.dollarPrice &&
              // parseInt(
              //   divideNo(
              //     parseInt(res.data.data[i].returnValues.dollarPrice?._hex)
              //   )
              // ) > 0
              // ? divideNo(
              //   parseInt(
              //     res.data.data[i].returnValues.dollarPrice._hex,
              //     16
              //   )
              // )
              // : divideNo(
              //   parseInt(res.data.data[i].returnValues.price._hex, 16)
              // )

              let obj = [
                res.data[i]?.metaData
                  ? res.data[i]?.metaData?.thumbnft
                  : res.data[i]?.nftInfo[0].metaData?.thumbnft
                    ? res.data[i]?.nftInfo[0].metaData?.thumbnft
                    : res.data[i]?.nftInfo[0].metaData?.image,
                res.data[i]?.nftInfo[0]?.en_nft_name
                  ? res.data[i]?.nftInfo[0]?.en_nft_name
                  : res.data[i]?.metaData?.name
                    ? res.data[i]?.metaData?.name
                    : res.data[i]?.nftInfo[0]?.metaData?.name,
                    res?.data[i]?.event,
                res.data[i].returnValues.price && res.data[i].returnValues.price._hex,
                res.data[i].returnValues.seller && res.data[i].returnValues.seller,
                res.data[i].sellData && res.data[i].sellData.owner,
                res.data[i].timestamp,
              ]
              bids.push(obj)
            // }
          }

          // console.log("🚀 ~ file: nftDataCollectionAction.js ~ line 90 ~ return ~ bids", bids)

          let temp = {
            ...res,
            data: bids
          };
          // console.log("🚀 ~ file: nftDataCollectionAction.js ~ line 159 ~ return ~ temp", temp)
          dispatch(nftDataCollectionLoadSuccess({ ...temp, tabTitle: tabTitle }));
        }

      })
      .catch(err => {
        dispatch(nftDataCollectionLoadFail());
      });
  }
}

export const nftDataCollectionList = (page, collectionAddress, type, collectionId, isStore, manualColl, seriesInfoId, tabTitle) => {
  // console.log("🚀 ~ file: nftDataCollectionAction.js ~ line 64 ~ nftDataCollectionList ~ ", page, collectionAddress, type, collectionId, isStore, manualColl, seriesInfoId)
  return (dispatch, getState) => {
    if (isStore && type !== 'owned') {
      const data = {
        filterType: type,
        limit: 10,
        packName: 'Monkey King',
        page,
      };

      const fetch_data_body = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      };

      fetch(`${BASE_URL}/user/fetch-pack-data`, fetch_data_body)
        .then(response => response.json())
        .then(json => {
          const selectedPack = json.data
          const nftData = [];
          for (let i = 0; i < selectedPack?.length; i++) {
            if (selectedPack?.length > 0 && selectedPack[0]?.tokenUri) {
              nftData.push({
                ...selectedPack[i]?.tokenUri?.metaData,
                properties: {
                  type: selectedPack[i]?.tokenUri?.metaData?.properties?.type,
                },
                totalSupply: selectedPack[i]?.tokenUri?.metaData?.totalSupply,
                externalLink: selectedPack[i]?.tokenUri?.metaData?.externalLink,
                thumbnft: selectedPack[i]?.tokenUri?.metaData?.thumbnft,
                tokenURI: selectedPack[i]?.tokenUri?.tokenUri,
                nftChain: 'binance',
                price: selectedPack[i]?.price,
              });
              // }
            } else {
              // for (let i = 0; i < selectedPack?.length; i++) {
              selectedPack[i].metaData = selectedPack[i]?.nftDetail.metaData;
              selectedPack[i].tokenId = selectedPack[i]?.nftDetail.tokenId;
              let parsedNFT = parseNftObject(selectedPack[i]);
              nftData.push({
                ...parsedNFT,
                properties: {
                  type: selectedPack[i]?.nftDetail?.metaData?.properties?.type,
                },
                totalSupply: selectedPack[i]?.nftDetail?.metaData?.totalSupply,
                externalLink: selectedPack[i]?.nftDetail?.metaData?.externalLink,
                thumbnft: selectedPack[i]?.nftDetail?.metaData?.thumbnft,
                tokenURI: selectedPack[i]?.catInfo?.tokenUri,
                price:
                  selectedPack[i]?.price?.toString() === "0"
                    ? selectedPack[i]?.usdPrice?.toString()
                    : selectedPack[i]?.price?.toString(),
              });
            }
          }
          json.data = nftData;
          dispatch(nftDataCollectionLoadSuccess({ ...json, tabTitle: tabTitle }));
        })
        .catch(err => {
          dispatch(nftDataCollectionLoadFail());
        });
    } else {
      const { data, wallet } = getState().UserReducer;
      const owner = data?.user?._id || wallet?.address;
      if (type === 'owned') {
        dispatch(nftBlindSeriesCollectionList(page, collectionAddress, type, seriesInfoId, '', 'nftDataCollectionList', tabTitle));
      } else {
        let url = `${BASE_URL}/user/nft-data-collection?type=${type}&page=${page}&limit=10&owner=${owner}`;
        if (manualColl) {
          url = url.concat(`&collectionId=${collectionId}`);
          url = url.concat(`&collectionAddress=${collectionId}`);
        } else if (collectionId) {
          url = url.concat(`&collectionId=${collectionId}`);
          url = url.concat(`&collectionAddress=${collectionAddress}`);
        } else {
          url = url.concat(`&collectionAddress=${collectionAddress}`);
        }
        fetch(url)
          .then(response => response.json())
          .then(json => {
            const nftData = [];
            // if (!json.count) {
            //   json.data = [];
            // } else {
            json.data.map(item => {
              const parsedNFT = parseNftObject(item);
              const data = {
                ...parsedNFT,
                totalSupply: item?.metaData?.totalSupply,
                properties: {
                  type: item?.metaData?.properties?.type,
                },
                externalLink: item?.metaData?.externalLink,
                // thumbnft: item?.metaData?.thumbnft,
                thumbnft: item?.thumbnailUrl,
                tokenURI: item?.catInfo?.tokenUri,
                thumbnailUrl: item?.metaData.thumbnft,
                ...item,
              };
              nftData.push(data);
            });
            // }
            json.data = nftData;
            dispatch(nftDataCollectionLoadSuccess({ ...json, tabTitle: tabTitle }));
          }).catch(err => {
            dispatch(nftDataCollectionLoadFail());
          })
      }
    }
  }
}

export const nftBlindDataCollectionList = (collectionAddress, collectionType, req_body, tabTitle) => {
  // console.log("🚀 ~ file: nftDataCollectionAction.js ~ line 162 ~", collectionAddress, collectionType, req_body, tabTitle)
  return (dispatch, getState) => {
    const { data, wallet } = getState().UserReducer;
    const owner = wallet?.address || data?.user?._id;
    // console.log("🚀 ~ file: nftDataCollectionAction.js ~ line 168 ~ return ~ owner", owner)
    const url = collectionType == 0 ?
      `${BASE_URL}/blindBox/view-blind-all-series-token-info` :
      `${BASE_URL}/blindBox/view-blind-series-info?collectionAddress=${collectionAddress}&frontend=true&owner=${owner}`

    const requestOptions = collectionType == 0 ? {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req_body)
    } : {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    fetch(url, requestOptions)
      .then(response => response.json())
      .then(jsonData => {
        let json = {
          ...jsonData,
          mysteryBox: collectionType == 1 ? true : false
        }

        const data = json.data;

        if (collectionType == 0) {
          // console.log("🚀 ~ file: nftDataCollectionAction.js ~ line 191 ~ return ~ json", json)
          dispatch(nftDataCollectionLoadSuccess({ ...json, tabTitle: tabTitle }));
        } else {
          let nftData = [];

          for (let i = 0; i < data.length; i++) {
            nftData.push({
              ...data[i],
              collectionName: data[i]?.boxURIMetaInfo?.name,
              bannerImage: data[i]?.boxURIMetaInfo?.banner_image,
              iconImage: data[i]?.boxURIMetaInfo?.image,
              items: data[i]?.maxBoxes,
            });
          }

          json.count = json.data.length;
          json.data = nftData;
          // console.log("🚀 ~ file: nftDataCollectionAction.js ~ line 208 ~ return ~ json", json)
          dispatch(nftDataCollectionLoadSuccess({ ...json, tabTitle: tabTitle }));
        }
      })
      .catch(err => {
        dispatch(nftDataCollectionLoadFail());
      })
  }
}

export const nftBlindSeriesCollectionList = (page, collectionAddress, type, seriesInfoId, chainType, callFrom, tabTitle) => {
  return (dispatch, getState) => {
    const { data, wallet } = getState().UserReducer;
    const owner = wallet?.address || data?.user?._id;

    if (type === 'owned') {
      let url = `${BASE_URL}/user/my-collection`;
      if (wallet?.address) url = `${BASE_URL}/xanalia/mydata`;
      const req_body = {
        limit: 20,
        loggedIn: owner,
        networkType,
        nftType: 'mycollection',
        page,
        owner,
      }

      const fetch_data_body = {
        method: 'POST',
        body: JSON.stringify(req_body),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      };

      // fetch(`${BASE_URL}/user/my-collection`, fetch_data_body)
      //   .then(response => response.json())
      //   .then(json => {
      //     if (json.data) {
      //       dispatch(nftBlindSeriesCollectionLoadSuccess(json));
      //     } else {
      //       dispatch(nftBlindSeriesCollectionLoadFail());
      //     }
      //   })
      //   .catch(err => {
      //     console.log('=====blind_series_my_collection_err', err);

      fetch(url, fetch_data_body)
        .then(response => response.json())
        .then(json => {
          if (json.data && json.count) {
            if (callFrom) {
              dispatch(nftDataCollectionLoadSuccess({ ...json, tabTitle: tabTitle }));
            } else {
              dispatch(nftBlindSeriesCollectionLoadSuccess({ ...json, tabTitle: tabTitle }));
            }
          } else {
            dispatch(nftBlindSeriesCollectionLoadFail());
          }
        })
        .catch(err => {
          console.log('=====blind_series_my_collection_err', err);
        });

    } else {
      const req_body = seriesInfoId == "61aa058d504d60a828f80113" ?
        {
          limit: 10,
          filterType: type == "minted2" && seriesInfoId == "61aa058d504d60a828f80113" ? "gallery" : type,
          chainType: chainType,
          page,
          seriesInfoId: seriesInfoId,
        } :
        {
          limit: 10,
          filterType: type,
          loggedIn: owner,
          owner,
          page,
          seriesInfoId: collectionAddress,
        }

      const fetch_data_body = {
        method: 'POST',
        body: JSON.stringify(req_body),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      };

      fetch(`${BASE_URL}/blindBox/view-blind-series-token-info`, fetch_data_body)
        .then(response => response.json())
        .then(json => {
          // const nftData = [];
          let obj = json.data;

          if (obj !== "No record found" && obj !== "404 Not Found") {
            // for (let i = 0; i < obj?.length; i++) {
            //   let parsedNFT = parseNftObject(obj[i]);
            //   nftData.push({
            //     ...parsedNFT,
            //     properties: {
            //       type: obj[i]?.metaData?.properties?.type,
            //     },
            //     totalSupply: obj[i]?.metaData?.totalSupply,
            //     externalLink: obj[i]?.metaData?.externalLink,
            //     thumbnft: obj[i]?.metaData?.thumbnft,
            //     thumbnailUrl: obj[i]?.metaData?.thumbnft,
            //     tokenURI: obj[i]?.returnValues?.tokenURI,
            //     price: obj[i]?.price?.toString(),
            //   });
            // }
            // json.data = nftData;
            // console.log("🚀 ~ file: nftDataCollectionAction.js ~ line 319 ~ return ~ json", json)
            dispatch(nftBlindSeriesCollectionLoadSuccess({ ...json, tabTitle: tabTitle }));
          } else {
            dispatch(nftBlindSeriesCollectionLoadFail());
          }
        })
        .catch(err => {
          console.log('=====blind_series_err', err);
          dispatch(nftBlindSeriesCollectionLoadFail());
        });
    }
  }
}