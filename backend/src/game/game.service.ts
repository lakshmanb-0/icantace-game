import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateGameDto } from './dto/create-game.dto';
import { Game, GameDocument } from './schema/game.schema';
import { Model } from 'mongoose';
import { uniqBy } from 'lodash';
import { SchemaType } from 'src/enum';
import { EntityBaseService } from 'src/entity-base/entity-base.service';
import { RawgService } from 'src/rawg/rawg.service';
import { TrailerService } from 'src/trailer/trailer.service';
import { AchievementService } from 'src/achievement/achievement.service';
import { ScreenshotService } from 'src/screenshot/screenshot.service';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game.name) private readonly gameModel: Model<GameDocument>,
    private readonly entityBaseService: EntityBaseService,
    private readonly rawgService: RawgService,
    private readonly trailerService: TrailerService,
    private readonly achievementService: AchievementService,
    private readonly screenshotService: ScreenshotService,
  ) {}

  async createGame(game: CreateGameDto): Promise<GameDocument> {
    return await this.gameModel.findOneAndUpdate(
      { rawg_id: game.id },
      { ...game, rawg_id: game.id },
      { new: true, upsert: true },
    );
  }

  async upsertMany(games: any[]): Promise<any> {
    return await this.gameModel.bulkWrite(
      games.map((game: any) => ({
        updateOne: {
          filter: { id: game.id },
          update: game,
          upsert: true,
        },
      })),
    );
  }

  async findOne(id: string): Promise<GameDocument> {
    return await this.gameModel
      .findById(id)
      .populate('screenshots')
      .populate('trailers')
      .populate('achievements')
      .populate('publishers')
      .populate('developers')
      .populate('genres')
      .populate('esrb_rating')
      .populate('tags');
  }

  async upsertGames(): Promise<any> {
    const response = await this.rawgService.getGames(1, 1);
    const gameIds = response.results.map((i: any) => i.id);
    const gamePromises = [];
    const trailerPromises = [];
    const achievementPromises = [];
    const screenshotPromises = [];

    for (const gameId of gameIds) {
      gamePromises.push(this.rawgService.getGame(gameId));
      trailerPromises.push(this.rawgService.getTrailers(gameId));
      achievementPromises.push(this.rawgService.getAchievements(gameId));
      screenshotPromises.push(this.rawgService.getScreenshots(gameId));
    }
    // get all games data
    const games = (await Promise.all(gamePromises)).filter(Boolean);
    const trailers = (await Promise.all(trailerPromises)).flat().filter(Boolean);
    const achievements = (await Promise.all(achievementPromises)).flat().filter(Boolean);
    const screenshots = (await Promise.all(screenshotPromises)).flat().filter(Boolean);
    console.log('achievements', achievements);
    let entityBases = [];

    const addEntityBase = (entitys: any[], type: SchemaType) => {
      return entitys.map((entity: any) => ({
        ...entity,
        type: type,
      }));
    };

    games.forEach((game: any) => {
      const gamePlatforms = game.platforms.map((platform: any) => ({
        ...platform.platform,
      }));

      entityBases = uniqBy(
        [
          ...entityBases,
          ...addEntityBase(gamePlatforms || [], SchemaType.PLATFORM),
          ...addEntityBase(game.tags || [], SchemaType.TAG),
          ...addEntityBase(game.publishers || [], SchemaType.PUBLISHER),
          ...addEntityBase(game.developers || [], SchemaType.DEVELOPER),
          ...addEntityBase(game.genres || [], SchemaType.GENRE),
          ...addEntityBase(game.esrb_rating ? [game.esrb_rating] : [], SchemaType.ESRB_RATING),
        ],
        item => `${item.id}-${item.type}`,
      );
    });
    const [updatedEntityBases, updatedTrailers, updatedAchievements, updatedScreenshots] =
      await Promise.all([
        this.entityBaseService.upsertMany(entityBases),
        this.trailerService.upsertMany(trailers),
        this.achievementService.upsertMany(achievements),
        this.screenshotService.upsertMany(screenshots),
      ]);

    const updatedGames: GameDocument[] = games.map((game: any) => {
      const minimum_requirements =
        game.platforms.find((platform: any) => platform?.requirements?.minimum)?.requirements
          .minimum || '';
      const recommended_requirements =
        game.platforms.find((platform: any) => platform?.requirements?.recommended)?.requirements
          .recommended || '';
      return {
        ...game,
        minimum_requirements,
        recommended_requirements,
        tags: updatedEntityBases
          .filter(
            (entityBase: any) =>
              entityBase.type === SchemaType.TAG &&
              game.tags.some((tag: any) => tag.id === entityBase.id),
          )
          .map((entityBase: any) => entityBase._id),
        publishers: updatedEntityBases
          .filter(
            (entityBase: any) =>
              entityBase.type === SchemaType.PUBLISHER &&
              game.publishers.some((publisher: any) => publisher.id === entityBase.id),
          )
          .map((entityBase: any) => entityBase._id),
        developers: updatedEntityBases
          .filter(
            (entityBase: any) =>
              entityBase.type === SchemaType.DEVELOPER &&
              game.developers.some((developer: any) => developer.id === entityBase.id),
          )
          .map((entityBase: any) => entityBase._id),
        genres: updatedEntityBases
          .filter(
            (entityBase: any) =>
              entityBase.type === SchemaType.GENRE &&
              game.genres.some((genre: any) => genre.id === entityBase.id),
          )
          .map((entityBase: any) => entityBase._id),
        platforms: updatedEntityBases
          .filter(
            (entityBase: any) =>
              entityBase.type === SchemaType.PLATFORM &&
              game.platforms.some((platform: any) => platform.platform.id === entityBase.id),
          )
          .map((entityBase: any) => entityBase._id),
        esrb_rating: updatedEntityBases.find(
          (entityBase: any) =>
            entityBase.type === SchemaType.ESRB_RATING &&
            game.esrb_rating &&
            game.esrb_rating.id === entityBase.id,
        )?._id,
        trailers: updatedTrailers
          .filter((trailer: any) => trailer.game_id === game.id)
          .map((trailer: any) => trailer._id),
        achievements: updatedAchievements
          .filter((achievement: any) => achievement.game_id === game.id)
          .map((achievement: any) => achievement._id),
        screenshots: updatedScreenshots
          .filter((screenshot: any) => screenshot.game_id === game.id)
          .map((screenshot: any) => screenshot._id),
      };
    });
    return await this.upsertMany(updatedGames);
  }
}
