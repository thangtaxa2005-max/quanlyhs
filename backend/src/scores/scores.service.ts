import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from './score.entity';

@Injectable()
export class ScoresService {
  constructor(
    @InjectRepository(Score)
    private scoreRepository: Repository<Score>,
  ) {}

  async findByStudentAndSubject(
    studentId: number,
    subjectId: number,
    semesterId: number,
  ) {
    return this.scoreRepository.find({
      where: {
        student: { id: studentId },
        subject: { id: subjectId },
        semester_id: semesterId,
      },
      relations: ['student', 'subject', 'created_by'],
    });
  }

  async findByClass(classId: number, subjectId: number, semesterId: number) {
    return this.scoreRepository.find({
      where: {
        student: { class: { id: classId } },
        subject: { id: subjectId },
        semester_id: semesterId,
      },
      relations: ['student', 'subject'],
    });
  }

  async create(data: any) {
    const score = this.scoreRepository.create(data);
    return this.scoreRepository.save(score);
  }

  async update(id: number, data: any) {
    await this.scoreRepository.update(id, data);
    return this.scoreRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    await this.scoreRepository.delete(id);
    return { message: 'Xóa điểm thành công' };
  }

  calculateDTBm(scores: Score[]) {
    let totalWeighted = 0;
    let totalWeight = 0;

    scores.forEach((score) => {
      let weight = 1;
      if (score.score_type === '1tiet') weight = 2;
      if (score.score_type === 'hocky') weight = 3;
      totalWeighted += Number(score.score_value) * weight;
      totalWeight += weight;
    });

    if (totalWeight === 0) return 0;
    const dtbm = totalWeighted / totalWeight;
    return Math.round(dtbm * 100) / 100;
  }

  getXepLoai(dtbm: number) {
    if (dtbm >= 8.0) return 'Giỏi';
    if (dtbm >= 6.5) return 'Khá';
    if (dtbm >= 5.0) return 'Trung bình';
    return 'Yếu';
  }
}
