import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ScoresService } from './scores.service';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('scores')
@UseGuards(JwtAuthGuard)
export class ScoresController {
  constructor(private scoresService: ScoresService) {}

  @Get()
  findByClass(
    @Query('classId') classId: string,
    @Query('subjectId') subjectId: string,
    @Query('semesterId') semesterId: string,
  ) {
    return this.scoresService.findByClass(+classId, +subjectId, +semesterId);
  }

  @Get('student')
  findByStudent(
    @Query('studentId') studentId: string,
    @Query('subjectId') subjectId: string,
    @Query('semesterId') semesterId: string,
  ) {
    return this.scoresService.findByStudentAndSubject(
      +studentId,
      +subjectId,
      +semesterId,
    );
  }

  @Get('dtbm')
  async getDTBm(
    @Query('classId') classId: string,
    @Query('subjectId') subjectId: string,
    @Query('semesterId') semesterId: string,
  ) {
    const scores = await this.scoresService.findByClass(
      +classId,
      +subjectId,
      +semesterId,
    );

    const studentScores: { [key: number]: any } = {};
    scores.forEach((score) => {
      const studentId = score.student.id;
      if (!studentScores[studentId]) {
        studentScores[studentId] = {
          student: score.student,
          scores: [],
        };
      }
      studentScores[studentId].scores.push(score);
    });

    return Object.values(studentScores).map((item: any) => {
      const dtbm = this.scoresService.calculateDTBm(item.scores);
      return {
        student: item.student,
        scores: item.scores,
        dtbm,
        xep_loai: this.scoresService.getXepLoai(dtbm),
      };
    });
  }

  @Post()
  create(@Body() body: any, @Request() req: any) {
    return this.scoresService.create({
      ...body,
      created_by: { id: req.user.id },
    });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.scoresService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scoresService.remove(+id);
  }
}
