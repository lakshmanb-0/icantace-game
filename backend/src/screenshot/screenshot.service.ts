import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Screenshot, ScreenshotDocument } from './screenshot.schema';

@Injectable()
export class ScreenshotService {
  constructor(
    @InjectModel(Screenshot.name) private readonly screenshotModel: Model<ScreenshotDocument>,
  ) {}

  async upsertMany(screenshots: any[]): Promise<any> {
    await this.screenshotModel.bulkWrite(
      screenshots.map((screenshot: any) => ({
        updateOne: {
          filter: { id: screenshot.id },
          update: screenshot,
          upsert: true,
        },
      })),
    );

    const updatedDocs = await this.screenshotModel
      .find({
        id: { $in: screenshots.map((screenshot: any) => screenshot.id) },
      })
      .lean();

    return updatedDocs.map(doc => ({
      ...doc,
      game_id: screenshots.find((s: any) => s.id === doc.id)?.game_id || '',
    }));
  }
}
