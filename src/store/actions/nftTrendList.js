import { BASE_URL } from '../../common/constants';
import { networkType } from '../../common/networkType';

import {
    NFT_LIST_SUCCESS,
    LOAD_NFT_START,
    NFT_LIST_FAIL,
    PAGE_CHANGE,
    HANDLE_LIKE_DISLIKE,
    NFT_LIST_RESET,
    NFT_LIST_UPDATE,
    NEW_NFT_LIST_UPDATE,
    FAVORITE_LIST_UPDATE,
    TWOD_LIST_UPDATE,
    MYLIST_LIST_UPDATE,
    ALL_ARTIST_SUCCESS
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

export const handleLikeDislikeSuccess = (data) => ({
    type: HANDLE_LIKE_DISLIKE,
    payload: data
});

export const pageChange = (data) => ({
    type: PAGE_CHANGE,
    payload: data
});

export const getAllArtistSuccess = (data) => ({
    type: ALL_ARTIST_SUCCESS,
    payload: data
})

export const getNFTList = (page) => {
    return (dispatch, getState) => {

        let accountKey = getState().AuthReducer.accountKey;

        let body_data = {
            approveStatus: 'approve',
            type: "hot",
            page,
            limit: 30,
            networkType: networkType,
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

        fetch(`${BASE_URL}/getDemuxData`, fetch_data_body)
            .then(response => response.json())
            .then(json => {

                let new_list = [...json.data];
                dispatch(nftLoadSuccess(new_list))

            }).catch(err => {
                dispatch(nftLoadFail())
                alert(err.message)
            })

    }
}

export const getAllArtist = () => {
    return (dispatch) => {

        let body_data = {
            networkType: networkType,
        }

        let fetch_data_body = {
            method: 'POST',
            body: JSON.stringify(body_data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }

        fetch('https://api.xanalia.com/user/get-all-artist', fetch_data_body)
            .then(response => response.json())
            .then(json => {
                dispatch(getAllArtistSuccess([...json.data]))

            }).catch(err => {
                // dispatch(nftLoadFail())
                alert(err.message)
            })
    }
}

export const handleLikeDislike = (item, index) => {
    return (dispatch, getState) => {

        const { accountKey, screenName } = getState().AuthReducer;

        let oldNFTS = screenName == "Trend" ? getState().ListReducer.nftList :
            screenName == "newNFT" ? getState().NewNFTListReducer.newNftList :
                screenName == "favourite" ? getState().MyNFTReducer.favorite :
                    screenName == "twoDArt" ? getState().TwoDReducer.twoDNftList : getState().MyNFTReducer.myList;

        var url1 = "";
        var url2 = `${BASE_URL}/updateRating`;
        let like_body = {
            networkType: networkType,
            owner: accountKey,
            tokenId: item.tokenId
        }
        let rating_body = {
            networkType: networkType,
            tokenId: item.tokenId
        }
        if (item.like == 0) {
            url1 = `${BASE_URL}/likeNFT`;
            rating_body.rating = item.rating + 1;
            item.like = 1;
            item.rating = item.rating + 1;
        } else {
            url1 = `${BASE_URL}/unlikeNFT`
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
        ]).then(([v, a]) => {
            console.log(v, a)
            const nftUpdated = [
                ...oldNFTS.slice(0, index),
                item,
                ...oldNFTS.slice(index + 1),
            ];

            screenName == "Hot" ? dispatch(nftLoadUpdate(nftUpdated)) :
                screenName == "newNFT" ? dispatch(newNftLoadUpdate(nftUpdated)) :
                    screenName == "favourite" ? dispatch(favoriteNFTUpdate(nftUpdated)) :
                        screenName == "twoDArt" ? dispatch(twoDNFTUpdate(nftUpdated)) :
                            dispatch(myNFTupdate(nftUpdated));

        })

    }
}

export const nftLoadUpdate = (data) => ({
    type: NFT_LIST_UPDATE,
    payload: data
});

export const myNFTupdate = (data) => ({
    type: MYLIST_LIST_UPDATE,
    payload: data
});

export const newNftLoadUpdate = (data) => ({
    type: NEW_NFT_LIST_UPDATE,
    payload: data
});

export const favoriteNFTUpdate = (data) => ({
    type: FAVORITE_LIST_UPDATE,
    payload: data
});

export const twoDNFTUpdate = (data) => ({
    type: TWOD_LIST_UPDATE,
    payload: data
});