import { Controller, Post, Query } from '@nestjs/common';
import { RideService } from './ride.service';

@Controller('ride')
export class RideController {
  constructor(private readonly rideService: RideService) {}

  @Post('estimate')
  async estimateRide(
    @Query('origin') origin: string,
    @Query('destination') destination: string,
    @Query('customer_id') customer_id: number,
  ) {
    return this.rideService.estimateRide(origin, destination, customer_id);
  }
  // @Get()
  // async findManyRides() {
  //   return this.rideService.findManyRides();
  // }

  // @Patch()
  // async findDriver() {
  //   return this.rideService.findDriver();
  // }
}
