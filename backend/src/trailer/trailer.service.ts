import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trailer, TrailerDocument } from './trailer.schema';

@Injectable()
export class TrailerService {
  constructor(@InjectModel(Trailer.name) private readonly trailerModel: Model<TrailerDocument>) {}

  async upsertMany(trailers: any[]): Promise<any> {
    await this.trailerModel.bulkWrite(
      trailers.map((trailer: any) => ({
        updateOne: {
          filter: { id: trailer.id },
          update: trailer,
          upsert: true,
        },
      })),
    );

    const updatedDocs = await this.trailerModel
      .find({
        id: { $in: trailers.map((trailer: any) => trailer.id) },
      })
      .lean();

    return updatedDocs.map(doc => ({
      ...doc,
      game_id: trailers.find((t: any) => t.id === doc.id)?.game_id || '',
    }));
  }
}
