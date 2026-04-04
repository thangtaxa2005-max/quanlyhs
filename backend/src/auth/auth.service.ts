import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['role'],
    });

    if (!user) {
      throw new UnauthorizedException('Tên đăng nhập không tồn tại');
    }

    // === TẠM THỜI BỎ BCRYPT ĐỂ DỄ TEST ===
    // So sánh trực tiếp với chuỗi "123456"
    if (password !== '123456') {
      throw new UnauthorizedException('Mật khẩu không chính xác');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('Tài khoản đã bị khóa');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role?.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        email: user.email,
        role: user.role?.name,
      },
    };
  }

  async validateUser(userId: number) {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: ['role'],
    });
  }
}
