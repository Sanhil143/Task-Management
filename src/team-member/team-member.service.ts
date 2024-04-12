import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TeamMemberShipEntity } from './schema/team-member.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateTeamMemberShipDto,
  UpdateTeamMemberShipDto,
} from './dto/teammembership.dto';
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

  async create(
    createTeamMemberShipDto: CreateTeamMemberShipDto,
  ): Promise<TeamMemberShipEntity> {
    const { teamId, userId } = createTeamMemberShipDto;

    const team = await this.teamRepository.findOne({
      where: { teamId: teamId },
    });
    if (!team) {
      throw new Error('Team not found');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const existingMembership = await this.teamMemberShipRepository.findOne({
      where: { teamId, userId },
    });
    if (existingMembership) {
      throw new Error('User is already added to this team');
    }

    const newTeamMembership = new TeamMemberShipEntity();
    newTeamMembership.teamId = team.teamId;
    newTeamMembership.userId = user.id;

    return await this.teamMemberShipRepository.save(newTeamMembership);
  }

  async update(
    updateTeamMemberShipDto: UpdateTeamMemberShipDto,
  ): Promise<TeamMemberShipEntity> {
    const { teamId, userId, teamMemberShipId } = updateTeamMemberShipDto;

    const team = await this.teamRepository.findOne({
      where: { teamId: teamId },
    });

    if (!team) {
      throw new Error('Team not found');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    const existingMembership = await this.teamMemberShipRepository.findOne({
      where: { teamMemberShipId: teamMemberShipId },
    });

    if (!existingMembership) {
      throw new Error('Team membership not found');
    }

    const userAlreadyInTeam = await this.teamMemberShipRepository.findOne({
      where: { teamId, userId },
    });

    if (userAlreadyInTeam) {
      throw new Error('User is already in this team');
    }

    const newTeamMembership = new TeamMemberShipEntity();
    newTeamMembership.teamId = team.teamId;
    newTeamMembership.userId = user.id;

    return await this.teamMemberShipRepository.save(newTeamMembership);
  }

  async getTeamMembersByTeamId(
    teamId: number,
  ): Promise<
    { userId: number; firstName: string; lastName: string; email: string }[]
  > {
    const teamMemberships = await this.teamMemberShipRepository.find({
      where: { teamId },
    });

    if (!teamMemberships || teamMemberships.length === 0) {
      throw new HttpException(
        'No team members found for the given team ID',
        HttpStatus.NOT_FOUND,
      );
    }

    const userIds = teamMemberships.map((membership) => membership.userId);

    const users: {
      userId: number;
      firstName: string;
      lastName: string;
      email: string;
    }[] = [];
    for (const userId of userIds) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (user) {
        users.push({
          userId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        });
      }
    }

    return users;
  }

  async removeTeamMemberbyUserId(userId: number, teamId: number): Promise<TeamMemberShipEntity | undefined> {
    const teamMembershipToRemove = await this.teamMemberShipRepository.findOne({
      where: { userId: userId, teamId:teamId },
    });
  
    if (!teamMembershipToRemove) {
      throw new HttpException(
        'Team membership not found',
        HttpStatus.NOT_FOUND,
      );
    }
  
    const removedTeamMembership = await this.teamMemberShipRepository.remove(
      teamMembershipToRemove,
    );
  
    return removedTeamMembership;
  }
}
