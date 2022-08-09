import {
    LAUNCHPAD_NFT_LIST_FAIL,
    LAUNCHPAD_NFT_LIST_RESET,
    LAUNCHPAD_NFT_LIST_START,
    LAUNCHPAD_NFT_LIST_SUCCESS,
    LAUNCHPAD_NFT_LIST_PAGE_CHANGE
} from '../types'


export const launchpadNftLoadStart = () => ({
    type: LAUNCHPAD_NFT_LIST_START
});

export const launchpadNftLoadFail = () => ({
    type: LAUNCHPAD_NFT_LIST_FAIL
});

export const launchpadNftListReset = () => ({
    type: LAUNCHPAD_NFT_LIST_RESET
});

export const launchpadNftPageChange = (data) => ({
    type: LAUNCHPAD_NFT_LIST_PAGE_CHANGE,
    payload: data
});

export const launchpadNftLoadSuccess = (data) => ({
    type: LAUNCHPAD_NFT_LIST_SUCCESS,
    payload: data
});


export const getLaunchpadNftList = (page, limit) => {
    return (dispatch) => {
        dispatch(launchpadNftLoadStart())
        const url = `https://prod-backend.xanalia.com/launchpad?page=${page}&limit=${limit}`
        console.log("🚀 ~ file: launchpadAction.js ~ line 38 ~ ~ url", url)

        fetch(url)
            .then(response => response.json())
            .then(data => {
                dispatch(launchpadNftLoadSuccess(data))
            })
            .catch(() => {
                dispatch(launchpadNftLoadFail())
            })
    }
}