import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EntityBaseModule } from './entity-base/entity-base.module';
import { GameModule } from './game/game.module';
import { RawgModule } from './rawg/rawg.module';
import { ReviewModule } from './review/review.module';
import { UserGameListModule } from './user-game-list/user-game-list.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/demo'),
    RawgModule,
    GameModule,
    EntityBaseModule,
    UserModule,
    ReviewModule,
    UserGameListModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
