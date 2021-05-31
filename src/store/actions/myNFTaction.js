import Config from "react-native-config";

import {
    MY_NFT_LOAD_FAIL,
    MY_NFT_LOAD_START,
    MY_PAGE_CHANGE,
    MY_NFT_LOAD_RESET,
    MY_NFT_LOAD_SUCCESS,
    FAVORITE_NFT_SUCCESS,
    FAVORITE_PAGE_CHANGE
} from '../types';

import { twoNftLoadSuccess } from './twoDAction';

export const myNftLoadStart = () => ({
    type: MY_NFT_LOAD_START
});

export const myNftLoadFail = () => ({
    type: MY_NFT_LOAD_FAIL
});

export const myNftListReset = () => ({
    type: MY_NFT_LOAD_RESET
});

export const myPageChange = (data) => ({
    type: MY_PAGE_CHANGE,
    payload: data
});

export const favoritePageChange = (data) => ({
    type: FAVORITE_PAGE_CHANGE,
    payload: data
});

export const myNFTList = (page, screen, limit) => {
    return (dispatch, getState) => {

        let accountKey = getState().AuthReducer.accountKey;
        const { myList, favorite } = getState().MyNFTReducer;
        
        let body_data = {
            limit: limit,
            networkType: "mainnet",
            owner: accountKey,
            page: page,
            token: "HubyJ*%qcqR0",
            type: "2D"
        }

        let fetch_data_body = {
            method: 'POST',
            body: JSON.stringify(body_data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }
        fetch(`${Config.BASE_URL}/getDemuxData`, fetch_data_body)
            .then(response => response.json())  // promise
            .then(json => {
                let new_list = [...json.data];
                if (screen == "favorite") {

                    var favoriteList = new_list.filter(e => e.like == 1);

                    let nftCompleteList = [...favorite, ...favoriteList];
                    let jsonObject_C = nftCompleteList.map(JSON.stringify);
                    let uniqueSet_C = new Set(jsonObject_C);
                    let uniqueArray_C = Array.from(uniqueSet_C).map(JSON.parse);
                    dispatch(favoriteNftSuccess(uniqueArray_C))

                } else if (screen == "2D") {

                    dispatch(twoNftLoadSuccess(new_list))

                } else {
                    var results = new_list.filter(e => {
                        if (e.hasOwnProperty("returnValues")) {
                            return e.returnValues.to === accountKey
                        }
                    });
                    let array = [...myList, ...results];
                    let jsonObject = array.map(JSON.stringify);
                    let uniqueSet = new Set(jsonObject);
                    let uniqueArray = Array.from(uniqueSet).map(JSON.parse);
                    dispatch(myNftLoadSuccess(uniqueArray))

                }

            }).catch(err => {
                dispatch(myNftLoadFail())
                alert(err.message)
            })
    }
}

export const myNftLoadSuccess = (data) => ({
    type: MY_NFT_LOAD_SUCCESS,
    payload: data
});

export const favoriteNftSuccess = (data) => ({
    type: FAVORITE_NFT_SUCCESS,
    payload: data
});