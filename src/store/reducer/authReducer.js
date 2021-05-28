import { ACCOUNT_KEY_FAIL, ACCOUNT_KEY_SUCCESS, RESET_ACCOUNT, HANDLE_SCREEN_NAME } from '../types';

const initialState = {
    accountKey: "",
    accountLoading: true,
    screenName: "",
}

export default function AuthReducer(state = initialState, action) {
    switch (action.type) {

        case ACCOUNT_KEY_SUCCESS:
            return state = { ...state, accountKey: action.payload, accountLoading: false };

        case ACCOUNT_KEY_FAIL:
            return state = { ...state, accountLoading: false };

        case RESET_ACCOUNT:
            return state = { ...state, accountKey: "" };

        case HANDLE_SCREEN_NAME:
            return state = { ...state, screenName: action.payload };

        default:
            return state;
    }
}