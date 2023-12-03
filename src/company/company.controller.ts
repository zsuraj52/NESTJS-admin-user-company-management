import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@ApiTags('Company')
@Controller('company')
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @Post('/register')
  public async createCompany(@Body() companyDetails: any) {
    return await this.companyService.createCompanyService(companyDetails);
  }

  @Post('/login')
  public async loginCompany(@Body() companyLoginData: any) {
    return await this.companyService.loginCompanyService(companyLoginData);
  }

  @Get('/:companyId')
  @UseGuards(AuthGuard('company-jwt'))
  public async getCompanyById(@Param('companyId') companyId: string) {
    return await this.companyService.getCompanyByCompanyId(companyId);
  }

  @Get('/')
  @UseGuards(AuthGuard('company-jwt'))
  public async getAllCompanies() {
    return await this.companyService.getAllCompaniesService();
  }

  @Patch('/update/:companies')
  @UseGuards(AuthGuard('company-jwt'))
  public async updateCompanyDetails(
    @Body() companyDetails: any,
    @Param('companyId') companyId: string,
  ) {
    return await this.companyService.updateCompanyDetailsService(
      companyId,
      companyDetails,
    );
  }

  @Delete('/delete/:companyId')
  @UseGuards(AuthGuard('company-jwt'))
  public async deleteCompany(@Param('companyId') companyId: string) {
    return await this.companyService.deleteCompanyService(companyId);
  }
}
