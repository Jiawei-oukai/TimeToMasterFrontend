// userReducer.ts
import { Reducer } from 'redux';

interface UserState {
  user: any; 
  isLoggedIn: boolean;
}

const initialState: UserState = {
  user: null,
  isLoggedIn: false,
};

const userReducer: Reducer<UserState> = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isLoggedIn: true,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isLoggedIn: false,
      };
    default:
      return state;
  }
};

export default userReducer;
