import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetTagsGamesPayload {
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsNumber()
  @IsNotEmpty()
  page: number;

  @IsNumber()
  @IsNotEmpty()
  limit: number;
}

export class GetGenresGamesPayload {
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsNumber()
  @IsNotEmpty()
  page: number;

  @IsNumber()
  @IsNotEmpty()
  limit: number;
}
