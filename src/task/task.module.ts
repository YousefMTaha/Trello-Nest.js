import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Task,
  taskModel,
} from 'src/schemas/task.schema';
import { userModel } from 'src/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  imports: [taskModel,  userModel, JwtModule],
})
export class taskModule {}
