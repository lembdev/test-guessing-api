import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as configs from './infrastructure/configs';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: Object.values(configs) }),
  ],
  controllers: [],
  providers: [],
})
export class MainModule {}
