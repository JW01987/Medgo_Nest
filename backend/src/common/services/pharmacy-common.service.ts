import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class PharmacyCommonService {
  constructor(private prisma: PrismaService) {}

  /**
   * userId로 약국 찾기
   * @param userId
   * @returns 약국의 정보
   */
  async findPharmacyIdByUserId(userId: number) {
    const pharmacy = await this.prisma.pharmacy.findFirst({
      where: { userId, deletedAt: null },
      select: { id: true },
    });

    if (!pharmacy) {
      throw new Error('약국을 찾을 수 없습니다.');
    }

    return pharmacy;
  }
}
