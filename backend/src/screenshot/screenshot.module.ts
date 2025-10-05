import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Screenshot, ScreenshotSchema } from './screenshot.schema';
import { ScreenshotService } from './screenshot.service';
import { ScreenshotController } from './screenshot.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Screenshot.name, schema: ScreenshotSchema }])],
  controllers: [ScreenshotController],
  providers: [ScreenshotService],
  exports: [ScreenshotService],
})
export class ScreenshotModule {}
