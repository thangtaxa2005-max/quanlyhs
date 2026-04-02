import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Student } from '../students/student.entity';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  class_name: string;

  @Column({ nullable: true })
  grade_name: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'homeroom_teacher_id' })
  homeroom_teacher: User;

  @OneToMany(() => Student, (student) => student.class)
  students: Student[];

  @CreateDateColumn()
  created_at: Date;
}
