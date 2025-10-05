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
import * as crypto from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';
import { RedisService } from '../redis/redis.service';
import { EmailRecode } from './types/emailRecode.type';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private redisService: RedisService,
  ) {}

  /**
   * 로그인
   * @param loginDTO
   * @returns { accessToken, refreshToken }
   */
  async loginService(loginDTO: LoginDTO) {
    const { email, password } = loginDTO;

    const user = await this.prisma.member.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('가입되지 않은 이메일입니다.');

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid)
      throw new UnauthorizedException('비밀번호가 틀렸습니다');

    // Access Token (1시간)
    const payload: JwtPayload = { userId: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });

    // Refresh Token (7일)
    const refreshToken = crypto.randomBytes(64).toString('hex');
    const redisKey = `refresh_token:${refreshToken}`;
    const ttlSeconds = 7 * 24 * 60 * 60; // 7일

    await this.redisService
      .getClient()
      .setEx(redisKey, ttlSeconds, JSON.stringify({ userId: user.id }));

    return { accessToken, refreshToken };
  }

  /**
   * Refresh Token으로 새 Access Token 발급
   * @param refreshToken
   * @returns { accessToken: newAccessToken }
   */
  async refreshToken(refreshToken: string) {
    const redisKey = `refresh_token:${refreshToken}`;
    const record = await this.redisService.getClient().get(redisKey);

    if (!record) throw new UnauthorizedException('유효하지 않은 리프레시 토큰');

    const { userId } = JSON.parse(record) as { userId: number };
    const user = await this.prisma.member.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('회원 정보를 찾을 수 없음');

    const newAccessToken = this.jwtService.sign(
      { userId: user.id, email: user.email },
      { expiresIn: '1h' },
    );

    return { accessToken: newAccessToken };
  }

  /**
   * 로그아웃 시 Refresh Token 삭제
   * @param refreshToken
   */
  async logout(refreshToken: string) {
    const redisKey = `refresh_token:${refreshToken}`;
    await this.redisService.getClient().del(redisKey);
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
    const token = crypto.randomBytes(32).toString('hex');
    const redisKey = `email_verif:${token}`;
    const ttlSeconds = 30 * 60; //30분
    const data: EmailRecode = {
      email,
      verified: false,
    };

    await this.redisService
      .getClient()
      .setEx(redisKey, ttlSeconds, JSON.stringify(data));

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
        링크 유효시간: 30분
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
    const userToken = await this.redisService
      .getClient()
      .get(`email_verif:${token}`);
    if (!userToken) throw new BadRequestException('유효하지 않은 링크입니다.');
    const record = JSON.parse(userToken) as EmailRecode;

    const redisKey = `email_verif:${record.email}`;
    const ttlSeconds = 24 * 60 * 60; //1d

    await this.redisService
      .getClient()
      .setEx(redisKey, ttlSeconds, JSON.stringify({ verified: true }));
    await this.redisService.getClient().del(`email_verif:${token}`);

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
    const userToken = await this.redisService
      .getClient()
      .get(`email_verif:${email}`);
    if (!userToken) throw new BadRequestException('이메일 인증이 필요합니다.');

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
    await this.redisService.getClient().del(`email_verif:${email}`);
    return { success: true, message: '회원가입 완료' };
  }

  /**
   * 비밀번호 변경을 위한 메일 전송
   * @param email
   * @returns
   */
  async sendVerificationEmailForPsw(email: string) {
    const user = await this.findByEmail(email);

    const token = crypto.randomBytes(32).toString('hex');
    const redisKey = `password_verif:${token}`;
    const ttlSeconds = 30 * 60; //30분

    await this.redisService
      .getClient()
      .setEx(redisKey, ttlSeconds, JSON.stringify({ id: user.id }));

    const url = process.env.DOMAIN_URL + `/auth/reset-password?token=${token}`;
    const html = `
        <div
      style="text-align: center; font-family: Arial,sans-serif; background-color:#fff;color: #333; line-height: 1.5; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;"
    >
      <h1 style="color: #14b3ae;">비밀번호 재설정을 위한 메일입니다</h1>
      <h3>본인이 설정한 것이 아니라면 링크를 클릭하지 마세요</h3>
      <img
        src="https://cdn-icons-gif.flaticon.com/9534/9534955.gif"
        style="width:200px;"
      />
      <p>아래 버튼을 클릭하면 비밀번호를 재설정 할 수 있습니다.</p>
      <a
        href="${url}"
        style="display: inline-block; padding: 10px 20px; background-color: #14b3ae; color: white; text-decoration: none; border-radius: 5px;"
        >비밀번호 재설정</a
      >
      <p style="margin-top: 20px; font-size: 12px; color: #888;">
        링크 유효시간: 30분
      </p>
    </div>
    `;

    await this.mailerService.sendMail({
      to: email,
      from: `"약찾GO 서비스팀" <${process.env.SMTP_USER}>`,
      subject: '비밀번호 재설정 메일',
      html,
    });

    return { message: '비밀번호 재설정 메일 발송 완료' };
  }

  /**
   * 비밀번호 변경
   * @param token
   * @param newPassword
   * @returns
   */
  async resetPasswordService(token: string, newPassword: string) {
    const userToken = await this.redisService
      .getClient()
      .get(`password_verif:${token}`);
    if (!userToken)
      throw new BadRequestException('유효하지 않거나 만료된 토큰입니다.');
    const record = JSON.parse(userToken) as { id: number };
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.member.update({
      where: { id: record.id },
      data: { password: hashedPassword },
    });

    await this.redisService.getClient().del(`password_verif:${token}`);

    return { message: '비밀번호 변경 완료' };
  }
}
