import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { workspaceVisibility } from 'src/utils/sysConstants';

@Schema({ timestamps: true })
export class Workspace {
  @Prop({ required: true })
  title: string;

  @Prop()
  content: string;

  @Prop({ ref: 'Member' })
  members: [Types.ObjectId];

  @Prop({
    enum: Object.values(workspaceVisibility),
    default: workspaceVisibility.public,
  })
  visiual: string;

  
}
