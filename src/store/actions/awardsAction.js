import { BASE_URL } from '../../common/constants';
import { networkType } from '../../common/networkType';
import { alertWithSingleBtn } from '../../utils';
import { translate } from '../../walletUtils';

import {
    AWARDS_NFT_FAIL,
    AWARDS_NFT_LIST_RESET,
    AWARDS_NFT_START,
    AWARDS_NFT_SUCCESS,
    AWARDS_PAGE_CHANGE,
} from '../types';

export const awardsNftLoadStart = () => ({
    type: AWARDS_NFT_START
});

export const awardsNftLoadFail = () => ({
    type: AWARDS_NFT_FAIL
});

export const awardsNftListReset = () => ({
    type: AWARDS_NFT_LIST_RESET
});

export const awardsNftPageChange = (data) => ({
    type: AWARDS_PAGE_CHANGE,
    payload: data
});

export const awardsNftLoadSuccess = (data) => ({
    type: AWARDS_NFT_SUCCESS,
    payload: data
});


export const getAwardsNftList = (page, limit) => {
    return (dispatch, getState) => {

        dispatch(awardsNftLoadStart());

        const { data } = getState().UserReducer;
        let user = data.user;
        let body_data = {
            approveStatus: "approve",
            page,
            limit: limit || 24,
            networkType: networkType,
            token: "HubyJ*%qcqR0",
            type: "awards2021",
        }

        if (user) {
            body_data.owner = user._id;
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

                dispatch(awardsNftLoadSuccess(json));

            }).catch(err => {

                dispatch(awardsNftLoadFail())
                alertWithSingleBtn(
                    translate("wallet.common.alert"),
                    translate("wallet.common.error.networkFailed"),
                );
            })
    }
}