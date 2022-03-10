import {
  ALL_ARTIST_SUCCESS,
  ARTIST_LOADING_END,
  ARTIST_LOADING_START,
  GIF_NFT_LIST_SUCCESS,
  LOAD_NFT_START,
  MOVIE_NFT_LOAD_START,
  HOT_NFT_LOAD_START,
  GIF_NFT_LOAD_START,
  MOVIE_NFT_LIST_SUCCESS,
  NFT_LIST_FAIL,
  MOVIE_NFT_LOAD_FAIL,
  HOT_NFT_LOAD_FAIL,
  GIF_NFT_LOAD_FAIL,
  NFT_LIST_RESET,
  NFT_LIST_SUCCESS,
  NFT_LIST_UPDATE,
  PAGE_CHANGE,
  SET_SORT_ORDER,
} from '../types';

const initialState = {
  isHotNftLoading: false,
  isGifNftLoading: false,
  isMovieNftLoading: false,
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
    case MOVIE_NFT_LOAD_START:
      return (state = {...state, isMovieNftLoading: true});

    case GIF_NFT_LOAD_START:
      return (state = {...state, isGifNftLoading: true});

    case HOT_NFT_LOAD_START:
      return (state = {...state, isHotNftLoading: true});
      
    case LOAD_NFT_START:
      return (state = {...state, nftListLoading: true});

    case NFT_LIST_SUCCESS:
      return (state = {
        ...state,
        nftList: [...state.nftList, ...action.payload.data],
        totalCount: action.payload.count,
        nftListLoading: false,
        isHotNftLoading: false,
      });

    case GIF_NFT_LIST_SUCCESS:
      return (state = {
        ...state,
        gifList: [...state.gifList, ...action.payload.data],
        totalCount: action.payload.count,
        nftListLoading: false,
        isGifNftLoading: false
      });
    case MOVIE_NFT_LIST_SUCCESS:
      return (state = {
        ...state,
        movieList: [...state.movieList, ...action.payload.data],
        totalCount: action.payload.count,
        nftListLoading: false,
        isMovieNftLoading:false,
      });

    case NFT_LIST_UPDATE:
      return (state = {...state, nftList: [...action.payload]});

    case NFT_LIST_RESET:
      return (state = {...state, nftList: [], gifList: [], movieList: []});

    case MOVIE_NFT_LOAD_FAIL:
      return (state = {...state, isMovieNftLoading: false });
    
    case HOT_NFT_LOAD_FAIL:
      return (state = {...state, isHotNftLoading: false });
    
    case GIF_NFT_LOAD_FAIL:
      return (state = {...state, isGifNftLoading: false });
    
    case NFT_LIST_FAIL:
      return (state = {...state, nftListLoading: false });

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
