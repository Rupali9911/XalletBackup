import {
  NFT_DATA_COLLECTION_FAIL,
  NFT_DATA_COLLECTION_LIST_RESET,
  NFT_DATA_COLLECTION_START,
  NFT_DATA_COLLECTION_SUCCESS,
  NFT_DATA_COLLECTION_PAGE_CHANGE,
  NFT_DATA_COLLECTION_LIST_UPDATE,
} from '../types';

const initialState = {
  nftDataCollectionLoading: false,
  nftDataCollectionList: [],
  nftDataCollectionPage: 1,
  nftDataCollectionTotalCount: 0
}

export default function nftDataCollectionReducer(state = initialState, action) {
  switch (action.type) {

    case NFT_DATA_COLLECTION_START:
      return state = { ...state, nftDataCollectionLoading: true };

    case NFT_DATA_COLLECTION_SUCCESS:
      return state = {
        ...state,
        nftDataCollectionList: [...state.nftDataCollectionList, ...action.payload.data],
        nftDataCollectionTotalCount: action.payload.count,
        nftDataCollectionLoading: false,
      };

    case NFT_DATA_COLLECTION_LIST_UPDATE:
      return state = { ...state, nftDataCollectionList: [...action.payload] };

    case NFT_DATA_COLLECTION_LIST_RESET:
      return state = { ...state, nftDataCollectionList: [] };

    case NFT_DATA_COLLECTION_FAIL:
      return state = { ...state, nftDataCollectionLoading: false };

    case NFT_DATA_COLLECTION_PAGE_CHANGE:
      return state = { ...state, nftDataCollectionPage: action.payload };

    default:
      return state;
  }
}