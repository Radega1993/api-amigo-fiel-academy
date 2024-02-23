import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dog } from 'src/dog/entities/dog.entity';
import { CreateDogDto } from 'src/dog/dto/create-dog.dto';
import { UpdateDogDto } from 'src/dog/dto/update-dog.dto';
import { validate as isUUID } from 'uuid';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class DogService {
  private readonly logger = new Logger('DogService');

  constructor(
    @InjectRepository(Dog)
    private readonly dogRepository: Repository<Dog>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createDogDto: CreateDogDto) {
    try {
      const user = await this.userRepository.findOneBy({
        id: createDogDto.userId,
      });
      if (!user) {
        throw new NotFoundException(
          `Usuario con ID ${createDogDto.userId} no encontrado.`,
        );
      }

      // Crear el restaurante y establecer la relación con el usuario
      const dog = this.dogRepository.create({
        ...createDogDto,
        user: user, // Establece la relación con el usuario
      });

      await this.dogRepository.save(dog);
      return dog;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.dogRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(term: string) {
    let restaurant: Dog;
    if (isUUID(term)) {
      restaurant = await this.dogRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.dogRepository.createQueryBuilder();
      restaurant = await queryBuilder
        .where(`name =: name`, {
          name: term,
        })
        .getOne();
    }
    if (!restaurant)
      throw new NotFoundException(`Restaurant with id ${term} not found`);
    return restaurant;
  }

  async update(id: string, updateRestaurantDto: UpdateDogDto) {
    try {
      const restaurant = await this.dogRepository.preload({
        id: id,
        ...updateRestaurantDto,
      });

      if (!restaurant) {
        throw new NotFoundException(`Restaurant with ID ${id} not found.`);
      }

      await this.dogRepository.save(restaurant);
      return restaurant;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string): Promise<void> {
    const dog = await this.findOne(id);
    await this.dogRepository.remove(dog);
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error! sorry ...');
  }
}
