import AsyncStorage from '@react-native-async-storage/async-storage';
import { reject } from 'lodash';
import { resolve } from 'path-browserify';
import {
    ADD_ETH_TRANSACTION,
    ADD_BNB_TRANSACTION,
    // ADD_TNFT_TRANSACTION,
    ADD_USDC_TRANSACTION,
    ADD_MATIC_TRANSACTION,
    ADD_XETA_TRANSACTION,
    ADD_ALL_ETH_TRANSACTIONS,
    ADD_ALL_BNB_TRANSACTIONS,
    ADD_ALL_MATIC_TRANSACTIONS,
    ADD_ALL_XETA_TRANSACTIONS,
    UPDATE_BALANCES,
    UPDATE_ETH_BALANCES,
    UPDATE_BSC_BALANCES,
    UPDATE_POLY_BALANCES,
    UPDATE_XANA_BALANCES,
    SET_CONNECTED_APPS,
    SET_SOCKET_OPEN,
    SET_REQUEST_APP_ID,
    UPDATE_NETWORK_TYPE
} from '../types';
import ImagesSrc from "../../constants/Images";
// import {BASE_URL} from "../../helpers/ApiRequest";
import { BASE_URL } from '../../common/constants';
import sendRequest from '../../helpers/AxiosApiRequest';

const initialState = {
    ethTransactions: [],
    ethBalance: "0",
    bnbTransactions: [],
    bnbBalance: "0",
    maticTransactions: [],
    maticBalance: "0",
    Transactions: [],
    tnftTransactions: [],
    tnftBalance: "0",
    talTransactions: [],
    talBalance: "0",
    aliaTransactions: [],
    aliaBalance: "0",
    busdTransactions: [],
    busdBalance: "0",
    usdtTransactions: [],
    usdtBalance: "0",
    usdcTransactions: [],
    usdcBalance: "0",
    wethTransactions: [],
    wethBalance: "0",
    xetaTransactions: [],
    xetaBalance: "0",
    connectedApps: [],
    socketOpen: false,
    requestAppId: null,
    networkType: {
        id: 4,
        name: "XANACHAIN",
        chainId: 76798,
        rpc: "https://testnet.xana.net/ext/bc/2dNW4t2bMKcnAamjCX7e79iFw1LEvyb8CYWXcX7NeUUQM9TdM8/rpc",
        image: "https://ik.imagekit.io/xanalia/Images/Logo.png",
        status: 1,
        networkTokens: []
    }
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
                ethTransactions: [...action.payload],
                usdtTransactions: [...action.payload]
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
        case ADD_USDC_TRANSACTION:
            let isUsdcExist = state.usdcTransactions.findIndex((_item) => _item.hash == action.payload.hash);
            if (isUsdcExist == -1) {
                return {
                    ...state,
                    usdcTransactions: [...state.usdcTransactions, action.payload]
                };
            } else {
                return {
                    ...state
                }
            }

        case ADD_ALL_BNB_TRANSACTIONS:
            return {
                ...state,
                bnbTransactions: [...action.payload],
                tnftTransactions: [...action.payload],
                busdTransactions: [...action.payload],
                aliaTransactions: [...action.payload]

            };

        case ADD_MATIC_TRANSACTION:
            let isMaticExist = state.maticTransactions.findIndex((_item) => _item.hash == action.payload.hash);
            if (isMaticExist == -1) {
                return {
                    ...state,
                    maticTransactions: [...state.maticTransactions, action.payload],

                };
            } else {
                return {
                    ...state
                }
            }

        case ADD_ALL_MATIC_TRANSACTIONS:
            return {
                ...state,
                maticTransactions: [...action.payload],
                talTransactions: [...action.payload],
                usdcTransactions: [...action.payload],
                wethTransactions: [...action.payload],
                aliaTransactions: [...action.payload],
            };

        case ADD_XETA_TRANSACTION:
            let isXetaExist = state.xetaTransactions.findIndex((_item) => _item.hash == action.payload.hash);
            if (isXetaExist == -1) {
                return {
                    ...state,
                    xetaTransactions: [...state.xetaTransactions, action.payload],

                };
            } else {
                return {
                    ...state
                }
            }

        case ADD_ALL_XETA_TRANSACTIONS:
            return {
                ...state,
                xetaTransactions: [...action.payload],
            };


        case UPDATE_BALANCES:
            return {
                ...state,
                ethBalance: action.payload.ETH,
                bnbBalance: action.payload.BNB,
                maticBalance: action.payload.Matic,
                tnftBalance: action.payload.TNFT, // for testnet only
                talBalance: action.payload.TAL, // for testnet only
                usdtBalance: action.payload.USDT,
                busdBalance: action.payload.BUSD,
                wethBalance: action.payload.WETH,
                aliaBalance: action.payload.ALIA,
                xetaBalance: action.payload.XETA
            }

        case UPDATE_ETH_BALANCES:
            return {
                ...state,
                ethBalance: action.payload.ETH,
                usdtBalance: action.payload.USDT,
            }

        case UPDATE_BSC_BALANCES:
            return {
                ...state,
                bnbBalance: action.payload.BNB,
                tnftBalance: action.payload.TNFT, // for testnet only
                busdBalance: action.payload.BUSD
            }

        case UPDATE_POLY_BALANCES:
            return {
                ...state,
                maticBalance: action.payload.Matic,
                talBalance: action.payload.TAL, // for testnet only,
                usdcBalance: action.payload.USDC,
                wethBalance: action.payload.WETH,
                //aliaBalance: action.payload.ALIA,
            }

        case UPDATE_XANA_BALANCES:
            return {
                ...state,
                xetaBalance: action.payload.Xeta,
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

        case UPDATE_NETWORK_TYPE:
            return {
                ...state,
                networkType: action.payload
            }

        default:
            return state;
    }
}

