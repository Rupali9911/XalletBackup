import { CHAT_LOAD_START, CHAT_SUCCESS, CHAT_LOAD_FAIL } from '../types';

export const chatLoadStart = () => ({
  type: CHAT_LOAD_START,
});

export const chatLoadSuccess = (data) => ({
  type: CHAT_SUCCESS,
  payload: data,
});

export const chatLoadFail = (error) => ({
  type: CHAT_LOAD_FAIL,
  payload: error,
});



