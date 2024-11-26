import { Body, Controller, Patch, Post, Get, Query } from '@nestjs/common';
import { RideService } from './ride.service';
import { ConfirmRide } from './interfaces';

@Controller('ride')
export class RideController {
  constructor(private readonly rideService: RideService) {}

  @Post('estimate')
  async estimateRide(
    @Body('origin') origin: string,
    @Body('destination') destination: string,
    @Body('customer_id') customer_id: number,
  ) {
    return this.rideService.estimateRide(origin, destination, customer_id);
  }
  @Get()
  async findManyRides(
    @Query('customer_id') customer_id: string,
    @Query('driver_id') driver_id: number,
  ) {
    return this.rideService.findManyRides(customer_id, driver_id);
  }

  @Patch('confirm')
  async findDriver(@Body() data: ConfirmRide) {
    return this.rideService.createRide(data);
  }
}
