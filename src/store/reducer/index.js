import { combineReducers } from 'redux';

import AuthReducer from './authReducer';
import ListReducer from './listReducer';
import NewNFTListReducer from './newListReducer';
import MyNFTReducer from './myNFTReducer';
import TwoDReducer from './twodReducer';
import AwardsNFTReducer from './awardsReducer';
import MyCollectionReducer from './myCollectionReducer';
import UserReducer from './userReducer';
import WalletReducer from './walletReducer';
import LanguageReducer from './languageReducer';
import PaymentReducer from './paymentReducer';
import AsyncReducer from './asyncStorageReducer';

const RootReducer = combineReducers({
    AuthReducer,
    ListReducer,
    NewNFTListReducer,
    MyNFTReducer,
    TwoDReducer,
    AwardsNFTReducer,
    MyCollectionReducer,
    UserReducer,
    WalletReducer,
    LanguageReducer,
    PaymentReducer,
    AsyncReducer
});

const _rootReducer = (state, action) => {
    if(action.type === 'USER_LOGGED_OUT'){
        state = undefined;
    }
    return RootReducer(state, action);
}

export default _rootReducer;