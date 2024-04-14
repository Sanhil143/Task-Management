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

  async getAllTeams(userId:number): Promise<TeamEntity[]> {
    return await this.teamRepository.find({
      where:{userId:userId,isDeleted:false}
    });
  }

  async removeTeam(teamId: number,userId:number): Promise<TeamEntity | undefined> {
    const teamMemberships = await this.teamMemberShipRepository.find({
      where: { teamId :teamId,userId:userId},
    });

    await Promise.all(teamMemberships.map(async (membership) => {
      await this.teamMemberShipRepository.update(membership.teamMemberShipId, { isDeleted: true, updatedAt: new Date() });
    }));
  
    const teamToRemove = await this.teamRepository.findOne({where:{teamId}});
    if (teamToRemove) {
      await this.teamRepository.update(teamToRemove.teamId,{isDeleted:true, updatedAt:new Date()});
    }
    return teamToRemove;
  }
}
