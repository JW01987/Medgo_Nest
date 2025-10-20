import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateMedicineDTO {
  @ApiPropertyOptional({
    description: '변경할 의약품 아이디',
    example: 1,
  })
  @IsNumber()
  medicineId: number;

  @ApiPropertyOptional({
    description: '변경할 의약품 수량',
    example: 1,
  })
  @IsNumber()
  count: number;
}
