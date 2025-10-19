import { Module } from '@nestjs/common';
import { WsModule } from './web-socket/web-socket.module';

@Module({
  imports: [WsModule],
})
export class ApiModule {}
