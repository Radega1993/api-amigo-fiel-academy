import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { Dog } from 'src/dog/entities/dog.entity';
import { validate as isUUID } from 'uuid';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@Injectable()
export class UserService {
  private readonly logger = new Logger('UserService');
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Dog)
    private readonly restaurantRepository: Repository<Dog>,
    private readonly jwtService: JwtService,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.userRepository.find({
      take: limit,
      skip: offset,
      relations: ['restaurants'],
    });
  }

  async findOne(term: string) {
    let user: User;
    if (isUUID(term)) {
      user = await this.userRepository.findOne({
        where: { id: term },
        relations: ['restaurants'],
      });
    } else {
      const queryBuilder = this.userRepository.createQueryBuilder('user');
      user = await queryBuilder
        .leftJoinAndSelect('user.restaurants', 'restaurant') // Usar leftJoinAndSelect para cargar restaurantes
        .where('user.email = :email', { email: term })
        .getOne();
    }
    if (!user) throw new NotFoundException(`User with id ${term} not found`);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id: id,
      ...updateUserDto,
      dogs: [],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    try {
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error! sorry ...');
  }
}
