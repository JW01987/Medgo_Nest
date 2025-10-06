import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { mypageInfoDTO } from './dto/mypage-info.dto';

@Injectable()
export class MypageService {
  constructor(private prisma: PrismaService) {}

  /**
   * 마이페이지 정보 불러오기
   * @param id
   * @returns {message:'정보가 업데이트 되었습니다'}
   */
  async getUserInfoService(id: number) {
    const userData = await this.prisma.member.findUnique({
      where: { id },
    });
    const pharmacyData = await this.prisma.pharmacy.findUnique({
      where: { id },
    });

    if (!userData || !pharmacyData)
      throw new BadRequestException('유저 정보가 없습니다');

    const data: mypageInfoDTO = {
      pharmacyName: pharmacyData.pharmacyName,
      licenseCode: userData.licenseCode,
      address: pharmacyData.address,
      phone: pharmacyData.phone ?? undefined,
      latitude: pharmacyData.latitude,
      longitude: pharmacyData.longitude,
      openTime: pharmacyData.openTime ?? undefined,
      closeTime: pharmacyData.closeTime ?? undefined,
    };
    return data;
  }

  async updateUserInfoService(id: number, body: mypageInfoDTO) {
    const dataToUpdate = {
      pharmacyName: body.pharmacyName,
      address: body.address,
      phone: body.phone ?? null,
      latitude: body.latitude,
      longitude: body.longitude,
      openTime: body.openTime ?? null,
      closeTime: body.closeTime ?? null,
    };
    await this.prisma.pharmacy.update({
      where: { userId: id, deletedAt: null },
      data: dataToUpdate,
    });

    return { message: '정보가 업데이트 되었습니다' };
  }
}
