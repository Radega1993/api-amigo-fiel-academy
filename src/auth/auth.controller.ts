import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { Auth, GetUser } from './decorators';
import { User } from './entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado con éxito.',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({
    status: 200,
    description: 'Inicio de sesión exitoso.',
    type: LoginUserDto,
  })
  @ApiResponse({ status: 401, description: 'Credenciales no válidas.' })
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-auth-status')
  @Auth()
  @ApiOperation({ summary: 'Verificar el estado de autenticación del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Estado de autenticación verificado con éxito.',
    type: User,
  })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  checkAuthStatus(@GetUser('id') user: User) {
    return this.authService.checkAuthStatus(user);
  }
}
