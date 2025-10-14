import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NoticeDTO } from './dto/board.dto';
import { PharmacyCommonService } from '../common/services/pharmacy-common.service';

@Injectable()
export class BoardService {
  constructor(
    private prisma: PrismaService,
    private commonService: PharmacyCommonService,
  ) {}

  /**
   * 공지사항 조회
   * @param userId:number
   * @returns 공지사항 리스트
   */
  async getNoticeService(pharmacyId: number) {
    const notices: NoticeDTO[] = await this.prisma.pharmacyBoard.findMany({
      where: { pharmacyId },
      select: { id: true, title: true, content: true, createdAt: true },
    });

    return notices;
  }

  /**
   * 공지사항 등록
   * @param userId:number
   * @param dto:NoticeDTO
   * @returns
   */
  async createNoticeService(pharmacyId: number, dto: NoticeDTO) {
    await this.prisma.pharmacyBoard.create({
      data: {
        pharmacyId,
        title: dto.title,
        content: dto.content,
        createdAt: new Date(),
      },
    });

    return { message: '공지사항 등록완료' };
  }

  /**
   * 공지사항 수정
   * @param userId:number
   * @param dto:NoticeDTO
   * @returns
   */
  async updateNoticeService(pharmacyId: number, dto: NoticeDTO) {
    if (!dto.noticeId) {
      throw new Error('공지사항 아이디가 필요합니다.');
    }

    await this.findNoticeByPharmacyId(pharmacyId, dto.noticeId);
    await this.prisma.pharmacyBoard.update({
      where: { id: dto.noticeId },
      data: {
        title: dto.title,
        content: dto.content,
      },
    });

    return { message: '공지사항 업데이트' };
  }
  /**
   * 공지사항 삭제
   * @param userId:number
   * @param noticeId:number
   * @returns { message: '공지사항 삭제' }
   */
  async deleteNoticeService(pharmacyId: number, noticeId: number) {
    await this.findNoticeByPharmacyId(pharmacyId, noticeId);

    await this.prisma.pharmacyBoard.delete({
      where: { id: noticeId },
    });

    return { message: '공지사항 삭제' };
  }

  /**
   * 약국ID와 공지사항ID로 공지사항 찾기
   * @param pharmacyId
   * @param noticeId
   * @returns 공지사항 정보
   */
  async findNoticeByPharmacyId(pharmacyId: number, noticeId: number) {
    const notice = await this.prisma.pharmacyBoard.findFirst({
      where: { id: noticeId, pharmacyId },
    });

    if (!notice) {
      throw new Error('공지사항을 찾을 수 없습니다.');
    }

    return notice;
  }
}
