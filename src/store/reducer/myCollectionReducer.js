import {
    MY_COLLECTION_LOAD_FAIL,
    MY_COLLECTION_LOAD_START,
    MY_COLLECTION_LOAD_SUCCESS,
    MY_COLLECTION_PAGE_CHANGE,
    MY_COLLECTION_LOAD_RESET,
    MY_COLLECTION_LIST_UPDATE
} from '../types';

const initialState = {
    myCollectionListLoading: false,
    myCollection: [],
    favorite: [],
    myCollectionPage: 1,
    myCollectionTotalCount: 0
}

export default function MyCollectionReducer(state = initialState, action) {
    switch (action.type) {

        case MY_COLLECTION_PAGE_CHANGE:
            return state = { ...state, myCollectionPage: action.payload };

        case MY_COLLECTION_LOAD_START:
            return state = { ...state, myCollectionListLoading: true };

        case MY_COLLECTION_LOAD_SUCCESS:
            return state = { ...state, myCollection: [...state.myCollection, ...action.payload.data], myCollectionTotalCount: action.payload.count, myCollectionListLoading: false };

        case MY_COLLECTION_LIST_UPDATE:
            return state = { ...state, myCollection: [...action.payload] };

        case MY_COLLECTION_LOAD_FAIL:
            return state = { ...state, myCollectionListLoading: false };

        case MY_COLLECTION_LOAD_RESET:
            return state = { ...state, myCollection: [], favorite: [] };

        default:
            return state;
    }
}