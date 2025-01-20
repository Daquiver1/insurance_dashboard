export interface User {
  id: number;
  username: string;
  password: string;
  name: string;
}

export interface SignupFormInputs {
  username: string;
  password: string;
  confirmPassword: string;
  name: string;
}
