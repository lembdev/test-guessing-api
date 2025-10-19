import { Module } from '@nestjs/common';
import { GameGateway } from './gateways/game.gateway';

@Module({
  imports: [],
  providers: [GameGateway],
})
export class WsModule {}
