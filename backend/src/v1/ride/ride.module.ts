import { RideRepositoryProvider } from './ride.provider';
import { RideService } from './ride.service';
import { RideController } from './ride.controller';
import { Module } from '@nestjs/common';

@Module({
  providers: [RideRepositoryProvider, RideService],
  controllers: [RideController],
})
export class RideModule {}
