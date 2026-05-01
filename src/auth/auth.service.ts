import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto, LoginUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/auth.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../common/interfaces/jwt.payload.interface';
import { ConfigService } from '@nestjs/config';
import { AuthResponse } from '../common/interfaces/AuthResponse.interface';
import { buildAuthResponse } from './mappers/auth.mapper';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async registerUser(registerUserDto: RegisterUserDto): Promise<AuthResponse> {
    try {
      const { password, ...data } = registerUserDto;

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
      return buildAuthResponse(user, token);

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.handleError(error);
    }
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<AuthResponse> {
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

      const token = this.getJwtToken({ id: user.id });

      return buildAuthResponse(user, token);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.handleError(error);
    }
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private handleError(error: unknown): never {
    if (this.hasErrorCode(error) && error.code === '23505') {
      throw new ConflictException('Email already exists');
    }
    console.error(error);
    throw new InternalServerErrorException('An unexpected error occurred');
  }

  private hasErrorCode(error: unknown): error is { code: string } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      typeof (error as { code: unknown }).code === 'string'
    );
  }
}
