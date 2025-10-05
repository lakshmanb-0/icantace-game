import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Achievement {
  @Prop() id: number;
  @Prop() name: string;
  @Prop() description: string;
  @Prop() image: string;
  @Prop() percent: string;
}

export const AchievementSchema = SchemaFactory.createForClass(Achievement);
export type AchievementDocument = Achievement & Document;

AchievementSchema.index({ id: 1 });
