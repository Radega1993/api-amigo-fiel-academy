import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Auth } from 'src/auth/decorators';

@ApiTags('user')
@Controller('user')
@Auth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios.',
    type: [CreateUserDto],
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.userService.findAll(paginationDto);
  }

  @Get(':term')
  @ApiOperation({ summary: 'Buscar un usuario por ID o email' })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado.',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  findOne(@Param('term') term: string) {
    return this.userService.findOne(term);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado con éxito.',
    type: UpdateUserDto,
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado con éxito.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.remove(id);
  }
}
