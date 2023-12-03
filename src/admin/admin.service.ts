import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();
import * as jwt from 'jsonwebtoken';
import * as sgMail from '@sendgrid/mail';
import { AdminRepository } from './Entity/admin.repo';
import { Admin } from './Entity/admin.entity';
import { registerAdmin } from './DTO/admin.dto';
import { UserService } from '../user/user.service';
import { CompanyService } from '../company/company.service';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

@Injectable()
export class AdminService {
  constructor(
    private adminRepository: AdminRepository,
    private userService: UserService,
    private companyService: CompanyService,
  ) {}

  public async createAdminService(admin: registerAdmin): Promise<Admin> {
    console.log(
      '🚀 ~ file: admin.service.ts:8 ~ AdminService ~ createAdminService ~ admin:',
      admin,
    );
    try {
      return await this.validateEmail(admin.email)
        .then(async (response) => {
          console.log(
            '🚀 ~ file: admin.service.ts:24 ~ AdminService ~ .then ~ response:',
            response,
          );
          if (response === false) {
            throw new Error(
              `Invalid Email: ${admin.email}. Please Provide Valid Input.`,
            );
          }
          return await this.adminRepository
            .getAdminByEmailRepo(admin.email)
            .then(async (adminData: any) => {
              console.log(
                '🚀 ~ file: admin.service.ts:36 ~ AdminService ~ .then ~ adminData:',
                adminData,
              );
              if (adminData) {
                throw new Error(`Admin With Provided Email Already exist!`);
              }
              admin.password = await bcrypt.hash(admin.password, 10);
              return await this.adminRepository
                .createAdminEntry(admin)
                .then((adminData: any) => {
                  console.log(
                    '🚀 ~ file: admin.service.ts:15 ~ AdminService ~ returnawaitthis.adminRepository.createAdminEntry ~ adminData:',
                    adminData,
                  );
                  return adminData;
                });
            });
        })
        .catch((err: any) => {
          throw err;
        });
    } catch (error) {
      console.log(
        '🚀 ~ file: admin.service.ts:11 ~ AdminService ~ createAdminService ~ error:',
        error.message,
      );
      throw error.message;
    }
  }

  public async loginAdminService(adminData: any) {
    try {
      console.log(
        '🚀 ~ file: admin.service.ts:68 ~ AdminService ~ loginAdminService ~ adminData:',
        adminData,
      );
      const admin = await this.adminRepository.getAdminByEmailRepo(
        adminData.email,
      );
      console.log(
        '🚀 ~ file: admin.service.ts:71 ~ AdminService ~ loginAdminService ~ admin:',
        admin,
      );
      if (!admin) {
        throw new Error(`No Admin Found`);
      }
      const isPasswordCorrect = bcrypt.compareSync(
        adminData.password,
        admin.password,
      );
      if (isPasswordCorrect === false) {
        throw new Error(`Incorrect Password `);
      }
      const token = jwt.sign({ ...admin }, process.env.WEBTOKEN_SECRET_KEY, {
        expiresIn: '1h',
      });
      return {
        ...admin,
        token: token,
      };
    } catch (error) {
      console.log(
        '🚀 ~ file: admin.service.ts:71 ~ AdminService ~ loginAdminService ~ error:',
        error,
      );
      throw error.message;
    }
  }

  public async getAdminByIdService(id: string) {
    try {
      console.log(
        '🚀 ~ file: admin.service.ts:108 ~ AdminService ~ getAdminByIdService ~ id:',
        id,
      );
      return await this.adminRepository.getAdminByIdRepo(id);
    } catch (error) {
      console.log(
        '🚀 ~ file: admin.service.ts:112 ~ AdminService ~ getAdminByIdService ~ error:',
        error,
      );
      throw error.message;
    }
  }

  public async getAllUsersForAdminService(id: string) {
    try {
      console.log(
        '🚀 ~ file: admin.service.ts:123 ~ AdminService ~ getAllUsersForAdminService ~ id:',
        id,
      );
      const admin = await this.adminRepository.getAdminByIdRepo(id);
      console.log(
        '🚀 ~ file: admin.service.ts:126 ~ AdminService ~ getAllUsersForAdminService ~ admin:',
        admin,
      );
      return await this.userService.getAllUsersForAdminId(id);
    } catch (error) {
      console.log(
        '🚀 ~ file: admin.service.ts:126 ~ AdminService ~ getAllUsersForAdminService ~ error:',
        error,
      );
      return error.message;
    }
  }

