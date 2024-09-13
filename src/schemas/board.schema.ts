import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Board {
  @Prop({ required: true })
  title: string;

  @Prop({ type: [Types.ObjectId], ref: 'List' })
  lists: [Types.ObjectId];

  // todo make it required
  @Prop({ ref: 'Workspace', required: false })
  workSpace: Types.ObjectId;

  @Prop({ ref: 'User', required: true })
  owner: Types.ObjectId;
}

const boardSchema = SchemaFactory.createForClass(Board);

export const boardModel = MongooseModule.forFeature([
  { name: 'Board', schema: boardSchema },
]);
