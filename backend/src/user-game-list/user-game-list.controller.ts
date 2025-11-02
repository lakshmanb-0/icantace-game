import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserGameListType } from 'src/enum';
import { CreateUserGameListDto } from './dto/create-user-game-list.dto';
import { UpdateUserGameListDto } from './dto/update-user-game-list.dto';
import { UserGameListService } from './user-game-list.service';

@ApiTags('user-game-lists')
@Controller('user-game-lists')
export class UserGameListController {
  constructor(private readonly userGameListService: UserGameListService) {}

  @Post()
  @ApiOperation({ summary: 'Add a game to a user list (favorite, want-to-play, or viewed)' })
  @ApiResponse({ status: 201, description: 'Game added to list successfully' })
  @ApiResponse({ status: 409, description: 'Game already in this list' })
  async create(@Body() createUserGameListDto: CreateUserGameListDto) {
    return await this.userGameListService.create(createUserGameListDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user game list entries with filters' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'type', required: false, enum: UserGameListType })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'gameId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Entries retrieved successfully' })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('type') type?: UserGameListType,
    @Query('userId') userId?: string,
    @Query('gameId') gameId?: string,
  ) {
    return await this.userGameListService.findAll(
      parseInt(page),
      parseInt(limit),
      type,
      userId,
      gameId,
    );
  }

  @Get('user/:userId/favorites')
  @ApiOperation({ summary: "Get user's favorite games" })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Favorites retrieved successfully' })
  async findUserFavorites(
    @Param('userId') userId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return await this.userGameListService.findUserFavorites(
      userId,
      parseInt(page),
      parseInt(limit),
    );
  }

  @Get('user/:userId/want-to-play')
  @ApiOperation({ summary: "Get user's want-to-play games" })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Want-to-play list retrieved successfully' })
  async findUserWantToPlay(
    @Param('userId') userId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return await this.userGameListService.findUserWantToPlay(
      userId,
      parseInt(page),
      parseInt(limit),
    );
  }

  @Get('user/:userId/viewed')
  @ApiOperation({ summary: "Get user's viewed games" })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Viewed games retrieved successfully' })
  async findUserViewed(
    @Param('userId') userId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return await this.userGameListService.findUserViewed(userId, parseInt(page), parseInt(limit));
  }

  @Get('user/:userId/stats')
  @ApiOperation({ summary: 'Get user statistics across all lists' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User stats retrieved successfully' })
  async getUserStats(@Param('userId') userId: string) {
    return await this.userGameListService.getUserStats(userId);
  }

  @Get('game/:gameId/stats')
  @ApiOperation({ summary: 'Get game statistics (views, favorites, want-to-play count)' })
  @ApiParam({ name: 'gameId', description: 'Game ID' })
  @ApiResponse({ status: 200, description: 'Game stats retrieved successfully' })
  async getGameStats(@Param('gameId') gameId: string) {
    return await this.userGameListService.findGameStats(gameId);
  }

  @Get('check/:userId/:gameId')
  @ApiOperation({ summary: 'Check if a user has a game in any list' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'gameId', description: 'Game ID' })
  @ApiResponse({ status: 200, description: 'Status retrieved successfully' })
  async checkUserGameStatus(@Param('userId') userId: string, @Param('gameId') gameId: string) {
    return await this.userGameListService.checkUserGameStatus(userId, gameId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user game list entry by ID' })
  @ApiParam({ name: 'id', description: 'Entry ID' })
  @ApiResponse({ status: 200, description: 'Entry found' })
  @ApiResponse({ status: 404, description: 'Entry not found' })
  async findOne(@Param('id') id: string) {
    return await this.userGameListService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a user game list entry (e.g., change from favorite to want-to-play)',
  })
  @ApiParam({ name: 'id', description: 'Entry ID' })
  @ApiResponse({ status: 200, description: 'Entry updated successfully' })
  @ApiResponse({ status: 404, description: 'Entry not found' })
  async update(@Param('id') id: string, @Body() updateUserGameListDto: UpdateUserGameListDto) {
    return await this.userGameListService.update(id, updateUserGameListDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a game from a user list by entry ID' })
  @ApiParam({ name: 'id', description: 'Entry ID' })
  @ApiResponse({ status: 204, description: 'Entry deleted successfully' })
  @ApiResponse({ status: 404, description: 'Entry not found' })
  async remove(@Param('id') id: string) {
    await this.userGameListService.remove(id);
  }

  @Delete('user/:userId/game/:gameId/:type')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a game from a specific user list' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'gameId', description: 'Game ID' })
  @ApiParam({ name: 'type', description: 'List type', enum: UserGameListType })
  @ApiResponse({ status: 204, description: 'Entry deleted successfully' })
  @ApiResponse({ status: 404, description: 'Entry not found' })
  async removeByUserAndGame(
    @Param('userId') userId: string,
    @Param('gameId') gameId: string,
    @Param('type') type: UserGameListType,
  ) {
    await this.userGameListService.removeByUserAndGame(userId, gameId, type);
  }
}
