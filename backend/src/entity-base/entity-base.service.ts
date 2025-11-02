import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, FilterQuery, Model } from 'mongoose';
import { EntityType, SchemaType } from 'src/enum';
import { Game, GameDocument } from 'src/game/schema/game.schema';
import { GetEntityBaseGamesPayload } from './entity-base.dto';
import { EntityBase, EntityBaseDocument } from './entity-base.schema';

@Injectable()
export class EntityBaseService {
  constructor(
    @InjectModel(EntityBase.name) private readonly entityBaseModel: Model<EntityBaseDocument>,
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

  async getEntityBaseGames(payload: GetEntityBaseGamesPayload): Promise<any> {
    const { slug, page, limit, search, entityType } = payload;
    const entity = await this.entityBaseModel.findOne({ slug: slug, type: entityType });
    if (!entity) {
      throw new NotFoundException('Entity not found');
    }
    const schemaType = EntityType[entityType as SchemaType];

    const query: FilterQuery<GameDocument> = {
      [schemaType]: { $in: [entity._id] },
    };
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const games = await this.gameModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await this.gameModel.countDocuments(query);
    return { total, games };
  }
}
