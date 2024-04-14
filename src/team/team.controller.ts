import { Controller, Get, Post, Body, UseGuards, Delete, Param, HttpException, HttpStatus } from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/team.dto';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { TeamEntity } from './schema/team.entity';
import { UserGuard } from 'src/auth/guards/user.guard';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @UseGuards(AdminGuard)
  @Post('create')
  create(@Body() createTeamDto: CreateTeamDto) {
    const {name,userId} = createTeamDto
    if(!name){
      return {status:false, error:"team name is required"}
    }
    if(!userId){
      return {status:false, error:"admin id is required"}
    }
    return this.teamService.create(createTeamDto);
  }

  @UseGuards(AdminGuard)
  @Get(':userId')
  findAll(@Param('userId') userId: number): Promise<TeamEntity[]> {
    return this.teamService.getAllTeams(userId);
  }

  @UseGuards(AdminGuard)
  @Delete('removeTeam/:teamId/:userId')
  async removeTeam(
    @Param('teamId') teamId:number,
    @Param('userId') userId: number){
    try {
      if(!teamId){
        return {status:false, error:"teamId is required"}
      }
      if(!userId){
        return {status:false, error:"userId is required"}
      }
      const removeTeam = await this.teamService.removeTeam(teamId,userId);
      if(!removeTeam){
        return {status:false, error:"error during team deletion"}
      }
      return {status:true, error:"team remove successfully"}
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(UserGuard)
  @Get('getAllTeamByUser/:userId')
  async getAllTeamByUser(@Param('userId')userId:number){
    return this.teamService.getAllTeamByUser(userId);
  }
}
