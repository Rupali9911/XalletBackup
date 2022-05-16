import { READ_EXTERNAL_STORAGE } from '../types';

export const setStoragePermission = (payload) => ({
    type: READ_EXTERNAL_STORAGE,
    payload
});

const initialState = {
    storage: false
}

export default function PermissionsReducer(state = initialState, action) {
    switch (action.type) {

        case READ_EXTERNAL_STORAGE:
            return { ...state, storage: action.payload }

        default:
            return state;
    }
}
