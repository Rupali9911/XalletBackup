import {
  COLLECTION_FAIL,
  COLLECTION_LIST_RESET,
  COLLECTION_START,
  COLLECTION_SUCCESS,
  COLLECTION_PAGE_CHANGE,
  COLLECTION_LIST_UPDATE,
} from '../types';

const initialState = {
  collectionLoading: false,
  collectionList: [],
  collectionPage: 1,
  collectionTotalCount: 0
}

export default function CollectionReducer(state = initialState, action) {
  switch (action.type) {

    case COLLECTION_START:
      return state = { ...state, collectionLoading: true };

    case COLLECTION_SUCCESS:
      return state = {
        ...state,
        collectionList: [...state.collectionList, ...action.payload.listCollectionAllUser],
        collectionTotalCount: action.payload.count,
        collectionLoading: false,
      };

    case COLLECTION_LIST_UPDATE:
      return state = { ...state, collectionList: [...action.payload] };

    case COLLECTION_LIST_RESET:
      return state = { ...state, collectionList: [] };

    case COLLECTION_FAIL:
      return state = { ...state, collectionLoading: false };

    case COLLECTION_PAGE_CHANGE:
      return state = { ...state, collectionPage: action.payload };

    default:
      return state;
  }
}