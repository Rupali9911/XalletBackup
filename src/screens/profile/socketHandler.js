import React from 'react';
import {useDispatch} from 'react-redux';
import SOCKET_EVENTS from '../../constants/socketContants';
import {useSocketGlobal} from '../../helpers/useSocketGlobal';
import {getUserData} from '../../store/reducer/userReducer';

export const SocketHandler = ({id}) => {
  const dispatch = useDispatch();
  useSocketGlobal(
    SOCKET_EVENTS.userUpdateAvatar,
    () => {
      dispatch(getUserData(id, true));
    },
    false,
    true,
  );
  useSocketGlobal(
    SOCKET_EVENTS.userUpdateBanner,
    () => {
      dispatch(getUserData(id, true));
    },
    false,
    true,
  );
  return null;
};
