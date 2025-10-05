import { Game, GameSchema } from './schema/game.schema';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { EntityBaseModule } from 'src/entity-base/entity-base.module';
import { RawgModule } from 'src/rawg/rawg.module';
import { TrailerModule } from 'src/trailer/trailer.module';
import { AchievementModule } from 'src/achievement/achievement.module';
import { ScreenshotModule } from 'src/screenshot/screenshot.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
    EntityBaseModule,
    RawgModule,
    TrailerModule,
    AchievementModule,
    ScreenshotModule,
  ],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
