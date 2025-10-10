import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class NoticeDTO {
  @ApiProperty({ description: '공지사항 아이디' })
  @IsNumber()
  @IsOptional()
  noticeId?: number;

  @ApiProperty({ description: '공지사항 제목' })
  @IsString()
  title: string;

  @ApiProperty({ description: '공지사항 내용' })
  @IsString()
  content: string;

  @ApiProperty({ description: '공지사항 생성일' })
  @IsDate()
  @IsOptional()
  createdAt?: Date;
}
