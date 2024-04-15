import { UserEntity } from 'src/user/schema/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class TaskEntity {
  @PrimaryGeneratedColumn()
  taskId: number;

  @Column()
  description: string;

  @Column()
  userId: number;

  @Column()
  due_date: Date;

  @ManyToOne(() => UserEntity, (user) => user.id)
  asignee: UserEntity;

  @Column()
  status: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: null, nullable: true })
  updatedAt: Date | null;

  @Column({ default: false })
  isDeleted: boolean;
}
