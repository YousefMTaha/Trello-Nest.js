import { IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { IsObjectId } from 'src/decorators/isObjectId.decorator';
import { PartialType } from '@nestjs/mapped-types';
import { IsFutureDate } from 'src/decorators/deadline.decorator';
export class addTaskDto {
  @IsString()
  content: string;
  
  @IsString()
  title: string;

  @IsObjectId()
  assignTo: Types.ObjectId;

  @IsFutureDate()
  deadline: Date;
}

export class updateTaskDTO extends PartialType(addTaskDto) {}
