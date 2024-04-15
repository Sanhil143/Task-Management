import {
  Body,
  Controller,
  Delete,
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
      if (!teamId) {
        return { status: false, error: 'teamId is required' };
      }
      const teamMembers =
        await this.teamMemberShipService.getTeamMembersByTeamId(teamId);
      return teamMembers;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(AdminGuard)
  @Delete('removeTeamMember/:teamId/:userId')
  async removeTeamMemberbyUserId(
    @Param('teamId') teamId: number,
    @Param('userId') userId: number,
  ) {
    try {
      if (!teamId) {
        return { status: false, error: 'teamId is required' };
      }
      if (!userId) {
        return { status: false, error: 'userId is required' };
      }
      const removeTeamMember =
        await this.teamMemberShipService.removeTeamMemberbyUserId(
          userId,
          teamId,
        );
      if (!removeTeamMember) {
        return { status: false, message: 'error during deletion' };
      }
      return { status: true, message: 'teammember remove successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
