import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthRequest } from '../jwt/types/auth-request.type';
import { BoardService } from './board.service';
import { NoticeDTO } from './dto/board.dto';
@ApiTags('Notice API')
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  //TODO:공지사항 등록, 수정, 삭제, 조회(페이징), 고객이 공지사항 조회

  /**
   * 공지사항 조회 (약국)
   * @param req:AuthRequest
   * @returns 공지사항 리스트
   */
  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '공지사항 조회하기 - 약국' })
  @ApiResponse({
    status: 200,
    description: `공지사항 정보`,
  })
  async getNotice(@Req() req) {
    const user = (req as AuthRequest).user;
    return await this.boardService.getNoticeService(user.userId);
  }

  /**
   * 공지사항 등록(약국)
   * @param req
   * @param dto
   * @returns
   */
  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '공지사항 등록하기' })
  @ApiBody({ type: NoticeDTO })
  @ApiResponse({
    status: 200,
    description: `{ message: '공지사항 등록완료 '}`,
  })
  async createNotice(@Req() req, @Body() dto: NoticeDTO) {
    const user = (req as AuthRequest).user;
    return await this.boardService.createNoticeService(user.userId, dto);
  }

  /**
   * 공지사항 수정(약국)
   * @param req:AuthRequest
   * @param dto:NoticeDTO
   * @returns
   */
  @Post('update')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '공지사항 수정하기 - 약국' })
  @ApiBody({ type: NoticeDTO })
  @ApiResponse({
    status: 201,
    description: `{ message: '공지사항 업데이트' }`,
  })
  async updateNotice(@Req() req, @Body() dto: NoticeDTO) {
    const user = (req as AuthRequest).user;
    return await this.boardService.updateNoticeService(user.userId, dto);
  }

  /**
   * 공지사항 삭제(약국)
   * @param req
   * @param noticeId
   * @returns
   */
  @Post('delete')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '공지사항 삭제하기 - 약국' })
  @ApiQuery({
    name: 'noticeId',
    type: Number,
    description: '삭제할 공지사항의 ID',
    example: 1,
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: `{ message: '공지사항 삭제' }`,
  })
  async deleteNotice(@Req() req, @Query('noticeId') noticeId: number) {
    const user = (req as AuthRequest).user;
    return await this.boardService.deleteNoticeService(user.userId, noticeId);
  }
}
