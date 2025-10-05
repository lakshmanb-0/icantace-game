import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Trailer {
  @Prop() id: number;
  @Prop() name: string;
  @Prop() preview: string;
  @Prop() minResolution: string;
  @Prop() maxResolution: string;
}

export const TrailerSchema = SchemaFactory.createForClass(Trailer);
export type TrailerDocument = Trailer & Document;

TrailerSchema.index({ id: 1 });
