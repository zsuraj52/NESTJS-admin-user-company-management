import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();
import { CompanyRepository } from './Entity/company.repo';

@Injectable()
export class CompanyService {
  constructor(private companyRepository: CompanyRepository) {}

  public async createCompanyService(companyDetails: any) {
    try {
      console.log(
        '🚀 ~ file: company.service.ts:8 ~ CompanyService ~ createCompanyService ~ companyDetails:',
        companyDetails,
      );
      const company =
        await this.companyRepository.getCompanyByDetails(companyDetails);
      console.log(
        '🚀 ~ file: company.service.ts:15 ~ CompanyService ~ createCompanyService ~ company:',
        company,
      );
      if (company) {
        throw new Error(`Company Found For Provided Details!`);
      }
      return await this.companyRepository.saveCompanyDetails(companyDetails);
    } catch (error) {
      console.log(
        '🚀 ~ file: company.service.ts:11 ~ CompanyService ~ createCompanyService ~ error:',
        error,
      );
      return error.message;
    }
  }

  public async loginCompanyService(companyLoginData: any) {
    try {
      console.log(
        '🚀 ~ file: company.service.ts:34 ~ CompanyService ~ loginCompanyService ~ companyLoginData:',
        companyLoginData,
      );
      const company = await this.companyRepository.getCompanyByEmailRepo(
        companyLoginData.email,
      );
      console.log(
        '🚀 ~ file: company.service.ts:42 ~ CompanyService ~ loginCompanyService ~ company:',
        company,
      );
      if (!company) {
        throw new Error(`No Company Found For Provided Email Id!`);
      }
      const isPasswordCorrect = bcrypt.compareSync(
        companyLoginData.password,
        company.password,
      );
      console.log(
        '🚀 ~ file: company.service.ts:48 ~ CompanyService ~ loginCompanyService ~ isPasswordCorrect:',
        isPasswordCorrect,
      );
      if (isPasswordCorrect === false) {
        throw new Error(`Provided Password is Wrong`);
      }
      const token = jwt.sign({ ...company }, process.env.WEBTOKEN_SECRET_KEY, {
        expiresIn: '1h',
      });
      return {
        ...company,
        token: token,
      };
    } catch (error) {
      console.log(
        '🚀 ~ file: company.service.ts:37 ~ CompanyService ~ loginCompanyService ~ error:',
        error,
      );
      return error.message;
    }
  }

  public async getCompanyByCompanyId(companyId: string) {
    return await this.companyRepository.getCompanyByIdRepo(companyId);
  }

  public async getAllCompaniesService() {
    return await this.companyRepository.getAllCompaniesServiceRepo();
  }

  public async getAllCompaniesForAdminId(adminId: string) {
    return await this.companyRepository.getAllCompaniesForAdminIdRepo(adminId);
  }

  public async updateCompanyDetailsService(companyId: string, company: any) {
    console.log(
      '🚀 ~ file: company.service.ts:89 ~ CompanyService ~ updateCompanyDetailsService ~ company:',
      company,
    );
    if (company.password) {
      company.password = await bcrypt.hash(company.password, 10);
    }
    return await this.companyRepository.updateCompanyDetailsRepo(
      company,
      companyId,
    );
  }

  public async deleteCompanyService(companyId: string) {
    return await this.companyRepository.deleteCompanyRepo(companyId);
  }
}
