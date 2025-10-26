import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model } from 'mongoose';
import { Screenshot, ScreenshotDocument } from './screenshot.schema';

@Injectable()
export class ScreenshotService {
  constructor(
    @InjectModel(Screenshot.name) private readonly screenshotModel: Model<ScreenshotDocument>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async upsertMany(screenshots: any[], session: ClientSession): Promise<any> {
    await this.screenshotModel.bulkWrite(
      screenshots.map((screenshot: any) => ({
        updateOne: {
          filter: { id: screenshot.id },
          update: screenshot,
          upsert: true,
        },
      })),
      { session },
    );

    const updatedDocs = await this.screenshotModel
      .find({
        id: { $in: screenshots.map((screenshot: any) => screenshot.id) },
      })
      .session(session)
      .lean();

    return updatedDocs.map(doc => ({
      ...doc,
      game_id: screenshots.find((s: any) => s.id === doc.id)?.game_id || '',
    }));
  }
}
