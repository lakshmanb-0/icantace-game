import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Model } from 'mongoose';
import { UserGameListType } from 'src/enum';
import { Game } from 'src/game/schema/game.schema';
import { User } from 'src/user/schema/user.schema';

@Schema({ timestamps: true })
export class UserGameList extends Document {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Game' })
  gameId: string | Game;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: string | User;

  @Prop({
    required: true,
    type: String,
    enum: Object.values(UserGameListType),
    default: UserGameListType.FAVORITE,
  })
  type: UserGameListType;
}

export const UserGameListSchema = SchemaFactory.createForClass(UserGameList);

export type UserGameListDocument = UserGameList & Document;
export type UserGameListModel = Model<UserGameListDocument>;

// Indexes
UserGameListSchema.index({ gameId: 1 });
UserGameListSchema.index({ createdBy: 1 });
UserGameListSchema.index({ type: 1 });
UserGameListSchema.index({ createdBy: 1, gameId: 1, type: 1 }, { unique: true });
