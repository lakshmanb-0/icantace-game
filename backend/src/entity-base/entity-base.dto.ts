import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { SchemaType } from 'src/enum';

export class GetEntityBaseGamesPayload {
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsNumber()
  @IsNotEmpty()
  page: number;

  @IsNumber()
  @IsNotEmpty()
  limit: number;

  @IsEnum(SchemaType)
  @IsNotEmpty()
  entityType: SchemaType;

  @IsString()
  @IsOptional()
  search: string;
}
