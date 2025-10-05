import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MemberModule } from './member/member.module';
import { PharmacyModule } from './pharmacy/pharmacy.module';
import { MedicineModule } from './medicine/medicine.module';
import { StockModule } from './stock/stock.module';
import { BoardModule } from './board/board.module';
import { AuthModule } from './auth/auth.module';

import { PrismaModule } from '../prisma/prisma.module';
import { GlobalJwtModule } from './jwt/jwt.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER, // Gmail 계정
          pass: process.env.SMTP_PASS, // 앱 비밀번호
        },
      },
    }),
    GlobalJwtModule,
    MemberModule,
    PharmacyModule,
    MedicineModule,
    StockModule,
    BoardModule,
    AuthModule,
    PrismaModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
