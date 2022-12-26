import {ERROR_ALERT} from '../types';

const initialState = {
  alertData: {},
};

export default function AlertReducer(state = initialState, action) {
  switch (action.type) {
    case ERROR_ALERT:
      return (state = {...state, alertData: action.payload});
    default:
      return state;
  }
}
