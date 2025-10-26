import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model } from 'mongoose';
import { EntityBase, EntityBaseDocument } from './entity-base.schema';
import { Game, GameDocument } from 'src/game/schema/game.schema';
import { SchemaType } from 'src/enum';
import { GetGenresGamesPayload, GetTagsGamesPayload } from './entity-base.dto';

@Injectable()
export class EntityBaseService {
  constructor(
    @InjectModel(EntityBase.name) private readonly entityBaseModel: Model<EntityBaseDocument>,
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Game.name) private readonly gameModel: Model<GameDocument>,
  ) {}

  async upsertMany(
    entityBases: EntityBase[],
    session: ClientSession,
  ): Promise<EntityBaseDocument[]> {
    await this.entityBaseModel.bulkWrite(
      entityBases.map((entityBase: EntityBase) => ({
        updateOne: {
          filter: { id: entityBase.id, type: entityBase.type },
          update: entityBase,
          upsert: true,
        },
      })),
      { session },
    );

    // Fetch and return the updated/created documents
    const updatedDocs = await this.entityBaseModel
      .find({
        $or: entityBases.map((entity: EntityBase) => ({
          id: entity.id,
          type: entity.type,
        })),
      })
      .session(session);

    return updatedDocs;
  }

  async getTagsGames(payload: GetTagsGamesPayload): Promise<any> {
    const { slug, page, limit } = payload;
    const tag = await this.entityBaseModel.findOne({ slug: slug, type: SchemaType.TAG });
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }
    const total = await this.gameModel.countDocuments({ tags: { $in: [tag._id] } });
    const games = await this.gameModel
      .find({ tags: { $in: [tag._id] } })
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      total,
      games,
    };
  }

  async getGenresGames(payload: GetGenresGamesPayload): Promise<any> {
    const { slug, page, limit } = payload;
    const genre = await this.entityBaseModel.findOne({ slug: slug, type: SchemaType.GENRE });
    if (!genre) {
      throw new NotFoundException('Genre not found');
    }
    const total = await this.gameModel.countDocuments({ genres: { $in: [genre._id] } });
    const games = await this.gameModel
      .find({ genres: { $in: [genre._id] } })
      .skip((page - 1) * limit)
      .limit(limit);
    return {
      total,
      games,
    };
  }
}
