import { Body, Controller, Get } from '@nestjs/common';
import { EntityBaseService } from './entity-base.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetGenresGamesPayload, GetTagsGamesPayload } from './entity-base.dto';

@Controller('entity-base')
export class EntityBaseController {
  constructor(private readonly entityBaseService: EntityBaseService) {}

  @Get('get-tag-games')
  @ApiOperation({ summary: 'Get tags games by slug', description: 'Retrieves tags games by slug' })
  @ApiBody({
    type: GetTagsGamesPayload,
    description: 'Payload',
    examples: {
      example: {
        value: { slug: 'action', page: 1, limit: 10 },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Tags games found' })
  @ApiResponse({ status: 404, description: 'Tags games not found' })
  async getTagsGames(@Body() payload: GetTagsGamesPayload): Promise<any> {
    return this.entityBaseService.getTagsGames(payload);
  }

  @Get('get-genre-games')
  @ApiOperation({
    summary: 'Get genres games by slug',
    description: 'Retrieves genres games by slug',
  })
  @ApiBody({
    type: GetGenresGamesPayload,
    description: 'Payload',
    examples: {
      example: {
        value: { slug: 'action', page: 1, limit: 10 },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Genres games found' })
  @ApiResponse({ status: 404, description: 'Genres games not found' })
  async getGenresGames(@Body() payload: GetGenresGamesPayload): Promise<any> {
    return this.entityBaseService.getGenresGames(payload);
  }
}
