import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RawgModule } from './rawg/rawg.module';
import { GameModule } from './game/game.module';
import { EntityBaseModule } from './entity-base/entity-base.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/demo'),
    RawgModule,
    GameModule,
    EntityBaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
