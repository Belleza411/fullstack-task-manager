export interface Auth {
	username: string;
	password: string;
	confirmPassword: string;
}

export type Login = Pick<Auth, 'username' | 'password'>;

export interface AuthResponse {
    accessToken: string;
	refreshToken: string;
}