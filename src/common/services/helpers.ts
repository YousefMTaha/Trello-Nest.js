import { ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class Helper<T> {
  constructor(@InjectModel('') private readonly _model: Model<T>) {}
  private _modelName = this._model.modelName;

  async isExist({
    field,
    value,
    isId = true,
  }: {
    field?: string;
    value: string;
    isId?: boolean;
  }): Promise<T> {
    return isId
      ? await this._checkIdIsExist(value)
      : await this._checkvalueIsExist(field, value);
  }

  async isNotExist({
    field,
    value,
    collectionId, // in the update case (like update unique name for list) the name of the list, i need to check if other list has this name
  }: {
    field: string;
    value: string;
    collectionId?: string;
  }): Promise<void> {
    const dbQuery = {};
    if (collectionId) {
      const notEqual = {};
      notEqual['$ne'] = collectionId; // {$ne:collectionId}
      dbQuery['_id'] = notEqual; // {_id:{$ne:collectionId}}
    }
    dbQuery[field] = value;

    const isData = await this._model.findOne(dbQuery);

    console.log(isData);

    if (isData)
      throw new ConflictException(
        `${this._modelName} ${field} is already exist`,
      );
  }

  private async _checkIdIsExist(id: string): Promise<T> {
    const isData = await this._model.findById(id);
    if (!isData) throw new NotFoundException(`${this._modelName} id not found`);

    return isData;
  }

  private async _checkvalueIsExist(field: string, value: string): Promise<T> {
    const dbQuery = {};
    dbQuery[field] = value;

    const isData = await this._model.findOne(dbQuery);
    if (!isData)
      throw new NotFoundException(`${this._modelName} ${field} not found`);

    return isData;
  }
}
