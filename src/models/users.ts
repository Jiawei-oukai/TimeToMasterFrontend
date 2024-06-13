export default interface Users {
    _id : string;
    userName: string;
    email: string;
    password: string;
};


export interface UserLoginInfo {
    email: string;
    password: string;
};

export interface UserSignUpInfo {
    userName: string;
    email: string;
    password: string;
};