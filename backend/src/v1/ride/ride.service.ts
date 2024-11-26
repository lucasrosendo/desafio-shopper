import { Inject, Injectable } from '@nestjs/common';
import { RideRepository } from './ride.repository';
import { Driver } from '@prisma/client';
import { CustomException } from '../../utils/custom-exceptions';
import { ConfirmRide } from './interfaces';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../.env' });
@Injectable()
export class RideService {
  constructor(
    @Inject('RideRepositoryProvider')
    private readonly rideRepository: RideRepository,
  ) {}

  async createRide(data: ConfirmRide): Promise<any> {
    if (!data.customer_id) {
      throw new CustomException({
        error_description: 'Customer ID is required',
        error_code: 'INVALID_DATA',
        status: 400,
      });
    }
    if (!data.origin) {
      throw new CustomException({
        error_description: 'Origin is required',
        error_code: 'INVALID_DATA',
        status: 400,
      });
    }
    if (!data.destination) {
      throw new CustomException({
        error_description: 'Destination is required',
        error_code: 'INVALID_DATA',
        status: 400,
      });
    }
    if (data.origin === data.destination) {
      throw new CustomException({
        error_description: 'Origin and destination cannot be the same',
        error_code: 'INVALID_DATA',
        status: 400,
      });
    }
    const existDriver = this.findDriver(data.driver.id);
    if (!existDriver) {
      throw new CustomException({
        error_description: 'Motorista não encontrado',
        error_code: 'INVALID_DATA',
        status: 404,
      });
    }
    if ((await existDriver).minKm >= data.distance) {
      throw new CustomException({
        error_description: 'Driver is too far',
        error_code: 'INVALID_DISTANCE',
        status: 406,
      });
    }
    await this.rideRepository.createRide(data);
    const createResponse = {
      description: 'Operação realizada com sucesso',
      response: {
        sucsses: true,
      },
    };
    return createResponse;
  }

  async findManyRides(
    customer_id: string,
    driver_id?: number,
  ): Promise<{ customer_id: string; rides: any[] }> {
    if (!customer_id) {
      throw new CustomException({
        error_description: 'Nenhum registro encontrado',
        error_code: 'NO_RIDES_FOUND',
        status: 400,
      });
    }
    const driverExist = this.findDriver(driver_id);
    if (!driverExist) {
      throw new CustomException({
        error_description: 'Motorista invalido',
        error_code: 'INVALID_DATA',
        status: 404,
      });
    }
    const responseRides = await this.rideRepository.findManyRides(
      customer_id,
      driver_id ? Number(driver_id) : undefined,
    );

    const formattedRides = responseRides.map((ride) => ({
      id: ride.ride_id,
      customer_id: ride.customer_id,
      origin: ride.origin,
      destination: ride.destination,
      distance: ride.distance,
      duration: ride.duration,
      driver: {
        id: ride.Driver.driver_id,
        name: ride.Driver.name,
      },
      value: ride.value,
    }));
    return {
      customer_id: customer_id,
      rides: formattedRides,
    };
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
        error_description: 'Origin and destination are required',
        error_code: 'INVALID_DATA',
        status: 400,
      });
    }
    if (origin === destination) {
      throw new CustomException({
        error_description: 'Origin and destination cannot be the same',
        error_code: 'INVALID_DATA',
        status: 400,
      });
    }
    if (!customer_id) {
      throw new CustomException({
        error_description: 'Customer ID is required',
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
