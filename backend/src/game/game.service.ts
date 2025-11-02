import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { groupBy, uniqBy } from 'lodash';
import { ClientSession, Connection, Model } from 'mongoose';
import { AchievementService } from 'src/achievement/achievement.service';
import { EntityBaseService } from 'src/entity-base/entity-base.service';
import { SchemaType } from 'src/enum';
import { RawgService } from 'src/rawg/rawg.service';
import { ScreenshotService } from 'src/screenshot/screenshot.service';
import { TrailerService } from 'src/trailer/trailer.service';
import { CreateGameDto } from './dto/create-game.dto';
import { Game, GameDocument } from './schema/game.schema';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game.name) private readonly gameModel: Model<GameDocument>,
    private readonly entityBaseService: EntityBaseService,
    private readonly rawgService: RawgService,
    private readonly trailerService: TrailerService,
    private readonly achievementService: AchievementService,
    private readonly screenshotService: ScreenshotService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async createGame(game: CreateGameDto): Promise<GameDocument> {
    return await this.gameModel.findOneAndUpdate(
      { rawg_id: game.id },
      { ...game, rawg_id: game.id },
      { new: true, upsert: true },
    );
  }

  async upsertMany(games: any[], session: ClientSession): Promise<any> {
    return await this.gameModel.bulkWrite(
      games.map((game: any) => ({
        updateOne: {
          filter: { id: game.id },
          update: game,
          upsert: true,
        },
      })),
      { session },
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

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      // get all game ids
      const gameIds = response.results.map((i: any) => i.id);

      const gamePromises = [];
      const trailerPromises = [];
      const achievementPromises = [];
      const screenshotPromises = [];
      const creatorPromises = [];
      for (const gameId of gameIds) {
        gamePromises.push(this.rawgService.getGame(gameId));
        trailerPromises.push(this.rawgService.getTrailers(gameId));
        achievementPromises.push(this.rawgService.getAchievements(gameId));
        screenshotPromises.push(this.rawgService.getScreenshots(gameId));
        creatorPromises.push(this.rawgService.getCreators(gameId));
      }

      // get all games data from rawg api
      const games = (await Promise.all(gamePromises)).filter(Boolean);
      const trailers = (await Promise.all(trailerPromises)).flat().filter(Boolean);
      const achievements = (await Promise.all(achievementPromises)).flat().filter(Boolean);
      const screenshots = (await Promise.all(screenshotPromises)).flat().filter(Boolean);
      const creators = (await Promise.all(creatorPromises)).flat().filter(Boolean);
      let entityBases = [];
      const creatorsByGameId: Record<string, any[]> = groupBy(creators, 'game_id');

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

        const creators = creatorsByGameId[game.id] || [];
        const creatorsData = creators.map((creator: any) => ({
          ...creator,
          type: SchemaType.CREATOR,
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
            ...addEntityBase(creatorsData, SchemaType.CREATOR),
          ],
          item => `${item.id}-${item.type}`,
        );
      });

      // upsert all data
      const updatedEntityBases = await this.entityBaseService.upsertMany(entityBases, session);
      const updatedTrailers = await this.trailerService.upsertMany(trailers, session);
      const updatedScreenshots = await this.screenshotService.upsertMany(screenshots, session);
      const updatedAchievements = await this.achievementService.upsertMany(achievements, session);

      // lockup maps
      const entityBasesByTypeId: Map<string, string> = new Map(
        updatedEntityBases.map((entityBase: any) => [
          `${entityBase.type}-${entityBase.id}`,
          entityBase._id,
        ]),
      );
      const screenshotsByGameId: Record<string, any[]> = groupBy(updatedScreenshots, 'game_id');
      const achievementsByGameId: Record<string, any[]> = groupBy(updatedAchievements, 'game_id');
      const trailersByGameId: Record<string, any[]> = groupBy(updatedTrailers, 'game_id');

      // map games with updated data
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
          tags: game.tags
            .map((tag: any) => entityBasesByTypeId.get(`${SchemaType.TAG}-${tag.id}`))
            .filter(Boolean),
          publishers: game.publishers
            .map((publisher: any) =>
              entityBasesByTypeId.get(`${SchemaType.PUBLISHER}-${publisher.id}`),
            )
            .filter(Boolean),
          developers: game.developers
            .map((developer: any) =>
              entityBasesByTypeId.get(`${SchemaType.DEVELOPER}-${developer.id}`),
            )
            .filter(Boolean),
          genres: game.genres
            .map((genre: any) => entityBasesByTypeId.get(`${SchemaType.GENRE}-${genre.id}`))
            .filter(Boolean),
          platforms: game.platforms
            .map((platform: any) =>
              entityBasesByTypeId.get(`${SchemaType.PLATFORM}-${platform.platform.id}`),
            )
            .filter(Boolean),
          esrb_rating:
            entityBasesByTypeId.get(`${SchemaType.ESRB_RATING}-${game.esrb_rating?.id}`) ?? null,

          trailers: (trailersByGameId[game.id] || []).map((trailer: any) => trailer._id),
          achievements: (achievementsByGameId[game.id] || []).map(
            (achievement: any) => achievement._id,
          ),
          screenshots: (screenshotsByGameId[game.id] || []).map(
            (screenshot: any) => screenshot._id,
          ),
          creators: creators
            .map((creator: any) => entityBasesByTypeId.get(`${SchemaType.CREATOR}-${creator.id}`))
            .filter(Boolean),
        };
      });
      const result = await this.upsertMany(updatedGames, session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      console.error('Failed to upsert games', error);
      await session.abortTransaction();
      return error;
    } finally {
      await session.endSession();
    }
  }
}
