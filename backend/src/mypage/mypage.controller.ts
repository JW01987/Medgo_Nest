import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MypageService } from './mypage.service';
import { CreateMypageDto } from './dto/create-mypage.dto';
import { UpdateMypageDto } from './dto/update-mypage.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('mypage')
export class MypageController {
  constructor(private readonly mypageService: MypageService) {}

  //TODO: 마이페이지 수정,.... 정보 불러오기
  @Get('')
  @ApiOperation({ summary: '마이페이지 정보 불러오기' })
  @ApiResponse({
    status: 200,
    description: `회원정보`,
  })
  async getUserInfo(@Query('token') token: string) {
    return await this.mypageService.getUserInfoService(token);
  }

  @Get()
  findAll() {
    return this.mypageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mypageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMypageDto: UpdateMypageDto) {
    return this.mypageService.update(+id, updateMypageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mypageService.remove(+id);
  }
}
