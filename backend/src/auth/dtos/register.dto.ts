import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString } from 'class-validator';

export class RegisterDTO {
  @ApiProperty({ type: String, description: '약국 이름' })
  @IsString()
  name: string;

  @ApiProperty({ type: String, description: '이메일 주소' })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, description: '비밀번호' })
  @IsString()
  password: string;

  @ApiProperty({ type: String, description: '위도' })
  @IsNumber()
  latitude: number;

  @ApiProperty({ type: String, description: '경도' })
  @IsNumber()
  longitude: number;

  @ApiProperty({ type: String, description: '약국 주소' })
  @IsString()
  address: string;

  @ApiProperty({ type: String, description: '약사 면허 번호' })
  @IsString()
  licenseCode: string;
}
