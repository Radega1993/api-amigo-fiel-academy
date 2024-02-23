import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';

import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { Restaurant } from 'src/dogs/entities/restaurant.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    private readonly jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const { restaurants = [], password, ...userDetails } = createUserDto;
      const user = this.userRepository.create({
        ...userDetails,
        password: bcrypt.hashSync(password, 10),
        restaurants: restaurants.map((restaurant) =>
          this.restaurantRepository.create({ id: restaurant }),
        ),
      });
      await this.userRepository.save(user);
      return {
        ...user,
        token: this.getJwtToken({ id: user.id, email: user.email }),
        restaurants,
      };
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const { password, email } = loginUserDto;
      const user = await this.userRepository.findOne({
        where: { email },
        select: { email: true, password: true, id: true },
      });
      if (!user) {
        throw new UnauthorizedException(
          'Credentials are not valid (email/password)',
        );
      }
      if (!bcrypt.compareSync(password, user.password)) {
        throw new UnauthorizedException(
          'Credentials are not valid (email/password)',
        );
      }
      return {
        ...user,
        token: this.getJwtToken({ id: user.id, email: user.email }),
      };
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id, email: user.email }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
  private handleDBError(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException('Please check server logs');
  }
}
