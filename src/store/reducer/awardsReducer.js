import {
    AWARDS_NFT_FAIL,
    AWARDS_NFT_LIST_RESET,
    AWARDS_NFT_START,
    AWARDS_NFT_SUCCESS,
    AWARDS_PAGE_CHANGE,
    AWARDS_LIST_UPDATE,
} from '../types';

const initialState = {
    awardsNftLoading: false,
    awardsNftList: [],
    awardsNftPage: 1,
    awardsTotalCount: 0
}

export default function AwardsNFTReducer(state = initialState, action) {
    switch (action.type) {

        case AWARDS_NFT_START:
            return state = { ...state, awardsNftLoading: true };

        case AWARDS_NFT_SUCCESS:
            return state = { ...state, awardsNftList: [...state.awardsNftList, ...action.payload.data], awardsTotalCount: action.payload.count, awardsNftLoading: false };

        case AWARDS_LIST_UPDATE:
            return state = { ...state, awardsNftList: [...action.payload] };

        case AWARDS_NFT_LIST_RESET:
            return state = { ...state, awardsNftList: [] };

        case AWARDS_NFT_FAIL:
            return state = { ...state, awardsNftLoading: false };

        case AWARDS_PAGE_CHANGE:
            return state = { ...state, awardsNftPage: action.payload };

        default:
            return state;
    }
}