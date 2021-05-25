import { ACCOUNT_KEY_FAIL, ACCOUNT_KEY_SUCCESS, RESET_ACCOUNT } from '../types';

const initialState = {
    accountKey: "",
    accountLoading: true
}

export default function AuthReducer(state = initialState, action) {
    switch (action.type) {

        case ACCOUNT_KEY_SUCCESS:
            return state = { ...state, accountKey: action.payload, accountLoading: false };

        case ACCOUNT_KEY_FAIL:
            return state = { ...state, accountLoading: false };

        case RESET_ACCOUNT:
            return state = { ...state, accountKey: "" };

        default:
            return state;
    }
}