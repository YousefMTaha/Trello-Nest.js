import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { taskModule } from 'src/task/task.module';
import { userModule } from 'src/user/user.module';

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
