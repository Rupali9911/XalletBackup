import { SET_CAMERA_PERMISSION } from '../types';

export const setCameraPermission = (payload) => ({
    type: SET_CAMERA_PERMISSION,
    payload
});

const initialState = {
    camera: false
}

export default function PermissionReducer(state = initialState, action) {
    switch (action.type) {

        case SET_CAMERA_PERMISSION:
            return { ...state, camera: action.payload }

        default:
            return state;
    }
}
