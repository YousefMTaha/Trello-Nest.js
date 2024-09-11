import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { fileTypes } from 'src/utils/sysConstants';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(
    private allowedTypes: string[] | string = Object.values(fileTypes),
  ) {}
  transform(value: any, metadata: ArgumentMetadata): Express.Multer.File {
    if (!value) {
      throw new BadRequestException('File is required');
    }

    if (!Array.isArray(this.allowedTypes))
      this.allowedTypes = [this.allowedTypes];

    // check for the type
    if (!this.allowedTypes.includes(value.mimetype.split('/')[0]))
      throw new BadRequestException(
        `Invalid task type, The allowed types is ${this.allowedTypes.join()}`,
      );

    // check for size in KB
    if (value.size > 5 * 1024 * 1024)
      throw new BadRequestException('Task size exceed 5MB');

    return value;
  }
}
