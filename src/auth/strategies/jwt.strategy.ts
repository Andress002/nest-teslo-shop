import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../entities/auth.entity';
import { JwtPayload } from '../interfaces/jwt.payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
      //getOrThrow devuelve un error si la variable de entorno no está definida
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload: JwtPayload): Promise<User> {
    const { email } = payload;

    const user = await this.userRepository.findOneBy({ email });

    if (!user)
      throw new UnauthorizedException('Invalid token: user does not exist');

    if (!user.isActive)
      throw new UnauthorizedException('User account is inactive');

    return user;
  }
}
