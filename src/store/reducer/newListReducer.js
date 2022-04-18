import {
  FAVORITE_NFT_LOAD_SUCCESS,
  NEW_NFT_LIST_RESET,
  NEW_NFT_LIST_UPDATE,
  NEW_NFT_LOAD_FAIL,
  ART_NFT_LOAD_FAIL,
  NEW_NFT_LOAD_START,
  ART_NFT_LOAD_START,
  NEW_NFT_LOAD_SUCCESS,
  NEW_PAGE_CHANGE,
  UPDATE_ARTIST_DETAIL,
  UPDATE_NFT_DETAIL,
  UPDATE_OWNER_DETAIL,
} from '../types';

const initialState = {
  isArtNftLoading: false,
  isPhotoNftLoading: false,
  newNftListLoading: false,
  newNftList: [],
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
      switch (action.payload) {
        case 'art':
          return (state = {...state, isArtNftLoading: true })
        case 'photo':
          return (state = {...state, isPhotoNftLoading: true })
        default:
          return (state = {...state, newNftListLoading: true })
      }

    case NEW_NFT_LOAD_SUCCESS:
      return (state = {
        ...state,
        newNftList: [...state.newNftList, ...action.payload.data],
        newTotalCount: action.payload.count,
        newNftListLoading: false,
        isArtNftLoading: false,
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
      return (state = {...state, newNftListLoading: false, isPhotoNftLoading: false  });
    case ART_NFT_LOAD_FAIL:
      return (state = {...state, isArtNftLoading: false});

    case NEW_NFT_LIST_RESET:
      switch (action.payload) {
        case 'art':
          return (state = {...state, newNftList: [] })
        case 'photo':
          return (state = {...state, favoriteNftList: [] })
        default:
          return (state = {...state, newNftList: [], favoriteNftList: []});
      }

    case NEW_NFT_LIST_UPDATE:
      return (state = {...state, newNftList: [...action.payload]});

    case NEW_PAGE_CHANGE:
      return (state = {...state, newListPage: action.payload});

    default:
      return state;
  }
}
