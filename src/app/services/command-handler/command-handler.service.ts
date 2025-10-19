import type { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { COMMAND, ICommand } from '../../../contracts';

@Injectable()
export class CommandHandlerService {
  private readonly _commands = {
    [COMMAND.MAKE_GUESS]: 'make-guess',
    [COMMAND.RESET_SECRET]: 'reset-secret',
    [COMMAND.ROOM_CREATE]: 'room-create',
    [COMMAND.ROOM_GET_LIST]: 'room-get-list',
    [COMMAND.ROOM_JOIN]: 'room-join',
    [COMMAND.ROOM_LEAVE]: 'room-leave',
    [COMMAND.SHOW_RESULTS]: 'show-results',
  } as const;

  handleCommand(socket: Socket, data: ICommand) {}
}
