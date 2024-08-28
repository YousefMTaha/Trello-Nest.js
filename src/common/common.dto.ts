import { IsObjectId } from 'src/decorators/isObjectId.decorator';

export class ObjectIdDTO {
  @IsObjectId()
  id: string;
}
