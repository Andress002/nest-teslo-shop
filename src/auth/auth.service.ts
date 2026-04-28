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
import { JwtPayload } from '../common/interfaces/jwt.payload.interface';
import { ConfigService } from '@nestjs/config';
import { AuthResponse } from '../common/interfaces/AuthResponse.interface';
import { ApiResponse } from '../common/interfaces/api-response.interface';
import { buildAuthResponse } from './mappers/auth.mapper';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async registerUser(createUserDto: CreateUserDto): Promise<ApiResponse<AuthResponse>> {
    try {
      const { password, ...data } = createUserDto;

      const saltRounds = Number(
        this.configService.getOrThrow<number>('BCRYPT_SALT_ROUNDS'),
      );

      const hashPassword = await bcrypt.hash(password, saltRounds);

      const user = this.userRepository.create({
        ...data,
        password: hashPassword,
      });

      await this.userRepository.save(user);

      const token = this.getJwtToken({ id: user.id });

      return {
        message: 'Usuario registrado con exito',
        data: buildAuthResponse(user, token)
      }


    } catch (error) {
      throw this.handleError(error);
    }
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<ApiResponse<AuthResponse>> {
    const { password, email } = loginUserDto;

    try {
      const user = await this.userRepository.findOne({
        where: { email },
        select: { email: true, password: true, id: true, fullName: true, rol: true },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new BadRequestException('Invalid credentials');
      }

      const token = this.getJwtToken({ id: user.id })

      return {
        message: 'Login exitoso',
        data: buildAuthResponse(user, token)
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
      throw new BadRequestException('Invalid credentials');
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