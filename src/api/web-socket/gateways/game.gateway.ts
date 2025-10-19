import type { Server, Socket } from 'socket.io';
import type { ICommand } from 'src/contracts/commands';
import { BadRequestException, Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { CommandHandlerService } from 'src/app';
import { Command } from 'src/contracts/commands';

@WebSocketGateway({ cors: { origin: '*' } })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly _logger = new Logger(this.constructor.name);

  @WebSocketServer()
  private readonly _server: Server;

  constructor(private readonly _commandHandlerService: CommandHandlerService) {}

  handleConnection(socketClient: Socket) {
    this._logger.log(`Client connected: ${socketClient.id}`);
  }

  handleDisconnect(socketClient: Socket) {
    this._logger.log(`Client disconnected: ${socketClient.id}`);
  }

  @SubscribeMessage('command')
  commandMessageHandler(
    @ConnectedSocket() socket: Socket,
    @MessageBody() command: ICommand,
  ): void {
    const parseResult = Command.safeParse(command);

    if (!parseResult.success) {
      const error = new BadRequestException(parseResult.error);
      this._logger.error(parseResult.error);

      socket.emit('error', { error, command });

      return;
    }

    this._commandHandlerService.handleCommand(socket, parseResult.data);
  }
}
