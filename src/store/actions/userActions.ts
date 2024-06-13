// userActions.ts

import { Action } from 'redux';
import { CustomAction } from './../types/types';

export const setUser = (user: any): CustomAction<any> => ({
  type: 'SET_USER',
  payload: user,
});

export const logout = (): Action => ({
  type: 'LOGOUT',
});
