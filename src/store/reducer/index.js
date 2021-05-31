import { combineReducers } from 'redux';

import AuthReducer from './authReducer';
import ListReducer from './listReducer';
import NewNFTListReducer from './newListReducer';
import MyNFTReducer from './myNFTReducer';
import TwoDReducer from './twodReducer';

const RootReducer = combineReducers({
    AuthReducer,
    ListReducer,
    NewNFTListReducer,
    MyNFTReducer,
    TwoDReducer
});

export default RootReducer;