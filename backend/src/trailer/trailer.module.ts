import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Trailer, TrailerSchema } from './trailer.schema';
import { TrailerService } from './trailer.service';
import { TrailerController } from './trailer.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Trailer.name, schema: TrailerSchema }])],
  controllers: [TrailerController],
  providers: [TrailerService],
  exports: [TrailerService],
})
export class TrailerModule {}
