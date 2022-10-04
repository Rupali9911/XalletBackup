import {BUY_NFT_START, BUY_NFT_SUCCESS, BUY_NFT_FAIL} from '../types';
import {ApiRequest} from '../../helpers/ApiRequest';

const initialState = {
  isBuyLoading: false,
  buyNFTRes: {},
  buyError: {},
  nftData: {},
};

export default function detailsNFTReducer(state = initialState, action) {
  switch (action.type) {
    case BUY_NFT_START:
      return {...state, isBuyLoading: true};

    case BUY_NFT_SUCCESS:
      return {...state, buyNFTRes: action.payload, isBuyLoading: false};

    case BUY_NFT_FAIL:
      return {...state, buyError: action.payload, isBuyLoading: false};

    default:
      return state;
  }
}
