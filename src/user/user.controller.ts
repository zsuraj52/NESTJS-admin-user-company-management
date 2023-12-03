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
import { User } from './Entity/user.entity';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  public async registerUser(@Body() user: User) {
    return await this.userService.registerUserService(user);
  }

  @Post('/login')
  public async loginUser(@Body() userLoginData: any) {
    return await this.userService.loginUserService(userLoginData);
  }

  @Post('/forgot/password')
  public async forgotPassword(@Query() email: string) {
    return await this.userService.forgotPasswordService(email);
  }

  @UseGuards(AuthGuard('user-jwt'))
  @Post('/password/reset')
  public async resetPassword(@Query() id: string, @Body() data: string) {
    return await this.userService.resetPasswordService(id, data);
  }

  @Get('/:id')
  @UseGuards(AuthGuard('user-jwt'))
  public async getUser(@Param('id') id: string) {
    return await this.userService.getUserByIdService(id);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard('user-jwt'))
  public async updateUser(@Param('id') id: string, @Body() user: User) {
    return await this.userService.updateUserById(id, user);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('user-jwt'))
  public async deleteUser(@Param('id') id: string) {
    return await this.userService.deleteUserById(id);
  }
}
