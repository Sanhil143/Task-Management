import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TeamMemberShipService } from './team-member.service';
import {
  CreateTeamMemberShipDto,
  UpdateTeamMemberShipDto,
} from './dto/teammembership.dto';
import { UserGuard } from 'src/auth/guards/user.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Controller('teammembership')
export class TeamMemberShipController {
  constructor(private readonly teamMemberShipService: TeamMemberShipService) {}

  @UseGuards(AdminGuard)
  @Post('create')
  async createTeamMembership(
    @Body() createTeamMemberShipDto: CreateTeamMemberShipDto,
  ) {
    try {
      const updatedMembership = await this.teamMemberShipService.create(
        createTeamMemberShipDto,
      );
      return {
        success: true,
        data: updatedMembership,
        message: 'created team successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AdminGuard)
  @Patch('update')
  async updateTeamMembership(
    @Body() updateTeamMemberShipDto: UpdateTeamMemberShipDto,
  ) {
    try {
      const updatedMembership = await this.teamMemberShipService.update(
        updateTeamMemberShipDto,
      );
      return {
        success: true,
        data: updatedMembership,
        message: 'User added to the team successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(UserGuard)
  @Get(':teamId')
  async getTeamMembersByTeamId(@Param('teamId') teamId: number) {
    try {
      const teamMembers =
        await this.teamMemberShipService.getTeamMembersByTeamId(teamId);
      return teamMembers;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
