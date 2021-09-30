import {
    ADD_ETH_TRANSACTION,
    ADD_BNB_TRANSACTION,
    ADD_MATIC_TRANSACTION,
    UPDATE_BALANCES
} from '../types';

const initialState = {
    ethTransactions: [],
    ethBalance: "0",
    bnbTransactions: [],
    bnbBalance: "0",
    maticTransactions: [],
    maticBalance: "0"
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

        case ADD_MATIC_TRANSACTION:
            let isMaticExist = state.maticTransactions.findIndex((_item) => _item.hash == action.payload.hash);
            console.log(action.payload);
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

        case UPDATE_BALANCES:
            return {
                ...state,
                ethBalance: action.payload.ETH,
                bnbBalance: action.payload.BNB,
                maticBalance: action.payload.Matic
            }
        default:
            return state;
    }
}

export const addEthTransaction = (data) => ({
    type: ADD_ETH_TRANSACTION,
    payload: data
});

export const addBnbTransaction = (data) => ({
    type: ADD_BNB_TRANSACTION,
    payload: data
});

export const addMaticTransaction = (data) => ({
    type: ADD_MATIC_TRANSACTION,
    payload: data
});

export const updateBalances = (data) => ({
    type: UPDATE_BALANCES,
    payload: data
});

export const getTransactions = (address, type) => (dispatch) =>
    new Promise((resolve, reject) => {
        fetch(`https://testapi.xanalia.com/xanawallet/fetch-transactions?addr=${address}&type=${type}`).then((response) => {
            console.log('response',response);
            return ""
        })
        .then((res) => {
            console.log('res');
            resolve();
        }).catch((err) => {
            console.log('err',err);
            reject();
        })
    });