export const updateNetworkType = (data) => ({
    type: UPDATE_NETWORK_TYPE,
    payload: data
});

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
export const addTnftTransaction = (data) => ({
    type: ADD_TNFT_TRANSACTION,
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

export const addXetaTransaction = (data) => ({
    type: ADD_XETA_TRANSACTION,
    payload: data
});

export const addAllMaticTransactions = (data) => ({
    type: ADD_ALL_MATIC_TRANSACTIONS,
    payload: data
});

export const addAllXetaTransactions = (data) => ({
    type: ADD_ALL_XETA_TRANSACTIONS,
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

export const updateXanaBalances = (data) => ({
    type: UPDATE_XANA_BALANCES,
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


export const getTransactions = (address, type, coin) => (dispatch) =>
    new Promise((resolve, reject) => {
        const data = {
            addr: address,
            type: type,
            coin: coin
        }
        let fetch_request_param = {
            method: 'GET',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }
        fetch(`${BASE_URL}xanawallet/fetch-transactions`, fetch_request_param).then((response) => {
            return ""
        })
            .then((res) => {
                resolve();
            }).catch((err) => {
                reject();
            })
    });

export const setConnectedAppsToLocal = (data) => (dispatch) =>
    new Promise(async (resolve, reject) => {
        await AsyncStorage.setItem('@apps', JSON.stringify(data), (err) => { });
        dispatch(setConnectedApps(data));
        resolve();
    });

export const convertCurrency = (amount, symbol, convert) => {
    return new Promise((resolve, reject) => {
        let CMC_PRO_API_KEY = '67c4c255-a649-49df-9e23-5d58ec5f5d24'
        let url = `https://pro-api.coinmarketcap.com/v2/tools/price-conversion`;
        sendRequest({
            url,
            method: 'GET',
            params: {
                amount,
                symbol,
                convert,
                CMC_PRO_API_KEY,
            },
        })
            .then(res => {
                console.log('Response of conversion api', res)
                resolve(res?.data[0]?.quote[convert]?.price)
            })
            .catch(err => {
                console.log('Error from conversion api', err)
                reject();
                //setPrice('0.00')
            });
    });
}
