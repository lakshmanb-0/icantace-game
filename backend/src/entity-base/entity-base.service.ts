import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityBase, EntityBaseDocument } from './entity-base.schema';

@Injectable()
export class EntityBaseService {
  constructor(
    @InjectModel(EntityBase.name) private readonly entityBaseModel: Model<EntityBaseDocument>,
  ) {}

  async upsertMany(entityBases: EntityBase[]): Promise<EntityBaseDocument[]> {
    await this.entityBaseModel.bulkWrite(
      entityBases.map((entityBase: EntityBase) => ({
        updateOne: {
          filter: { id: entityBase.id, type: entityBase.type },
          update: entityBase,
          upsert: true,
        },
      })),
    );

    // Fetch and return the updated/created documents
    const updatedDocs = await this.entityBaseModel.find({
      $or: entityBases.map((entity: EntityBase) => ({
        id: entity.id,
        type: entity.type,
      })),
    });

    return updatedDocs;
  }
}
