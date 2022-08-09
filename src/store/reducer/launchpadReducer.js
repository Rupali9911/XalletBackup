import {
    LAUNCHPAD_NFT_LIST_FAIL,
    LAUNCHPAD_NFT_LIST_RESET,
    LAUNCHPAD_NFT_LIST_START,
    LAUNCHPAD_NFT_LIST_SUCCESS,
    LAUNCHPAD_NFT_LIST_PAGE_CHANGE
} from '../types'

const initialState = {
    launchpadLoading: false,
    launchpadList: [],
    launchpadPage: 1,
    launchpadTotalCount: 5
}

export default function LaunchpadReducer(state = initialState, action) {
    switch (action.type) {
        case LAUNCHPAD_NFT_LIST_START:
            return state = { ...state, launchpadLoading: true }

        case LAUNCHPAD_NFT_LIST_SUCCESS:
            return state = {
                ...state,
                launchpadList: [...action.payload.listCollectionAllUser],
                launchpadTotalCount: action.payload.count,
                launchpadLoading: false,
            };

        case LAUNCHPAD_NFT_LIST_RESET:
            return state = { ...state, launchpadList: [] };

        case LAUNCHPAD_NFT_LIST_FAIL:
            return state = { ...state, launchpadLoading: false }

        case LAUNCHPAD_NFT_LIST_PAGE_CHANGE:
            return state = { ...state, launchpadPage: action.payload };

        default:
            return state;
    }
}