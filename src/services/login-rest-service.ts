import { UserLoginInfo }  from '@/models/users';

const baseURI = 'http://timetomaster-backend-dev.us-east-1.elasticbeanstalk.com';

export const validate = async (userInfo: UserLoginInfo) => {
    // console.log("validate users:", userInfo)
    const url = '/users/validate';
    const response = await fetch(baseURI + url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo),
    });
  
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const user =  await response.json();
    // localStorage.setItem('token', token);
    // console.log('Login successful', user);
  
    return user;
}
