import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import { listModel } from 'src/schemas/list.schema';

@Module({
  imports: [listModel],
  controllers: [ListController],
  providers: [ListService],
})
export class ListModule {}
