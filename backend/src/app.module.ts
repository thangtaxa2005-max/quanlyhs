import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
// import { UsersModule } from './users/users.module';   // tạm comment vì chưa có module
import { ClassesModule } from './classes/classes.module';
import { StudentsModule } from './students/students.module';
import { SubjectsModule } from './subjects/subjects.module';
import { ScoresModule } from './scores/scores.module';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'eduadmin',
      password: 'edu@123456',
      database: 'edumanager',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // tạm dùng true trong giai đoạn phát triển
      logging: false,
    }),
    AuthModule,
    // UsersModule,           // tạm comment
    ClassesModule,
    StudentsModule,
    SubjectsModule,
    ScoresModule,
    AttendanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
