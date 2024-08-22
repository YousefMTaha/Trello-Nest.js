import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { taskModule } from './task/task.module';
import { MongooseModule } from '@nestjs/mongoose';
import { userModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/trello-nest'),
    taskModule,
    userModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
