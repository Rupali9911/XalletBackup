import axios from 'axios';
import moment from 'moment';
import {BASE_URL, NEW_BASE_URL} from '../../common/constants';
import {networkType} from '../../common/networkType';
import {
  getEventByValue,
  getFromAddress,
  getToAddress,
} from '../../constants/tradingHistory';
import sendRequest from '../../helpers/AxiosApiRequest';

import {
  ACTIVITY_NFT_LIST_FAIL,
  ACTIVITY_NFT_LIST_PAGE_CHANGE,
  ACTIVITY_NFT_LIST_RESET,
  ACTIVITY_NFT_LIST_START,
  ACTIVITY_NFT_LIST_SUCCESS,
  NFT_BLIND_SERIES_COLLECTION_FAIL,
  NFT_BLIND_SERIES_COLLECTION_LIST_RESET,
  NFT_BLIND_SERIES_COLLECTION_PAGE_CHANGE,
  NFT_BLIND_SERIES_COLLECTION_START,
  NFT_BLIND_SERIES_COLLECTION_SUCCESS,
  NFT_DATA_COLLECTION_FAIL,
  NFT_DATA_COLLECTION_LIST_RESET,
  NFT_DATA_ONSALE_COLLECTION_LIST_RESET,
  NFT_DATA_SOLDOUT_COLLECTION_LIST_RESET,
  NFT_DATA_OWNED_COLLECTION_LIST_RESET,
  NFT_DATA_GALLERY_COLLECTION_LIST_RESET,
  NFT_DATA_COLLECTION_PAGE_CHANGE,
  NFT_DATA_ONSALE_COLLECTION_PAGE_CHANGE,
  NFT_DATA_SOLDOUT_COLLECTION_PAGE_CHANGE,
  NFT_DATA_OWNED_COLLECTION_PAGE_CHANGE,
  NFT_DATA_GALARY_COLLECTION_PAGE_CHANGE,
  NFT_DATA_COLLECTION_START,
  NFT_DATA_COLLECTION_SUCCESS,
} from '../types';

export const nftDataCollectionLoadSuccess = data => ({
  type: NFT_DATA_COLLECTION_SUCCESS,
  payload: data,
});

export const nftDataCollectionLoadStart = tabTitle => ({
  type: NFT_DATA_COLLECTION_START,
  payload: tabTitle,
});

export const nftDataCollectionLoadFail = () => ({
  type: NFT_DATA_COLLECTION_FAIL,
});

export const nftDataCollectionListReset = () => ({
  type: NFT_DATA_COLLECTION_LIST_RESET,
});
export const nftDataOnSaleCollectionListReset = () => ({
  type: NFT_DATA_ONSALE_COLLECTION_LIST_RESET,
});
export const nftDataSoldOutCollectionListReset = () => ({
  type: NFT_DATA_SOLDOUT_COLLECTION_LIST_RESET,
});
export const nftDataOwnedCollectionListReset = () => ({
  type: NFT_DATA_OWNED_COLLECTION_LIST_RESET,
});
export const nftDataGalleryCollectionListReset = () => ({
  type: NFT_DATA_GALLERY_COLLECTION_LIST_RESET,
});

export const nftDataCollectionPageChange = data => ({
  type: NFT_DATA_COLLECTION_PAGE_CHANGE,
  payload: data,
});
export const nftDataOnSaleCollectionPageChange = data => ({
  type: NFT_DATA_ONSALE_COLLECTION_PAGE_CHANGE,
  payload: data,
});
export const nftDataSoldOutCollectionPageChange = data => ({
  type: NFT_DATA_SOLDOUT_COLLECTION_PAGE_CHANGE,
  payload: data,
});
export const nftDataOwnedCollectionPageChange = data => ({
  type: NFT_DATA_OWNED_COLLECTION_PAGE_CHANGE,
  payload: data,
});
export const nftDataGalarryCollectionPageChange = data => ({
  type: NFT_DATA_GALARY_COLLECTION_PAGE_CHANGE,
  payload: data,
});

export const nftBlindSeriesCollectionLoadStart = tabTitle => ({
  type: NFT_BLIND_SERIES_COLLECTION_START,
  payload: tabTitle,
});

export const nftBlindSeriesCollectionLoadSuccess = data => ({
  type: NFT_BLIND_SERIES_COLLECTION_SUCCESS,
  payload: data,
});

export const nftBlindSeriesCollectionReset = () => ({
  type: NFT_BLIND_SERIES_COLLECTION_LIST_RESET,
});

export const nftBlindSeriesCollectionLoadFail = () => ({
  type: NFT_BLIND_SERIES_COLLECTION_FAIL,
});

export const nftBlindSeriesCollectionPageChange = data => ({
  type: NFT_BLIND_SERIES_COLLECTION_PAGE_CHANGE,
  payload: data,
});

export const activityNftListStart = tabTitle => ({
  type: ACTIVITY_NFT_LIST_START,
  payload: tabTitle,
});

export const activityNftListSuccess = data => ({
  type: ACTIVITY_NFT_LIST_SUCCESS,
  payload: data,
});

