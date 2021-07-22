import { BASE_URL } from '../../common/constants';
import { networkType } from '../../common/networkType';

import {
    MY_COLLECTION_LOAD_FAIL,
    MY_COLLECTION_LOAD_START,
    MY_COLLECTION_PAGE_CHANGE,
    MY_COLLECTION_LOAD_RESET,
    MY_COLLECTION_LOAD_SUCCESS
} from '../types';

import { twoNftLoadSuccess } from './twoDAction';

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

export const myCollectionList = (page, screen, limit) => {
    return (dispatch, getState) => {

        let accountKey = getState().AuthReducer.accountKey;
        const { myList, favorite } = getState().MyCollectionReducer;

        let body_data = {
            limit: limit,
            networkType: networkType,
            owner: accountKey,
            page: page,
            ntfType: "mycollection"
        }

        let fetch_data_body = {
            method: 'POST',
            body: JSON.stringify(body_data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }
        fetch(`${BASE_URL}/mydata`, fetch_data_body)
            .then(response => response.json())  // promise
            .then(json => {
                console.log(accountKey);
                console.log(json.data)
                let new_list = [...json.data];
                // if (screen == "favorite") {

                //     var favoriteList = new_list.filter(e => e.like == 1);

                //     let nftCompleteList = [...favorite, ...favoriteList];
                //     let jsonObject_C = nftCompleteList.map(JSON.stringify);
                //     let uniqueSet_C = new Set(jsonObject_C);
                //     let uniqueArray_C = Array.from(uniqueSet_C).map(JSON.parse);

                // } else if (screen == "2D") {

                //     dispatch(twoNftLoadSuccess(new_list))

                // } else {
                    var results = new_list.filter(e => {
                        if (e.hasOwnProperty("returnValues")) {
                            return e.returnValues.to === accountKey
                        }
                    });
                    let array = [...myList, ...results];
                    let jsonObject = array.map(JSON.stringify);
                    let uniqueSet = new Set(jsonObject);
                    let uniqueArray = Array.from(uniqueSet).map(JSON.parse);
                    dispatch(myCollectionLoadSuccess(uniqueArray))

                // }

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