import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();
import * as jwt from 'jsonwebtoken';
import * as sgMail from '@sendgrid/mail';
import { Injectable } from '@nestjs/common';
import { UserRepository } from './Entity/user.repo';
import { AdminRepository } from '../admin/Entity/admin.repo';
import { User } from './Entity/user.entity';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

@Injectable()
export class UserService {
  constructor(
    private userRepo: UserRepository,
    private adminRepo: AdminRepository,
  ) {}

  public async registerUserService(user: any) {
    try {
      console.log(
        '🚀 ~ file: user.service.ts:9 ~ UserService ~ registerUserService ~ user:',
        user,
      );
      if (!user.admin) {
        throw new Error(`Please Provide AdminId`);
      }
      const admin = await this.adminRepo.getAdminByIdRepo(user.admin);
      if (!admin) {
        throw new Error(`No Admin Found`);
      }
      const userData = await this.userRepo.getUserByEmail(user.email);
      console.log(
        '🚀 ~ file: user.service.ts:16 ~ UserService ~ registerUserService ~ userData:',
        userData,
      );
      if (userData) {
        throw new Error('User Already Exist!');
      }
      const password = user.password;
      user.password = await bcrypt.hash(user.password, 10);
      return await this.userRepo.createUser(user).then(async (user) => {
        return await sgMail
          .send({
            to: user.email,
            from: 'suraj.zurange@thinkitive.com',
            subject: 'Registration Successfully',
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Welcome to Our Website</title>
            </head>
            <body>
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <table width="600" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" bgcolor="#007bff" style="padding: 40px 0;">
                          <h1 style="color: #ffffff;">Welcome to Our Website!</h1>
                        </td>
                      </tr>
                      <tr>
                        <td bgcolor="#ffffff" style="padding: 40px 30px;">
                          <p>Hello ${user.firstName + ' ' + user.lastName},</p>
                          <p>Thank you for registering on our website. We're excited to have you as part of our community!</p>
                          <p>Your account has been successfully created. Here are your registration details:</p>
                          <ul>
                            <li><strong>Username:</strong> ${user.username}</li>
                            <li><strong>Email:</strong> ${password}</li>
                          </ul>
                          <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
                          <p>Best regards,<br> The [Your Company Name] Team</p>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" bgcolor="#007bff" style="padding: 20px 0;">
                          <p style="color: #ffffff;">&copy; 2023 [Your Company Name]. All rights reserved.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
            `,
          })
          .then(() => {
            console.log('email send successfully');
            return user;
          });
      });
    } catch (error) {
      console.log(
        '🚀 ~ file: user.service.ts:11 ~ UserService ~ registerUserService ~ error:',
        error,
      );
      return error.message;
    }
  }

  public async loginUserService(userLoginData: any) {
    try {
      console.log(
        '🚀 ~ file: user.service.ts:49 ~ UserService ~ loginUserService ~ userLoginData:',
        userLoginData,
      );
      const user = await this.userRepo.getUserByEmail(userLoginData.email);
      console.log(
        '🚀 ~ file: user.service.ts:52 ~ UserService ~ loginUserService ~ user:',
        user,
      );
      if (!user) {
        throw new Error(`No User Found For Given Credentials`);
      }
      const isValidPassword = await bcrypt.compareSync(
        userLoginData.password,
        user.password,
      );
      console.log(
        '🚀 ~ file: user.service.ts:57 ~ UserService ~ loginUserService ~ isValidPassword:',
        isValidPassword,
      );
      if (isValidPassword === false) {
        throw new Error(`provided Password is Incorrect!`);
      }
      const token = jwt.sign({ ...user }, process.env.WEBTOKEN_SECRET_KEY, {
        expiresIn: '1h',
      });
      return {
        ...user,
        token: token,
      };
    } catch (error) {
      console.log(
        '🚀 ~ file: user.service.ts:52 ~ UserService ~ loginUserService ~ error:',
        error,
      );
      return error.message;
    }
  }

  public async forgotPasswordService(email: string) {
    try {
      console.log(
        '🚀 ~ file: user.service.ts:146 ~ UserService ~ forgotPasswordService ~ email:',
        email,
      );
      const user = await this.userRepo.getUserByEmail(email);
      console.log(
        '🚀 ~ file: user.service.ts:149 ~ UserService ~ forgotPasswordService ~ user:',
        user,
      );
      if (!user || !user.id) {
        throw new Error(`No User Found!`);
      }
      const password = Math.random().toString(36).slice(2);
      console.log(
        '🚀 ~ file: user.service.ts:154 ~ UserService ~ forgotPasswordService ~ password:',
        password,
      );
      user.password = password;
      return await this.userRepo.updateUser(user.id, user).then(async () => {
        return await sgMail.send({
          to: user.email,
          from: 'suraj.zurange@thinkitive.com',
          subject: 'Forgot Password',
          html: `<!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Password Change Notification</title>
                </head>
                <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
                
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4;">
                    <tr>
                      <td align="center">
                        <table width="600" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; background-color: #ffffff; border-radius: 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); margin: 20px auto;">
                          <tr>
                            <td align="center" bgcolor="#007bff" style="padding: 40px 0;">
                              <h1 style="color: #ffffff; margin: 0;">Password Change Notification</h1>
                            </td>
                          </tr>
                          <tr>
                            <td bgcolor="#ffffff" style="padding: 40px 30px;">
                              <p style="margin: 0 0 20px;">Dear ${
                                user.firstName + ' ' + user.lastName
                              },</p>
                              <p style="margin: 0 0 20px;">This email is to inform you that we have processed a password change based on your "Forgot Password" request.</p>
                              <p style="margin: 0 0 20px;">Please Find the Below Passowrd:</p>
                              <strong style="margin: 0 0 20px;>${password}</strong>
                              <p style="margin: 0 0 20px;>We Strongly Recommend You To Change The Password After Logged In.</p>
                              <p style="margin: 0 0 20px;">If you did not initiate this change or if you believe your account has been compromised, please take immediate action by contacting our support team.</p>
                              <p style="margin: 0 0 20px;">Your account security is important to us, and we are here to assist you with any concerns you may have.</p>
                              <p style="margin: 0;">Best regards,<br> [Your Company Name]</p>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" bgcolor="#007bff" style="padding: 20px 0;">
                              <p style="color: #ffffff; margin: 0;">&copy; 2023 [Your Company Name]. All rights reserved.</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
                </html>
                `,
        });
      });
    } catch (error) {
      console.log(
        '🚀 ~ file: user.service.ts:149 ~ UserService ~ forgotPasswordService ~ error:',
        error,
      );
      return error.message;
    }
  }

  public async resetPasswordService(id: any, data: any) {
    try {
      console.log(
        '🚀 ~ file: user.service.ts:229 ~ UserService ~ resetPasswordService ~ data, id:',
        data,
        id,
      );
      const user = await this.userRepo.getUserById(id.id);
      console.log(
        '🚀 ~ file: user.service.ts:232 ~ UserService ~ resetPasswordService ~ user:',
        user,
      );
      if (!user) {
        throw new Error(`No User Found!`);
      }
      const comparePassword = bcrypt.compareSync(
        data.oldPassword,
        user.password,
      );
      console.log(
        '🚀 ~ file: user.service.ts:237 ~ UserService ~ resetPasswordService ~ comparePassword:',
        comparePassword,
      );
      if (comparePassword === false) {
        throw new Error(`Old Password is Wrong!`);
      }
      if (data.oldPassword === data.newPassword) {
        throw new Error(`Old and New Password Matches!`);
      }
      if (data.newPassword !== data.confirmNewPassword) {
        throw new Error(`New Password & Confirm New Password Not Matches!`);
      }
      user.password = await bcrypt.hash(data.newPassword, 10);
      return await this.userRepo.updateUser(id, user);
    } catch (error) {
      console.log(
        '🚀 ~ file: user.service.ts:232 ~ UserService ~ resetPasswordService ~ error:',
        error,
      );
      return error.message;
    }
  }

  public async getUserByIdService(id: string) {
    return await this.userRepo.getUserById(id);
  }

  public async updateUserById(id: string, userData: User) {
    try {
      console.log(
        '🚀 ~ file: user.service.ts:276 ~ UserService ~ updateUserById ~ id, userData:',
        id,
        userData,
      );
      let user = await this.getUserByIdService(id);
      console.log(
        '🚀 ~ file: user.service.ts:279 ~ UserService ~ updateUserById ~ user:',
        user,
      );
      if (!user) {
        throw new Error(`No User Found!`);
      }
      user = Object.assign(user, userData);
      return await this.userRepo.updateUser(id, user);
    } catch (error) {
      console.log(
        '🚀 ~ file: user.service.ts:294 ~ UserService ~ updateUserById ~ error:',
        error,
      );
      return error.message;
    }
  }

  public async getUserByUserIdAndAdminId(userId: string, adminId: string) {
    try {
      console.log(
        '🚀 ~ file: user.service.ts:300 ~ UserService ~ getUserByUserIdAndAdminId ~ userId, adminId:',
        userId,
        adminId,
      );
      return await this.userRepo
        .getUserByUserIdAndAdminIdRepo(userId, adminId)
        .then((user) => {
          console.log(
            '🚀 ~ file: user.service.ts:305 ~ UserService ~ returnawaitthis.userRepo.getUserByUserIdAndAdminIdRepo ~ user:',
            user,
          );
          return user;
        });
    } catch (error) {
      console.log(
        '🚀 ~ file: user.service.ts:303 ~ UserService ~ getUserByUserIdAndAdminId ~ error:',
        error,
      );
      throw error.message;
    }
  }

  public async deleteUserById(id: string) {
    try {
      console.log(
        '🚀 ~ file: user.service.ts:302 ~ UserService ~ deleteUserById ~ id:',
        id,
      );
      const user = await this.userRepo.getUserById(id);
      console.log(
        '🚀 ~ file: user.service.ts:305 ~ UserService ~ deleteUserById ~ user:',
        user,
      );
      if (!user) {
        throw new Error(`No User Found!`);
      }
      user.isUserDeleted = true;
      return await this.userRepo.updateUser(id, user).then(() => {
        return `User With Id ${id} De-activated Successfully!`;
      });
    } catch (error) {
      console.log(
        '🚀 ~ file: user.service.ts:305 ~ UserService ~ deleteUserById ~ error:',
        error,
      );
      return error.message;
    }
  }

  public async getAllUsersForAdminId(adminId: any) {
    return await this.userRepo.getAllUsersRepo(adminId);
  }

  public async deleteUsersForAdminId(id: string) {
    try {
      return await this.userRepo
        .getAllUsersRepo(id)
        .then(async (users: any) => {
          console.log(
            '🚀 ~ file: user.service.ts:337 ~ UserService ~ .then ~ users:',
            users,
          );
          await users.map(async (user: any) => {
            user.isUserDeleted = true;
            await this.userRepo.updateUser(user.id, user);
          });
          return `Users De-Activated for AdminId ${id}`;
        });
    } catch (error) {
      console.log(
        '🚀 ~ file: user.service.ts:336 ~ UserService ~ deleteUsersForAdminId ~ error:',
        error,
      );
      return error.message;
    }
  }
}
