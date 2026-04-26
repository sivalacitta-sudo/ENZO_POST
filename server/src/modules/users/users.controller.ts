import { Controller, Get, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  async getProfile(@Request() req) {
    return this.usersService.findOne(req.user.userId);
  }

  @Patch('profile')
  async updateProfile(@Request() req, @Body() body: { nickname?: string; avatarUrl?: string }) {
    return this.usersService.updateProfile(req.user.userId, body.nickname || '', body.avatarUrl || '');
  }
}
