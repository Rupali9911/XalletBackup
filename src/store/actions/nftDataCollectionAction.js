import { BASE_URL } from '../../common/constants';
import axios from 'axios';
import { parseNftObject } from '../../utils/parseNFTObj';
import {
  NFT_DATA_COLLECTION_FAIL,
  NFT_DATA_COLLECTION_LIST_RESET,
  NFT_DATA_COLLECTION_START,
  NFT_DATA_COLLECTION_SUCCESS,
  NFT_DATA_COLLECTION_PAGE_CHANGE,
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

export const nftDataCollectionList = (page, collectionAddress, type) => {
  return (dispatch, getState) => {

    const { data, wallet } = getState().UserReducer;
    const owner = wallet.address || data.user._id;

    fetch(`${BASE_URL}/user/nft-data-collection?type=${type}&collectionAddress=${collectionAddress}&page=${page}&limit=10&owner=${owner}`)
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