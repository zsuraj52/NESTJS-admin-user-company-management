import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '../config/config.service';
import { CompanyJwtStrategy } from './jwt.strategy';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'company-jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('WEBTOKEN_SECRET_KEY'),
          signOptions: {
            ...(configService.get('WEBTOKEN_EXPIRATION_TIME')
              ? {
                  expiresIn: Number(
                    configService.get('WEBTOKEN_EXPIRATION_TIME'),
                  ),
                }
              : {}),
          },
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule,
    CompanyModule,
  ],
  controllers: [],
  providers: [CompanyJwtStrategy],
  exports: [PassportModule.register({ defaultStrategy: 'company-jwt' })],
})
export class CompanyAuthModule {}
