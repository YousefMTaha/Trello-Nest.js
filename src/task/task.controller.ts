import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { AddTaskDto, UpdateTaskDTO } from './task.dto';
import { Request as Req } from 'express';
import { AuthenticationGuard } from 'src/guards/authentication/authentication.guard';
import { ObjectIdDTO } from 'src/common/common.dto';
@Controller('tasks')
export class TaskController {
  constructor(private _TaskServerice: TaskService) {}

  @Get()
  getTasks(): Promise<object> {
    return this._TaskServerice.getTask();
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
  async getAllTasksAssingtoOne(@Param() req: ObjectIdDTO) {
    return this._TaskServerice.getAllTaskToOne(req);
  }

  @UseGuards(AuthenticationGuard)
  @Get(':id')
  getSpecificTask(@Request() req: Req) {
    return this._TaskServerice.getOneTask(req);
  }
}
