import { Dog } from 'src/dog/entities/dog.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Entity,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  email: string;

  @Column('text', {
    select: false,
  })
  password: string;

  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @Column('text')
  name: string;

  @Column('text')
  surname: string;

  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles: string[];

  @OneToMany(() => Dog, (dog) => dog.user, {
    cascade: true,
  })
  dogs: Dog[];

  @BeforeInsert()
  checkFielsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }
  @BeforeUpdate()
  checkFielsBeforeUpdate() {
    this.email = this.email.toLowerCase().trim();
  }
}
