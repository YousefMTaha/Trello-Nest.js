import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { userService } from './user.service';
import { AddUserDTO, signinDTO } from './user.dto';
import { AuthenticationGuard } from 'src/guards/authentication/authentication.guard';
import { Request as Req } from 'express';

@Controller('user')
export class userController {
  constructor(private _userServices: userService) {}

  @Post('signup')
  addUser(@Request() req: Req, @Body() body: AddUserDTO) {
    return this._userServices.signup(req, body);
  }

  @Post('signin')
  signin(@Body() body: signinDTO) {
    return this._userServices.signin(body);
  }

  @UseGuards(AuthenticationGuard)
  @Get()
  getProfile(@Request() req: object) {
    return this._userServices.getProfile(req);
  }

  @Get('/confirmEmail/:token')
  confrimEmail(@Param() params: { token: string }) {
    return this._userServices.confirmEmail(params);
  }
}
