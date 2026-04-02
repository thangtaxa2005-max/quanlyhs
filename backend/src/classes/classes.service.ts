import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './class.entity';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
  ) {}

  async findAll() {
    return this.classRepository.find({
      relations: ['homeroom_teacher', 'students'],
    });
  }

  async findOne(id: number) {
    return this.classRepository.findOne({
      where: { id },
      relations: ['homeroom_teacher', 'students'],
    });
  }

  async create(data: Partial<Class>) {
    const newClass = this.classRepository.create(data);
    return this.classRepository.save(newClass);
  }

  async update(id: number, data: Partial<Class>) {
    await this.classRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.classRepository.delete(id);
    return { message: 'Xóa lớp học thành công' };
  }

  async count() {
    return this.classRepository.count();
  }
}
