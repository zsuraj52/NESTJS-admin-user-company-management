import { Company } from '../../company/Entity/company.entity';
import { User } from '../../user/Entity/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('admin')
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column()
  gender: string;

  @OneToMany(() => User, (user) => user.admin, { cascade: true })
  user: User[];

  @OneToMany(() => Company, (company) => company.admin, { cascade: true })
  company: Company[];

  @Column({ default: false })
  isAdminDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
