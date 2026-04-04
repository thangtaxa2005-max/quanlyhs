import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { Attendance, AttendanceStatus } from './attendance.entity';
import { CreateAttendanceDto, UpdateAttendanceDto } from './attendance.dto';
import { Student } from '../students/student.entity';
import { Class } from '../classes/class.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,

    @InjectRepository(Student)
    private studentRepository: Repository<Student>,

    @InjectRepository(Class)
    private classRepository: Repository<Class>,
  ) {}

  // Tạo / điểm danh cho một học sinh
  async create(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    const { date, studentId, classId, status, session, note } =
      createAttendanceDto;

    const today = new Date().toISOString().split('T')[0];
    if (date > today) {
      throw new BadRequestException(
        'Không thể điểm danh cho ngày trong tương lai',
      );
    }

    const student = await this.studentRepository.findOne({
      where: { id: studentId },
      relations: ['class'],
    });

    if (!student) {
      throw new NotFoundException(
        `Không tìm thấy học sinh với ID ${studentId}`,
      );
    }

    if (student.class?.id !== classId) {
      throw new BadRequestException('Học sinh không thuộc lớp này');
    }

    const existing = await this.attendanceRepository.findOne({
      where: { student: { id: studentId }, class: { id: classId }, date },
    });

    if (existing) {
      throw new BadRequestException(
        'Học sinh này đã được điểm danh trong ngày hôm nay',
      );
    }

    const attendance = this.attendanceRepository.create({
      date,
      status,
      session,
      note,
      student,
      class: { id: classId },
    });

    return this.attendanceRepository.save(attendance);
  }

  // Cập nhật điểm danh
  async update(
    id: number,
    updateAttendanceDto: UpdateAttendanceDto,
  ): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
      relations: ['student', 'class'],
    });

    if (!attendance) {
      throw new NotFoundException(
        `Không tìm thấy bản ghi điểm danh với ID ${id}`,
      );
    }

    const attendanceDate = new Date(attendance.date);
    const today = new Date();
    const diffDays = Math.ceil(
      Math.abs(today.getTime() - attendanceDate.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    if (diffDays > 7) {
      throw new BadRequestException(
        'Chỉ được sửa điểm danh trong vòng 7 ngày kể từ ngày học',
      );
    }

    Object.assign(attendance, updateAttendanceDto);
    return this.attendanceRepository.save(attendance);
  }

  // Lấy điểm danh theo lớp và ngày
  async findByClassAndDate(
    classId: number,
    date: string,
  ): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      where: { class: { id: classId }, date },
      relations: ['student'],
      order: { id: 'ASC' },
    });
  }

  // Tính tỷ lệ chuyên cần (tạm thời)
  async getAttendanceRate(
    studentId: number,
    startDate: string,
    endDate: string,
  ) {
    const [total, absent] = await Promise.all([
      this.attendanceRepository.count({
        where: {
          student: { id: studentId },
          date: Between(startDate, endDate),
        },
      }),
      this.attendanceRepository.count({
        where: {
          student: { id: studentId },
          status: In([
            AttendanceStatus.ABSENT_PERMISSION,
            AttendanceStatus.ABSENT_NO_PERMISSION,
          ]),
          date: Between(startDate, endDate),
        },
      }),
    ]);

    const rate = total > 0 ? ((total - absent) / total) * 100 : 100;
    return Math.round(rate * 100) / 100;
  }
}
