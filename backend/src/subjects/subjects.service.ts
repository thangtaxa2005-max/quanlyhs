import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './subject.entity';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
  ) {}

  async findAll() {
    return this.subjectRepository.find();
  }

  async findOne(id: number) {
    return this.subjectRepository.findOne({ where: { id } });
  }

  async create(data: Partial<Subject>) {
    const subject = this.subjectRepository.create(data);
    return this.subjectRepository.save(subject);
  }

  async update(id: number, data: Partial<Subject>) {
    await this.subjectRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.subjectRepository.delete(id);
    return { message: 'Xóa môn học thành công' };
  }

  async count() {
    return this.subjectRepository.count();
  }
}
