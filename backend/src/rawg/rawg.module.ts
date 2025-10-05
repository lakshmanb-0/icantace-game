import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RawgController } from './rawg.controller';
import { RawgService } from './rawg.service';

@Module({
  imports: [HttpModule],
  controllers: [RawgController],
  providers: [RawgService],
  exports: [RawgService],
})
export class RawgModule {}
