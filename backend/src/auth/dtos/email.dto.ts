import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class EmailDto {
  @ApiProperty({ description: '이메일 주소' })
  @IsEmail()
  email: string;
}
