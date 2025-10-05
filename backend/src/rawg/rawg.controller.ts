import { Controller } from '@nestjs/common';
import { RawgService } from './rawg.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('rawg')
@Controller('rawg')
export class RawgController {
  constructor(private readonly rawgService: RawgService) {}
}
