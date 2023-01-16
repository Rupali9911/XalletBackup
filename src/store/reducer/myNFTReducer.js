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
  MY_NFT_CREATED_PAGE_CHANGE,
  MY_NFT_OWNED_PAGE_CHANGE,
  MY_NFT_CREATED_LIST_RESET,
  MY_NFT_OWNED_LIST_RESET,
  MY_NFT_CREATED_LOAD_START,
  MY_NFT_OWNED_LOAD_START,
} from '../types';

const initialState = {
  myNftListLoading: true,
  myNftCreatedListLoading: true,
  myNftOwnedListLoading: true,
  myList: [],
  myNftCreatedList: [],
  myNftOwnedList: [],
  favorite: [],
  myListPage: 1,
  myNftCreatedListPage: 1,
  myNftOwnedListPage: 1,
  nftUserAdd: '',
  myNftTotalCount: 0,
  myNftCreatedTotalCount: 0,
  myNftOwnedTotalCount: 0,
};

export default function MyNFTReducer(state = initialState, action) {
  switch (action.type) {
    case SET_NFT_USER_ADDRESS:
      return (state = {...state, nftUserAdd: action.payload});

    case MY_PAGE_CHANGE:
      return (state = {...state, myListPage: action.payload});

    case MY_NFT_CREATED_PAGE_CHANGE:
      return (state = {...state, myNftCreatedListPage: action.payload});

    case MY_NFT_OWNED_PAGE_CHANGE:
      return (state = {...state, myNftOwnedListPage: action.payload});

    case FAVORITE_PAGE_CHANGE:
      return (state = {...state, favoritePage: action.payload});

    case MY_NFT_LOAD_START:
      return (state = {...state, myNftListLoading: true});

    case MY_NFT_CREATED_LOAD_START:
      return (state = {...state, myNftCreatedListLoading: true});

    case MY_NFT_OWNED_LOAD_START:
      return (state = {...state, myNftOwnedListLoading: true});

    case MY_NFT_LOAD_SUCCESS:
      if (action.payload.tabTitle === 1) {
        return (state = {
          ...state,
          myNftCreatedList: [...state.myNftCreatedList, ...action.payload.list],
          myList: [...state.myList, ...action.payload.list],
          // myNftTotalCount: action.payload.count,
          myNftCreatedTotalCount: action.payload.count,
          // myNftListLoading: false,
          myNftCreatedListLoading: false,
        });
      } else if (action.payload.tabTitle === 2) {
        return (state = {
          ...state,
          myNftCreatedList: [...state.myNftCreatedList],
          myNftOwnedList: [...state.myNftOwnedList, ...action.payload.list],
          myList: [...state.myList, ...action.payload.list],
          myNftOwnedTotalCount: action.payload.count,
          // myNftTotalCount: action.payload.count,
          // myNftListLoading: false,
          myNftOwnedListLoading: false,
        });
      } else {
        return (state = {
          ...state,
          myList: [...state.myList, ...action.payload.list],
          myNftTotalCount: action.payload.count,
          myNftListLoading: false,
        });
      }

    case FAVORITE_NFT_SUCCESS:
      return (state = {
        ...state,
        favorite: [...action.payload],
        myNftListLoading: false,
      });

    case FAVORITE_LIST_UPDATE:
      return (state = {...state, favorite: [...action.payload.data]});

    case MYLIST_LIST_UPDATE:
      return (state = {...state, myList: [...action.payload.data]});

    case MY_NFT_LOAD_FAIL:
      return (state = {...state, myNftListLoading: false});

    case MY_NFT_LOAD_RESET:
      return (state = {
        ...state,
        myList: [],
        favorite: [],
      });

    case MY_NFT_CREATED_LIST_RESET:
      return (state = {
        ...state,
        myNftCreatedListPage: 1,
        myNftCreatedList: [],
      });
    case MY_NFT_OWNED_LIST_RESET:
      return (state = {
        ...state,
        myNftOwnedListPage: 1,
        myNftOwnedList: [],
      });

    default:
      return state;
  }
}
