import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { GameService } from './game.service';
import { GameDocument } from './schema/game.schema';

@ApiTags('games')
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('upsert')
  @ApiOperation({
    summary: 'Upsert games from RAWG API',
    description: 'Fetches and upserts games from the RAWG API',
  })
  @ApiResponse({ status: 200, description: 'Games successfully upserted' })
  async upsertGames(): Promise<any> {
    return this.gameService.upsertGames();
  }

  @Get('get-game/:id')
  @ApiOperation({ summary: 'Get a game by ID', description: 'Retrieves a game by its ID' })
  @ApiParam({ name: 'id', description: 'Game ID', example: '60d21b4967d0d8992e610c85' })
  @ApiResponse({ status: 200, description: 'Game found' })
  @ApiResponse({ status: 404, description: 'Game not found' })
  async getGame(@Param('id') id: string): Promise<GameDocument> {
    return this.gameService.findOne(id);
  }
}
