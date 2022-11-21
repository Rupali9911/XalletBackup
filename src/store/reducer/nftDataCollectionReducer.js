import {
  NFT_DATA_COLLECTION_FAIL,
  NFT_DATA_COLLECTION_LIST_RESET,
  NFT_DATA_ONSALE_COLLECTION_LIST_RESET,
  NFT_DATA_SOLDOUT_COLLECTION_LIST_RESET,
  NFT_DATA_OWNED_COLLECTION_LIST_RESET,
  NFT_DATA_GALLERY_COLLECTION_LIST_RESET,
  NFT_DATA_COLLECTION_START,
  NFT_DATA_COLLECTION_SUCCESS,
  NFT_DATA_COLLECTION_PAGE_CHANGE,
  NFT_DATA_ONSALE_COLLECTION_PAGE_CHANGE,
  NFT_DATA_SOLDOUT_COLLECTION_PAGE_CHANGE,
  NFT_DATA_OWNED_COLLECTION_PAGE_CHANGE,
  NFT_DATA_GALARY_COLLECTION_PAGE_CHANGE,
  NFT_DATA_COLLECTION_LIST_UPDATE,
  NFT_BLIND_SERIES_COLLECTION_START,
  NFT_BLIND_SERIES_COLLECTION_SUCCESS,
  NFT_BLIND_SERIES_COLLECTION_LIST_RESET,
  NFT_BLIND_SERIES_COLLECTION_FAIL,
  NFT_BLIND_SERIES_COLLECTION_PAGE_CHANGE,
  ACTIVITY_NFT_LIST_SUCCESS,
  ACTIVITY_NFT_LIST_START,
  ACTIVITY_NFT_LIST_FAIL,
  ACTIVITY_NFT_LIST_RESET,
  ACTIVITY_NFT_LIST_PAGE_CHANGE,
} from '../types';

const initialState = {
  nftDataCollectionLoading: false,
  nftDataOnSaleCollectionList: [],
  nftDataSoldOutCollectionList: [],
  nftDataOwnedCollectionList: [],
  nftDataGalleryCollectionList: [],
  nftDataCollectionList: [],
  mysteryBoxCollectionList: [],

  nftDataCollectionPage: 1,
  nftDataOnSaleCollectionPage: 1,
  nftDataSoldOutCollectionPage: 1,
  nftDataOwnedCollectionPage: 1,
  nftDataGalleryCollectionPage: 1,

  nftDataCollectionTotalCount: 0,
  nftDataOnSaleCollectionTotalCount: 0,
  nftDataSoldOutCollectionTotalCount: 0,
  nftDataOwnedCollectionTotalCount: 0,
  nftDataGalleryCollectionTotalCount: 0,
  mysteryBoxCollectionTotalCount: 0,

  nftBlindSeriesCollectionLoading: false,
  nftBlindSeriesCollectionList: [],
  nftBlindSeriesCollectionPage: 1,
  nftBlindSeriesCollectionTotalCount: 0,

  nftActivityLoading: false,
  nftActivityList: [],
  nftActivityPage: 1,
  nftActivityTotalCount: 0,
  tabTitle: '',
  nftActivityItems: [],
};

