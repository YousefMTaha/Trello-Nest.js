import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { taskModel } from 'src/schemas/task.schema';
import { userModel } from 'src/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { CloudinaryService } from 'src/utils/services/cloudinary/cloudinary.service';

@Module({
  controllers: [TaskController],
  providers: [TaskService, CloudinaryService],
  imports: [taskModel, userModel, JwtModule],
})
export class taskModule {}
