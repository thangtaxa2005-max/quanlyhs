import {
  IsNotEmpty,
  IsEnum,
  IsDateString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { AttendanceStatus } from './attendance.entity';

export class CreateAttendanceDto {
  @IsNotEmpty()
  @IsDateString()
  date: string; // YYYY-MM-DD

  @IsNotEmpty()
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @IsOptional()
  @IsString()
  session?: string; // 'morning' hoặc 'afternoon'

  @IsOptional()
  @IsString()
  @Length(0, 500)
  note?: string;

  @IsNotEmpty()
  studentId: number;

  @IsNotEmpty()
  classId: number;

  // createdBy sẽ được lấy từ JWT token sau này (không cho user nhập trực tiếp)
}

export class UpdateAttendanceDto {
  @IsOptional()
  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus;

  @IsOptional()
  @IsString()
  session?: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  note?: string;
}

export class AttendanceQueryDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  classId?: number;

  @IsOptional()
  studentId?: number;
}
