import { Module, Provider } from '@nestjs/common';
import { CommandHandlerService } from './services/command-handler/command-handler.service';

const PROVIDERS: Provider[] = [CommandHandlerService];

@Module({
  imports: [],
  providers: PROVIDERS,
  exports: PROVIDERS,
})
export class AppModule {}
