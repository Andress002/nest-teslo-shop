import { User } from "src/auth/entities/auth.entity";

export type UserAuthResponse = Pick<User, 'id' | 'email' | 'fullName' | 'rol'>
