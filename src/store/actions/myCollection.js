import { BASE_URL } from '../../common/constants';
import { networkType } from '../../common/networkType';
import { alertWithSingleBtn } from '../../utils';
import { translate } from '../../walletUtils';

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

        const { data } = getState().UserReducer;
        let user = data.user;

        let body_data = {
            limit: 24,
            networkType: networkType,
            page: page,
            nftType: 'mycollection'
        }

        if (ownerId.length > 24) {
            body_data.owner = ownerId.toUpperCase();
        } else {
            body_data.userId = ownerId;
        }

        if (user) {
            body_data.loggedIn = user._id;
        }

        let fetch_data_body = {
            method: 'POST',
            body: JSON.stringify(body_data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }
        
        const url = ownerId.length > 24 ?
            `${BASE_URL}/xanalia/mydata` :
            `${BASE_URL}/user/get-user-collection`;

        fetch(url, fetch_data_body)
            .then(response => response.json())  // promise
            .then(json => {
                dispatch(myCollectionLoadSuccess(json));
            }).catch(err => {
                dispatch(myCollectionLoadFail())
                alertWithSingleBtn(
                    translate('common.error'),
                    translate("wallet.common.error.networkFailed")
                )
            })
    }
}

export const myCollectionLoadSuccess = (data) => ({
    type: MY_COLLECTION_LOAD_SUCCESS,
    payload: data
});