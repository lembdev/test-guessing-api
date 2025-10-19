import type { Server } from 'socket.io';
import type { IPushEvent, ISocketId } from 'src/contracts';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PushHandlerService {
  private _server: Server;

  setSocketServer(server: Server) {
    this._server = server;
  }

  push(socketIds: ISocketId | ISocketId[], { event, payload }: IPushEvent) {
    const targets = Array.isArray(socketIds) ? socketIds : [socketIds];

    for (const socketId of targets) {
      this._server.to(socketId).emit(event, payload);
    }
  }
}
