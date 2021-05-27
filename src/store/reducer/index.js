import { combineReducers } from 'redux';

import AuthReducer from './authReducer';
import ListReducer from './listReducer';
import NewNFTListReducer from './newListReducer';
import MyNFTReducer from './myNFTReducer';

const RootReducer = combineReducers({
    AuthReducer,
    ListReducer,
    NewNFTListReducer,
    MyNFTReducer
});

export default RootReducer;