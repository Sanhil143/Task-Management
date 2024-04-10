import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TeamEntity {
  @PrimaryGeneratedColumn()
  teamId: number;

  @Column()
  name: string;
}
