import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsDate,
  IsOptional,
  IsArray,
  IsObject,
  ValidateNested,
  IsUrl,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ESRBRatingDto {
  @ApiProperty({ description: 'ESRB rating ID', example: 4 })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'ESRB rating slug', example: 'mature' })
  @IsString()
  slug: string;

  @ApiProperty({ description: 'ESRB rating name', example: 'Mature' })
  @IsString()
  name: string;
}

export class PlatformDetailsDto {
  @ApiProperty({ description: 'Platform ID', example: 4 })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'Platform slug', example: 'pc' })
  @IsString()
  slug: string;

  @ApiProperty({ description: 'Platform name', example: 'PC' })
  @IsString()
  name: string;
}

export class RequirementsDto {
  @ApiPropertyOptional({
    description: 'Minimum system requirements',
    example: 'OS: Windows 7 or newer',
  })
  @IsString()
  @IsOptional()
  minimum?: string;

  @ApiPropertyOptional({
    description: 'Recommended system requirements',
    example: 'OS: Windows 10',
  })
  @IsString()
  @IsOptional()
  recommended?: string;
}

export class GamePlatformDto {
  @ApiProperty({ description: 'Platform details', type: PlatformDetailsDto })
  @ValidateNested()
  @Type(() => PlatformDetailsDto)
  platform: PlatformDetailsDto;

  @ApiPropertyOptional({ description: 'Release date for this platform', example: '2020-09-17' })
  @IsString()
  @IsOptional()
  released_at?: string;

  @ApiPropertyOptional({
    description: 'System requirements for this platform',
    type: RequirementsDto,
  })
  @ValidateNested()
  @IsOptional()
  @Type(() => RequirementsDto)
  requirements?: RequirementsDto;
}

export class CreateGameDto {
  @ApiProperty({ description: 'Game ID', example: 3498 })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'Game slug', example: 'grand-theft-auto-v' })
  @IsString()
  slug: string;

  @ApiProperty({ description: 'Game name', example: 'Grand Theft Auto V' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Release date', example: '2013-09-17' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  released?: Date;

  @ApiPropertyOptional({ description: 'To be announced flag', example: false })
  @IsBoolean()
  @IsOptional()
  tba?: boolean;

  @ApiPropertyOptional({
    description: 'URL to background image',
    example: 'https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg',
  })
  @IsString()
  @IsOptional()
  @IsUrl()
  background_image?: string;

  @ApiPropertyOptional({ description: 'Game rating (0-5)', example: 4.48, minimum: 0, maximum: 5 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({ description: 'Maximum rating value', example: 5, minimum: 0, maximum: 5 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(5)
  rating_top?: number;

  @ApiPropertyOptional({ description: 'Game ratings details', type: 'object' })
  @IsObject()
  @IsOptional()
  ratings?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Number of ratings', example: 5681 })
  @IsNumber()
  @IsOptional()
  ratings_count?: number;

  @ApiPropertyOptional({ description: 'Number of text reviews', example: '45' })
  @IsString()
  @IsOptional()
  reviews_text_count?: string;

  @ApiPropertyOptional({ description: 'Number of users who added this game', example: 19260 })
  @IsNumber()
  @IsOptional()
  added?: number;

  @ApiPropertyOptional({
    description: 'Status breakdown of users who added this game',
    type: 'object',
  })
  @IsObject()
  @IsOptional()
  added_by_status?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Metacritic score', example: 91 })
  @IsNumber()
  @IsOptional()
  metacritic?: number;

  @ApiPropertyOptional({ description: 'Average playtime in hours', example: 73 })
  @IsNumber()
  @IsOptional()
  playtime?: number;

  @ApiPropertyOptional({ description: 'Number of game suggestions', example: 590 })
  @IsNumber()
  @IsOptional()
  suggestions_count?: number;

  @ApiPropertyOptional({ description: 'Last update date', example: '2023-04-16T07:15:36Z' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  updated?: Date;

  @ApiPropertyOptional({ description: 'ESRB rating', type: ESRBRatingDto })
  @ValidateNested()
  @IsOptional()
  @Type(() => ESRBRatingDto)
  esrb_rating?: ESRBRatingDto;

  @ApiPropertyOptional({ description: 'Platforms', type: [GamePlatformDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GamePlatformDto)
  @IsOptional()
  platforms?: GamePlatformDto[];
}
