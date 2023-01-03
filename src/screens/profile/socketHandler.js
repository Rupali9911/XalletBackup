import React from 'react';
import {useDispatch} from 'react-redux';
import SOCKET_EVENTS from '../../constants/socketContants';
import {useSocketGlobal} from '../../helpers/useSocketGlobal';
import {getUserData} from '../../store/reducer/userReducer';

export const SocketHandler = ({id, routeId}) => {
  const dispatch = useDispatch();
  useSocketGlobal(
    SOCKET_EVENTS.userUpdateAvatar,
    () => {
      dispatch(getUserData(id, routeId ? true : false));
    },
    false,
    true,
  );
  useSocketGlobal(
    SOCKET_EVENTS.userUpdateBanner,
    () => {
      dispatch(getUserData(id, routeId ? true : false));
    },
    false,
    true,
  );
  return null;
};
