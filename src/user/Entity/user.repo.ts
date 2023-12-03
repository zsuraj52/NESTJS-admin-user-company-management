import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

export class UserRepository {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  public async createUser(user: User) {
    return await this.userRepo.save({ ...user });
  }

  public async getUserByEmail(email: string) {
    return await this.userRepo.findOne({
      where: {
        email: email,
        isUserDeleted: false,
      },
    });
  }

  public async updateUser(id: string, user: User) {
    return await this.userRepo.update(id, user);
  }

  public async getUserById(id: string) {
    return await this.userRepo.findOne({
      where: {
        id: id,
        isUserDeleted: false,
      },
    });
  }

  public async getAllUsersRepo(adminId: any) {
    return await this.userRepo.find({
      relations: ['admin'],
      where: {
        admin: { id: adminId },
        isUserDeleted: false,
      },
    });
  }

  public async getUserByUserIdAndAdminIdRepo(userId: string, adminId: string) {
    return await this.userRepo.findOne({
      relations: ['admin'],
      where: {
        admin: { id: adminId },
        id: userId,
        isUserDeleted: false,
      },
    });
  }
}
