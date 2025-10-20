import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PasswordDTO {
  @ApiProperty({ description: '비밀번호' })
  @IsString()
  password: string;
}
