import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review, ReviewDocument } from './schema/review.schema';

@Injectable()
export class ReviewService {
  constructor(@InjectModel(Review.name) private readonly reviewModel: Model<ReviewDocument>) {}

  async create(createReviewDto: CreateReviewDto): Promise<ReviewDocument> {
    // Check if user already reviewed this game
    const existingReview = await this.reviewModel.findOne({
      gameId: createReviewDto.gameId,
      createdBy: createReviewDto.createdBy,
    });

    if (existingReview) {
      throw new ConflictException('You have already reviewed this game');
    }

    const review = new this.reviewModel(createReviewDto);
    return await review.save();
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    gameId?: string,
    userId?: string,
    isRecommended?: boolean,
  ): Promise<{ reviews: ReviewDocument[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (gameId) filter.gameId = gameId;
    if (userId) filter.createdBy = userId;
    if (isRecommended !== undefined) filter.isRecommended = isRecommended;

    const [reviews, total] = await Promise.all([
      this.reviewModel
        .find(filter)
        .populate('gameId', 'name slug background_image')
        .populate('createdBy', 'username email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.reviewModel.countDocuments(filter),
    ]);

    return {
      reviews,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<ReviewDocument> {
    const review = await this.reviewModel
      .findById(id)
      .populate('gameId', 'name slug background_image metacritic released')
      .populate('createdBy', 'username email');

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return review;
  }

  async findByGame(
    gameId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ reviews: ReviewDocument[]; total: number; page: number; totalPages: number }> {
    return this.findAll(page, limit, gameId);
  }

  async findByUser(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ reviews: ReviewDocument[]; total: number; page: number; totalPages: number }> {
    return this.findAll(page, limit, undefined, userId);
  }

  async update(
    id: string,
    userId: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<ReviewDocument> {
    const review = await this.reviewModel.findById(id);

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    // Check if the user owns this review
    if (review.createdBy.toString() !== userId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    const updatedReview = await this.reviewModel
      .findByIdAndUpdate(id, { $set: updateReviewDto }, { new: true })
      .populate('gameId', 'name slug background_image')
      .populate('createdBy', 'username email');

    return updatedReview;
  }

  async remove(id: string, userId: string): Promise<void> {
    const review = await this.reviewModel.findById(id);

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    // Check if the user owns this review
    if (review.createdBy.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await this.reviewModel.findByIdAndDelete(id);
  }

  async markHelpful(id: string): Promise<ReviewDocument> {
    const review = await this.reviewModel.findById(id);

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    // Toggle helpful status
    review.isHelpful = !review.isHelpful;
    return await review.save();
  }

  async getGameStats(gameId: string): Promise<any> {
    const [total, recommended, notRecommended] = await Promise.all([
      this.reviewModel.countDocuments({ gameId }),
      this.reviewModel.countDocuments({ gameId, isRecommended: true }),
      this.reviewModel.countDocuments({ gameId, isRecommended: false }),
    ]);

    return {
      total,
      recommended,
      notRecommended,
      recommendationRate: total > 0 ? Math.round((recommended / total) * 100) : 0,
    };
  }
}
