import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';
import { AttendanceStatus } from './attendance.entity';

export class CreateAttendanceDto {
  @IsNotEmpty()
  studentId: number;

  @IsNotEmpty()
  classId: number;

  @IsNotEmpty()
  @IsDateString()
  date: string; // YYYY-MM-DD

  @IsNotEmpty()
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @IsOptional()
  @IsString()
  note?: string;
}
