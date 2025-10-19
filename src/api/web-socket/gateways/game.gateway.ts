import type { Server, Socket } from 'socket.io';
import { BadRequestException, Logger, OnModuleInit } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { CommandHandlerService, PushHandlerService } from 'src/app';
import { Command } from 'src/contracts/ws-commands';

@WebSocketGateway({ cors: { origin: '*' } })
export class GameGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  private readonly _logger = new Logger(this.constructor.name);

  @WebSocketServer()
  private readonly _server: Server;

  constructor(
    private readonly _commandHandlerService: CommandHandlerService,
    private readonly _pushHandlerService: PushHandlerService,
  ) {}

  onModuleInit() {
    this._pushHandlerService.setSocketServer(this._server);
  }

  handleConnection(socket: Socket) {
    this._logger.log(`Client connected: ${socket.id}`);

    socket.onAny((event: string, ...args: any[]) => {
      try {
        const payload = args[0];
        if (!payload) return;

        this.messageHandler(socket, payload);
      } catch (err) {
        this._logger.error(`Error handling event '${event}': ${err}`);
      }
    });
  }

  handleDisconnect(socket: Socket) {
    this._logger.log(`Client disconnected: ${socket.id}`);
  }

  messageHandler(socket: Socket, command: unknown) {
    const parseResult = Command.safeParse(command);

    return parseResult.success
      ? this._commandHandlerService.handle(socket, parseResult.data)
      : this._emitError(socket, command, parseResult.error);
  }

  private _emitError(socket: Socket, command: unknown, errorDescr: unknown) {
    const error = new BadRequestException(errorDescr);
    this._logger.error(error);

    socket.emit('error', { error, command });
  }
}
