import { UserSignUpInfo } from '@/models/users';
import Users from '@/models/users';

const baseURI = 'http://timetomaster-backend-dev.us-east-1.elasticbeanstalk.com';

export const emailExist = async (email: string): Promise<boolean> => {
  const url = `${baseURI}/users/${email}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    // Handle HTTP errors
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  // Check if the response data is null
  return data !== null;
};

export const restSignUp = async (userInfo: UserSignUpInfo): Promise<Users | null> => {
  const emailExists = await emailExist(userInfo.email);

  if (emailExists) {
    return null; // Email already exists
  }

  const url = `${baseURI}/users/createNewUser`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userInfo),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const user = await response.json();
  console.log('User created successfully');

  return user as Users;
};
