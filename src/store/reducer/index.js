import { combineReducers } from 'redux';

import ListReducer from './listReducer';
import AuthReducer from './authReducer';

const RootReducer = combineReducers({
    ListReducer,
    AuthReducer
});

export default RootReducer;