export const activityNftListFail = () => ({
  type: ACTIVITY_NFT_LIST_FAIL,
});

export const activityNftListReset = () => ({
  type: ACTIVITY_NFT_LIST_RESET,
});

export const activityNftListPageChange = data => ({
  type: ACTIVITY_NFT_LIST_PAGE_CHANGE,
  payload: data,
});

export const activityHistoryList = (
  page,
  collectionId,
  limit,
  tabTitle,
  sort,
) => {
  // console.log("🚀 ~ file: nftDataCollectionAction.js ~ line 64, ~ nftDataCollectionList ~ ", page, collectionId, limit)
  return dispatch => {
    let data = {
      page,
      collectionId,
      limit,
      sort,
    };

    sendRequest({
      url: `${NEW_BASE_URL}/sale-nft/trading-history`,
      method: 'POST',
      data,
    })
      .then(res => {
        if (res?.items?.length > 0) {
          const tradingList = [];

          res?.items?.map(item => {
            let from = item?.fromUser?.userWallet?.address;
            let to = item?.toUser?.userWallet?.address;
            let temp = [
              {
                image: item?.nft?.previewImage
                  ? item?.nft?.previewImage
                  : item?.nft?.smallImage,
                imageName: item?.nft?.name,
              },
              getEventByValue(item?.action),
              item?.price && item?.receiveToken
                ? Number(item?.price) + ' ' + item?.receiveToken
                : '',
              getFromAddress(from, item?.action),
              getToAddress(to, item?.action),
              moment(item?.createdAt).format('YYYY/MM/DD hh:mm:ss'),
            ];

            tradingList.push(temp);
          });
          dispatch(
            activityNftListSuccess({
              list: tradingList,
              count: res?.meta?.totalPages,
              result: res?.items,
              tabTitle: tabTitle,
            }),
          );
        } else {
          dispatch(activityNftListFail());
        }
      })
      .catch(err => {
        dispatch(activityNftListFail());
      });
  };
};

export const nftDataCollectionList = (
  page,
  tabTitle,
  networkName,
  contractAddress,
  isLaunchPad,
  tabStatus,
  userId,
  userAddress,
  launchpadId,
) => {
  // console.log("🚀 ~ file: nftDataCollectionAction.js ~ line 64 ~ nftDataCollectionList ~ ", page, collectionAddress, type, collectionId, isStore, manualColl, seriesInfoId)

  return dispatch => {
    let limit = 10;
    if (isLaunchPad) {
      let url = `${NEW_BASE_URL}/launchpad/nfts`;

      sendRequest({
        url,
        params: {
          page,
          limit,
          launchpadId,
        },
      })
        .then(json => {
          dispatch(nftDataCollectionLoadSuccess({...json, tabTitle: tabTitle}));
        })
        .catch(err => {
          dispatch(nftDataCollectionLoadFail());
        });
    } else {
      let url = '';
      if (userAddress && tabTitle == 'Owned') {
        url = `${NEW_BASE_URL}/collections/nft/owner/collectionId?&userAddress=${userAddress}`;
      } else if (tabStatus) {
        url = `${NEW_BASE_URL}/collections/nft/collectionId?&status=${tabStatus}`;
      }

      sendRequest({
        url,
        params: {
          page,
          limit,
          networkName,
          contractAddress,
          userId,
        },
      })
        .then(json => {
          dispatch(nftDataCollectionLoadSuccess({...json, tabTitle: tabTitle}));
        })
        .catch(err => {
          dispatch(nftDataCollectionLoadFail());
        });
    }
  };
};

const handleCollectionList = (url, collectionType, req_body) => {
  return new Promise(async (resolve, reject) => {
    if (global.cancelToken) {
      global.cancelToken.cancel('Operations cancelled due to new request');
    }
    global.cancelToken = axios.CancelToken.source();
    await axios({
      method: collectionType == 0 ? 'post' : 'get',
      url: url,
      data: collectionType == 0 ? req_body : {},
      cancelToken: global.cancelToken.token,
    })
      .then(result => {
        // console.log("🚀 ~ line 230 ~ returnnewPromise ~ result", result.data.data)
        resolve(result);
        // return result;
      })
      .catch(error => {
        // console.log("🚀 ~ line 234 ~ returnnewPromise ~ error", error)
        reject('result error', error);
      });
  });
};

