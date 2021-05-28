import Config from "react-native-config";

import {
    TWOD_NFT_FAIL,
    TWOD_NFT_LIST_RESET,
    TWOD_NFT_START,
    TWOD_NFT_SUCCESS,
    TWOD_PAGE_CHANGE
} from '../types';

export const twoDNftLoadStart = () => ({
    type: TWOD_NFT_START
});

export const twoDNftLoadFail = () => ({
    type: TWOD_NFT_FAIL
});

export const twoDNftListReset = () => ({
    type: TWOD_NFT_LIST_RESET
});

export const twoPageChange = (data) => ({
    type: TWOD_PAGE_CHANGE,
    payload: data
});

export const twoNftLoadSuccess = (data) => ({
    type: TWOD_NFT_SUCCESS,
    payload: data
});