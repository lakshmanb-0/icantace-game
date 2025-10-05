import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Achievement, AchievementDocument } from './achievement.schema';

@Injectable()
export class AchievementService {
  constructor(
    @InjectModel(Achievement.name) private readonly achievementModel: Model<AchievementDocument>,
  ) {}

  async upsertMany(achievements: any[]): Promise<any> {
    await this.achievementModel.bulkWrite(
      achievements.map((achievement: any) => ({
        updateOne: {
          filter: { id: achievement.id },
          update: achievement,
          upsert: true,
        },
      })),
    );

    const updatedDocs = await this.achievementModel
      .find({
        id: { $in: achievements.map((achievement: any) => achievement.id) },
      })
      .lean();

    return updatedDocs.map(doc => ({
      ...doc,
      game_id: achievements.find((a: any) => a.id === doc.id)?.game_id || '',
    }));
  }
}
