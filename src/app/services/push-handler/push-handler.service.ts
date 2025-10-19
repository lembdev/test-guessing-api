import type { Server, Socket } from 'socket.io';
import type { IPushEvent } from 'src/contracts';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PushHandlerService {
  private _server: Server;

  setSocketServer(server: Server) {
    this._server = server;
  }

  push(socket: Socket, event: IPushEvent) {}

  pushError(socket: Socket, event: { command: string; error: unknown }) {}
}
