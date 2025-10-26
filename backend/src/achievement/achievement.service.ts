import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model } from 'mongoose';
import { Achievement, AchievementDocument } from './achievement.schema';

@Injectable()
export class AchievementService {
  constructor(
    @InjectModel(Achievement.name) private readonly achievementModel: Model<AchievementDocument>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async upsertMany(achievements: any[], session: ClientSession): Promise<any> {
    await this.achievementModel.bulkWrite(
      achievements.map((achievement: any) => ({
        updateOne: {
          filter: { id: achievement.id },
          update: achievement,
          upsert: true,
        },
      })),
      { session },
    );

    const updatedDocs = await this.achievementModel
      .find({
        id: { $in: achievements.map((achievement: any) => achievement.id) },
      })
      .session(session)
      .lean();

    return updatedDocs.map(doc => ({
      ...doc,
      game_id: achievements.find((a: any) => a.id === doc.id)?.game_id || '',
    }));
  }
}
