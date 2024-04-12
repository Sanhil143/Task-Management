import { Controller, Get, Post, Body, UseGuards, Delete, Param, HttpException, HttpStatus } from '@nestjs/common';
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

  @UseGuards(AdminGuard)
  @Delete('removeTeam/:teamId')
  async removeTeam(@Param('teamId') teamId:number){
    try {
      if(!teamId){
        return {status:false, error:"teamId is required"}
      }
      const removeTeam = await this.teamService.removeTeam(teamId);
      if(!removeTeam){
        return {status:false, error:"error during team deletion"}
      }
      return {status:true, error:"team remove successfully"}
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
