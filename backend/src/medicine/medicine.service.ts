import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MedicineFindAllQueryDTO } from './dto/medicineFindAll.dto';
import { FindPharmacyMedDTO } from './dto/findPharmacyMed.dto';
@Injectable()
export class MedicineService {
  constructor(private prisma: PrismaService) {}

  /**
   * 식약청 등록 의약품 키워드 조회
   * @param {MedicineFindAllQueryDTO} query - 조회할 의약품 정보, 페이지 정보
   */
  async getAllMedicineService(dto: MedicineFindAllQueryDTO) {
    const page = parseInt(dto.page ?? '1');
    const size = parseInt(dto.size ?? '10');
    const skip = (page - 1) * size;

    const medicines = await this.prisma.medicine.findMany({
      where: {
        productName: {
          contains: dto.keyword,
        },
      },
      orderBy: {
        productName: dto.order ?? 'asc',
      },
      skip,
      take: size,
    });

    const total = await this.prisma.medicine.count({
      where: {
        productName: {
          contains: dto.keyword,
        },
      },
    });

    return {
      data: medicines,
      page,
      size,
      total,
      totalPages: Math.ceil(total / size),
    };
  }

  /**
   * 식약청 의약품 데이터를 약국의 재고로 등록하기
   * @param {number} medicineId - 등록할 의약품 아이디
   * @param {number} pharmacyId - 약국 아이디
   * @param {number} medCount - 의약품 갯수
   */
  async registMedicineService(
    medicineId: number,
    pharmacyId: number,
    medCount: number,
  ) {
    const isExist = await this.prisma.pharmacyStock.count({
      where: { pharmacyId, medicineId },
    });

    if (isExist > 0) {
      return { message: '이미 등록된 의약품입니다.' };
    }

    await this.prisma.pharmacyStock.create({
      data: {
        pharmacyId,
        medicineId,
        medCount,
      },
    });

    return { message: '의약품 등록 완료' };
  }

  /**
   * 약국의 의약품 재고 확인
   * @param {FindPharmacyMedDTO} query - 조회할 페이지 정보
   * @param {number} pharmacyId - 약국의 아이디
   */
  async getMedicineService(dto: FindPharmacyMedDTO, pharmacyId: number) {
    const page = dto.page ?? 1;
    const size = dto.size ?? 10;
    const skip = (page - 1) * size;

    const medicines = await this.prisma.pharmacyStock.findMany({
      where: { pharmacyId },
      skip,
      take: size,
    });

    const total = await this.prisma.medicine.count({
      where: {
        productName: {
          contains: dto.keyword,
        },
      },
    });

    return {
      data: medicines,
      page,
      size,
      total,
      totalPages: Math.ceil(total / size),
    };
  }

  /**
   * 약국의 의약품 수량 수정
   * @param {number} medicineId - 수정할 의약품 아이디
   * @param {number} medCount - 수정할 의약품 갯수
   * @param {number} pharmacyId - 약국 아이디
   */
  async updateMedicineService(
    medicineId: number,
    medCount: number,
    pharmacyId: number,
  ) {
    await this.prisma.pharmacyStock.update({
      where: {
        medicineId_pharmacyId: {
          medicineId,
          pharmacyId,
        },
      },
      data: { medCount },
    });

    return { message: '의약품 수량 변경 완료' };
  }

  /**
   * 약국의 의약품 삭제
   * @param {number} medicineId - 삭제할 의약품의 ID
   * @param {number} pharmacyId - 약국 아이디
   */
  async deleteMedicineService(medicineId: number, pharmacyId: number) {
    await this.prisma.pharmacyStock.delete({
      where: {
        medicineId_pharmacyId: {
          medicineId: medicineId,
          pharmacyId: pharmacyId,
        },
      },
    });

    return { message: '의약품 삭제 완료' };
  }
}
