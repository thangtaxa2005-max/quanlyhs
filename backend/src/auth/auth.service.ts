import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';

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
      throw new UnauthorizedException('Ten dang nhap khong ton tai');
    }
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      throw new UnauthorizedException('Mat khau khong chinh xac');
    }
    if (!user.is_active) {
      throw new UnauthorizedException('Tai khoan da bi khoa');
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

  async seedAdmin() {
    const existing = await this.userRepository.findOne({
      where: { username: 'admin' },
    });
    if (existing) {
      return { message: 'Admin da ton tai!' };
    }
    const password_hash = await bcrypt.hash('Admin@123', 10);
    const user = this.userRepository.create({
      username: 'admin',
      password_hash,
      full_name: 'Quan tri vien',
      email: 'admin@quanlyhs.vn',
      is_active: true,
    });
    await this.userRepository.save(user);
    return { message: 'Tao admin thanh cong!', username: 'admin', password: 'Admin@123' };
  }
}