  public async getAllCompaniesForAdminService(adminId: string) {
    try {
      console.log(
        '🚀 ~ file: admin.service.ts:150 ~ AdminService ~ getAllCompaniesForAdminService ~ adminId:',
        adminId,
      );
      return await this.companyService.getAllCompaniesForAdminId(adminId);
    } catch (error) {
      console.log(
        '🚀 ~ file: admin.service.ts:153 ~ AdminService ~ getAllCompaniesForAdminService ~ error:',
        error,
      );
      throw error;
    }
  }

  public async getByUsernameAndPass(username: string, password: string) {
    try {
      console.log(
        '🚀 ~ file: admin.service.ts:119 ~ AdminService ~ getByUsernameAndPass ~ username, password:',
        username,
        password,
      );
      return await this.adminRepository.getByUsernameAndPassRepo(username);
    } catch (error) {
      console.log(
        '🚀 ~ file: admin.service.ts:122 ~ AdminService ~ getByUsernameAndPass ~ error:',
        error,
      );
    }
  }

  public async getAdminByEmail(email: string) {
    try {
      console.log(
        '🚀 ~ file: admin.service.ts:108 ~ AdminService ~ getAdminByEmailService ~ email:',
        email,
      );
      return await this.adminRepository.getAdminByEmailRepo(email);
    } catch (error) {
      console.log(
        '🚀 ~ file: admin.service.ts:112 ~ AdminService ~ getAdminByEmailService ~ error:',
        error,
      );
      throw error.message;
    }
  }

  public async updateAdminDetailsService(id: string, admin: Admin) {
    try {
      console.log(
        '🚀 ~ file: admin.service.ts:152 ~ AdminService ~ updateAdminDetailsService ~ id, admin:',
        id,
        admin,
      );
      let adminData = await this.adminRepository.getAdminByIdRepo(id);
      console.log(
        '🚀 ~ file: admin.service.ts:159 ~ AdminService ~ updateAdminDetailsService ~ adminData:',
        adminData,
      );
      if (!adminData) {
        throw new Error(`No Admin Found For Id ${id}`);
      }
      if (admin.password) {
        admin.password = await bcrypt.hash(admin.password, 10);
      }
      adminData = { ...adminData, ...admin };
      return await this.adminRepository.updateAdminDetailsRepo(id, adminData);
    } catch (error) {
      console.log(
        '🚀 ~ file: admin.service.ts:155 ~ AdminService ~ updateAdminDetailsService ~ error:',
        error.message,
      );
      throw error.message;
    }
  }

  public async updateUserDetailsService(
    userId: string,
    adminId: string,
    userDetails: any,
  ) {
    try {
      console.log(
        '🚀 ~ file: admin.service.ts:209 ~ AdminService ~ updateUserDetailsService ~ userId, adminId, userDetails:',
        userId,
        adminId,
        userDetails,
      );
      const user = await this.userService.getUserByIdService(userId);
      console.log(
        '🚀 ~ file: admin.service.ts:212 ~ AdminService ~ updateUserDetailsService ~ user:',
        user,
      );
      if (!user) {
        throw new Error(`No User Found For Id ${userId}`);
      }
      if (userDetails.password) {
        userDetails.password = bcrypt.hash(userDetails.password, 10);
      }
      return await this.userService
        .updateUserById(userId, userDetails)
        .then(async () => {
          return await this.userService.getUserByIdService(userId);
        });
    } catch (error) {
      console.log(
        '🚀 ~ file: admin.service.ts:212 ~ AdminService ~ updateUserDetailsService ~ error:',
        error,
      );
      throw error.message;
    }
  }

  public async updateCompanyDetailsService(
    companyDetails: any,
    companyId: string,
  ) {
    try {
      console.log(
        '🚀 ~ file: admin.service.ts:248 ~ AdminService ~ updateCompanyDetailsService ~ companyDetails, companyId:',
        companyDetails,
        companyId,
      );
      let company = await this.companyService.getCompanyByCompanyId(companyId);
      console.log(
        '🚀 ~ file: admin.service.ts:255 ~ AdminService ~ updateCompanyDetailsService ~ company:',
        company,
      );
      if (!company) {
        throw new Error(`No Company Found`);
      }
      company = Object.assign(company, companyDetails);
      return await this.companyService.updateCompanyDetailsService(
        companyId,
        company,
      );
    } catch (error) {
      console.log(
        '🚀 ~ file: admin.service.ts:251 ~ AdminService ~ updateCompanyDetailsService ~ error:',
        error,
      );
      throw error;
    }
  }

