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
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewService } from './review.service';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({ status: 201, description: 'Review successfully created' })
  @ApiResponse({ status: 409, description: 'User already reviewed this game' })
  async create(@Body() createReviewDto: CreateReviewDto) {
    return await this.reviewService.create(createReviewDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reviews with filters and pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'isRecommended', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Reviews retrieved successfully' })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('userId') userId?: string,
    @Query('isRecommended') isRecommended?: string,
  ) {
    const isRecommendedBool =
      isRecommended === 'true' ? true : isRecommended === 'false' ? false : undefined;
    return await this.reviewService.findAll(
      parseInt(page),
      parseInt(limit),
      undefined,
      userId,
      isRecommendedBool,
    );
  }

  @Get('game/:gameId')
  @ApiOperation({ summary: 'Get all reviews for a specific game' })
  @ApiParam({ name: 'gameId', description: 'Game ID' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Game reviews retrieved successfully' })
  async findByGame(
    @Param('gameId') gameId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return await this.reviewService.findByGame(gameId, parseInt(page), parseInt(limit));
  }

  @Get('game/:gameId/stats')
  @ApiOperation({ summary: 'Get review statistics for a game' })
  @ApiParam({ name: 'gameId', description: 'Game ID' })
  @ApiResponse({ status: 200, description: 'Game review stats retrieved' })
  async getGameStats(@Param('gameId') gameId: string) {
    return await this.reviewService.getGameStats(gameId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all reviews by a specific user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'User reviews retrieved successfully' })
  async findByUser(
    @Param('userId') userId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return await this.reviewService.findByUser(userId, parseInt(page), parseInt(limit));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a review by ID' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiResponse({ status: 200, description: 'Review found' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async findOne(@Param('id') id: string) {
    return await this.reviewService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a review (user must own the review)' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiQuery({
    name: 'userId',
    required: true,
    type: String,
    description: 'User ID (for authorization)',
  })
  @ApiResponse({ status: 200, description: 'Review updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the review owner' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async update(
    @Param('id') id: string,
    @Query('userId') userId: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return await this.reviewService.update(id, userId, updateReviewDto);
  }

  @Post(':id/helpful')
  @ApiOperation({ summary: 'Mark a review as helpful/unhelpful' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiQuery({ name: 'userId', required: true, type: String, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Review helpful status toggled' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async markHelpful(@Param('id') id: string) {
    return await this.reviewService.markHelpful(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a review (user must own the review)' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiQuery({
    name: 'userId',
    required: true,
    type: String,
    description: 'User ID (for authorization)',
  })
  @ApiResponse({ status: 204, description: 'Review deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the review owner' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async remove(@Param('id') id: string, @Query('userId') userId: string) {
    await this.reviewService.remove(id, userId);
  }
}
