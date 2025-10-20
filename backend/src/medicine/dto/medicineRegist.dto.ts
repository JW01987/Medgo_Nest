import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class MedicineRegistQueryDTO {
  @ApiPropertyOptional({
    description: '의약품 아이디',
    example: 1,
  })
  @IsNumberString()
  medicineId: string;

  @ApiPropertyOptional({
    description: '의약품 갯수',
    example: 10,
  })
  @IsNumberString()
  medicineCount: string;
}
