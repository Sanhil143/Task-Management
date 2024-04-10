import { TeamEntity } from 'src/team/schema/team.entity';
import { UserEntity } from 'src/user/schema/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TeamMemberShipEntity {
  @PrimaryGeneratedColumn()
  teamMemberShipId: number;

  @Column()
  userId: number; // Use userId as a foreign key

  @Column()
  teamId: number;

  @ManyToOne(() => TeamEntity, (team) => team.teamId)
  team: TeamEntity;

  @ManyToOne(() => UserEntity, (user) => user.id)
  user: UserEntity;
}
