import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResetPasswordDTO {
  @ApiProperty({ description: '비밀번호 재설정 토큰' })
  @IsString()
  token: string;

  @ApiProperty({ description: '새 비밀번호' })
  @IsString()
  newPassword: string;
}
