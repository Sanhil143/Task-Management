import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TeamEntity {
  @PrimaryGeneratedColumn()
  teamId: number;

  @Column()
  userId: number;

  @Column()
  name: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: null, nullable: true })
  updatedAt: Date | null;

  @Column({ default: false })
  isDeleted: boolean;
}
