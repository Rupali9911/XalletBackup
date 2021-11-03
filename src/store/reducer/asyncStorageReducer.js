import { ADD_ASYNC_DATA } from '../types';

export const addAsyncAction = (payload) => ({
    type: ADD_ASYNC_DATA,
    payload: payload
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

        default:
            return state;
    }
}