import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Class } from '../classes/class.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  full_name: string;

  @Column({ nullable: true })
  date_of_birth: Date;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  parent_phone: string;

  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => Class, (cls) => cls.students)
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @CreateDateColumn()
  enrollment_date: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
