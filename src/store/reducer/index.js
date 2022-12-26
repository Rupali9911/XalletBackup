import {combineReducers} from 'redux';
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
import PermissionReducer from './cameraPermission';
import PermissionsReducer from './storagepermission';
import HotCollectionReducer from './hotCollectionReducer';
import NftDataCollectionReducer from './nftDataCollectionReducer';
import CollectionReducer from './collectionReducer';
import LaunchpadReducer from './launchpadReducer';
import NetworkReducer from './networkReducer';
import chatReducer from './chatReducer';
import detailsNFTReducer from './detailsNFTReducer';
import AlertReducer from './alertReducer';
import {reducer as formReducer} from 'redux-form';

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
  AsyncReducer,
  PermissionReducer,
  PermissionsReducer,
  HotCollectionReducer,
  NftDataCollectionReducer,
  CollectionReducer,
  LaunchpadReducer,
  NetworkReducer,
  chatReducer,
  detailsNFTReducer,
  AlertReducer,
  form: formReducer,
});

const _rootReducer = (state, action) => {
  if (action.type === 'USER_LOGGED_OUT') {
    state = undefined;
  }
  return RootReducer(state, action);
};

export default _rootReducer;
