import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dtos/register.dto';
import { LoginDTO } from './dtos/login.dto';
import { EmailDto } from './dtos/email.dto';
import { ResetPasswordDTO } from './dtos/resetPsw.dto';

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
  @ApiResponse({ status: 201, description: 'JWT 토큰 반환' })
  async login(@Body() loginDTO: LoginDTO) {
    return this.authService.loginService(loginDTO);
  }

  /**
   * 이메일 중복 확인
   * @param email
   * @returns boolean
   */
  @Post('api/check-id')
  @ApiOperation({ summary: '이메일 중복 확인' })
  @ApiBody({ type: EmailDto })
  @ApiResponse({ status: 200 })
  async checkEmail(@Body() dto: EmailDto) {
    console.log('컨트롤러', dto.email);
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
  @ApiResponse({ status: 201, description: '이메일 발송 완료' })
  async sendVerificationEmail(@Body() dto: EmailDto) {
    return this.authService.sendVerificationEmail(dto.email);
  }

  // TODO: 이메일 인증 후 완료 페이지 제작하기
  /**
   * 이메일 인증 링크 클릭
   * @param token
   * @returns
   */
  @Get('api/verify-email')
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
  @ApiBody({ type: ResetPasswordDTO })
  @ApiResponse({
    status: 200,
    description: `return { message: '비밀번호 변경 완료' }`,
  })
  async resetPassword(@Body() body: ResetPasswordDTO) {
    return await this.authService.resetPasswordService(
      body.token,
      body.newPassword,
    );
  }
}
