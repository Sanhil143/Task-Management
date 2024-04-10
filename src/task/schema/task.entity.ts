import { UserEntity } from 'src/user/schema/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

@Entity()
export class TaskEntity {
  @PrimaryGeneratedColumn()
  taskId: number;

  @Column()
  description: string;

  @Column()
  due_date: Date;

  @ManyToOne(() => UserEntity, (user) => user.id)
  asignee: UserEntity;

  @Column()
  status: string;
}
