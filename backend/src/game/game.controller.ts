import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
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

  @Get('all')
  @ApiOperation({
    summary: 'Get all games with pagination',
    description: 'Retrieves all games with pagination support',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Page number' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 20,
    description: 'Number of games per page',
  })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search games by name' })
  @ApiResponse({ status: 200, description: 'Games retrieved successfully' })
  async getAllGames(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('search') search?: string,
  ): Promise<{ games: GameDocument[]; total: number; page: number; totalPages: number }> {
    return this.gameService.findAll(parseInt(page), parseInt(limit), search);
  }
}
