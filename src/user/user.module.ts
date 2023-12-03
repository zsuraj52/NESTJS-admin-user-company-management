import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './Entity/user.entity';
import { UserRepository } from './Entity/user.repo';
import { AdminRepository } from '../admin/Entity/admin.repo';
import { Admin } from '../admin/Entity/admin.entity';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, AdminRepository],
  imports: [TypeOrmModule.forFeature([User, Admin])],
  exports: [UserService],
})
export class UserModule {}
