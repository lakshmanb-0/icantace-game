import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Model } from 'mongoose';
import { Game } from 'src/game/schema/game.schema';
import { User } from 'src/user/schema/user.schema';

@Schema({ timestamps: true })
export class Review extends Document {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Game' })
  gameId: string | Game;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: string | User;

  @Prop({ required: true, type: Boolean })
  isRecommended: boolean;

  @Prop({ required: true, type: Boolean })
  isHelpful: boolean;

  @Prop({ required: true, type: String })
  content: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

export type ReviewDocument = Review & Document;
export type ReviewModel = Model<ReviewDocument>;

// Indexes
ReviewSchema.index({ gameId: 1 });
ReviewSchema.index({ createdBy: 1 });
ReviewSchema.index({ isRecommended: 1 });
ReviewSchema.index({ isHelpful: 1 });
ReviewSchema.index({ createdAt: -1 });
ReviewSchema.index({ gameId: 1, createdBy: 1 }, { unique: true });
