import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/team.dto';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @UseGuards(AdminGuard)
  @Post('create')
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamService.create(createTeamDto);
  }

  @UseGuards(AdminGuard)
  @Get()
  findAll() {
    return this.teamService.getAllTeams();
  }
}
