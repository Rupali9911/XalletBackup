import Config from "react-native-config";

import {
    ACCOUNT_KEY_FAIL,
    ACCOUNT_KEY_SUCCESS,
    RESET_ACCOUNT,
    NFT_LIST_SUCCESS,
    NFT_LIST_UPDATE,
    LOAD_NFT_START,
    NFT_LIST_FAIL,
    PAGE_CHANGE,
    HANDLE_LIKE_DISLIKE,
    MY_NFT_LOAD_FAIL,
    MY_NFT_LOAD_START,
    MY_NFT_LOAD_SUCCESS,
    MY_PAGE_CHANGE
} from '../types';

export const loadAccountKeyFail = () => ({
    type: ACCOUNT_KEY_FAIL
});

export const resetAccount = () => ({
    type: RESET_ACCOUNT
});

export const loadAccountKeySuccess = (data) => ({
    type: ACCOUNT_KEY_SUCCESS,
    payload: data
});

export const nftLoadStart = () => ({
    type: LOAD_NFT_START
});

export const nftLoadFail = () => ({
    type: NFT_LIST_FAIL
});

export const nftLoadSuccess = (data) => ({
    type: NFT_LIST_SUCCESS,
    payload: data
});

export const nftLoadUpdate = (data) => ({
    type: NFT_LIST_UPDATE,
    payload: data
});

export const handleLikeDislikeSuccess = (data) => ({
    type: HANDLE_LIKE_DISLIKE,
    payload: data
});

export const pageChange = (data) => ({
    type: PAGE_CHANGE,
    payload: data
});

export const getNFTList = (page) => {
    return (dispatch, getState) => {

        let accountKey = getState().AuthReducer.accountKey;
        let oldNFTS = getState().ListReducer.nftList;
        
        let body_data = {
            type: "2d",
            page,
            limit: 30,
            networkType: "mainnet",
        }

        if (accountKey) {
            body_data.owner = accountKey;
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
            .then(response => response.json())
            .then(json => {
                
                let new_list = [...json.data];
                let array = [...oldNFTS, ...new_list];
                let jsonObject = array.map(JSON.stringify);
                let uniqueSet = new Set(jsonObject);
                let uniqueArray = Array.from(uniqueSet).map(JSON.parse);
                dispatch(nftLoadSuccess(uniqueArray))

            }).catch(err => {
                dispatch(nftLoadFail())
                alert(err.message)
            })

        }
    }

    export const handleLikeDislike = (item, index) => {
        return (dispatch, getState) => {
            
            let accountKey = getState().AuthReducer.accountKey;
            let oldNFTS = getState().ListReducer.nftList;
            
            var url1 = "";
            var url2 = `${Config.BASE_URL}/updateRating`;
            let like_body = {
                networkType: "mainnet",
            owner: accountKey,
            tokenId: item.tokenId
        }
        let rating_body = {
            networkType: "mainnet",
            tokenId: item.tokenId
        }
        if (item.like == 0) {
            url1 = `${Config.BASE_URL}/likeNFT`;
            rating_body.rating = item.rating + 1;
            item.like = 1;
            item.rating = item.rating + 1;
        } else {
            url1 = `${Config.BASE_URL}/unlikeNFT`
            rating_body.rating = item.rating - 1
            item.like = 0;
            item.rating = item.rating - 1;
        }
        
        let fetch_like_body = {
            method: 'POST',
            body: JSON.stringify(like_body),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }
        let fetch_rating_body = {
            method: 'POST',
            body: JSON.stringify(rating_body),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }
        Promise.all([
            fetch(url1, fetch_like_body).then(res => res.json()),
            fetch(url2, fetch_rating_body).then(res => res.json())
        ]).then(() => {
            const nftUpdated = [
                ...oldNFTS.slice(0, index),
                item,
                ...oldNFTS.slice(index + 1),
            ];
            
            dispatch(nftLoadUpdate(nftUpdated))
        })
        
    }
}

export const myNftLoadSuccess = (data) => ({
    type: MY_NFT_LOAD_SUCCESS,
    payload: data
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
        let oldNFTS = getState().ListReducer.myList;
        
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
                let array = [...oldNFTS, ...results];
                let jsonObject = array.map(JSON.stringify);
                let uniqueSet = new Set(jsonObject);
                let uniqueArray = Array.from(uniqueSet).map(JSON.parse);
                dispatch(myNftLoadSuccess(uniqueArray))
                
            }).catch(err => {
                dispatch(myNftLoadFail())
                alert(err.message)
            })
    }
}