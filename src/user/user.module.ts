import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Dog } from 'src/dog/entities/dog.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [ConfigModule, TypeOrmModule.forFeature([User, Dog]), AuthModule],
  exports: [TypeOrmModule],
})
export class UserModule {}
