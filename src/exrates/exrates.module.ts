import { ExratesGateway } from './exrates.gateway';
import { Module } from '@nestjs/common';

@Module({
  providers: [ExratesGateway],
  exports: [ExratesGateway],
})
export class ExratesModule {}
