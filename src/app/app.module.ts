import { Module, Provider } from '@nestjs/common';
import { CommandHandlerService } from './services/command-handler/command-handler.service';
import { PlayerService } from './services/player/player.service';
import { PushHandlerService } from './services/push-handler/push-handler.service';
import { ResultsCalculatorService } from './services/results-calculator/results-calculator.service';
import { RoomService } from './services/room/room.service';

const PROVIDERS: Provider[] = [
  CommandHandlerService,
  PlayerService,
  PushHandlerService,
  ResultsCalculatorService,
  RoomService,
];

@Module({
  imports: [],
  providers: PROVIDERS,
  exports: PROVIDERS,
})
export class AppModule {}
