import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MemberService } from './member.service';
//--- 마이페이지 ---//
@ApiTags('Mypage API')
@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  // @Post('login')
  // @ApiOperation({ summary: '로그인' })
  // @ApiBody({ type: LoginDTO })
  // @ApiResponse({ status: 201, description: 'JWT 토큰 반환' })
  // async login(@Body() loginDTO: LoginDTO) {
  //   return this.authService.loginService(loginDTO);
  // }
}
