import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDTO } from './dtos/register.dto';
import bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from './dtos/login.dto';
import { JwtPayload } from './types/jwt-payload.type';
import { randomBytes } from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  /**
   * 로그인
   * @param loginDTO
   * @returns jwt 토큰
   */
  async loginService(loginDTO: LoginDTO) {
    const { email, password } = loginDTO;

    const user = await this.findByEmail(email);

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid)
      throw new UnauthorizedException('비밀번호가 틀렸습니다');

    const payload: JwtPayload = { userId: user.id, email: user.email };
    const token = this.jwtService.sign(payload, { expiresIn: '1h' });

    return { accessToken: token };
  }

  /**
   * 이메일 중복 체크
   * @param email
   * @returns boolean - 중복이 없으면 isUnique값이 true
   *
   */
  async checkEmailService(email: string) {
    console.log(email);
    const user = await this.prisma.member.findUnique({ where: { email } });
    if (!user) return { isUnique: true };
    return { isUnique: false };
  }

  /**
   * 이메일로 유저 찾기
   * @param email
   * @returns 유저 정보
   */
  async findByEmail(email: string) {
    const user = await this.prisma.member.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('유저가 존재하지 않습니다');
    return user;
  }

  /**
   * 이메일 인증 링크 발송
   * @param email
   * @returns
   */
  async sendVerificationEmail(email: string) {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1시간

    await this.prisma.emailVerification.create({
      data: { email, token, expiresAt },
    });

    const url =
      process.env.DOMAIN_URL + `/auth/api/verify-email?token=${token}`;

    const html = `
        <div
      style="text-align: center; font-family: Arial,sans-serif; background-color:#fff;color: #333; line-height: 1.5; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;"
    >
      <h1 style="color: #14b3ae;">👋 만나서 반가워요!</h1>
      <h3>약찾GO 회원가입 인증 이메일입니다</h3>
      <img
        src="https://cdn-icons-gif.flaticon.com/9534/9534955.gif"
        style="width:200px;"
      />
      <p>아래 버튼을 클릭하면 이메일 인증이 완료됩니다</p>
      <a
        href="${url}"
        style="display: inline-block; padding: 10px 20px; background-color: #14b3ae; color: white; text-decoration: none; border-radius: 5px;"
        >이메일 인증</a
      >
      <p style="margin-top: 20px; font-size: 12px; color: #888;">
        링크 유효시간: 1시간
      </p>
    </div>
    `;

    await this.mailerService.sendMail({
      to: email,
      from: `"약찾GO 서비스팀" <${process.env.SMTP_USER}>`,
      subject: '약찾GO 회원가입 인증 메일입니다',
      context: { url },
      html,
    });

    return { success: true, message: '이메일 발송 완료' };
  }

  /**
   * 이메일 인증 토큰 확인
   * @param token
   * @returns
   */
  async verifyEmailToken(token: string) {
    const record = await this.prisma.emailVerification.findFirst({
      where: { token, used: false },
    });

    if (!record) throw new BadRequestException('유효하지 않은 링크입니다.');
    if (record.expiresAt < new Date())
      throw new BadRequestException('링크가 만료되었습니다.');

    await this.prisma.emailVerification.update({
      where: { id: record.id },
      data: { used: true },
    });

    return { success: true, message: '이메일 인증 완료' };
  }

  /**
   * 회원가입
   * @param registerDTO
   * @returns
   */
  async registerService(registerDTO: RegisterDTO) {
    const { name, email, password, latitude, longitude, address, licenseCode } =
      registerDTO;
    const record = await this.prisma.emailVerification.findFirst({
      where: { email, used: true },
    });

    if (!record) throw new BadRequestException('이메일 인증이 필요합니다.');

    const hashedPassword = await bcrypt.hash(password, 10);

    const member = await this.prisma.member.create({
      data: {
        email: email,
        password: hashedPassword,
        licenseCode: licenseCode,
      },
    });

    await this.prisma.pharmacy.create({
      data: {
        pharmacyName: name,
        address: address,
        latitude: latitude,
        longitude: longitude,
        userId: member.id,
        // phone, openTime, closeTime 생략
        // TODO:추후 회원정보 수정에서 추가
      },
    });

    return { success: true, message: '회원가입 완료' };
  }
}
