import {
    MY_NFT_LOAD_FAIL,
    MY_NFT_LOAD_START,
    MY_NFT_LOAD_SUCCESS,
    MY_PAGE_CHANGE
} from '../types';

const initialState = {
    myNftListLoading: false,
    myList: [],
    completeNFTList: [],
    myListPage: 1
}

export default function MyNFTReducer(state = initialState, action) {
    switch (action.type) {

        case MY_PAGE_CHANGE:
            return state = { ...state, myListPage: action.payload };

        case MY_NFT_LOAD_START:
            return state = { ...state, myNftListLoading: true };

        case MY_NFT_LOAD_SUCCESS:
            return state = { ...state, myList: [...action.payload.myList], completeNFTList: [...action.payload.completeList], myNftListLoading: false };

        case MY_NFT_LOAD_FAIL:
            return state = { ...state, myNftListLoading: false };

        default:
            return state;
    }
}