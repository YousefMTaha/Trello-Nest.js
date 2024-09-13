import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';

@Schema({ timestamps: true })
export class List {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;
}

const listSchema = SchemaFactory.createForClass(List);

export const listModel = MongooseModule.forFeature([
  { name: 'List', schema: listSchema },
]);
