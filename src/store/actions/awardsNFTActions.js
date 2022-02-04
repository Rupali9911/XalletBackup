import { BASE_URL } from '../../common/constants';
import { networkType } from '../../common/networkType';
import { translate } from '../../walletUtils';
import { alertWithSingleBtn } from '../../common/function';
import { parseNftObject } from '../../utils/parseNFTObj';
import {
    NEW_NFT_LOAD_START,
    NEW_NFT_LOAD_SUCCESS,
    NEW_NFT_LOAD_FAIL,
    NEW_PAGE_CHANGE,
    NEW_NFT_LIST_RESET
} from '../types';

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

export const newNFTList = (page) => {
    return (dispatch, getState) => {

        const { data, wallet } = getState().UserReducer;
        let user = data.user;

        let body_data = {
            approveStatus: "approve",
            limit: 24,
            networkType: networkType,
            page,
            token: "HubyJ*%qcqR0",
            type: "awards2021",
        }

        if (user) {
            body_data.owner = wallet.address;
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
                let nftData = [];
                if (!json.count) {
                    json.data = [];
                } else {
                    json.data.map(item => {
                        const parsedNFT = parseNftObject(item);
                        const data = {
                            ...parsedNFT,
                            ...item,
                        };
                        nftData.push(data);
                    });
                }
				json.data = nftData;
                dispatch(newNftLoadSuccess(nftData))

            }).catch(err => {
                dispatch(newNftLoadFail())
                // alertWithSingleBtn(
                //     translate("wallet.common.alert"),
                //     translate("wallet.common.error.networkFailed"),
                // );
            })
    }
}