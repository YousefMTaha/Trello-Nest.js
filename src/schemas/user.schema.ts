import {
  MongooseModule,
  Prop,
  raw,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { sysRoles } from 'src/utils/sysConstants';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User {
  @Prop(
    raw({
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    }),
  )
  name: Record<string, any>;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email: string;

  @Prop({ default: false })
  confirmEmail: boolean;

  @Prop()
  age: number;

  @Prop({ enum: Object.values(sysRoles), default: sysRoles.User })
  role: string;

 
}

export const userSchema = SchemaFactory.createForClass(User);

userSchema.pre('save', function () {
  this.password = bcrypt.hashSync(this.password, 9);
});

export const userModel = MongooseModule.forFeature([
  { name: User.name, schema: userSchema },
]);
