import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './Entity/admin.entity';
import { AdminRepository } from './Entity/admin.repo';
import { User } from '../user/Entity/user.entity';
import { UserRepository } from '../user/Entity/user.repo';
import { UserService } from '../user/user.service';
import { CompanyService } from '../company/company.service';
import { CompanyRepository } from '../company/Entity/company.repo';
import { Company } from '../company/Entity/company.entity';

@Module({
  controllers: [AdminController],
  providers: [
    AdminService,
    AdminRepository,
    UserRepository,
    UserService,
    CompanyService,
    CompanyRepository,
  ],
  imports: [TypeOrmModule.forFeature([Admin, User, Company])],
  exports: [AdminService],
})
export class AdminModule {}
