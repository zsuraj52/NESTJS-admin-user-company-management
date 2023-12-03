import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { Company } from './Entity/company.entity';
import { CompanyRepository } from './Entity/company.repo';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService, CompanyRepository],
  imports: [TypeOrmModule.forFeature([Company])],
  exports: [CompanyService],
})
export class CompanyModule {}
