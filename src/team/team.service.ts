import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/team.dto';
import { TeamEntity } from './schema/team.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,
  ) {}

  async create(
    createTeamDto: CreateTeamDto,
  ) : Promise<TeamEntity> {
    const userData = await this.teamRepository.save(createTeamDto);
    return this.teamRepository.save(userData);  
  }

  async getAllTasks(): Promise<TeamEntity[]> {
    return await this.teamRepository.find();
  }
}
