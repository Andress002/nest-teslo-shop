import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
<<<<<<< HEAD
=======
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/auth.entity';
import { Message } from './decorators/message.decorator';
>>>>>>> ec697ab37739fd5798583db359e8c60851c222c1

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @Message('Usuario registrado con exito')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  @Post('login')
  @Message('Login exitoso')
  @HttpCode(HttpStatus.ACCEPTED)
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }
<<<<<<< HEAD
=======

  @Get('private')
  @UseGuards(AuthGuard('jwt'))
  testingPrivateRoute(
    @GetUser('email') user: User
  ) {
    return {
      ok: true,
      message: 'Hola mundo private',
      user
    }
  }
>>>>>>> ec697ab37739fd5798583db359e8c60851c222c1
}
