import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { SchemaType } from 'src/enum';

@Schema({ timestamps: true })
export class EntityBase {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  slug: string;

  @Prop()
  games_count?: number;

  @Prop()
  image_background?: string;

  @Prop({ required: true, enum: SchemaType, default: SchemaType.TAG })
  type: SchemaType;

  @Prop({ type: [String], default: [] })
  positions?: string[] | null;
}

export const EntityBaseSchema = SchemaFactory.createForClass(EntityBase);
export type EntityBaseDocument = EntityBase & Document;
export type EntityBaseModel = Model<EntityBaseDocument>;

EntityBaseSchema.index({ id: 1, type: 1 });
EntityBaseSchema.index({ slug: 1, type: 1 });
EntityBaseSchema.index({ type: 1 });
EntityBaseSchema.index({ type: 1, id: 1 });
