import { combineReducers } from 'redux';

import AuthReducer from './authReducer';
import ListReducer from './listReducer';
import NewNFTListReducer from './newListReducer';
import MyNFTReducer from './myNFTReducer';
import TwoDReducer from './twodReducer';
import MyCollectionReducer from './myCollectionReducer';
import UserReducer from './userReducer';
import WalletReducer from './walletReducer';
import LanguageReducer from './languageReducer';

const RootReducer = combineReducers({
    AuthReducer,
    ListReducer,
    NewNFTListReducer,
    MyNFTReducer,
    TwoDReducer,
    MyCollectionReducer,
    UserReducer,
    WalletReducer,
    LanguageReducer
});

export default RootReducer;