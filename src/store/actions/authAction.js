import {
    ACCOUNT_KEY_FAIL,
    ACCOUNT_KEY_SUCCESS,
    RESET_ACCOUNT,
    HANDLE_SCREEN_NAME
} from '../types';

export const loadAccountKeyFail = () => ({
    type: ACCOUNT_KEY_FAIL
});

export const resetAccount = () => ({
    type: RESET_ACCOUNT
});

export const loadAccountKeySuccess = (data) => ({
    type: ACCOUNT_KEY_SUCCESS,
    payload: data
});

export const changeScreenName = (data) => ({
    type: HANDLE_SCREEN_NAME,
    payload: data
});