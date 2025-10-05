import { Controller } from '@nestjs/common';
import { EntityBaseService } from './entity-base.service';

@Controller('entity-base')
export class EntityBaseController {
  constructor(private readonly entityBaseService: EntityBaseService) {}
}
