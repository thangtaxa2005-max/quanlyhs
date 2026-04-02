import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './attendance.entity';
import { CreateAttendanceDto } from './attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepo: Repository<Attendance>,
  ) {}

  async markAttendance(dto: CreateAttendanceDto) {
    const { studentId, classId, ...data } = dto;

    // Kiểm tra đã điểm danh chưa (đủ 3 điều kiện: student + class + date)
    const existing = await this.attendanceRepo.findOne({
      where: {
        student: { id: studentId },
        class: { id: classId },
        date: data.date,
      },
    });

    if (existing) {
      await this.attendanceRepo.update(existing.id, {
        status: data.status,
        note: data.note,
      });
      return this.attendanceRepo.findOne({
        where: { id: existing.id },
        relations: ['student', 'class'],
      });
    }

    const attendance = this.attendanceRepo.create({
      ...data,
      student: { id: studentId },
      class: { id: classId },
    });
    return this.attendanceRepo.save(attendance);
  }

  async getByClass(classId: number, date: string) {
    return this.attendanceRepo.find({
      where: {
        class: { id: classId },
        date,
      },
      relations: ['student'],
      order: {
        student: { id: 'ASC' },
      },
    });
  }
}