export default function nftDataCollectionReducer(state = initialState, action) {
  switch (action.type) {
    case NFT_DATA_COLLECTION_START:
      return (state = {
        ...state,
        nftDataCollectionLoading: true,
        tabTitle: action.payload,
      });

    case NFT_DATA_COLLECTION_SUCCESS:
      if (action.payload.tabTitle === 'On Sale') {
        return (state = {
          ...state,
          nftDataOnSaleCollectionList: [
            ...state.nftDataOnSaleCollectionList,
            ...action.payload?.list,
          ],
          nftDataCollectionList: [
            ...state.nftDataCollectionList,
            ...action.payload?.list,
          ],
          nftDataCollectionTotalCount: action.payload.count,
          nftDataOnSaleCollectionTotalCount: action.payload.count,
          nftDataCollectionLoading: false,
        });
      }
      if (action.payload.tabTitle === 'Sold Out') {
        return (state = {
          ...state,
          nftDataSoldOutCollectionList: [
            ...state.nftDataSoldOutCollectionList,
            ...action.payload?.list,
          ],
          nftDataCollectionList: [
            ...state.nftDataCollectionList,
            ...action.payload?.list,
          ],
          nftDataCollectionTotalCount: action.payload.count,
          nftDataSoldOutCollectionTotalCount: action.payload.count,
          nftDataCollectionLoading: false,
        });
      }
      if (action.payload.tabTitle === 'Owned') {
        return (state = {
          ...state,
          nftDataOwnedCollectionList: [
            ...state.nftDataOwnedCollectionList,
            ...action.payload?.list,
          ],
          nftDataCollectionList: [
            ...state.nftDataCollectionList,
            ...action.payload?.list,
          ],
          nftDataCollectionTotalCount: action.payload.count,
          nftDataOwnedCollectionTotalCount: action.payload.count,
          nftDataCollectionLoading: false,
        });
      }
      if (action.payload.tabTitle === 'Gallery') {
        return (state = {
          ...state,
          nftDataGalleryCollectionList: [
            ...state.nftDataGalleryCollectionList,
            ...action.payload?.list,
          ],
          nftDataCollectionList: [
            ...state.nftDataCollectionList,
            ...action.payload?.list,
          ],
          nftDataCollectionTotalCount: action.payload.count,
          nftDataGalleryCollectionTotalCount: action.payload.count,
          nftDataCollectionLoading: false,
        });
      }

    case NFT_DATA_COLLECTION_LIST_UPDATE:
      return (state = {...state, nftDataCollectionList: [...action.payload]});

    case NFT_DATA_COLLECTION_LIST_RESET:
      return (state = {
        ...state,
        nftDataCollectionList: [],
        mysteryBoxCollectionList: [],
      });
    case NFT_DATA_ONSALE_COLLECTION_LIST_RESET:
      return (state = {...state, nftDataOnSaleCollectionList: []});
    case NFT_DATA_SOLDOUT_COLLECTION_LIST_RESET:
      return (state = {...state, nftDataSoldOutCollectionList: []});
    case NFT_DATA_OWNED_COLLECTION_LIST_RESET:
      return (state = {...state, nftDataOwnedCollectionList: []});
    case NFT_DATA_GALLERY_COLLECTION_LIST_RESET:
      return (state = {...state, nftDataGalleryCollectionList: []});

    case NFT_DATA_COLLECTION_FAIL:
      return (state = {...state, nftDataCollectionLoading: false});

    case NFT_DATA_COLLECTION_PAGE_CHANGE:
      return (state = {...state, nftDataCollectionPage: action.payload});

    case NFT_DATA_ONSALE_COLLECTION_PAGE_CHANGE:
      return (state = {...state, nftDataOnSaleCollectionPage: action.payload});
    case NFT_DATA_SOLDOUT_COLLECTION_PAGE_CHANGE:
      return (state = {...state, nftDataSoldOutCollectionPage: action.payload});
    case NFT_DATA_OWNED_COLLECTION_PAGE_CHANGE:
      return (state = {...state, nftDataOwnedCollectionPage: action.payload});
    case NFT_DATA_GALARY_COLLECTION_PAGE_CHANGE:
      return (state = {...state, nftDataGalleryCollectionPage: action.payload});

    case NFT_BLIND_SERIES_COLLECTION_START:
      return (state = {
        ...state,
        nftBlindSeriesCollectionLoading: true,
        tabTitle: action.payload,
      });

    case NFT_BLIND_SERIES_COLLECTION_SUCCESS:
      return (state =
        action.payload.tabTitle === state.tabTitle
          ? {
              ...state,
              nftBlindSeriesCollectionList: [
                ...state.nftBlindSeriesCollectionList,
                ...action.payload.data,
              ],
              nftBlindSeriesCollectionTotalCount: action.payload.count,
              nftBlindSeriesCollectionLoading: false,
            }
          : {
              ...state,
            });

    case NFT_BLIND_SERIES_COLLECTION_LIST_RESET:
      return (state = {...state, nftBlindSeriesCollectionList: []});

    case NFT_BLIND_SERIES_COLLECTION_FAIL:
      return (state = {...state, nftBlindSeriesCollectionLoading: false});

    case NFT_BLIND_SERIES_COLLECTION_PAGE_CHANGE:
      return (state = {...state, nftBlindSeriesCollectionPage: action.payload});

    case ACTIVITY_NFT_LIST_START:
      return (state = {
        ...state,
        nftActivityLoading: true,
        tabTitle: action.payload,
      });

    case ACTIVITY_NFT_LIST_SUCCESS:
      return (state = {
        ...state,
        nftActivityList: [...action.payload?.list],
        nftActivityPage: 1,
        nftActivityTotalCount: action.payload.count,
        nftActivityItems: action.payload.result,
        tabTitle: action.payload.tabTitle,
        nftActivityLoading: false,
      });

    case ACTIVITY_NFT_LIST_FAIL:
      return (state = {...state, nftActivityLoading: false});

    case ACTIVITY_NFT_LIST_RESET:
      return (state = {...state, nftActivityList: []});

    case ACTIVITY_NFT_LIST_PAGE_CHANGE:
      return (state = {...state, nftActivityPage: action.payload});

    default:
      return state;
  }
}
