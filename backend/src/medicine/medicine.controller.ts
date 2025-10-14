import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { MedicineService } from './medicine.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { medicineRegistQueryDTO } from './dto/medicineRegist.dto';
import { AuthRequest } from '../common/jwt/types/auth-request.type';
@ApiTags('Medicine API')
@Controller('medicine')
export class MedicineController {
  constructor(private readonly medicineService: MedicineService) {}

  // 의약품 등록을 위한 의약품 검색
  @Get('/new')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '공지사항 조회하기 - 약국' })
  @ApiResponse({
    status: 200,
    description: `공지사항 정보`,
  })
  async registDrug(@Query() query: medicineRegistQueryDTO, @Req() req) {
    const user = (req as AuthRequest).user;
    return await this.medicineService.registDrugService(user.userId, query);
  }
}
