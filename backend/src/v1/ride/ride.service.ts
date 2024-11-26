import { Inject, Injectable } from '@nestjs/common';
import { RideRepository } from './ride.repository';
import { Prisma, Driver, Rides } from '@prisma/client';
import { CustomException } from '../../utils/custom-exceptions';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../.env' });
@Injectable()
export class RideService {
  constructor(
    @Inject('RideRepositoryProvider')
    private readonly rideRepository: RideRepository,
  ) {}

  async createRide(data: Prisma.RidesCreateInput): Promise<Rides> {
    return this.rideRepository.createRide(data);
  }

  async findManyRides(customer_id: number): Promise<Rides[]> {
    return this.rideRepository.findManyRides(customer_id);
  }

  async findDriver(driver_id: number): Promise<Driver> {
    return this.rideRepository.findDriver(driver_id);
  }

  async findDriversByDistance(minKm: number): Promise<Driver[]> {
    return this.rideRepository.findDriversByDistance(minKm);
  }

  async estimateRide(origin: string, destination: string, customer_id: number) {
    if (!origin || !destination) {
      throw new CustomException({
        message: 'Origin and destination are required',
        error_code: 'INVALID_DATA',
        status: 400,
      });
    }
    if (origin === destination) {
      throw new CustomException({
        message: 'Origin and destination cannot be the same',
        error_code: 'INVALID_DATA',
        status: 400,
      });
    }
    if (!customer_id) {
      throw new CustomException({
        message: 'Customer ID is required',
        error_code: 'INVALID_DATA',
        status: 400,
      });
    }

    const googleRouteResponse = await fetch(
      'https://routes.googleapis.com/directions/v2:computeRoutes',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': process.env.GOOGLE_API_KEY,
          'X-Goog-FieldMask': '*',
        },
        body: JSON.stringify({
          origin: {
            placeId: origin,
          },
          destination: {
            placeId: destination,
          },
          travelMode: 'DRIVE',
          routingPreference: 'TRAFFIC_AWARE',
          computeAlternativeRoutes: false,
          routeModifiers: {
            avoidTolls: false,
            avoidHighways: false,
            avoidFerries: false,
          },
          regionCode: 'pt-BR',
        }),
      },
    );

    const dataGoogle = await googleRouteResponse.json();
    const dataResponse = dataGoogle.routes[0];
    const distanceMeters = dataResponse.distanceMeters;

    const Drivers = await this.findDriversByDistance(distanceMeters);

    const responseEstimateRide = {
      descripiton: 'Operação realizada com sucesso',
      response: {
        origin: {
          latitude: dataResponse.viewport.low.latitude,
          longitude: dataResponse.viewport.low.longitude,
        },
        destination: {
          latitude: dataResponse.viewport.high.latitude,
          longitude: dataResponse.viewport.high.longitude,
        },
        distance: dataResponse.localizedValues.distance.text,
        duration: dataResponse.localizedValues.duration.text,
        options: [
          Drivers.map((driver) => {
            return {
              id: driver.driver_id,
              name: driver.name,
              description: driver.description,
              vehicle: driver.car,
              review: {
                rating: driver.rating,
                comment: driver.comment,
              },
              value: (driver.rate * (distanceMeters / 1000)).toFixed(2),
            };
          }),
        ],
        routeResponse: dataGoogle,
      },
    };
    return responseEstimateRide;
  }
}
