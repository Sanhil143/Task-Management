import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TeamMemberShipEntity } from './schema/team-member.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTeamMemberShipDto, UpdateTeamMemberShipDto } from './dto/teammembership.dto';
import { TeamEntity } from '../team/schema/team.entity';
import { UserEntity } from '../user/schema/user.entity';

@Injectable()
export class TeamMemberShipService {
  constructor(
    @InjectRepository(TeamMemberShipEntity)
    private readonly teamMemberShipRepository: Repository<TeamMemberShipEntity>,
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createTeamMemberShipDto: CreateTeamMemberShipDto): Promise<TeamMemberShipEntity> {
    const { teamId, userId } = createTeamMemberShipDto;

    const team = await this.teamRepository.findOne({ where: { teamId: teamId } });
    if (!team) {
      throw new Error('Team not found');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const existingMembership = await this.teamMemberShipRepository.findOne({ where: 
      { teamId, userId } });
    if (existingMembership) {
      throw new Error('User is already added to this team');
    }

    const newTeamMembership = new TeamMemberShipEntity();
    newTeamMembership.teamId = team.teamId;
    newTeamMembership.userId = user.id;

    return await this.teamMemberShipRepository.save(newTeamMembership);
  }

  async update(updateTeamMemberShipDto: UpdateTeamMemberShipDto): Promise<TeamMemberShipEntity> {
    const { teamId, userId, teamMemberShipId } = updateTeamMemberShipDto;

    const team = await this.teamRepository.findOne({where:{teamId:teamId}});

    if (!team) {
      throw new Error('Team not found');
    }

    const user = await this.userRepository.findOne({where:{id:userId}});

    if (!user) {
      throw new Error('User not found');
    }

    const existingMembership = await this.teamMemberShipRepository.findOne({where:{teamMemberShipId:teamMemberShipId}});

    if (!existingMembership) {
      throw new Error('Team membership not found');
    }

    const userAlreadyInTeam = await this.teamMemberShipRepository.findOne({ where: {teamId, userId } });

    if (userAlreadyInTeam) {
      throw new Error('User is already in this team');
    }

    existingMembership.userId = user.id;
    return await this.teamMemberShipRepository.save(existingMembership);
  }

  async getTeamMembersByTeamId(teamId: number): Promise<number[]> {
    // Check if any team members exist for the given teamId
    const teamMemberships = await this.teamMemberShipRepository.find({ where: { teamId} });

    if (!teamMemberships || teamMemberships.length === 0) {
      throw new HttpException('No team members found for the given team ID', HttpStatus.NOT_FOUND);
    }

    // Extract userIds from team memberships
    const userIds = teamMemberships.map((membership) => membership.userId);

    return userIds;
  }
}