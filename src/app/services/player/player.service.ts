import type { IPlayer, IPlayerUuid, ISocketId } from '../../../contracts';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ulid } from 'ulid';

@Injectable()
export class PlayerService {
  private _players: Map<ISocketId, IPlayer> = new Map();

  findOneBySocketId(socketId: ISocketId): IPlayer | null {
    return this._players.get(socketId) || null;
  }

  findOneBySocketIdOrFail(socketId: ISocketId) {
    const room = this.findOneBySocketId(socketId);
    if (!room) {
      throw new NotFoundException('Player not found');
    }

    return room;
  }

  create(socketId: ISocketId, name: string) {
    const player: IPlayer = {
      uuid: ulid() as IPlayerUuid,
      name,
    };

    this._players.set(socketId, player);

    return player;
  }

  delete(socketId: ISocketId) {
    this._players.delete(socketId);
  }
}
