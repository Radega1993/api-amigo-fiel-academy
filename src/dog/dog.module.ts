import { Module } from '@nestjs/common';
import { DogService } from './dog.service';
import { DogController } from './dog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dog } from './entities/dog.entity';
import { User } from 'src/user/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [DogController],
  providers: [DogService],
  imports: [TypeOrmModule.forFeature([Dog, User]), AuthModule],
})
export class DogModule {}
