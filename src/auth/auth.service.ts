import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, LoginUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/auth.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt.payload.interface';
import { ConfigService } from '@nestjs/config';
import { LoginResponse } from './interfaces/login-response.interface';
import { RegisterResponse } from './interfaces/register-response.interface';
import { ApiResponse } from './interfaces/api-response.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async registerUser(createUserDto: CreateUserDto): Promise<ApiResponse<RegisterResponse>> {
    try {
      const { password, ...data } = createUserDto;

      const saltRounds = Number(
        this.configService.getOrThrow<string>('BCRYPT_SALT_ROUNDS'),
      );

      const hashPassword = await bcrypt.hash(password, saltRounds);

      const user = this.userRepository.create({
        ...data,
        password: hashPassword,
      });

      await this.userRepository.save(user);

      return {
        message: 'Usuario registrado con exito',
        data: {
          email: user.email,
          fullName: user.fullName,
          rol: user.roles,
          token: this.getJwtToken({ id: user.id }),
        }
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<ApiResponse<LoginResponse>> {
    const { password, email } = loginUserDto;

    try {
      const user = await this.userRepository.findOne({
        where: { email },
        select: { email: true, password: true, id: true },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new BadRequestException('Password is incorrect');
      }

      return {
        message: 'Login exitoso',
        data: {
          email: user.email,
          token: this.getJwtToken({ id: user.id }),
        }
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error(error);
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  handleError(error: any): never {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error.code === '23505') {
      throw new BadRequestException('Email already exists');
    }
    console.log(error);
    throw new InternalServerErrorException('An unexpected error occurred');
  }
}


/* 
Genérico	           Qué representa

T	                   El objeto completo

K	                   Las propiedades que quieres quitar

*/