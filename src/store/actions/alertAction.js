import {ERROR_ALERT} from '../types';

export const alertAction = data => ({
  type: ERROR_ALERT,
  payload: data,
});
