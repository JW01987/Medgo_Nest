import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PharmacyModule } from './pharmacy/pharmacy.module';
import { MedicineModule } from './medicine/medicine.module';
import { StockModule } from './stock/stock.module';
import { BoardModule } from './board/board.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { GlobalJwtModule } from './common/jwt/jwt.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { RedisModule } from './redis/redis.module';
import { MypageModule } from './mypage/mypage.module';

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
    PharmacyModule,
    MedicineModule,
    StockModule,
    BoardModule,
    AuthModule,
    PrismaModule,
    RedisModule,
    MypageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
