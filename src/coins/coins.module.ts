import { Module } from '@nestjs/common';
import { CoinsService } from './coins.service';

@Module({
  imports: [],
  providers: [CoinsService],
})
export class CoinsModule {}
