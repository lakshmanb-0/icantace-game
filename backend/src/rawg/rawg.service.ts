import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RawgService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiKey = this.configService.get<string>('RAWG_API_KEY');
    this.baseUrl = this.configService.get<string>('RAWG_BASE_URL');
    if (!this.apiKey) {
      console.warn('RAWG_API_KEY is not defined in environment variables');
    }
  }

  async getGame(id: number) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/games/${id}`, {
          params: {
            key: this.apiKey,
          },
        }),
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch game from RAWG API', error);
      throw new HttpException(
        'Failed to fetch game from RAWG API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getGames(page: number = 1, page_size: number = 40) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/games`, {
          params: {
            key: this.apiKey,
            page: page,
            page_size: page_size,
          },
        }),
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch games from RAWG API', error);
      throw new HttpException(
        'Failed to fetch games from RAWG API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getTrailers(id: number, page_size: number = 40) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/games/${id}/movies`, {
          params: {
            key: this.apiKey,
            page_size: page_size,
          },
        }),
      );
      const trailers = response.data;

      const count = trailers.count;
      const pages = Math.ceil(count / page_size);
      const promises = [];
      for (let i = 2; i <= pages; i++) {
        promises.push(
          firstValueFrom(
            this.httpService.get(`${this.baseUrl}/games/${id}/movies`, {
              params: {
                key: this.apiKey,
                page: i,
                page_size: page_size,
              },
            }),
          ),
        );
      }

      const otherTrailers = (await Promise.all(promises)).flatMap(
        (trailer: any) => trailer.data.results,
      );

      const trailersData = trailers.results.concat(otherTrailers).map((trailer: any) => ({
        ...trailer,
        game_id: id,
        minResolution: trailer?.data?.[480] || '',
        maxResolution: trailer?.data?.max || '',
      }));
      return trailersData;
    } catch (error) {
      console.error('Failed to fetch trailers from RAWG API', error);
      throw new HttpException(
        'Failed to fetch trailers from RAWG API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAchievements(id: number, page_size: number = 40) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/games/${id}/achievements`, {
          params: {
            key: this.apiKey,
            page_size: page_size,
          },
        }),
      );
      const achievements = response.data;

      const count = achievements.count;
      const pages = Math.ceil(count / page_size);
      const promises = [];
      for (let i = 2; i <= pages; i++) {
        promises.push(
          firstValueFrom(
            this.httpService.get(`${this.baseUrl}/games/${id}/achievements`, {
              params: {
                key: this.apiKey,
                page: i,
                page_size: page_size,
              },
            }),
          ),
        );
      }

      const otherAchievements = (await Promise.all(promises)).flatMap(
        (achievement: any) => achievement.data.results,
      );
      const achievementsData = achievements.results
        .concat(otherAchievements)
        .map((achievement: any) => ({
          ...achievement,
          game_id: id,
        }));
      return achievementsData;
    } catch (error) {
      console.error('Failed to fetch achievements from RAWG API', error);
      throw new HttpException(
        'Failed to fetch achievements from RAWG API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getScreenshots(id: number, page_size: number = 40) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/games/${id}/screenshots`, {
          params: {
            key: this.apiKey,
            page_size: page_size,
          },
        }),
      );
      const screenshots = response.data;

      const count = screenshots.count;
      const pages = Math.ceil(count / page_size);
      const promises = [];
      for (let i = 2; i <= pages; i++) {
        promises.push(
          firstValueFrom(
            this.httpService.get(`${this.baseUrl}/games/${id}/screenshots`, {
              params: {
                key: this.apiKey,
                page: i,
                page_size: page_size,
              },
            }),
          ),
        );
      }

      const otherScreenshots = (await Promise.all(promises)).flatMap(
        (screenshot: any) => screenshot.data.results,
      );
      const screenshotsData = screenshots.results
        .concat(otherScreenshots)
        .map((screenshot: any) => ({
          ...screenshot,
          game_id: id,
        }));
      return screenshotsData;
    } catch (error) {
      console.error('Failed to fetch screenshots from RAWG API', error);
      throw new HttpException(
        'Failed to fetch screenshots from RAWG API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCreators(id: number, page_size: number = 40) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/games/${id}/development-team`, {
          params: {
            key: this.apiKey,
            page_size: page_size,
          },
        }),
      );
      const creators = response.data;

      const count = creators.count;
      const pages = Math.ceil(count / page_size);
      const promises = [];
      for (let i = 2; i <= pages; i++) {
        promises.push(
          firstValueFrom(
            this.httpService.get(`${this.baseUrl}/games/${id}/development-team`, {
              params: { key: this.apiKey, page: i, page_size: page_size },
            }),
          ),
        );
      }
      const otherCreators = (await Promise.all(promises)).flatMap(
        (creator: any) => creator.data.results,
      );
      const creatorsData = creators.results.concat(otherCreators).map((creator: any) => ({
        ...creator,
        game_id: id,
        positions: creator?.positions?.map((result: any) => result.name) || [],
        image_background: creator?.image || '',
      }));
      return creatorsData;
    } catch (error) {
      console.error('Failed to fetch creators from RAWG API', error);
      throw new HttpException(
        'Failed to fetch creators from RAWG API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
