import { validate } from './login-rest-service';
import { UserLoginInfo }  from '@/models/users';

export const login = async (userInfo: UserLoginInfo) => {
  const validatedUser = await validate(userInfo);
  return  validatedUser;
};

