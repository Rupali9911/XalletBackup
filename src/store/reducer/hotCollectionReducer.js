import {
  HOT_COLLECTION_FAIL,
  HOT_COLLECTION_LIST_RESET,
  HOT_COLLECTION_START,
  HOT_COLLECTION_SUCCESS,
  HOT_COLLECTION_PAGE_CHANGE,
  HOT_COLLECTION_LIST_UPDATE,
} from '../types';

const initialState = {
  hotCollectionLoading: false,
  hotCollectionList: [],
  hotCollectionPage: 1,
  hotCollectionTotalCount: 5
}

export default function HotCollectionReducer(state = initialState, action) {
  switch (action.type) {

    case HOT_COLLECTION_START:
      return state = { ...state, hotCollectionLoading: true };

    case HOT_COLLECTION_SUCCESS:
      return state = {
        ...state,
        hotCollectionList: [...state.hotCollectionList, ...action.payload.listCollectionAllUser],
        hotCollectionTotalCount: action.payload.count,
        hotCollectionLoading: false,
      };

    case HOT_COLLECTION_LIST_UPDATE:
      return state = { ...state, hotCollectionList: [...action.payload] };

    case HOT_COLLECTION_LIST_RESET:
      return state = { ...state, hotCollectionList: [] };

    case HOT_COLLECTION_FAIL:
      return state = { ...state, hotCollectionLoading: false };

    case HOT_COLLECTION_PAGE_CHANGE:
      return state = { ...state, hotCollectionPage: action.payload };

    default:
      return state;
  }
}