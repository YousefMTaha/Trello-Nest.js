import { Body, Controller, Get, Post, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { TaskService } from './task.service';
import { addTaskDto } from './task.dto';
import { Request as Req } from 'express';
import { AuthenticationGuard } from 'src/guards/authentication/authentication.guard';
@Controller('tasks')
@UseGuards(AuthenticationGuard)
export class TaskController {
  constructor(private _TaskServerice: TaskService) {}
  @Get()
  getTasks(): Promise<object> {
    return this._TaskServerice.getTask();
  }

  @Post()
  addTask(@Request() req: Req , @Body() body : addTaskDto): Promise<object> {
    
    return this._TaskServerice.addTask(req , body);
  }
}
