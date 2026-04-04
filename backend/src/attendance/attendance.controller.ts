import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Query,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import {
  CreateAttendanceDto,
  UpdateAttendanceDto,
  AttendanceQueryDto,
} from './attendance.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // Điểm danh (Create)
  @Post()
  async create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.create(createAttendanceDto);
  }

  // Lấy danh sách điểm danh theo lớp và ngày
  @Get('class/:classId')
  async getByClassAndDate(
    @Param('classId', ParseIntPipe) classId: number,
    @Query('date') date: string,
  ) {
    if (!date) {
      throw new BadRequestException(
        'Thiếu tham số date (định dạng YYYY-MM-DD)',
      );
    }
    return this.attendanceService.findByClassAndDate(classId, date);
  }

  // Cập nhật điểm danh
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ) {
    return this.attendanceService.update(id, updateAttendanceDto);
  }
}
