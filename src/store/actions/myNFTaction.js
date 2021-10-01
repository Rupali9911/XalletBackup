import { BASE_URL } from '../../common/constants';
import { networkType } from '../../common/networkType';

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

export const myNFTList = (page, ownerId) => {
    return (dispatch, getState) => {
        let body_data = {
            limit: 15,
            networkType: networkType,
            userId: ownerId,
            page: page,
            nftType: 'mynft'
        }

        let fetch_data_body = {
            method: 'POST',
            body: JSON.stringify(body_data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }
        fetch(`https://api.xanalia.com/user/get-user-collection`, fetch_data_body)
            .then(response => response.json())  // promise
            .then(json => {
                let new_list = [...json.data];
                if (new_list.length === 0) {
                    let data = {
                        limit: 15,
                        networkType: networkType,
                        owner: ownerId,
                        page: page,
                        nftType: 'mynft'
                    }

                    let data_body = {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        }
                    }
                    fetch(`https://api.xanalia.com/xanalia/mydata`, data_body)
                        .then(response => response.json())  // promise
                        .then(json => {
                            let list = [...json.data];
                            dispatch(myNftLoadSuccess(list));
                        }).catch(err => {
                            dispatch(myNftLoadFail())
                            alert(err.message)
                        })
                } else {
                    dispatch(myNftLoadSuccess(new_list));
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