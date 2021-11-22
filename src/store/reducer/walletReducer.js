import AsyncStorage from '@react-native-async-storage/async-storage';
import { reject } from 'lodash';
import { resolve } from 'path-browserify';
import {
    ADD_ETH_TRANSACTION,
    ADD_BNB_TRANSACTION,
    ADD_MATIC_TRANSACTION,
    ADD_ALL_ETH_TRANSACTIONS,
    ADD_ALL_BNB_TRANSACTIONS,
    ADD_ALL_MATIC_TRANSACTIONS,
    UPDATE_BALANCES,
    UPDATE_ETH_BALANCES,
    UPDATE_BSC_BALANCES,
    UPDATE_POLY_BALANCES,
    SET_CONNECTED_APPS,
    SET_SOCKET_OPEN,
    SET_REQUEST_APP_ID
} from '../types';

const initialState = {
    ethTransactions: [],
    ethBalance: "0",
    bnbTransactions: [],
    bnbBalance: "0",
    maticTransactions: [],
    maticBalance: "0",
    tnftTransactions: [],
    tnftBalance: "0",
    talTransactions: [],
    talBalance: "0",
    connectedApps: [],
    socketOpen: false,
    requestAppId: null
}

export default walletReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_ETH_TRANSACTION:
            let isEthExist = state.ethTransactions.findIndex((_item) => _item.hash == action.payload.hash);
            if (isEthExist == -1) {
                return {
                    ...state,
                    ethTransactions: [...state.ethTransactions, action.payload]
                };
            } else {
                return {
                    ...state
                }
            }

        case ADD_ALL_ETH_TRANSACTIONS:
            return {
                ...state,
                ethTransactions: [...action.payload]
            };

        case ADD_BNB_TRANSACTION:
            let isBnbExist = state.bnbTransactions.findIndex((_item) => _item.hash == action.payload.hash);
            if (isBnbExist == -1) {
                return {
                    ...state,
                    bnbTransactions: [...state.bnbTransactions, action.payload]
                };
            } else {
                return {
                    ...state
                }
            }

        case ADD_ALL_BNB_TRANSACTIONS:
            return {
                ...state,
                bnbTransactions: [...action.payload]
            };

        case ADD_MATIC_TRANSACTION:
            let isMaticExist = state.maticTransactions.findIndex((_item) => _item.hash == action.payload.hash);
            if (isMaticExist == -1) {
                return {
                    ...state,
                    maticTransactions: [...state.maticTransactions, action.payload]
                };
            } else {
                return {
                    ...state
                }
            }

        case ADD_ALL_MATIC_TRANSACTIONS:
            return {
                ...state,
                maticTransactions: [...action.payload]
            };

        case UPDATE_BALANCES:
            return {
                ...state,
                ethBalance: action.payload.ETH,
                bnbBalance: action.payload.BNB,
                maticBalance: action.payload.Matic,
                tnftBalance: action.payload.TNFT, // for testnet only
                talBalance: action.payload.TAL, // for testnet only
            }

        case UPDATE_ETH_BALANCES:
            return {
                ...state,
                ethBalance: action.payload.ETH,
            }

        case UPDATE_BSC_BALANCES:
            return {
                ...state,
                bnbBalance: action.payload.BNB,
                tnftBalance: action.payload.TNFT, // for testnet only
            }

        case UPDATE_POLY_BALANCES:
            return {
                ...state,
                maticBalance: action.payload.Matic,
                talBalance: action.payload.TAL, // for testnet only
            }

        case SET_CONNECTED_APPS:
            return {
                ...state,
                connectedApps: action.payload
            }

        case SET_SOCKET_OPEN:
            return {
                ...state,
                socketOpen: action.payload
            }

        case SET_REQUEST_APP_ID:
            return {
                ...state,
                requestAppId: action.payload
            }

        default:
            return state;
    }
}

export const addEthTransaction = (data) => ({
    type: ADD_ETH_TRANSACTION,
    payload: data
});

export const addAllEthTransactions = (data) => ({
    type: ADD_ALL_ETH_TRANSACTIONS,
    payload: data
});

export const addBnbTransaction = (data) => ({
    type: ADD_BNB_TRANSACTION,
    payload: data
});

export const addAllBnbTransactions = (data) => ({
    type: ADD_ALL_BNB_TRANSACTIONS,
    payload: data
});

export const addMaticTransaction = (data) => ({
    type: ADD_MATIC_TRANSACTION,
    payload: data
});

export const addAllMaticTransactions = (data) => ({
    type: ADD_ALL_MATIC_TRANSACTIONS,
    payload: data
});

export const updateBalances = (data) => ({
    type: UPDATE_BALANCES,
    payload: data
});

export const updateEthereumBalances = (data) => ({
    type: UPDATE_ETH_BALANCES,
    payload: data
});

export const updateBSCBalances = (data) => ({
    type: UPDATE_BSC_BALANCES,
    payload: data
});

export const updatePolygonBalances = (data) => ({
    type: UPDATE_POLY_BALANCES,
    payload: data
});

export const setConnectedApps = (data) => ({
    type: SET_CONNECTED_APPS,
    payload: data
});

export const setSocketOpenStatus = (data) => ({
    type: SET_SOCKET_OPEN,
    payload: data
});

export const setRequestAppId = (data) => ({
    type: SET_REQUEST_APP_ID,
    payload: data
});


export const getTransactions = (address, type) => (dispatch) =>
    new Promise((resolve, reject) => {
        const data = {
            addr: address,
            type: type
        }
        let fetch_request_param = {
            method: 'GET',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }
        fetch(`https://testapi.xanalia.com/xanawallet/fetch-transactions`, fetch_request_param).then((response) => {
            return ""
        })
            .then((res) => {
                resolve();
            }).catch((err) => {
                reject();
            })
    });

export const setConnectedAppsToLocal = (data) => (dispatch) =>
    new Promise(async(resolve, reject) => {
        await AsyncStorage.setItem('@apps',JSON.stringify(data),(err)=>console.log(err));
        dispatch(setConnectedApps(data));
        resolve();
    });
