import { Module } from '@nestjs/common';
import { PharmacyCommonService } from './services/pharmacy-common.service';

@Module({
  controllers: [],
  providers: [PharmacyCommonService],
})
export class CommonMoudle {}
