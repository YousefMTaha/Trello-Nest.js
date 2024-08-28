import { Types } from 'mongoose';
import { IsObjectId } from 'src/decorators/isObjectId.decorator';

export class ObjectIdDTO {
  @IsObjectId()
  id: Types.ObjectId | [Types.ObjectId];
}
