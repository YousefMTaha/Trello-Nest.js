import { NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Helper } from './helpers';

export class DBoperation<T> {
  constructor(@InjectModel('') private readonly _model: Model<T>) {}

  private _modelName = this._model.modelName;
  private _helpers = new Helper<T>(this._model);

  async getAll({
    populate,
  }: {
    populate?: string;
  } = {}): Promise<T[]> {
    const data = await this._model.find().populate(populate);

    if (!data.length)
      throw new NotFoundException(`no ${this._modelName}s found`);

    return data;
  }

  async getOne(id: string): Promise<T> {
    return this._helpers.isExist({ value: id });
  }

  async deleteOne(id: string): Promise<T> {
    const deletedDocument = await this._model.findByIdAndDelete(id);
    if (!deletedDocument) throw new Error('Document not found');
    return deletedDocument;
  }
}
