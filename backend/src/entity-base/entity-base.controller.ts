import { Body, Controller, Get } from '@nestjs/common';
import { EntityBaseService } from './entity-base.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetEntityBaseGamesPayload } from './entity-base.dto';
import { SchemaType } from 'src/enum';

@Controller('entity-base')
export class EntityBaseController {
  constructor(private readonly entityBaseService: EntityBaseService) {}

  @Get('get-entity-base-games')
  @ApiOperation({
    summary: 'Get entity base games by slug',
    description: 'Retrieves entity base games by slug',
  })
  @ApiBody({
    type: GetEntityBaseGamesPayload,
    description: 'Entity base games payload',
    examples: {
      example: {
        value: { slug: 'action', page: 1, limit: 10, entityType: SchemaType.TAG, search: 'action' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Entity base games found' })
  @ApiResponse({ status: 404, description: 'Entity base games not found' })
  async getEntityBaseGames(@Body() payload: GetEntityBaseGamesPayload): Promise<any> {
    return this.entityBaseService.getEntityBaseGames(payload);
  }
}
