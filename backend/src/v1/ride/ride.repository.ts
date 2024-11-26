import { Rides, Driver } from '@prisma/client';
import { PrismaService } from '../../infra/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RideRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createRide(data: {
    customer_id: string;
    origin: string;
    destination: string;
    distance: number;
    duration: string;
    driver: { id: number; name: string };
    value: number;
  }): Promise<Rides> {
    const { driver, ...rideData } = data;
    return this.prisma.rides.create({
      data: {
        ...rideData,
        driver_id: driver.id,
      },
    });
  }

  async findManyRides(customer_id: string, driver_id?: number): Promise<any[]> {
    return this.prisma.rides.findMany({
      where: {
        AND: [
          { customer_id: customer_id },
          { Driver: { driver_id: Number(driver_id) } },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        Driver: true,
      },
    });
  }

  async findDriver(driver_id: number): Promise<Driver> {
    return this.prisma.driver.findFirst({
      where: { driver_id: driver_id },
    });
  }

  async findManyDrivers(): Promise<Driver[]> {
    return this.prisma.driver.findMany();
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
