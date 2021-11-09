import {
    ADD_ETH_TRANSACTION,
    ADD_BNB_TRANSACTION,
    ADD_MATIC_TRANSACTION,
    ADD_ALL_ETH_TRANSACTIONS,
    ADD_ALL_BNB_TRANSACTIONS,
    ADD_ALL_MATIC_TRANSACTIONS,
    UPDATE_BALANCES
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
    talBalance: "0"
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