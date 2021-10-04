import { BASE_URL } from '../../common/constants';
import { networkType } from '../../common/networkType';

import {
    MY_COLLECTION_LOAD_FAIL,
    MY_COLLECTION_LOAD_START,
    MY_COLLECTION_PAGE_CHANGE,
    MY_COLLECTION_LOAD_RESET,
    MY_COLLECTION_LOAD_SUCCESS
} from '../types';

export const myCollectionLoadStart = () => ({
    type: MY_COLLECTION_LOAD_START
});

export const myCollectionLoadFail = () => ({
    type: MY_COLLECTION_LOAD_FAIL
});

export const myCollectionListReset = () => ({
    type: MY_COLLECTION_LOAD_RESET
});

export const myCollectionPageChange = (data) => ({
    type: MY_COLLECTION_PAGE_CHANGE,
    payload: data
});

export const myCollectionList = (page, ownerId) => {
    return (dispatch, getState) => {
        
        dispatch(myCollectionLoadStart());
        let body_data = {
            limit: 15,
            networkType: networkType,
            userId: ownerId,
            page: page,
            nftType: 'mycollection'
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
                dispatch(myCollectionLoadSuccess(new_list));
            }).catch(err => {
                dispatch(myCollectionLoadFail())
                alert(err.message)
            })
    }
}

export const myCollectionLoadSuccess = (data) => ({
    type: MY_COLLECTION_LOAD_SUCCESS,
    payload: data
});