// import { Prisma } from '@prisma/client';

export interface RideEntity {
  ride_id: string;
  driver_id: string;
  customer_id: string;
  origin: string;
  destination: string;
  distance: number;
  duration: number;
  value: number;
}

export interface DriverEntity {
  driver_id: string;
  name: string;
  description: string;
  car: string;
  rating: number;
  rate: number;
  minKm: number;
}

export interface ConfirmRide {
  customer_id: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver: { id: number; name: string };
  value: number;
}
