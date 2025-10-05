import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Screenshot {
  @Prop() id: number;
  @Prop() image: string;
  @Prop() width: number;
  @Prop() height: number;
  @Prop() is_deleted: boolean;
}

export const ScreenshotSchema = SchemaFactory.createForClass(Screenshot);
export type ScreenshotDocument = Screenshot & Document;

ScreenshotSchema.index({ id: 1 });
