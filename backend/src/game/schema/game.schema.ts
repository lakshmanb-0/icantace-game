import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
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

  @ApiPropertyOptional({ description: 'To be announced flag', example: false, default: false })
  @Prop({ default: false })
  tba: boolean;

  @ApiPropertyOptional({ description: 'Last update date', example: '2023-04-16T07:15:36Z' })
  @Prop()
  updated?: string;
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

  @ApiPropertyOptional({ description: 'Game rating (0-5)', example: 4.48 })
  @Prop()
  rating?: number;

  @ApiPropertyOptional({ description: 'Maximum rating value', example: 5 })
  @Prop()
  rating_top?: number;

  @ApiPropertyOptional({ description: 'Game ratings details', type: [RatingType] })
  @Prop({ type: [RatingType], default: [] })
  ratings?: RatingType[];

  @ApiPropertyOptional({ description: 'Number of users who added this game', example: 19260 })
  @Prop()
  added?: number;

  @ApiPropertyOptional({
    description: 'Status breakdown of users who added this game',
    type: 'object',
  })
  @Prop({ type: Object })
  added_by_status?: Record<string, number>;

  @ApiPropertyOptional({ description: 'Average playtime in hours', example: 73 })
  @Prop()
  playtime?: number;

  @ApiPropertyOptional({ description: 'Number of screenshots', example: 18 })
  @Prop()
  screenshots_count?: number;

  @ApiPropertyOptional({ description: 'Number of movies/trailers', example: 2 })
  @Prop()
  movies_count?: number;

  @ApiPropertyOptional({ description: 'Number of creators', example: 11 })
  @Prop()
  creators_count?: number;

  @ApiPropertyOptional({ description: 'Number of achievements', example: 539 })
  @Prop()
  achievements_count?: number;

  @ApiPropertyOptional({ description: 'Number of parent achievements', example: 75 })
  @Prop()
  parent_achievements_count?: number;

  @ApiPropertyOptional({ description: 'Number of game suggestions', example: 590 })
  @Prop()
  suggestions_count?: number;

  @ApiPropertyOptional({ description: 'Number of ratings', example: 5681 })
  @Prop()
  ratings_count?: number;

  @ApiPropertyOptional({
    description: 'Alternative game names',
    type: [String],
    example: ['GTA V', 'GTA 5'],
  })
  @Prop()
  alternative_names?: string[];

  @ApiPropertyOptional({ description: 'Number of reviews', example: 107 })
  @Prop()
  reviews_count?: number;

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
}

export const GameSchema = SchemaFactory.createForClass(Game);

export type GameDocument = Game & Document;

GameSchema.index({ id: 1 });
GameSchema.index({ slug: 1 });
