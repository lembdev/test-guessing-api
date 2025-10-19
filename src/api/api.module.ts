import { Module } from '@nestjs/common';
import { WebSocketModule } from './web-socket/web-socket.module';

@Module({
  imports: [WebSocketModule],
})
export class ApiModule {}
