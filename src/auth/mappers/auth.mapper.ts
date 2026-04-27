import { AuthResponse } from "src/common/interfaces/AuthResponse.interface"
import { UserAuthResponse } from "src/types/AuthResponse"


export const buildAuthResponse = (user: UserAuthResponse, token: string): AuthResponse => {
  return {
    fullName: user.fullName,
    email: user.email,
    rol: user.rol,
    token
  }
}