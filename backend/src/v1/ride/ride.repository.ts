import { Prisma, Rides, Driver } from '@prisma/client';
import { PrismaService } from '../../infra/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RideRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createRide(data: Prisma.RidesCreateInput): Promise<Rides> {
    return this.prisma.rides.create({ data });
  }

  async findManyRides(customer_id: number): Promise<Rides[]> {
    return this.prisma.rides.findMany({ where: { customer_id } });
  }

  async findDriver(driver_id: number): Promise<Driver> {
    return this.prisma.driver.findUnique({
      where: { driver_id: driver_id },
    });
  }

  async findDriversByDistance(minKm: number): Promise<Driver[]> {
    return this.prisma.driver.findMany({
      where: {
        minKm: {
          lte: minKm,
        },
      },
      orderBy: {
        minKm: 'asc',
      },
    });
  }
}
