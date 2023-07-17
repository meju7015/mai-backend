import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { BaseResponse } from '../../base/BaseResponse';
import { AuthUserMeResponseDto } from './dto/AuthUserMeResponse.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async me(@Req() req) {
    return BaseResponse.success<AuthUserMeResponseDto>(
      await this.userService.me(req.user.id),
    );
  }
}
