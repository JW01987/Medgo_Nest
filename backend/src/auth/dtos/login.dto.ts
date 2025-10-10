import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDTO {
  @ApiProperty({
    type: String,
    description: '이메일 주소',
    example: 'jeanmiles@naver.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: '비밀번호',
    example: '123',
  })
  @IsString()
  password: string;
}
