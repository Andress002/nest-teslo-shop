import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { Message } from './decorators/message.decorator';
import { User } from './entities/auth.entity';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @Message('Usuario registrado con exito')
  create(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerUser(registerUserDto);
  }

  @Post('login')
  @Message('Login exitoso')
  @HttpCode(HttpStatus.ACCEPTED)
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @Get('check-auth-status')
  @Message('Check auth status')
  @UseGuards(AuthGuard('jwt'))
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @Message('Ruta privada, Solo de testeo')
  @UseGuards(AuthGuard('jwt'))
  testingPrivateRoute(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }
}
