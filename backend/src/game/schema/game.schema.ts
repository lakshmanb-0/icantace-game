import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Model } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Achievement } from 'src/achievement/achievement.schema';
import { EntityBase } from 'src/entity-base/entity-base.schema';
import { Screenshot } from 'src/screenshot/screenshot.schema';
import { Trailer } from 'src/trailer/trailer.schema';

@Schema({ _id: false })
export class RatingType {
  @ApiProperty({ description: 'Rating title', example: 'exceptional' })
  @Prop()
  title: string;

  @ApiProperty({ description: 'Number of ratings', example: 3056 })
  @Prop()
  count: number;

  @ApiProperty({ description: 'Percentage of ratings', example: 53.79 })
  @Prop()
  percent: number;
}

// Main Game Schema
@Schema({ timestamps: true })
export class Game extends Document {
  @ApiProperty({ description: 'Game ID', example: 3498 })
  @Prop({ type: Number, required: true })
  id: number;

  @ApiProperty({ description: 'Game slug', example: 'grand-theft-auto-v' })
  @Prop({ required: true })
  slug: string;

  @ApiProperty({ description: 'Game name', example: 'Grand Theft Auto V' })
  @Prop({ required: true })
  name: string;

  @ApiPropertyOptional({ description: 'Original game name', example: 'Grand Theft Auto V' })
  @Prop()
  name_original: string;

  @ApiPropertyOptional({
    description: 'Raw description text',
    example: 'Grand Theft Auto V is an action-adventure game...',
  })
  @Prop()
  description_raw?: string;

  @ApiPropertyOptional({ description: 'Metacritic score', example: 91 })
  @Prop()
  metacritic?: number;

  @ApiPropertyOptional({ description: 'Release date', example: '2013-09-17' })
  @Prop()
  released?: string;

  @ApiPropertyOptional({
    description: 'URL to background image',
    example: 'https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg',
  })
  @Prop()
  background_image?: string;

  @ApiPropertyOptional({
    description: 'URL to additional background image',
    example: 'https://media.rawg.io/media/screenshots/5f5/5f5a38a222252d996b18962806eed707.jpg',
  })
  @Prop()
  background_image_additional?: string;

  @ApiPropertyOptional({ description: 'Average playtime in hours', example: 73 })
  @Prop()
  playtime?: number;

  @ApiPropertyOptional({
    description: 'Alternative game names',
    type: [String],
    example: ['GTA V', 'GTA 5'],
  })
  @Prop()
  alternative_names?: string[];

  @ApiPropertyOptional({ description: 'Game publishers', type: [EntityBase] })
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EntityBase' }], default: [] })
  publishers?: string[] | EntityBase[] | null;

  @ApiPropertyOptional({ description: 'Game developers', type: [EntityBase] })
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EntityBase' }], default: [] })
  developers?: string[] | EntityBase[] | null;

  @ApiPropertyOptional({ description: 'Game genres', type: [EntityBase] })
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EntityBase' }], default: [] })
  genres?: string[] | EntityBase[] | null;

  @ApiPropertyOptional({ description: 'Game tags', type: [EntityBase] })
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EntityBase' }], default: [] })
  tags?: string[] | EntityBase[] | null;

  @ApiPropertyOptional({ description: 'ESRB rating', type: EntityBase })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'EntityBase' })
  esrb_rating?: string | null | EntityBase;

  @ApiPropertyOptional({
    description: 'Minimum system requirements',
    example: 'OS: Windows 7 or newer',
  })
  @Prop()
  minimum_requirements?: string;

  @ApiPropertyOptional({
    description: 'Recommended system requirements',
    example: 'OS: Windows 10',
  })
  @Prop()
  recommended_requirements?: string;

  @ApiPropertyOptional({ description: 'Game trailers', type: [Trailer] })
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trailer' }], default: [] })
  trailers?: string[] | Trailer[] | null;

  @ApiPropertyOptional({ description: 'Game achievements', type: [Achievement] })
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' }], default: [] })
  achievements?: string[] | Achievement[] | null;

  @ApiPropertyOptional({ description: 'Game screenshots', type: [Screenshot] })
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Screenshot' }], default: [] })
  screenshots?: string[] | Screenshot[] | null;

  @ApiPropertyOptional({ description: 'Game creators', type: [EntityBase] })
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EntityBase' }], default: [] })
  creators?: string[] | EntityBase[] | null;

  @ApiPropertyOptional({
    description: 'Game website',
    example: 'https://www.rockstargames.com/gta-v',
  })
  @Prop()
  website?: string;
}

export const GameSchema = SchemaFactory.createForClass(Game);

export type GameDocument = Game & Document;
export type GameModel = Model<GameDocument>;

GameSchema.index({ id: 1 });
GameSchema.index({ slug: 1 });

GameSchema.index({ tags: 1 });
GameSchema.index({ genres: 1 });
GameSchema.index({ publishers: 1 });
GameSchema.index({ developers: 1 });
GameSchema.index({ creators: 1 });
GameSchema.index({ esrb_rating: 1 });
