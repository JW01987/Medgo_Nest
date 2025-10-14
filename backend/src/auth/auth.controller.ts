import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dtos/register.dto';
import { LoginDTO } from './dtos/login.dto';
import { EmailDto } from './dtos/email.dto';
import { PasswordDTO } from './dtos/psw.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthRequest } from '../common/jwt/types/auth-request.type';

//--- 로그인 / 회원가입 ---//
@ApiTags('Auth API')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 로그인
   * @param loginDTO
   * @returns JWT 토큰
   */
  @Post('login')
  @ApiOperation({ summary: '로그인' })
  @ApiBody({ type: LoginDTO })
  @ApiResponse({
    status: 200,
    description: 'Access Token과 Refresh Token 반환',
  })
  async login(@Body() loginDTO: LoginDTO) {
    return this.authService.loginService(loginDTO);
  }

  /**
   * Refresh Token으로 새 Access Token 발급
   * @param refreshToken
   * @returns
   */
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh Token으로 새 Access Token 발급' })
  @ApiResponse({
    status: 200,
    description: 'Refresh Token으로 새 Access Token 발급',
  })
  @ApiBody({ type: String })
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  /**
   * 로그아웃 시 Refresh Token 삭제
   * @param refreshToken
   * @returns
   */
  @Post('logout')
  @ApiOperation({ summary: '로그아웃 시 Refresh Token 삭제' })
  @ApiResponse({
    status: 204,
  })
  @ApiBody({ type: String })
  async logout(@Body('refreshToken') refreshToken: string) {
    return this.authService.logout(refreshToken);
  }

  /**
   * 이메일 중복 확인
   * @param email
   * @returns boolean
   */
  @Post('check-id')
  @ApiOperation({ summary: '이메일 중복 확인' })
  @ApiBody({ type: EmailDto })
  @ApiResponse({ status: 200 })
  async checkEmail(@Body() dto: EmailDto) {
    return this.authService.checkEmailService(dto.email);
  }

  /**
   * 이메일 인증 링크 발송
   * @param email
   * @returns
   */
  @Post('send-verification-email')
  @ApiOperation({ summary: '이메일 인증 링크 발송' })
  @ApiBody({ type: EmailDto })
  @ApiResponse({ status: 200, description: '이메일 발송 완료' })
  async sendVerificationEmail(@Body() dto: EmailDto) {
    return this.authService.sendVerificationEmail(dto.email);
  }

  // TODO: 이메일 인증 후 완료 페이지 제작하기
  /**
   * 이메일 인증 링크 클릭
   * @param token
   * @returns
   */
  @Get('verify-email')
  @ApiOperation({ summary: '이메일 인증 링크 클릭' })
  @ApiResponse({ status: 200, description: '이메일 인증 완료' })
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmailToken(token);
  }

  /**
   * 회원가입
   * @param registerDTO
   * @returns
   */
  @Post('register')
  @ApiOperation({ summary: '회원가입' })
  @ApiBody({ type: RegisterDTO })
  @ApiResponse({ status: 201, description: '회원가입 완료' })
  async register(@Body() registerDTO: RegisterDTO) {
    return this.authService.registerService(registerDTO);
  }

  /**
   * 비밀번호 재설정을 위한 메일 발송
   * @param EmailDto
   * @returns
   */
  @Post('forgot-password')
  @ApiOperation({ summary: '비밀번호 변경을 위한 메일 발송' })
  @ApiBody({ type: EmailDto })
  @ApiResponse({
    status: 200,
    description: "{ message: '비밀번호 재설정 메일 발송 완료' }",
  })
  async sendEmailForPsw(@Body() dto: EmailDto) {
    const isEmail = await this.authService.checkEmailService(dto.email);
    if (!isEmail) return { message: '이메일이 존재하지 않습니다' };
    return this.authService.sendVerificationEmailForPsw(dto.email);
  }

  /**
   * 비밀번호 변경
   * @param body: { token: string; newPassword: string }
   * @returns
   */
  //TODO:/auth/reset-password?token=${token} 으로 프론트 제작
  @Post('reset-password')
  @ApiOperation({ summary: '비밀번호 변경' })
  @ApiBody({ type: PasswordDTO })
  @ApiResponse({
    status: 201,
    description: `return { message: '비밀번호 변경 완료' }`,
  })
  async resetPassword(@Query() token: string, @Body() body: PasswordDTO) {
    return await this.authService.resetPasswordService(token, body.password);
  }

  /**
   * 비밀번호 확인
   * @param body
   * @returns { message: '비밀번호가 확인되었습니다' }
   */
  @Post('check-password')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '마이페이지 비밀번호 확인' })
  @ApiBody({ type: PasswordDTO })
  @ApiResponse({
    status: 200,
    description: `return { message: '비밀번호가 확인되었습니다' }`,
  })
  async checkPassword(@Req() req, @Body() body: PasswordDTO) {
    const user = (req as AuthRequest).user;
    return await this.authService.checkPswService(user.userId, body.password);
  }

  /**
   * 회원탈퇴
   * @param body
   * @returns { message: '회원탈퇴가 완료되었습니다' }
   */
  @Post('delete-account')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '회원탈퇴' })
  @ApiBody({ type: PasswordDTO })
  @ApiResponse({
    status: 204,
    description: `return { message: '회원탈퇴가 완료되었습니다' }`,
  })
  async deleteAccount(@Req() req, @Body() body: PasswordDTO) {
    const user = (req as AuthRequest).user;
    return await this.authService.deleteAccountService(
      user.userId,
      body.password,
    );
  }
}
