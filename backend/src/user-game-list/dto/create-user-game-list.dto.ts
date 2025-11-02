import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { UserGameListType } from 'src/enum';

export class CreateUserGameListDto {
  @ApiProperty({ description: 'Game ID', example: '60d21b4967d0d8992e610c85' })
  @IsNotEmpty()
  @IsMongoId()
  gameId: string;

  @ApiPropertyOptional({
    description: 'User ID (optional for anonymous views)',
    example: '60d21b4967d0d8992e610c86',
  })
  @IsOptional()
  @IsMongoId()
  createdBy?: string;

  @ApiProperty({
    description: 'List type',
    enum: UserGameListType,
    example: UserGameListType.FAVORITE,
  })
  @IsNotEmpty()
  @IsEnum(UserGameListType)
  type: UserGameListType;
}
