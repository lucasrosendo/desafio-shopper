import { Global, Module } from '@nestjs/common';
import { PrismaService } from './infra/prisma.service';
import { RideModule } from './v1/ride/ride.module';

@Global()
@Module({
  imports: [RideModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
