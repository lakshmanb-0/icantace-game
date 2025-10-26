import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EntityBase, EntityBaseSchema } from './entity-base.schema';
import { EntityBaseController } from './entity-base.controller';
import { EntityBaseService } from './entity-base.service';
import { Game, GameSchema } from 'src/game/schema/game.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: EntityBase.name, schema: EntityBaseSchema }]),
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
  ],
  controllers: [EntityBaseController],
  providers: [EntityBaseService],
  exports: [EntityBaseService],
})
export class EntityBaseModule {}
