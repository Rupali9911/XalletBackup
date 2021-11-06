import { ADD_ASYNC_DATA, UPDATE_ASYNC_PASSCODE } from '../types';

export const addAsyncAction = (payload) => ({
    type: ADD_ASYNC_DATA,
    payload
});

export const updateAsyncPasscodeAction = (payload) => ({
    type: UPDATE_ASYNC_PASSCODE,
    payload
});

const initialState = {
    passcode: "",
    wallet: null,
    BackedUp: false,
    userData: {}
}

export default function AsyncReducer(state = initialState, action) {
    switch (action.type) {

        case ADD_ASYNC_DATA:
            return { ...state, ...action.payload }

        case UPDATE_ASYNC_PASSCODE:
            return { ...state, passcode: action.payload }

        default:
            return state;
    }
}