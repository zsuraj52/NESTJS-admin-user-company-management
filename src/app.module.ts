import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { AdminAuthModule } from './Admin JWT Strategy/admin.auth.module';
import { UserAuthModule } from './User JWT Strategy/user.auth.module';
import { CompanyModule } from './company/company.module';
import { CompanyAuthModule } from './Company JWT Strategy/admin.auth.module';

@Module({
  imports: [
    AdminModule,
    AdminAuthModule,
    UserModule,
    UserAuthModule,
    CompanyModule,
    CompanyAuthModule,
    ConfigModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'NESTJSADMINMANAGEMENT',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
