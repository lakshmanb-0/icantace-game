import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateReviewDto {
  @ApiPropertyOptional({ description: 'Is the game recommended?', example: true })
  @IsOptional()
  @IsBoolean()
  isRecommended?: boolean;

  @ApiPropertyOptional({ description: 'Review content', example: 'Updated review content' })
  @IsOptional()
  @IsString()
  @MinLength(10)
  content?: string;
}
