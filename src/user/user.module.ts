import { Module } from '@nestjs/common';
import { userModel } from 'src/schemas/user.schema';
import { userController } from './user.controller';
import { userService } from './user.service';
import { JwtService } from '@nestjs/jwt';
@Module({
  imports: [userModel],
  controllers: [userController],
  providers: [userService, JwtService],
})
export class userModule {}
