import type { IPlayer, IPlayerUuid, ISocketId } from '../../../contracts';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ulid } from 'ulid';

@Injectable()
export class PlayerService {
  private _players: Map<ISocketId, IPlayer> = new Map();

  findManyByUuids(uuids: IPlayerUuid[]) {
    return Array.from(this._players.values()).filter((player) =>
      uuids.includes(player.uuid),
    );
  }

  findOneBySocketId(socketId: ISocketId): IPlayer | null {
    return this._players.get(socketId) || null;
  }

  findOneBySocketIdOrFail(socketId: ISocketId) {
    const player = this.findOneBySocketId(socketId);
    if (!player) {
      throw new NotFoundException('Player not found');
    }

    return player;
  }

  create(socketId: ISocketId, name: string) {
    const player: IPlayer = {
      uuid: ulid() as IPlayerUuid,
      roomUuid: null,
      socketId,
      name,
    };

    this._players.set(socketId, player);

    return player;
  }

  delete(socketId: ISocketId) {
    this._players.delete(socketId);
  }
}
