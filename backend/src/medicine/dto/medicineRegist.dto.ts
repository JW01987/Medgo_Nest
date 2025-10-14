import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn, IsNumberString } from 'class-validator';

export class medicineRegistQueryDTO {
  @ApiPropertyOptional({
    description: '현재 페이지 (기본값: 1)',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({
    description: '한 페이지당 표시할 데이터 개수 (기본값: 10)',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @IsNumberString()
  size?: string;

  @ApiPropertyOptional({
    description: '검색 키워드',
    example: '아스피린',
  })
  @IsString()
  keyword: string;

  @ApiPropertyOptional({
    description: '정렬 순서 (asc 또는 desc)',
    example: 'asc',
    default: 'asc',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';
}
