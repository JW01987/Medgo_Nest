import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class mypageInfoDTO {
  @ApiProperty({ description: '약국 이름' })
  @IsString()
  pharmacyName: string;

  @ApiProperty({ description: '면허번호' })
  @IsString()
  licenseCode: string;

  @ApiProperty({ description: '약국 주소' })
  @IsString()
  address: string;

  @ApiProperty({ description: '약국 연락처' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: '위도' })
  @IsNumber()
  latitude: number;

  @ApiProperty({ description: '경도' })
  @IsNumber()
  longitude: number;

  @ApiProperty({ description: '영업 시작 시각' })
  @IsString()
  @IsOptional()
  openTime?: string;

  @ApiProperty({ description: '영업 종료 시각' })
  @IsString()
  @IsOptional()
  closeTime?: string;
}
