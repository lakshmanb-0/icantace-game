import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model } from 'mongoose';
import { Trailer, TrailerDocument } from './trailer.schema';

@Injectable()
export class TrailerService {
  constructor(
    @InjectModel(Trailer.name) private readonly trailerModel: Model<TrailerDocument>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async upsertMany(trailers: any[], session: ClientSession): Promise<any> {
    await this.trailerModel.bulkWrite(
      trailers.map((trailer: any) => ({
        updateOne: {
          filter: { id: trailer.id },
          update: trailer,
          upsert: true,
        },
      })),
      { session },
    );

    const updatedDocs = await this.trailerModel
      .find({
        id: { $in: trailers.map((trailer: any) => trailer.id) },
      })
      .session(session)
      .lean();

    return updatedDocs.map(doc => ({
      ...doc,
      game_id: trailers.find((t: any) => t.id === doc.id)?.game_id || '',
    }));
  }
}
