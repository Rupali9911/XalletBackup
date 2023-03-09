import {
  FAVORITE_NFT_LOAD_SUCCESS,
  NEW_NFT_LIST_RESET,
  NEW_NFT_LIST_UPDATE,
  NEW_NFT_LOAD_FAIL,
  ART_NFT_LOAD_FAIL,
  NEW_NFT_LOAD_START,
  ART_NFT_LOAD_START,
  // NEW_NFT_LOAD_SUCCESS,
  NEW_NFT_ART_LOAD_SUCCESS,
  NEW_NFT_ALL_LOAD_SUCCESS,
  NEW_NFT_TRENDING_LOAD_SUCCESS,
  NEW_NFT_IMAGE_LOAD_SUCCESS,
  NEW_NFT_GIF_LOAD_SUCCESS,
  NEW_NFT_MOVIE_LOAD_SUCCESS,
  NEW_NFT_MUSIC_LOAD_SUCCESS,
  NEW_PAGE_CHANGE,
  UPDATE_ARTIST_DETAIL,
  UPDATE_NFT_DETAIL,
  UPDATE_OWNER_DETAIL,
} from '../types';

import {CATEGORY_VALUE} from '../../constants';

const initialState = {
  isArtNftLoading: false,
  isPhotoNftLoading: false,
  newNftListLoading: true,
  newArtNftList: [],
  newArtNftPage: 1,
  newArtNftCurrentFilter: 0,
  newArtNftTotalCount: 0,
  newAllNftList: [],
  newAllNftPage: 1,
  newAllNftCurrentFilter: 0,
  newAllNftTotalCount: 0,
  newTrendingNftList: [],
  newTrendingNftPage: 1,
  newTrendingNftCurrentFilter: 0,
  newTrendingNftTotalCount: 0,
  newImageNftList: [],
  newImageNftPage: 1,
  newImageNftCurrentFilter: 0,
  newImageNftTotalCount: 0,
  newGifNftList: [],
  newGIFNftPage: 1,
  newGIFNftCurrentFilter: 0,
  newGIFNftTotalCount: 0,
  newMovieNftList: [],
  newMovieNftPage: 1,
  newMovieNftCurrentFilter: 0,
  newMovieNftTotalCount: 0,
  newMusicNftList: [],
  newMusicNftPage: 1,
  newMusicNftCurrentFilter: 0,
  newMusicNftTotalCount: 0,

  favoriteNftList: [],
  newListPage: 1,
  newTotalCount: 0,
  nftDetail: {},
  artistDetail: {},
  ownerDetail: {},
};

