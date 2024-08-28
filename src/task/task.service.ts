import {
  BadRequestException,
  Body,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ManyTask, OneTask, Task } from 'src/schemas/task.schema';
import { AddTaskDto, UpdateTaskDTO } from './task.dto';
import { User } from 'src/schemas/user.schema';
import { taskTypes } from 'src/utils/sysConstants';
import { ObjectIdDTO } from 'src/common/common.dto';

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

  async getOneTask(req: any): Promise<object> {
    const task = await this._taskModel.findById(req.params.id);
    return task
      ? { status: true, task }
      : { status: false, message: 'invalid task id' };
  }

  async addTask(req: any, body: AddTaskDto): Promise<object> {
    const taskType = Array.isArray(body.assignTo);

    const isAsssignToExist = await this._checkUserId(body.assignTo, taskType);

    if (!isAsssignToExist.exist)
      throw new BadRequestException(isAsssignToExist.message);

    const taskModel = taskType ? this._manyTask : this._oneTask;

    const newTask = new taskModel({ ...body, createdBy: req.user._id });

    return {
      message: 'Done',
      task: await newTask.save(),
    };
  }

  async updateTask(req: any, body: UpdateTaskDTO): Promise<object> {
    const { content, title, deadline, assignTo } = body;
    const { id: taskId } = req.params;
    const { user } = req;

    const isTaskExist: any = await this._taskModel.findById(taskId);
    if (!isTaskExist) throw new NotFoundException('invalid task id');

    // check the owner of the task
    if (isTaskExist.createdBy.toString() != user._id.toString())
      throw new ForbiddenException('you are not the owner for this task');

    // check the type of the task
    const taskType = isTaskExist.type == taskTypes.manyTask;

    // check if user want to update the assignTo task and there is error
    let assignToObject = {};
    if (assignTo) {
      const updateAssignTo = await this._checkUserId(assignTo, taskType);

      if (!updateAssignTo.exist)
        throw new BadRequestException(updateAssignTo.message);

      assignToObject = taskType
        ? { $addToSet: { assignTo: { $each: assignTo } } } // addToSet instead of push to add to the array without duplicate the user
        : { assignTo };
    }

    const taskModel = taskType ? this._manyTask : this._oneTask;

    // update the task
    await taskModel.updateOne(
      { _id: taskId },
      { content, title, deadline, ...assignToObject },
    );

    return { status: true, message: 'task Updated' };
  }

  async deleteTask(params: ObjectIdDTO): Promise<object> {
    const { id } = params;

    const { deletedCount } = await this._taskModel.deleteOne({ _id: id });

    if (!deletedCount) throw new NotFoundException('invalid task id');

    return {
      message: 'Task Deleted',
    };
  }

  async getAllTaskToOne(params: ObjectIdDTO) {
    const { id } = params; // user id

    const tasks = await this._taskModel.find({
      $or: [{ assignTo: id }, { assignTo: { $elemMatch: { $eq: id } } }],
    });
    if (!tasks.length) throw new NotFoundException('no tasks found');

    return {
      message: 'done',
      tasks,
    };
  }

  private async _checkUserId(
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
