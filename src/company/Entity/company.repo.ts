import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class CompanyRepository {
  constructor(
    @InjectRepository(Company)
    private companyRepo: Repository<Company>,
  ) {}

  public async saveCompanyDetails(company: any) {
    console.log(
      '🚀 ~ file: company.repo.ts:12 ~ CompanyRepository ~ saveCompanyDetails ~ company:',
      company,
    );
    return await this.companyRepo.save(company);
  }

  public async getCompanyByEmailRepo(email: string) {
    return await this.companyRepo.findOne({
      where: {
        email: email,
        isCompanyDeleted: false,
      },
    });
  }

  public async getCompanyByDetails(companyDetails: any) {
    return await this.companyRepo.findOne({
      relations: ['admin'],
      where: {
        admin: { id: companyDetails.admin },
        companyName: companyDetails.companyName,
        isCompanyDeleted: false,
      },
    });
  }

  public async getCompanyByIdRepo(companyId: string) {
    return await this.companyRepo.findOne({
      where: {
        id: companyId,
        isCompanyDeleted: false,
      },
    });
  }

  public async getAllCompaniesServiceRepo() {
    return await this.companyRepo.find({
      where: {
        isCompanyDeleted: false,
      },
    });
  }

  public async getAllCompaniesForAdminIdRepo(adminId: string) {
    return await this.companyRepo.find({
      relations: ['admin'],
      where: {
        admin: { id: adminId },
        isCompanyDeleted: false,
      },
    });
  }

  public async updateCompanyDetailsRepo(company: any, companyId: string) {
    return await this.companyRepo.update(companyId, company).then(async () => {
      return await this.getCompanyByIdRepo(companyId);
    });
  }

  public async deleteCompanyRepo(companyId: string) {
    return await this.getCompanyByIdRepo(companyId).then(async (company) => {
      if (!company) {
        throw `No Company Found`;
      }
      company.isCompanyDeleted = true;
      return await this.companyRepo.update(companyId, company).then(() => {
        return `Company With ID ${companyId} Deleted Successfully!`;
      });
    });
  }
}
