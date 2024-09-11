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
import {
  ManyTask,
  OneTask,
  Task,
  TManyTaskModel,
  TOneTaskModel,
  TtaskModel,
} from 'src/schemas/task.schema';
import { AddTaskDto, UpdateTaskDTO } from './task.dto';
import { User } from 'src/schemas/user.schema';
import { cloudinaryFolderPath, taskTypes } from 'src/utils/sysConstants';
import { ObjectIdDTO } from 'src/common/common.dto';
import { CloudinaryService } from 'src/utils/services/cloudinary/cloudinary.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private readonly _taskModel: Model<Task>,
    @InjectModel(OneTask.name) private readonly _oneTask: Model<ManyTask>,
    @InjectModel(ManyTask.name) private readonly _manyTask: Model<OneTask>,
    @InjectModel(User.name) private readonly _userModel: Model<User>,
    private readonly _cloudinaryService: CloudinaryService,
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

    const task = await this._taskModel.findByIdAndDelete(id);

    if (!task) throw new NotFoundException('invalid task id');

    return {
      message: 'Task Deleted',
    };
  }

  async getAllTaskToOne(params: ObjectIdDTO) {
    const { id } = params; // userId

    const tasks = await this._taskModel.find({
      $or: [{ assignTo: id }, { assignTo: { $elemMatch: { $eq: id } } }], // oneTask or manyTask
    });

    if (!tasks.length) throw new NotFoundException('no tasks found');

    return {
      message: 'done',
      tasks,
    };
  }

  async getAllLateTask(req: any) {
    const { id } = req.user;
    const currentDate = new Date();

    const tasks = await this._taskModel.find({
      deadline: { $lt: currentDate },
      $or: [{ assignTo: id }, { assignTo: { $elemMatch: { $eq: id } } }],
    });

    if (!tasks.length) throw new NotFoundException('no task found');

    return {
      message: 'done',
      tasks,
    };
  }

  // todo upload on cloud without upload on local $$ test the methods
  async uploadAttachment(req: any) {
    const file: Express.Multer.File = req.file;
    const id: string = req.params.id; // task id
    const isTask: TtaskModel = await this._taskModel.findById(id);

    if (!isTask) throw new NotFoundException('task id not found');

    const { public_id, secure_url } = await this._cloudinaryService.uploadFile({
      file: file,
      folder: `${cloudinaryFolderPath}/${id}`,
    });

    const model =
      isTask.type == taskTypes.oneTask ? this._oneTask : this._manyTask;

    await model.updateOne(
      { _id: id },
      { $push: { attachments: { public_id, secure_url } } },
    );

    return {
      message: 'uploaded',
    };
  }

  //todo check for the model type to handle findoneandupdate
  async deleteAttachment(req: any): Promise<object> {
    const { id } = req.params;
    const { public_id } = req.body;

    const isTask: TtaskModel = await this._taskModel.findById(id);
    if (!isTask) throw new NotFoundException('task id not found');

    // delete image from cloud

    let model: any =
      isTask.type == taskTypes.oneTask ? this._oneTask : this._manyTask;

    // delete attach from db
    const { attachments } = await model.findByIdAndUpdate(
      id,
      {
        $pull: { attachments: { public_id } },
      },
      {
        new: true,
      },
    );

    if (isTask.attachments.length === attachments.length)
      throw new BadRequestException('public_id not found in the DB');

    await this._cloudinaryService.deleteFile(public_id);

    return {
      message: 'deleted',
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
