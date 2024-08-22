import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from './user.schema';

@Schema({ timestamps: true, discriminatorKey: 'type' })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  // todo  make it requried
  @Prop({ type: Types.ObjectId, ref: 'List', required: false })
  list: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: User;

  @Prop({ min: Date.now(), required: false })
  deadline: Date;
}

@Schema()
export class OneTask {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  assignTo: Types.ObjectId;
}

@Schema()
export class ManyTask {
  @Prop({ required: true, type: [Types.ObjectId], ref: 'User' })
  assignTo: Types.ObjectId[];
}

const taskSchema = SchemaFactory.createForClass(Task);

export const taskModel = MongooseModule.forFeature([
  {
    name: Task.name,
    schema: taskSchema,
    discriminators: [
      { name: OneTask.name, schema: SchemaFactory.createForClass(OneTask) },
      { name: ManyTask.name, schema: SchemaFactory.createForClass(ManyTask) },
    ],
  },
]);
