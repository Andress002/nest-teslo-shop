import { RegisterResponse } from "src/common/interfaces/register-response.interface";
import { LoginResponse } from "src/common/interfaces/login-response.interface";
import { UserLogin } from "src/types/UserLogin";
import { UserRegister } from "src/types/UserRegister";


export const buildRegisterResponse = (user: UserRegister, token: string): RegisterResponse => {
  return {
    fullName: user.fullName,
    email: user.email,
    rol: user.rol,
    token
  }
};

export const buildLoginResponse = (user: UserLogin, token: string): LoginResponse => {
  return {
    fullName: user.fullName,
    email: user.email,
    rol: user.rol,
    token
  }
}