import {
  ALL_ARTIST_SUCCESS,
  ARTIST_LOADING_END,
  ARTIST_LOADING_START,
  GIF_NFT_LIST_SUCCESS,
  LOAD_NFT_START,
  MOVIE_NFT_LIST_SUCCESS,
  NFT_LIST_FAIL,
  NFT_LIST_RESET,
  NFT_LIST_SUCCESS,
  NFT_LIST_UPDATE,
  PAGE_CHANGE,
  SET_SORT_ORDER,
} from '../types';

const initialState = {
  nftListLoading: false,
  nftList: [],
  gifList: [],
  movieList: [],
  artistList: [],
  page: 1,
  totalCount: 0,
  artistLoading: false,
  sort: null,
};

export default function ListReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_NFT_START:
      return (state = {...state, nftListLoading: true});

    case NFT_LIST_SUCCESS:
      return (state = {
        ...state,
        nftList: [...state.nftList, ...action.payload.data],
        totalCount: action.payload.count,
        nftListLoading: false,
      });

    case GIF_NFT_LIST_SUCCESS:
      return (state = {
        ...state,
        gifList: [...state.gifList, ...action.payload.data],
        totalCount: action.payload.count,
        nftListLoading: false,
      });
    case MOVIE_NFT_LIST_SUCCESS:
      return (state = {
        ...state,
        movieList: [...state.movieList, ...action.payload.data],
        totalCount: action.payload.count,
        nftListLoading: false,
      });

    case NFT_LIST_UPDATE:
      return (state = {...state, nftList: [...action.payload]});

    case NFT_LIST_RESET:
      return (state = {...state, nftList: []});

    case NFT_LIST_FAIL:
      return (state = {...state, nftListLoading: false});

    case PAGE_CHANGE:
      return (state = {...state, page: action.payload});

    case ARTIST_LOADING_START:
      return {...state, artistLoading: true};

    case ALL_ARTIST_SUCCESS:
      return {...state, artistList: action.payload, artistLoading: false};

    case ARTIST_LOADING_END:
      return {...state, artistLoading: false};

    case SET_SORT_ORDER:
      console.log('action.payload', action.payload);
      return {...state, sort: action.payload};

    default:
      return state;
  }
}
