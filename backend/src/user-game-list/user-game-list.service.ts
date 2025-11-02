import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserGameListType } from 'src/enum';
import { CreateUserGameListDto } from './dto/create-user-game-list.dto';
import { UpdateUserGameListDto } from './dto/update-user-game-list.dto';
import { UserGameList, UserGameListDocument } from './schema/user-game-list.schema';

@Injectable()
export class UserGameListService {
  constructor(
    @InjectModel(UserGameList.name) private readonly userGameListModel: Model<UserGameListDocument>,
  ) {}

  async create(createUserGameListDto: CreateUserGameListDto): Promise<UserGameListDocument> {
    // Check if this exact combination already exists
    const existing = await this.userGameListModel.findOne({
      gameId: createUserGameListDto.gameId,
      createdBy: createUserGameListDto.createdBy,
      type: createUserGameListDto.type,
    });

    if (existing) {
      throw new ConflictException('This game is already in this list for this user');
    }

    const entry = new this.userGameListModel(createUserGameListDto);
    return await entry.save();
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    type?: UserGameListType,
    userId?: string,
    gameId?: string,
  ): Promise<{ items: UserGameListDocument[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (type) filter.type = type;
    if (userId) filter.createdBy = userId;
    if (gameId) filter.gameId = gameId;

    const [items, total] = await Promise.all([
      this.userGameListModel
        .find(filter)
        .populate('gameId', 'name slug background_image metacritic released')
        .populate('createdBy', 'username email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.userGameListModel.countDocuments(filter),
    ]);

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<UserGameListDocument> {
    const item = await this.userGameListModel
      .findById(id)
      .populate('gameId', 'name slug background_image metacritic released')
      .populate('createdBy', 'username email');

    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    return item;
  }

  async findUserFavorites(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ items: UserGameListDocument[]; total: number; page: number; totalPages: number }> {
    return this.findAll(page, limit, UserGameListType.FAVORITE, userId);
  }

  async findUserWantToPlay(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ items: UserGameListDocument[]; total: number; page: number; totalPages: number }> {
    return this.findAll(page, limit, UserGameListType.WANT_TO_PLAY, userId);
  }

  async findUserViewed(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ items: UserGameListDocument[]; total: number; page: number; totalPages: number }> {
    return this.findAll(page, limit, UserGameListType.VIEWED, userId);
  }

  async findGameStats(gameId: string): Promise<any> {
    const [totalViews, totalFavorites, totalWantToPlay] = await Promise.all([
      this.userGameListModel.countDocuments({ gameId, type: UserGameListType.VIEWED }),
      this.userGameListModel.countDocuments({ gameId, type: UserGameListType.FAVORITE }),
      this.userGameListModel.countDocuments({ gameId, type: UserGameListType.WANT_TO_PLAY }),
    ]);

    return {
      gameId,
      views: totalViews,
      favorites: totalFavorites,
      wantToPlay: totalWantToPlay,
    };
  }

  async getUserStats(userId: string): Promise<any> {
    const [totalFavorites, totalWantToPlay, totalViewed] = await Promise.all([
      this.userGameListModel.countDocuments({ createdBy: userId, type: UserGameListType.FAVORITE }),
      this.userGameListModel.countDocuments({
        createdBy: userId,
        type: UserGameListType.WANT_TO_PLAY,
      }),
      this.userGameListModel.countDocuments({ createdBy: userId, type: UserGameListType.VIEWED }),
    ]);

    return {
      userId,
      favorites: totalFavorites,
      wantToPlay: totalWantToPlay,
      viewed: totalViewed,
    };
  }

  async update(
    id: string,
    updateUserGameListDto: UpdateUserGameListDto,
  ): Promise<UserGameListDocument> {
    const updated = await this.userGameListModel
      .findByIdAndUpdate(id, { $set: updateUserGameListDto }, { new: true })
      .populate('gameId', 'name slug background_image')
      .populate('createdBy', 'username email');

    if (!updated) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userGameListModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
  }

  async removeByUserAndGame(userId: string, gameId: string, type: UserGameListType): Promise<void> {
    const result = await this.userGameListModel.findOneAndDelete({
      createdBy: userId,
      gameId,
      type,
    });

    if (!result) {
      throw new NotFoundException(`No ${type} entry found for this user and game`);
    }
  }

  async checkUserGameStatus(userId: string, gameId: string): Promise<any> {
    const entries = await this.userGameListModel.find({
      createdBy: userId,
      gameId,
    });

    const status = {
      isFavorite: false,
      isWantToPlay: false,
      hasViewed: false,
    };

    entries.forEach(entry => {
      if (entry.type === UserGameListType.FAVORITE) status.isFavorite = true;
      if (entry.type === UserGameListType.WANT_TO_PLAY) status.isWantToPlay = true;
      if (entry.type === UserGameListType.VIEWED) status.hasViewed = true;
    });

    return status;
  }
}
