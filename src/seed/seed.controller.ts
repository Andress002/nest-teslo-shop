import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Message } from 'src/auth/decorators/message.decorator';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) { }

  @Get()
  @Message('Seed ejecutado correctamente')
  executedSeed() {
    return this.seedService.rundSeed();
  }
}
