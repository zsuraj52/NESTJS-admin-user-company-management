import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './admin.entity';
import { Repository } from 'typeorm';

export class AdminRepository {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  public async createAdminEntry(admin: any) {
    return this.adminRepository.save({ ...admin });
  }

  public async getAdminByEmailRepo(email: string) {
    return await this.adminRepository.findOne({
      where: { email: email, isAdminDeleted: false },
    });
  }

  public async getAdminByIdRepo(id: string) {
    return await this.adminRepository.findOne({
      where: { id: id, isAdminDeleted: false },
    });
  }

  public async getByUsernameAndPassRepo(username: string) {
    return await this.adminRepository.findOne({
      where: { username: username, isAdminDeleted: false },
    });
  }

  public async updateAdminDetailsRepo(id: string, adminData: Admin) {
    return await this.adminRepository
      .update(id, adminData)
      .then(async (admin: any) => {
        return await this.adminRepository.findOne({
          where: { id: admin.id, isAdminDeleted: false },
        });
      });
  }

  public async getAdminByPasswordRepo(password: string) {
    return await this.adminRepository.findOne({
      where: { password: password, isAdminDeleted: false },
    });
  }
}
