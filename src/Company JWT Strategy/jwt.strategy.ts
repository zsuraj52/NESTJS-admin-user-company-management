import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { CompanyService } from '../company/company.service';
import { ConfigService } from '../config/config.service';

/**
 * Jwt Strategy Class
 */
@Injectable()
export class CompanyJwtStrategy extends PassportStrategy(
  Strategy,
  'company-jwt',
) {
  /**
   * Constructor
   * @param {ConfigService} configService
   */
  constructor(
    readonly configService: ConfigService,
    private readonly companyService: CompanyService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('WEBTOKEN_SECRET_KEY'),
    });
  }

  /**
   * Checks if the bearer token is a valid token
   * @param {any} jwtPayload validation method for jwt token
   * @returns {Promise<object>} a object to be signed
   */
  async validate({ iat, exp, id }: any): Promise<object> {
    console.log(
      '🚀 ~ file: jwt.strategy.ts:34 ~ AdminJwtStrategy ~ validate ~ id:',
      id,
    );
    const timeDiff = exp - iat;
    if (timeDiff <= 0) {
      throw new UnauthorizedException();
    }

    const company = await this.companyService.getCompanyByCompanyId(id);
    if (!company) {
      throw new UnauthorizedException();
    }

    delete company.password;
    return company;
  }
}
