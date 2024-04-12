import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/team.dto';
import { TeamEntity } from './schema/team.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamMemberShipEntity } from 'src/team-member/schema/team-member.entity';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,
    @InjectRepository(TeamMemberShipEntity)
    private readonly teamMemberShipRepository: Repository<TeamMemberShipEntity>
  ) {}

  async create(createTeamDto: CreateTeamDto): Promise<TeamEntity> {
    const userData = await this.teamRepository.save(createTeamDto);
    return this.teamRepository.save(userData);
  }

  async getAllTeams(): Promise<TeamEntity[]> {
    return await this.teamRepository.find();
  }

  async removeTeam(teamId: number): Promise<TeamEntity | undefined> {
    const teamMemberships = await this.teamMemberShipRepository.find({
      where: { teamId },
    });

    await Promise.all(teamMemberships.map(async (membership) => {
      await this.teamMemberShipRepository.remove(membership);
    }));
  
    const teamToRemove = await this.teamRepository.findOne({where:{teamId}});
    if (teamToRemove) {
      await this.teamRepository.remove(teamToRemove);
    }
    return teamToRemove;
  }
}
