import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MedicineService } from './medicine.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { MedicineRegistQueryDTO } from './dto/medicineRegist.dto';
import { AuthRequest } from '../common/jwt/types/auth-request.type';
import { MedicineFindAllQueryDTO } from './dto/medicineFindAll.dto';
import { FindPharmacyMedDTO } from './dto/findPharmacyMed.dto';
import { UpdateMedicineDTO } from './dto/updateMedicine.dto';
@ApiTags('Medicine API')
@Controller('medicine')
export class MedicineController {
  constructor(private readonly medicineService: MedicineService) {}

  /**
   * 식약청 등록 의약품 키워드 조회
   * @param {MedicineFindAllQueryDTO} query - 조회할 의약품 정보, 페이지 정보
   */
  @Get('/get-all')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '의약품 등록을 위한 의약품 검색' })
  @ApiResponse({
    status: 201,
    description: `data - 식약청 의약품 검색 결과 리스트, page - 현재 페이지, 
    size - 한 페이지당 데이터 개수, total - 전체 데이터 개수, totalPages - 전체 페이지 수`,
  })
  async getAllMedicine(@Query() query: MedicineFindAllQueryDTO) {
    return await this.medicineService.getAllMedicineService(query);
  }

  /**
   * 식약청 의약품 데이터를 약국의 재고로 등록하기
   * @param {MedicineRegistQueryDTO} query - 조회할 의약품 정보, 페이지 정보
   * @param {AuthRequest} req - 요청 객체 (JWT 토큰을 통해 인증된 사용자 정보 포함)
   */
  @Post('/regist')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '의약품을 약국에 신규 등록' })
  @ApiResponse({
    status: 200,
    description: `{ message: '의약품 등록 완료'}`,
  })
  async registMedicine(@Query() query: MedicineRegistQueryDTO, @Req() req) {
    const { pharmacyId } = (req as AuthRequest).user;
    return await this.medicineService.registMedicineService(
      Number(query.medicineId),
      pharmacyId,
      Number(query.medicineCount),
    );
  }

  /**
   * 약국의 의약품 재고 확인
   * @param {FindPharmacyMedDTO} query - 조회할 의약품의 정보, 페이지 정보
   * @param {AuthRequest} req - 요청 객체 (JWT 토큰을 통해 인증된 사용자의 정보)
   */
  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '약국의 의약품 재고 조회' })
  @ApiResponse({
    status: 201,
    description: `약국의 의약품 재고 리스트`,
  })
  async getMedicine(@Query() query: FindPharmacyMedDTO, @Req() req) {
    const { pharmacyId } = (req as AuthRequest).user;
    return await this.medicineService.getMedicineService(query, pharmacyId);
  }

  /**
   * 약국의 의약품 수량 수정
   * @param {UpdateMedicineDTO} body - 수정할 의약품 정보
   * @param {AuthRequest} req - 요청 객체 (JWT 토큰을 통해 인증된 사용자 정보 포함)
   */
  @Post('/update-qty')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '약국의 의약품 수량 변경' })
  @ApiResponse({
    status: 201,
    description: `{ message: '의약품 수량 변경 완료' }`,
  })
  async updateMedicine(@Body() body: UpdateMedicineDTO, @Req() req) {
    const { pharmacyId } = (req as AuthRequest).user;
    return await this.medicineService.updateMedicineService(
      body.medicineId,
      body.count,
      pharmacyId,
    );
  }

  /**
   * 약국의 의약품 삭제
   * @param {number} medicineId - 삭제할 의약품의 ID
   * @param {AuthRequest} req - 요청 객체 (JWT 토큰을 통해 인증된 사용자 정보 포함)
   */
  @Post('/delete')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '약국의 의약품 삭제' })
  @ApiResponse({
    status: 201,
    description: `{ message: '의약품 삭제 완료' }`,
  })
  async deleteMedicine(@Query('medicine-id') medicineId: number, @Req() req) {
    const { pharmacyId } = (req as AuthRequest).user;
    return await this.medicineService.deleteMedicineService(
      medicineId,
      pharmacyId,
    );
  }
}
