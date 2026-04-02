import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async findAll() {
    return this.studentRepository.find({
      relations: ['class'],
    });
  }

  async findByClass(classId: number) {
    return this.studentRepository.find({
      where: { class: { id: classId } },
      relations: ['class'],
    });
  }

  async findOne(id: number) {
    return this.studentRepository.findOne({
      where: { id },
      relations: ['class'],
    });
  }

  async create(data: Partial<Student>) {
    const student = this.studentRepository.create(data);
    return this.studentRepository.save(student);
  }

  async update(id: number, data: Partial<Student>) {
    await this.studentRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.studentRepository.delete(id);
    return { message: 'Xóa học sinh thành công' };
  }

  async count() {
    return this.studentRepository.count();
  }
}
