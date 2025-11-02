import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsMongoId, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ description: 'Game ID', example: '60d21b4967d0d8992e610c85' })
  @IsNotEmpty()
  @IsMongoId()
  gameId: string;

  @ApiProperty({ description: 'User ID', example: '60d21b4967d0d8992e610c86' })
  @IsNotEmpty()
  @IsMongoId()
  createdBy: string;

  @ApiProperty({ description: 'Is the game recommended?', example: true })
  @IsNotEmpty()
  @IsBoolean()
  isRecommended: boolean;

  @ApiProperty({ description: 'Review content', example: 'This is an amazing game!' })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  content: string;
}
