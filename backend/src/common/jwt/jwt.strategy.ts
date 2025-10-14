import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './types/jwt-payload.type';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  async validate(payload: JwtPayload) {
    const { userId } = payload;

    const pharmacy = await this.prisma.pharmacy.findFirst({
      where: { userId, deletedAt: null },
      select: { id: true },
    });

    if (!pharmacy) {
      throw new UnauthorizedException('약국 정보를 찾을 수 없습니다.');
    }

    return { userId: payload.userId, pharmacyId: pharmacy.id };
  }
}
