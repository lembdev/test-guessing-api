import { Module, Provider } from '@nestjs/common';
import { CommandHandlerService } from './services/command-handler/command-handler.service';
import { GameService } from './services/game/game.service';
import { PlayerService } from './services/player/player.service';
import { PushHandlerService } from './services/push-handler/push-handler.service';
import { RoomService } from './services/room/room.service';

const PROVIDERS: Provider[] = [
  CommandHandlerService,
  GameService,
  PlayerService,
  PushHandlerService,
  RoomService,
];

@Module({
  imports: [],
  providers: PROVIDERS,
  exports: PROVIDERS,
})
export class AppModule {}
