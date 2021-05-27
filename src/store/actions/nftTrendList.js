import Config from "react-native-config";

import {
    NFT_LIST_SUCCESS,
    NFT_LIST_UPDATE,
    LOAD_NFT_START,
    NFT_LIST_FAIL,
    PAGE_CHANGE,
    HANDLE_LIKE_DISLIKE,
    NFT_LIST_RESET
} from '../types';


export const nftLoadStart = () => ({
    type: LOAD_NFT_START
});

export const nftLoadFail = () => ({
    type: NFT_LIST_FAIL
});

export const nftListReset = () => ({
    type: NFT_LIST_RESET
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
        // let oldNFTS = getState().ListReducer.nftList;

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
                // let array = [...oldNFTS, ...new_list];
                // let jsonObject = array.map(JSON.stringify);
                // let uniqueSet = new Set(jsonObject);
                // let uniqueArray = Array.from(uniqueSet).map(JSON.parse);
                dispatch(nftLoadSuccess(new_list))

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