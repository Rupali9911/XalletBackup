import { GET_NETWORKS } from '../types';

const initialState = {
    networks: null
}

export default function NetworkReducer(state = initialState, action) {
    switch (action.type) {

        case GET_NETWORKS:
            return state = { ...state, networks: action.payload };

        default:
            return state;
    }
}

export const setNetworkData = (data) => ({
    type: GET_NETWORKS,
    payload: data,
});