import { UserLoginInfo }  from '@/models/users';

const baseURI = process.env.BE_BASE_URI;

export const validate = async (userInfo: UserLoginInfo) => {
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
  
    return user;
}
