import { User } from "src/auth/entities/auth.entity";

export type UserLogin = Pick<User, 'id' | 'email' | 'fullName' | 'rol'>
