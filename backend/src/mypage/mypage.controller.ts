import { Controller, Get, UseGuards, Req, Post, Body } from '@nestjs/common';
import { MypageService } from './mypage.service';

import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthRequest } from '../common/jwt/types/auth-request.type';
import { MypageInfoDTO } from './dto/mypage-info.dto';

@Controller('mypage')
export class MypageController {
  constructor(private readonly mypageService: MypageService) {}

  /**
   * 마이페이지 정보 불러오기
   * @param req
   * @returns
   */
  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '마이페이지 정보 불러오기' })
  @ApiResponse({
    status: 200,
    description: `회원정보`,
  })
  async getUserInfo(@Req() req): Promise<MypageInfoDTO> {
    const user = (req as AuthRequest).user;
    return await this.mypageService.getUserInfoService(user.userId);
  }

  /**
   *
   * @param req 마이페이지 수정하기
   * @param body
   * @returns
   */
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '마이페이지 정보 수정하기' })
  @ApiResponse({
    status: 201,
    description: `회원정보 업데이트`,
  })
  async updateUserInfo(@Req() req, @Body() body: MypageInfoDTO) {
    const user = (req as AuthRequest).user;
    return await this.mypageService.updateUserInfoService(user.userId, body);
  }
}
