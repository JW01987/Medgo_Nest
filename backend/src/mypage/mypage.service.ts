import { Injectable } from '@nestjs/common';
import { CreateMypageDto } from './dto/create-mypage.dto';
import { UpdateMypageDto } from './dto/update-mypage.dto';

@Injectable()
export class MypageService {
  getUserInfoService(token: string) {
    return token;
  }
  create(createMypageDto: CreateMypageDto) {
    return 'This action adds a new mypage';
  }

  findAll() {
    return `This action returns all mypage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mypage`;
  }

  update(id: number, updateMypageDto: UpdateMypageDto) {
    return `This action updates a #${id} mypage`;
  }

  remove(id: number) {
    return `This action removes a #${id} mypage`;
  }
}
