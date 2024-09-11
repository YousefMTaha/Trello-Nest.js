import {
  MongooseModule,
  Prop,
  raw,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from './user.schema';
import { CloudinaryService } from 'src/utils/services/cloudinary/cloudinary.service';
import { CloudinaryModule } from 'src/utils/services/cloudinary/cloudinary.module';
import { cloudinaryFolderPath } from 'src/utils/sysConstants';

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

  @Prop({ min: Date.now(), required: true })
  deadline: Date;

  @Prop({
    type: [{ public_id: String, secure_url: String }],
  })
  attachments: { public_id: string; secure_url: string }[];
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

export const taskModel = MongooseModule.forFeatureAsync([
  {
    name: Task.name,
    useFactory: (CloudinaryService: CloudinaryService) => {
      taskSchema.post('findOneAndDelete', async function (doc) {
        if (doc?.attachments.length) {
          await CloudinaryService.deleteAllFiles(
            `${cloudinaryFolderPath}/${doc._id.toString()}`,
          );
        }

        // next();
      });
      return taskSchema;
    },
    inject: [CloudinaryService],
    imports: [CloudinaryModule],
    discriminators: [
      { name: OneTask.name, schema: SchemaFactory.createForClass(OneTask) },
      { name: ManyTask.name, schema: SchemaFactory.createForClass(ManyTask) },
    ],
  },
]);
export type TtaskModel = Document & Task & { type: string };

export type TOneTaskModel = TtaskModel & {
  assignTo: Types.ObjectId;
};

export type TManyTaskModel = TtaskModel & {
  assignTo: Types.ObjectId[];
};
