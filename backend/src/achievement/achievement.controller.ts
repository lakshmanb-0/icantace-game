import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AchievementService } from './achievement.service';

@ApiTags('achievements')
@Controller('achievement')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}
}
