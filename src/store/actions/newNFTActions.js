import { BASE_URL } from '../../common/constants';
import { networkType } from '../../common/networkType';

import {
    NEW_NFT_LOAD_START,
    NEW_NFT_LOAD_SUCCESS,
    NEW_NFT_LOAD_FAIL,
    NEW_PAGE_CHANGE,
    NEW_NFT_LIST_RESET
} from '../types';
import { alertWithSingleBtn } from '../../utils';
import { translate } from '../../walletUtils';
import { ApiRequest } from '../../helpers/ApiRequest';

export const newNftLoadSuccess = (data) => ({
    type: NEW_NFT_LOAD_SUCCESS,
    payload: data
});

export const newNftLoadStart = () => ({
    type: NEW_NFT_LOAD_START
});

export const newNftLoadFail = () => ({
    type: NEW_NFT_LOAD_FAIL
});

export const newNftListReset = () => ({
    type: NEW_NFT_LIST_RESET
});

export const newPageChange = (data) => ({
    type: NEW_PAGE_CHANGE,
    payload: data
});

export const newNFTList = (page, limit) => {
    return (dispatch, getState) => {

        dispatch(newNftLoadStart());

        const { data, wallet } = getState().UserReducer;
        let user = data.user;

        let body_data = {
            page,
            limit: limit || 24,
            sort: "sell",
            networkType: networkType,
            token: "HubyJ*%qcqR0",
            type: "2D",
            approveStaus: "approve"
        }

        if (user) {
            body_data.owner = wallet.address || user._id;
        }

        let fetch_data_body = {
            method: 'POST',
            body: JSON.stringify(body_data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }

        fetch(`${BASE_URL}/xanalia/getDemuxData`, fetch_data_body)
            .then(response => response.json())
            .then(json => {

                dispatch(newNftLoadSuccess(json))

            }).catch(err => {
                dispatch(newNftLoadFail())
                alertWithSingleBtn(
                    translate('common.error'),
                    translate("wallet.common.error.networkFailed")
                )
            })
    }
}

export const searchNFT = (searchTxt) => (dispatch) => 
    new Promise((resolve, reject) => {
        let data = {
            page: 1,
            limit: 5,
            searchValue: searchTxt,
            networkType: "testnet"
        }

        ApiRequest(`${BASE_URL}/xanalia/search-nft-type/`,'POST',data,null).then((response) => {
            resolve(response);
        }).catch((err) => {
            reject(err);
        });

    });