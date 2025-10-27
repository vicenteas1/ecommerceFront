export interface ILogin {
  email: string;
  password: string;
}

export interface LoginResult {
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
  accessToken: string;
}
