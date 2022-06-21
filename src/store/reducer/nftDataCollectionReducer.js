import {
  NFT_DATA_COLLECTION_FAIL,
  NFT_DATA_COLLECTION_LIST_RESET,
  NFT_DATA_COLLECTION_START,
  NFT_DATA_COLLECTION_SUCCESS,
  NFT_DATA_COLLECTION_PAGE_CHANGE,
  NFT_DATA_COLLECTION_LIST_UPDATE,

  NFT_BLIND_SERIES_COLLECTION_START,
  NFT_BLIND_SERIES_COLLECTION_SUCCESS,
  NFT_BLIND_SERIES_COLLECTION_LIST_RESET,
  NFT_BLIND_SERIES_COLLECTION_FAIL,
  NFT_BLIND_SERIES_COLLECTION_PAGE_CHANGE,
} from '../types';

const initialState = {
  nftDataCollectionLoading: false,
  nftDataCollectionList: [],
  mysteryBoxCollectionList: [],
  nftDataCollectionPage: 1,
  nftDataCollectionTotalCount: 0,
  mysteryBoxCollectionTotalCount: 0,

  nftBlindSeriesCollectionLoading: false,
  nftBlindSeriesCollectionList: [],
  nftBlindSeriesCollectionPage: 1,
  nftBlindSeriesCollectionTotalCount: 0,
  tabTitle: ''
}

export default function nftDataCollectionReducer(state = initialState, action) {
  switch (action.type) {

    case NFT_DATA_COLLECTION_START:
      return state = { ...state, nftDataCollectionLoading: true, tabTitle: action.payload };

    case NFT_DATA_COLLECTION_SUCCESS:
      // console.log("🚀 ~ file: nftDataCollectionReducer.js ~ line 40 ~ ~ ", state, action.payload)
      return state = action.payload.mysteryBox ?
        {
          ...state,
          mysteryBoxCollectionList: [...state.mysteryBoxCollectionList, ...action.payload.data],
          mysteryBoxCollectionTotalCount: action.payload.count,
          nftDataCollectionLoading: false,
        } :
        (action.payload.tabTitle === state.tabTitle) ? {
          ...state,
          nftDataCollectionList: [...state.nftDataCollectionList, ...action.payload.data],
          nftDataCollectionTotalCount: action.payload.count,
          nftDataCollectionLoading: false,
        } : {
          ...state,
        };
    // if (action.payload.mysteryBox) {
    //   return state = {
    //     ...state,
    //     mysteryBoxCollectionList: [...state.mysteryBoxCollectionList, ...action.payload.data],
    //     mysteryBoxCollectionTotalCount: action.payload.count,
    //     nftDataCollectionLoading: false,
    //   };
    // } else {
    //   return state = {
    //     ...state,
    //     nftDataCollectionList: [...state.nftDataCollectionList, ...action.payload.data],
    //     nftDataCollectionTotalCount: action.payload.count,
    //     nftDataCollectionLoading: false,
    //   };
    // }

    case NFT_DATA_COLLECTION_LIST_UPDATE:
      return state = { ...state, nftDataCollectionList: [...action.payload] };

    case NFT_DATA_COLLECTION_LIST_RESET:
      return state = { ...state, nftDataCollectionList: [], mysteryBoxCollectionList: [] };

    case NFT_DATA_COLLECTION_FAIL:
      return state = { ...state, nftDataCollectionLoading: false };

    case NFT_DATA_COLLECTION_PAGE_CHANGE:
      return state = { ...state, nftDataCollectionPage: action.payload };


    case NFT_BLIND_SERIES_COLLECTION_START:
      return state = { ...state, nftBlindSeriesCollectionLoading: true, tabTitle: action.payload };

    case NFT_BLIND_SERIES_COLLECTION_SUCCESS:
      return state = (action.payload.tabTitle === state.tabTitle) ? {
        ...state,
        nftBlindSeriesCollectionList: [...state.nftBlindSeriesCollectionList, ...action.payload.data],
        nftBlindSeriesCollectionTotalCount: action.payload.count,
        nftBlindSeriesCollectionLoading: false,
      } : {
        ...state,
      };

    case NFT_BLIND_SERIES_COLLECTION_LIST_RESET:
      return state = { ...state, nftBlindSeriesCollectionList: [] };

    case NFT_BLIND_SERIES_COLLECTION_FAIL:
      return state = { ...state, nftBlindSeriesCollectionLoading: false };

    case NFT_BLIND_SERIES_COLLECTION_PAGE_CHANGE:
      return state = { ...state, nftBlindSeriesCollectionPage: action.payload };

    default:
      return state;
  }
}