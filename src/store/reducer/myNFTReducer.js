import {
  FAVORITE_LIST_UPDATE,
  FAVORITE_NFT_SUCCESS,
  FAVORITE_PAGE_CHANGE,
  MYLIST_LIST_UPDATE,
  MY_NFT_LOAD_FAIL,
  MY_NFT_LOAD_RESET,
  MY_NFT_LOAD_START,
  MY_NFT_LOAD_SUCCESS,
  SET_NFT_USER_ADDRESS,
  MY_PAGE_CHANGE,
} from '../types';

const initialState = {
  myNftListLoading: false,
  myList: [],
  favorite: [],
  myListPage: 1,
  nftUserAdd: "",
  myNftTotalCount: 0,
};

export default function MyNFTReducer(state = initialState, action) {
  switch (action.type) {
    case SET_NFT_USER_ADDRESS:
      return (state = { ...state, nftUserAdd: action.payload });

    case MY_PAGE_CHANGE:
      return (state = { ...state, myListPage: action.payload });

    case FAVORITE_PAGE_CHANGE:
      return (state = { ...state, favoritePage: action.payload });

    case MY_NFT_LOAD_START:
      return (state = { ...state, myNftListLoading: true });

    case MY_NFT_LOAD_SUCCESS:
      return (state = {
        ...state,
        myList: [...state.myList, ...action.payload.list],
        myNftTotalCount: action.payload.count,
        myNftListLoading: false,
      });

    case FAVORITE_NFT_SUCCESS:
      return (state = {
        ...state,
        favorite: [...action.payload],
        myNftListLoading: false,
      });

    case FAVORITE_LIST_UPDATE:
      return (state = { ...state, favorite: [...action.payload.data] });

    case MYLIST_LIST_UPDATE:
      return (state = { ...state, myList: [...action.payload.data] });

    case MY_NFT_LOAD_FAIL:
      return (state = { ...state, myNftListLoading: false });

    case MY_NFT_LOAD_RESET:
      return (state = { ...state, myList: [], favorite: [] });

    default:
      return state;
  }
}
