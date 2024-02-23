import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DogService } from './dog.service';
import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Auth } from 'src/auth/decorators';

@ApiTags('restaurant')
@Controller('restaurant')
export class DogController {
  constructor(private readonly dogService: DogService) {}

  @Post()
  @Auth()
  @ApiOperation({ summary: 'Crear un nuevo restaurante' })
  @ApiResponse({
    status: 201,
    description: 'Restaurante creado con éxito.',
    type: CreateDogDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  create(@Body() createDogDto: CreateDogDto) {
    return this.dogService.create(createDogDto);
  }

  @Get()
  @Auth()
  @ApiOperation({ summary: 'Obtener todos los restaurantes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de restaurantes.',
    type: [CreateDogDto],
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.dogService.findAll(paginationDto);
  }

  @Get(':term')
  @ApiOperation({ summary: 'Buscar un restaurante por ID o nombre' })
  @ApiResponse({
    status: 200,
    description: 'Restaurante encontrado.',
    type: CreateDogDto,
  })
  @ApiResponse({ status: 404, description: 'Restaurante no encontrado.' })
  findOne(@Param('term') term: string) {
    return this.dogService.findOne(term);
  }

  @Patch(':id')
  @Auth()
  @ApiOperation({ summary: 'Actualizar un restaurante' })
  @ApiResponse({
    status: 200,
    description: 'Restaurante actualizado con éxito.',
    type: UpdateDogDto,
  })
  @ApiResponse({ status: 404, description: 'Restaurante no encontrado.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDogDto: UpdateDogDto,
  ) {
    return this.dogService.update(id, updateDogDto);
  }

  @Delete(':id')
  @Auth()
  @ApiOperation({ summary: 'Eliminar un restaurante' })
  @ApiResponse({ status: 200, description: 'Restaurante eliminado con éxito.' })
  @ApiResponse({ status: 404, description: 'Restaurante no encontrado.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.dogService.remove(id);
  }
}
