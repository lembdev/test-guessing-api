import { Module } from '@nestjs/common';
import { AppModule } from 'src/app/app.module';
import { GameGateway } from './gateways/game.gateway';

@Module({
  imports: [AppModule],
  providers: [GameGateway],
})
export class WsModule {}
