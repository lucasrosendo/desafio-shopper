import { Provider } from '@nestjs/common';
import { RideRepository } from './ride.repository';

export const RideRepositoryProvider: Provider = {
  provide: 'RideRepositoryProvider',
  useClass: RideRepository,
};
