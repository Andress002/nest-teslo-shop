import { User } from "src/auth/entities/auth.entity";

export type UserRegister = Pick<User, 'id' | 'email' | 'fullName' | 'rol'>