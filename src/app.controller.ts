import { Controller } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  async getHello() {
    return this.appService.getHello();
  }
}
