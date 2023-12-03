import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/Entity/user.entity';
import { Admin } from '../../admin/Entity/admin.entity';

@Entity('company')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => User, (users) => users.company, { cascade: true })
  user: User[];

  @ManyToOne(() => Admin, (admin) => admin.company, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'adminId' })
  admin: Admin;

  @Column()
  companyName: string;

  @Column()
  addressLine1: string;

  @Column()
  addressLine2: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  pincode: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isCompanyDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
