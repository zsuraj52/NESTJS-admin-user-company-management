import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { ConfigService } from '../config/config.service';

/**
 * Jwt Strategy Class
 */
@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, 'user-jwt') {
  /**
   * Constructor
   * @param {ConfigService} configService
   */
  constructor(
    readonly configService: ConfigService,
    private readonly userService: UserService,
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
  async validate(payload: any): Promise<object> {
    console.log(
      '🚀 ~ file: jwt.strategy.ts:34 ~ UserJwtStrategy ~ validate ~ payload:',
      payload,
    );
    const timeDiff = payload.exp - payload.iat;
    if (timeDiff <= 0) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.getUserByIdService(payload.id);
    if (!user) {
      throw new UnauthorizedException();
    }

    delete user.password;
    return user;
  }
}
