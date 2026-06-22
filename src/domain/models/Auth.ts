export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResult {
  token: string;
  expiresIn: string;
}

export interface TokenPayload {
  sub: string;
}