export default function NewNFTListReducer(state = initialState, action) {
  switch (action.type) {
    case ART_NFT_LOAD_START:
      return (state = {...state, isArtNftLoading: true});

    case NEW_NFT_LOAD_START:
      return (state = {...state, newNftListLoading: true});

    case NEW_NFT_ART_LOAD_SUCCESS:
      return (state = {
        ...state,
        newArtNftList: [...state.newArtNftList, ...action.payload.list],
        newArtNftTotalCount: action.payload.count,
        newArtNftPage: action.payload.pageNum,
        newArtNftCurrentFilter: action.payload.currentFilter,
        newNftListLoading: false,
      });

    case NEW_NFT_ALL_LOAD_SUCCESS:
      return (state = {
        ...state,
        newAllNftList: [...state.newAllNftList, ...action.payload.list],
        newAllNftTotalCount: action.payload.count,
        newAllNftPage: action.payload.pageNum,
        newAllNftCurrentFilter: action.payload.currentFilter,
        newNftListLoading: false,
      });

    case NEW_NFT_TRENDING_LOAD_SUCCESS:
      return (state = {
        ...state,
        newTrendingNftList: [
          ...state.newTrendingNftList,
          ...action.payload.list,
        ],
        newTrendingNftTotalCount: action.payload.count,
        newTrendingNftPage: action.payload.pageNum,
        newTrendingNftCurrentFilter: action.payload.currentFilter,
        newNftListLoading: false,
      });

    case NEW_NFT_IMAGE_LOAD_SUCCESS:
      return (state = {
        ...state,
        newImageNftList: [...state.newImageNftList, ...action.payload.list],
        newImageNftTotalCount: action.payload.count,
        newImageNftPage: action.payload.pageNum,
        newImageNftCurrentFilter: action.payload.currentFilter,
        newNftListLoading: false,
      });

    case NEW_NFT_GIF_LOAD_SUCCESS:
      return (state = {
        ...state,
        newGifNftList: [...state.newGifNftList, ...action.payload.list],
        newGIFNftTotalCount: action.payload.count,
        newGIFNftPage: action.payload.pageNum,
        newGIFNftCurrentFilter: action.payload.currentFilter,
        newNftListLoading: false,
      });

    case NEW_NFT_MOVIE_LOAD_SUCCESS:
      return (state = {
        ...state,
        newMovieNftList: [...state.newMovieNftList, ...action.payload.list],
        newMovieNftTotalCount: action.payload.count,
        newMovieNftPage: action.payload.pageNum,
        newMovieNftCurrentFilter: action.payload.currentFilter,
        newNftListLoading: false,
      });

    case NEW_NFT_MUSIC_LOAD_SUCCESS:
      return (state = {
        ...state,
        newMusicNftList: [...state.newMusicNftList, ...action.payload.list],
        newMusicNftTotalCount: action.payload.count,
        newMusicNftPage: action.payload.pageNum,
        newMusicNftCurrentFilter: action.payload.currentFilter,
        newNftListLoading: false,
      });

    case FAVORITE_NFT_LOAD_SUCCESS:
      return (state = {
        ...state,
        favoriteNftList: [...state.favoriteNftList, ...action.payload.data],
        newTotalCount: action.payload.count,
        isPhotoNftLoading: false,
        newNftListLoading: false,
      });
    case UPDATE_NFT_DETAIL:
      return (state = {...state, nftDetail: action.payload});
    case UPDATE_ARTIST_DETAIL:
      return (state = {...state, artistDetail: action.payload});
    case UPDATE_OWNER_DETAIL:
      return (state = {...state, ownerDetail: action.payload});
    case NEW_NFT_LOAD_FAIL:
      return (state = {
        ...state,
        newNftListLoading: false,
        isPhotoNftLoading: false,
      });
    case ART_NFT_LOAD_FAIL:
      return (state = {...state, isArtNftLoading: false});

    case NEW_NFT_LIST_RESET:
      switch (action.payload) {
        case CATEGORY_VALUE.allNft:
          return (state = {
            ...state,
            newAllNftList: [],
            newAllNftPage: 1,
            newAllNftTotalCount: 0,
          });
        case CATEGORY_VALUE.art:
          return (state = {
            ...state,
            newArtNftList: [],
            newArtNftPage: 1,
            newArtNftTotalCount: 0,
          });
        case CATEGORY_VALUE.trending:
          return (state = {
            ...state,
            newTrendingNftList: [],
            newTrendingNftPage: 1,
            newTrendingNftTotalCount: 0,
          });
        case CATEGORY_VALUE.image:
          return (state = {
            ...state,
            newImageNftList: [],
            newImageNftPage: 1,
            newImageNftTotalCount: 0,
          });
        case CATEGORY_VALUE.gif:
          return (state = {
            ...state,
            newGifNftList: [],
            newGIFNftPage: 1,
            newGIFNftTotalCount: 0,
          });
        case CATEGORY_VALUE.movie:
          return (state = {
            ...state,
            newMovieNftList: [],
            newMovieNftPage: 1,
            newMovieNftTotalCount: 0,
          });
        case CATEGORY_VALUE.music:
          return (state = {
            ...state,
            newMusicNftList: [],
            newMusicNftPage: 1,
            newMusicNftTotalCount: 0,
          });
        default:
          return (state = {...state, newNftList: []});
      }

    case NEW_NFT_LIST_UPDATE:
      return (state = {
        ...state,
        newNftList: [...state.newNftList, ...action.payload],
      });

    case NEW_PAGE_CHANGE:
      return (state = {...state, newListPage: action.payload});

    default:
      return state;
  }
}
