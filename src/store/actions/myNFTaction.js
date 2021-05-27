import Config from "react-native-config";

import {
    MY_NFT_LOAD_FAIL,
    MY_NFT_LOAD_START,
    MY_NFT_LOAD_SUCCESS,
    MY_PAGE_CHANGE
} from '../types';

export const myNftLoadSuccess = (data, cList) => ({
    type: MY_NFT_LOAD_SUCCESS,
    payload: { myList: data, completeList: cList }
});

export const myNftLoadStart = () => ({
    type: MY_NFT_LOAD_START
});

export const myNftLoadFail = () => ({
    type: MY_NFT_LOAD_FAIL
});

export const myPageChange = (data) => ({
    type: MY_PAGE_CHANGE,
    payload: data
});

export const myNFTList = (page) => {
    return (dispatch, getState) => {

        let accountKey = getState().AuthReducer.accountKey;
        const { myList, completeNFTList } = getState().MyNFTReducer;

        let body_data = {
            limit: 1000,
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
                var results = new_list.filter(e => {
                    if (e.hasOwnProperty("returnValues")) {
                        return e.returnValues.to === accountKey
                        // return e.returnValues.to === "0x41052F4608418d0A1039971c699bD74cf9CAd0Fd"
                    }
                });
                let array = [...myList, ...results];
                let nftCompleteList = [...completeNFTList, ...new_list];
                let jsonObject = array.map(JSON.stringify);
                let uniqueSet = new Set(jsonObject);
                let uniqueArray = Array.from(uniqueSet).map(JSON.parse);
                dispatch(myNftLoadSuccess(uniqueArray, nftCompleteList))

            }).catch(err => {
                dispatch(myNftLoadFail())
                alert(err.message)
            })
    }
}