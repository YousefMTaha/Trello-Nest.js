import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { AddTaskDto, UpdateTaskDTO } from './task.dto';
import { AuthenticationGuard } from 'src/guards/authentication/authentication.guard';
import { ObjectIdDTO } from 'src/common/dto/common.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/interceptors/file-validation.interceptor';
import { fileTypes } from 'src/utils/sysConstants';
import { Request as Req } from 'express';

@Controller('tasks')
export class TaskController {
  constructor(private _TaskServerice: TaskService) {}

  @Get()
  getTasks(): Promise<object> {
    return this._TaskServerice.getAllTasks();
  }

  @UseGuards(AuthenticationGuard)
  @Post()
  addTask(@Request() req: Req, @Body() body: AddTaskDto): Promise<object> {
    return this._TaskServerice.addTask(req, body);
  }

  @UseGuards(AuthenticationGuard)
  @Put(':id')
  updateTask(@Request() req: Req, @Body() body: UpdateTaskDTO) {
    return this._TaskServerice.updateTask(req, body);
  }

  @UseGuards(AuthenticationGuard)
  @Delete(':id')
  deleteTask(@Param() params: ObjectIdDTO) {
    return this._TaskServerice.deleteTask(params);
  }

  @UseGuards(AuthenticationGuard)
  @Get('assignTo/:id')
  async getAllTasksAssingtoOne(@Param() param: ObjectIdDTO) {
    return this._TaskServerice.getAllTaskToOne(param);
  }

  @UseGuards(AuthenticationGuard)
  @Get('lateTasks')
  async getAllLateTask(@Request() req: any) {
    return this._TaskServerice.getAllLateTask(req);
  }

  @UseGuards(AuthenticationGuard)
  @Get(':id')
  getSpecificTask(@Request() req: any) {
    return this._TaskServerice.getOneTask(req);
  }

  @UseGuards(AuthenticationGuard)
  @Patch('uploadAttachment/:id')
  @UseInterceptors(FileInterceptor('file', { dest: './uploads' }))
  uploadFile(
    @Param() id: ObjectIdDTO,
    @UploadedFile(new FileValidationPipe(fileTypes.image))
    file: Express.Multer.File,
    @Request() req: any,
  ) {
    req.file = file;
    return this._TaskServerice.uploadAttachment(req);
  }

  @UseGuards(AuthenticationGuard)
  @Patch('deleteAttach/:id')
  deleteAttach(@Request() req: any, @Param() param: ObjectIdDTO) {
    return this._TaskServerice.deleteAttachment(req);
  }
}
