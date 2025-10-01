import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dtos/register.dto';
import { LoginDTO } from './dtos/login.dto';
import { EmailDto } from './dtos/email.dto';

//- 로그인 / 회원가입 -//
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
}
