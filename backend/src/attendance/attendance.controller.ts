import { Controller, Post, Get, Body, Param, UseGuards, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './attendance.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('mark')
  async markAttendance(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.markAttendance(createAttendanceDto);
  }

  @Get('class/:classId/date/:date')
  async getByClassAndDate(
    @Param('classId') classId: string,
    @Param('date') date: string,
  ) {
    return this.attendanceService.getByClass(+classId, date);
  }
}