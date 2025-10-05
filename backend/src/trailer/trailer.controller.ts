import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TrailerService } from './trailer.service';

@ApiTags('trailers')
@Controller('trailer')
export class TrailerController {
  constructor(private readonly trailerService: TrailerService) {}
}
