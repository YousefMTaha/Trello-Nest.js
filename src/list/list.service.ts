import { Injectable } from '@nestjs/common';

import { List } from 'src/schemas/list.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ListService {
  constructor(
    @InjectModel(List.name) private readonly _ListModel: Model<List>,
  ) {}

  async create(body: any, req: any) {
    const list = await this._ListModel.create({
      content: body.content,
      createdBy: req.user._id,
    });

    return {
      message: 'Created',
      list,
    };
  }

  findAll() {
    return `This action returns all list`;
  }

  findOne(id: number) {
    return `This action returns a #${id} list`;
  }

  update(id: number, updateListDto: any) {
    return `This action updates a #${id} list`;
  }

  remove(id: number) {
    return `This action removes a #${id} list`;
  }
}
