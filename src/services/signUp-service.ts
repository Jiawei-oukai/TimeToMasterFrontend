import { restSignUp } from './signUp-rest-service';
import { UserSignUpInfo }  from '@/models/users';

export const signUp = async (userInfo: UserSignUpInfo) => {
  const signUpedUser = await restSignUp(userInfo);
  return  signUpedUser;
};

