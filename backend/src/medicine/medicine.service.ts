import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { medicineRegistQueryDTO } from './dto/medicineRegist.dto';
import { PharmacyCommonService } from '../common/services/pharmacy-common.service';

@Injectable()
export class MedicineService {
  constructor(
    private prisma: PrismaService,
    private commonService: PharmacyCommonService,
  ) {}

  async registDrugService(id: number, query: medicineRegistQueryDTO) {
    //키워드가 있으면 키워드로 검색
    //페이징은 전체 갯수/10(10개씩 보여주는게 디폴드)
    await this.commonService.findPharmacyIdByUserId(id);
  }
}
