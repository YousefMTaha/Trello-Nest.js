import { BadRequestException, Body, Injectable, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ManyTask, OneTask, Task } from 'src/schemas/task.schema';
import { addTaskDto, updateTaskDTO } from './task.dto';
import { User } from 'src/schemas/user.schema';
//
@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private readonly _taskModel: Model<Task>,
    @InjectModel(OneTask.name) private readonly _oneTask: Model<ManyTask>,
    @InjectModel(ManyTask.name) private readonly _manyTask: Model<OneTask>,
    @InjectModel(User.name) private readonly _userModel: Model<User>,
  ) {}
  home(): String {
    return 'Task Page';
  }

  async getTask(): Promise<Task[]> {
    return await this._taskModel.find();
  }

  async addTask(req: any, body: addTaskDto): Promise<object> {
    const taskType = Array.isArray(body.assignTo);

    const isAsssignToExist = await this.checkUserId(body.assignTo, taskType);
    
    if (!isAsssignToExist.exist)
      throw new BadRequestException(isAsssignToExist.message);

    const taskModel = taskType ? this._manyTask : this._oneTask;

    const newTask = new taskModel({ ...body, createdBy: req.user._id });

    return {
      message: 'Done',
      task: await newTask.save(),
    };
  }

  async updateTask(req: any, body: updateTaskDTO) {
    const {title  , content ,   }
  }

  private async checkUserId(
    id: any,
    isArray: boolean,
  ): Promise<{ exist: boolean; message?: string }> {
    if (isArray) return this._checkManyUserId(id);
    else return this._checkOneUserId(id);
  }

  private async _checkOneUserId(
    id: string,
  ): Promise<{ exist: boolean; message?: string }> {
    const user = await this._userModel.findById(id);

    return user
      ? { exist: true }
      : { exist: false, message: `user with ${id} not found` };
  }

  private async _checkManyUserId(
    ids: string[],
  ): Promise<{ exist: boolean; message?: string }> {
    for (const id of ids) {
      const user = await this._userModel.findById(id);
      if (!user) return { exist: false, message: `user with ${id} not found` };
    }
    return { exist: true };
  }
}
