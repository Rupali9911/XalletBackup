import {
    FAVORITE_NFT_LOAD_SUCCESS, NEW_NFT_LIST_RESET,
    NEW_NFT_LIST_UPDATE, NEW_NFT_LOAD_FAIL, NEW_NFT_LOAD_START,
    NEW_NFT_LOAD_SUCCESS, NEW_PAGE_CHANGE
} from '../types';

const initialState = {
  newNftListLoading: false,
  newNftList: [],
  favoriteNftList: [],
  newListPage: 1,
  newTotalCount: 0,
};

export default function NewNFTListReducer(state = initialState, action) {
  switch (action.type) {
    case NEW_NFT_LOAD_START:
      return (state = {...state, newNftListLoading: true});

    case NEW_NFT_LOAD_SUCCESS:
      return (state = {
        ...state,
        newNftList: [...state.newNftList, ...action.payload.data],
        newTotalCount: action.payload.count,
        newNftListLoading: false,
      });
    case FAVORITE_NFT_LOAD_SUCCESS:
      return (state = {
        ...state,
        favoriteNftList: [...state.favoriteNftList, ...action.payload.data],
        newTotalCount: action.payload.count,
        newNftListLoading: false,
      });

    case NEW_NFT_LOAD_FAIL:
      return (state = {...state, newNftListLoading: false});

    case NEW_NFT_LIST_RESET:
      return (state = {...state, newNftList: []});

    case NEW_NFT_LIST_UPDATE:
      return (state = {...state, newNftList: [...action.payload]});

    case NEW_PAGE_CHANGE:
      return (state = {...state, newListPage: action.payload});

    default:
      return state;
  }
}
