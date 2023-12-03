import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Admin } from './Entity/admin.entity';
import { registerAdmin } from './DTO/admin.dto';

@ApiBearerAuth()
@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('/register')
  public async createAdmin(@Body() admin: registerAdmin): Promise<Admin | any> {
    return await this.adminService.createAdminService(admin).catch((err) => {
      return { Error: err };
    });
  }

  @Post('/login')
  public async loginAdmin(@Body() admin: any) {
    return await this.adminService.loginAdminService(admin).catch((err) => {
      return { Error: err };
    });
  }

  @Post('/forgot/password')
  public async forgotPassword(@Query('email') email: string) {
    return await this.adminService.forgotPasswordService(email);
  }

  @Post('/reset/password')
  @UseGuards(AuthGuard('admin-jwt'))
  public async resetPassword(@Body() body: any) {
    return await this.adminService.resetPasswordService(body);
  }

  @Post('/register/user')
  @UseGuards(AuthGuard('admin-jwt'))
  public async createUser(@Body() user: any) {
    return await this.adminService.createUserService(user);
  }

  @Post('/register/company/:adminId')
  @UseGuards(AuthGuard('admin-jwt'))
  public async registerCompany(
    @Body() company: any,
    @Param('adminId') adminId: string,
  ) {
    return await this.adminService.registerCompanyService(company, adminId);
  }

  @Get('/:id')
  @UseGuards(AuthGuard('admin-jwt'))
  public async getAdminById(@Param('id') id: string) {
    return await this.adminService.getAdminByIdService(id);
  }

  @Get('/:id/users')
  @UseGuards(AuthGuard('admin-jwt'))
  public async getAllUsersForAdmin(@Param('id') id: string) {
    return await this.adminService.getAllUsersForAdminService(id);
  }

  @Get('/:adminId/companies')
  @UseGuards(AuthGuard('admin-jwt'))
  public async getAllCompaniesForAdmin(@Param('adminId') adminId: string) {
    return await this.adminService.getAllCompaniesForAdminService(adminId);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard('admin-jwt'))
  public async updateAdminDetails(
    @Param('id') id: string,
    @Body() admin: Admin,
  ) {
    return await this.adminService.updateAdminDetailsService(id, admin);
  }

  @Patch('/update/user/:adminId/:userId')
  @UseGuards(AuthGuard('admin-jwt'))
  public async updateUserDetails(
    @Body() userDetails: any,
    @Param('userId') userId: string,
    @Param('adminId') adminId: string,
  ) {
    return await this.adminService.updateUserDetailsService(
      userId,
      adminId,
      userDetails,
    );
  }

  @Patch('/update/company/:companyId')
  @UseGuards(AuthGuard('admin-jwt'))
  public async updateCompanyDetails(
    @Body() company: any,
    @Param('companyId') companyId: string,
  ) {
    return await this.adminService.updateCompanyDetailsService(
      company,
      companyId,
    );
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('admin-jwt'))
  public async deleteAdmin(@Param('id') id: string) {
    return await this.adminService.deleteAdminService(id);
  }

  @Delete('/delete/user/:userId')
  @UseGuards(AuthGuard('admin-jwt'))
  public async deleteAdminsUser(@Param('userId') userId: string) {
    return await this.adminService.deleteAdminsUser(userId);
  }

  @Delete('/company/:companyId')
  @UseGuards(AuthGuard('admin-jwt'))
  public async removeCompanyFromAdmin(@Param('companyId') companyId: string) {
    return await this.adminService.removeCompanyFromAdminService(companyId);
  }
}
