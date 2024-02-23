import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Dog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @ManyToOne(() => User, (user) => user.dogs, { onDelete: 'CASCADE' })
  user: User;
}