  public async deleteAdminService(id: string) {
    try {
      console.log(
        '🚀 ~ file: admin.service.ts:178 ~ AdminService ~ deleteAdminService ~ id:',
        id,
      );
      const admin = await this.adminRepository.getAdminByIdRepo(id);
      console.log(
        '🚀 ~ file: admin.service.ts:181 ~ AdminService ~ deleteAdminService ~ admin:',
        admin,
      );
      if (!admin) {
        throw new Error(`No Admin Found For Id ${id}`);
      }
      admin.isAdminDeleted = true;
      return await this.adminRepository
        .updateAdminDetailsRepo(id, admin)
        .then(async () => {
          await this.userService.deleteUsersForAdminId(id);
          return {
            Message: 'Admin De-activated Successfully!',
          };
        });
    } catch (error) {
      console.log(
        '🚀 ~ file: admin.service.ts:181 ~ AdminService ~ deleteAdminService ~ error:',
        error.message,
      );
      throw error.message;
    }
  }

  public async forgotPasswordService(email: string) {
    try {
      console.log(
        '🚀 ~ file: admin.service.ts:210 ~ AdminService ~ forgotPasswordService ~ email:',
        email,
      );
      return await this.validateEmail(email).then(async (response: boolean) => {
        if (response === false) {
          throw new Error(`Please Provide Valid Input Email`);
        }
        const admin = await this.adminRepository.getAdminByEmailRepo(email);
        if (!admin) {
          throw new Error(`No Admin Found`);
        }
        const password = Math.random().toString(36).slice(2);
        console.log(
          '🚀 ~ file: admin.service.ts:225 ~ AdminService ~ returnawaitthis.validateEmail ~ password:',
          password,
        );
        admin.password = await bcrypt.hash(password, 10);
        return await this.adminRepository
          .updateAdminDetailsRepo(admin.id, admin)
          .then(async () => {
            console.log('sending email........');
            return await sgMail
              .send({
                to: email,
                from: 'suraj.zurange@thinkitive.com',
                subject: 'Forgot Password',
                html: `<!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Password Reset</title>
                </head>
                <body>
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2>Password Reset</h2>
                        <p>Dear ${admin.firstName + ' ' + admin.lastName},
                        <br>We have received a request to reset your password.
                        <br>Here is your temporary newly generated password:</p>
                        <p><strong>${password}</strong></p>
                        <p>Please use this temporary password to log in to your account.<br> Once logged in, we strongly recommend changing the password to something more secure and memorable. 
                        <br>
                        You can do this by navigating to your account settings and selecting the option to change your password.</p>
                        <p>If you did not request a password reset, please contact our support team immediately at <b>support@surajteam.com</b> or <b>+91 1234567890</b>.</p>
                        <p>Best regards</p>
                    </div>
                </body>
                </html>
            `,
              })
              .then(() => {
                console.log('Email Sent Successfully!');
                return 'Please Check Your Email';
              })
              .catch((err) => {
                console.log(
                  '🚀 ~ file: admin.service.ts:268 ~ AdminService ~ .then ~ err:',
                  err.message,
                );
                return err.message;
              });
          });
      });
    } catch (error) {
      console.log(
        '🚀 ~ file: admin.service.ts:213 ~ AdminService ~ forgotPasswordService ~ error:',
        error,
      );
      throw error.message;
    }
  }

