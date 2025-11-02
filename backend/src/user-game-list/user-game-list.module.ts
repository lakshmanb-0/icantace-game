import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserGameList, UserGameListSchema } from './schema/user-game-list.schema';
import { UserGameListController } from './user-game-list.controller';
import { UserGameListService } from './user-game-list.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: UserGameList.name, schema: UserGameListSchema }])],
  controllers: [UserGameListController],
  providers: [UserGameListService],
  exports: [UserGameListService],
})
export class UserGameListModule {}
