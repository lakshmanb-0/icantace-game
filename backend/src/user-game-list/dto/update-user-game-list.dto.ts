import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { UserGameListType } from 'src/enum';

export class UpdateUserGameListDto {
  @ApiPropertyOptional({
    description: 'List type',
    enum: UserGameListType,
    example: UserGameListType.WANT_TO_PLAY,
  })
  @IsOptional()
  @IsEnum(UserGameListType)
  type?: UserGameListType;
}