  public async resetPasswordService(data: any) {
    try {
      console.log(
        '🚀 ~ file: admin.service.ts:277 ~ AdminService ~ resetPasswordService ~ data:',
        data,
      );
      const admin = await this.adminRepository.getAdminByEmailRepo(data.email);
      console.log(
        '🚀 ~ file: admin.service.ts:281 ~ AdminService ~ resetPasswordService ~ admin:',
        admin,
      );
      const passwordCompare = await bcrypt.compareSync(
        data.oldPassword,
        admin.password,
      );
      if (passwordCompare !== true) {
        throw new Error(`Old Password is Wrong`);
      }
      if (data.newPassword !== data.confirmNewPassword) {
        throw new Error(`new Password Confirm NewPassword is not indentical`);
      }
      const password = await bcrypt.hash(data.newPassword, 10);
      console.log(
        '🚀 ~ file: admin.service.ts:296 ~ AdminService ~ resetPasswordService ~ password:',
        password,
      );
      admin.password = password;
      return await this.adminRepository.updateAdminDetailsRepo(admin.id, admin);
      return admin;
    } catch (error) {
      console.log(
        '🚀 ~ file: admin.service.ts:280 ~ AdminService ~ resetPasswordService ~ error:',
        error,
      );
      throw error.message;
    }
  }

  public async createUserService(user: any) {
    try {
      console.log(
        '🚀 ~ file: admin.service.ts:354 ~ AdminService ~ createUserService ~ user:',
        user,
      );
      return await this.validateEmail(user.email).then(
        async (response: boolean) => {
          console.log(
            '🚀 ~ file: admin.service.ts:360 ~ AdminService ~ returnawaitthis.validateEmail ~ response:',
            response,
          );
          if (response === false) {
            throw new Error(`Invalid Email ${user.email}`);
          }
          return await this.userService.registerUserService(user);
        },
      );
    } catch (error) {
      console.log(
        '🚀 ~ file: admin.service.ts:357 ~ AdminService ~ createUserService ~ error:',
        error,
      );
      return error.message;
    }
  }

  public async registerCompanyService(company: any, adminId: any) {
    try {
      console.log(
        '🚀 ~ file: admin.service.ts:418 ~ AdminService ~ registerCompanyService ~ company, adminId:',
        company,
        adminId,
      );
      return await this.companyService
        .createCompanyService({
          ...company,
          admin: adminId,
        })
        .catch((err) => {
          console.log(
            '🚀 ~ file: admin.service.ts:432 ~ AdminService ~ registerCompanyService ~ err:',
            err.message,
          );
          throw new Error(err.message);
        });
    } catch (error) {
      console.log(
        '🚀 ~ file: admin.service.ts:421 ~ AdminService ~ registerCompanyService ~ error:',
        error.message,
      );
      return error.message;
    }
  }

  public async deleteAdminsUser(userId: string) {
    try {
      console.log(
        '🚀 ~ file: admin.service.ts:381 ~ AdminService ~ deleteAdminsUser ~ userId:',
        userId,
      );
      const user = await this.userService.getUserByIdService(userId);
      console.log(
        '🚀 ~ file: admin.service.ts:384 ~ AdminService ~ deleteAdminsUser ~ user:',
        user,
      );
      if (!user) {
        throw new Error(`User Not Found!`);
      }
      user.isUserDeleted = true;
      return await this.userService.updateUserById(user.id, user).then(() => {
        return `User With Name ${
          user.firstName + ' ' + user.lastName
        } Associated to Admin With Id ${
          user.admin
        } De-Activated Successfully! `;
      });
    } catch (error) {
      console.log(
        '🚀 ~ file: admin.service.ts:384 ~ AdminService ~ deleteAdminsUser ~ error:',
        error,
      );
      return error.message;
    }
  }

  public async removeCompanyFromAdminService(companyId: string) {
    try {
      console.log(
        '🚀 ~ file: admin.service.ts:527 ~ AdminService ~ removeCompanyFromAdminService ~ companyId:',
        companyId,
      );
      const company =
        await this.companyService.getCompanyByCompanyId(companyId);
      console.log(
        '🚀 ~ file: admin.service.ts:530 ~ AdminService ~ removeCompanyFromAdminService ~ company:',
        company,
      );
      if (!company) {
        throw new Error(`No Company Found!`);
      }
      company.isCompanyDeleted = true;
      return await this.companyService
        .updateCompanyDetailsService(companyId, company)
        .catch((err) => {
          throw err.message;
        });
    } catch (error) {
      console.log(
        '🚀 ~ file: admin.service.ts:530 ~ AdminService ~ removeCompanyFromAdminService ~ error:',
        error.message,
      );
      return error.message;
    }
  }

  public async validateEmail(email: string) {
    console.log(
      '🚀 ~ file: admin.validation.ts:3 ~ AdminDataValidation ~ validateEmail ~ email:',
      email,
    );
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email,
    );
  }
}
