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

export const nftDataCollectionLoadSuccess = (data) => ({
  type: NFT_DATA_COLLECTION_SUCCESS,
  payload: data
});

export const nftDataCollectionLoadStart = () => ({
  type: NFT_DATA_COLLECTION_START
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


export const nftBlindSeriesCollectionLoadStart = () => ({
  type: NFT_BLIND_SERIES_COLLECTION_START,
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

export const nftDataCollectionList = (page, collectionAddress, type, collectionId, isStore, manualColl) => {
  return (dispatch, getState) => {

    if (isStore) {
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
          for (let i = 0; i < selectedPack.length; i++) {
            console.log('======selectedPack', selectedPack[i].nftDetail?.metaData?.image);
            nftData.push({
              name: `MKC${i < 99 ? `0${i + 1}` : i + 1}`,
              description: `悟空101头像MKC${i < 99 ? `0${i + 1}` : i + 1}`,
              image: selectedPack[i].nftDetail?.metaData?.image,
              properties: {
                type: selectedPack[i].nftDetail?.metaData?.properties?.type,
              },
              totalSupply: selectedPack[i].nftDetail?.metaData?.totalSupply,
              externalLink: selectedPack[i].nftDetail?.metaData?.externalLink,
              thumbnft: selectedPack[i].nftDetail?.metaData?.thumbnft,
              tokenURI: "QmQVkzVkBGxgodX6jefYN7Tir9xNr1U4gpGVgtMoTuJ7Xv",
              nftChain: "binance",
            });
          }
          json.data = nftData;
          dispatch(nftDataCollectionLoadSuccess(json));
        })
        .catch(err => {
          dispatch(nftDataCollectionLoadFail());
        });
    } else {
      const { data, wallet } = getState().UserReducer;
      const owner = data?.user?._id || wallet?.address;

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
          dispatch(nftDataCollectionLoadSuccess(json));
  
        }).catch(err => {
          dispatch(nftDataCollectionLoadFail());
        })
    }
  }
}

export const nftBlindDataCollectionList = (collectionAddress) => {
  return (dispatch, getState) => {
    const { data, wallet } = getState().UserReducer;
    const owner = wallet?.address || data?.user?._id;

    fetch(`${BASE_URL}/blindBox/view-blind-series-info?collectionAddress=${collectionAddress}&frontend=true&owner=${owner}`)
      .then(response => response.json())
      .then(json => {

        const data = json.data;
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
        dispatch(nftDataCollectionLoadSuccess(json));
      })
      .catch(err => {
        dispatch(nftDataCollectionLoadFail());
      })
  }
}

export const nftBlindSeriesCollectionList = (page, collectionAddress, type) => {
  return (dispatch, getState) => {
    const { data, wallet } = getState().UserReducer;
    const owner = data.user._id;
    
    if (type === 'owned') {
      const req_body = {
        limit: 6,
        loggedIn: owner,
        networkType,
        nftType: 'mycollection',
        page,
      }

      const fetch_data_body = {
        method: 'POST',
        body: JSON.stringify(req_body),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      };
      fetch(`${BASE_URL}/user/my-collection`, fetch_data_body)
      .then(response => response.json())
      .then(json => {
        if(json.data) {
          dispatch(nftBlindSeriesCollectionLoadSuccess(json));
        } else {
          dispatch(nftBlindSeriesCollectionLoadFail());
        }
      })
      .catch(err => {
        console.log('=====blind_series_my_collection_err', err);
        dispatch(nftBlindSeriesCollectionLoadFail());
      });
    } else {
      const req_body = {
        limit: 6,
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
        const nftData = [];
        let obj = json.data;

        if (obj !== "No record found" && obj !== "404 Not Found") {
          for (let i = 0; i < obj?.length; i++) {
            let parsedNFT = parseNftObject(obj[i]);
            nftData.push({
              ...parsedNFT,
              properties: {
                type: obj[i]?.metaData?.properties?.type,
              },
              totalSupply: obj[i]?.metaData?.totalSupply,
              externalLink: obj[i]?.metaData?.externalLink,
              thumbnft: obj[i]?.metaData?.thumbnft,
              thumbnailUrl: obj[i]?.metaData?.thumbnft,
              tokenURI: obj[i]?.returnValues?.tokenURI,
              price: obj[i]?.price?.toString(),
            });
          }
          json.data = nftData;
          dispatch(nftBlindSeriesCollectionLoadSuccess(json));
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