export const nftBlindDataCollectionList = (
  collectionAddress,
  collectionType,
  req_body,
  tabTitle,
) => {
  // console.log("🚀 ~ file: nftDataCollectionAction.js ~ line 162 ~", collectionAddress, collectionType, req_body, tabTitle)
  return (dispatch, getState) => {
    const {data, wallet} = getState().UserReducer;
    const owner = wallet?.address || data?.user?._id;
    // console.log("🚀 ~ file: nftDataCollectionAction.js ~ line 168 ~ return ~ owner", owner)
    const url =
      collectionType == 0
        ? `${BASE_URL}/blindBox/view-blind-all-series-token-info`
        : `${BASE_URL}/blindBox/view-blind-series-info?collectionAddress=${collectionAddress}&frontend=true&owner=${owner}`;

    const requestOptions =
      collectionType == 0
        ? {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(req_body),
          }
        : {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          };

    // try {
    // let jsonData = handleCollectionList(url, collectionType, req_body);
    // console.log("🚀 ~ file: nftDataCollectionAction.js ~ line 263 ~ return ~ jsonData", jsonData)

    // let json = {
    //   ...jsonData.data,
    //   mysteryBox: collectionType == 1 ? true : false
    // }

    // const data = json.data;

    //   if (collectionType == 0) {
    //     // console.log("🚀 ~ file: nftDataCollectionAction.js ~ line 191 ~ return ~ json", json)
    //     dispatch(nftDataCollectionLoadSuccess({ ...json, tabTitle: tabTitle }));
    //   } else {
    //     let nftData = [];

    //     for (let i = 0; i < data.length; i++) {
    //       nftData.push({
    //         ...data[i],
    //         collectionName: data[i]?.boxURIMetaInfo?.name,
    //         bannerImage: data[i]?.boxURIMetaInfo?.banner_image,
    //         iconImage: data[i]?.boxURIMetaInfo?.image,
    //         items: data[i]?.maxBoxes,
    //       });
    //     }

    //     json.count = json.data.length;
    //     json.data = nftData;
    //     // console.log("🚀 ~ file: nftDataCollectionAction.js ~ line 208 ~ return ~ json", json)
    //     dispatch(nftDataCollectionLoadSuccess({ ...json, tabTitle: tabTitle }));
    //   }
    // } catch (error) {
    //   // console.log(error)
    //   console.log("🚀 ~ file: nftDataCollectionAction.js ~ line 294 ~ return ~ error", error)
    // }
    // }

    handleCollectionList(url, collectionType, req_body)
      .then(jsonData => {
        let json = {
          ...jsonData.data,
          mysteryBox: collectionType == 1 ? true : false,
        };

        const tempData = json.data;

        if (collectionType == 0) {
          dispatch(nftDataCollectionLoadSuccess({...json, tabTitle: tabTitle}));
        } else {
          let nftData = [];

          for (let i = 0; i < tempData.length; i++) {
            nftData.push({
              ...tempData[i],
              collectionName: tempData[i]?.boxURIMetaInfo?.name,
              bannerImage: tempData[i]?.boxURIMetaInfo?.banner_image,
              iconImage: tempData[i]?.boxURIMetaInfo?.image,
              items: tempData[i]?.maxBoxes,
            });
          }

          json.count = json.data.length;
          json.data = nftData;
          dispatch(nftDataCollectionLoadSuccess({...json, tabTitle: tabTitle}));
        }
      })
      .catch(err => {
        console.log('🚀 ~ line 335 ~ nftBlindDataCollectionList ~ err', err);
        if (!global.cancelToken) {
          dispatch(nftDataCollectionLoadFail());
        }
      });
  };
};

export const nftBlindSeriesCollectionList = (
  page,
  collectionAddress,
  type,
  seriesInfoId,
  chainType,
  callFrom,
  tabTitle,
) => {
  return (dispatch, getState) => {
    const {data, wallet} = getState().UserReducer;
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
      };

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
              dispatch(
                nftDataCollectionLoadSuccess({...json, tabTitle: tabTitle}),
              );
            } else {
              dispatch(
                nftBlindSeriesCollectionLoadSuccess({
                  ...json,
                  tabTitle: tabTitle,
                }),
              );
            }
          } else {
            dispatch(nftBlindSeriesCollectionLoadFail());
          }
        })
        .catch(err => {
          console.log('=====blind_series_my_collection_err', err);
        });
    } else {
      const req_body =
        seriesInfoId == '61aa058d504d60a828f80113'
          ? {
              limit: 10,
              filterType:
                type == 'minted2' && seriesInfoId == '61aa058d504d60a828f80113'
                  ? 'gallery'
                  : type,
              chainType: chainType,
              page,
              seriesInfoId: seriesInfoId,
            }
          : {
              limit: 10,
              filterType: type,
              loggedIn: owner,
              owner,
              page,
              seriesInfoId: collectionAddress,
            };

      const fetch_data_body = {
        method: 'POST',
        body: JSON.stringify(req_body),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      };

      fetch(
        `${BASE_URL}/blindBox/view-blind-series-token-info`,
        fetch_data_body,
      )
        .then(response => response.json())
        .then(json => {
          // const nftData = [];
          let obj = json.data;

          if (obj !== 'No record found' && obj !== '404 Not Found') {
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
            dispatch(
              nftBlindSeriesCollectionLoadSuccess({
                ...json,
                tabTitle: tabTitle,
              }),
            );
          } else {
            dispatch(nftBlindSeriesCollectionLoadFail());
          }
        })
        .catch(err => {
          console.log('=====blind_series_err', err);
          dispatch(nftBlindSeriesCollectionLoadFail());
        });
    }
  };
};
