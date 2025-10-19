import type { IRoom, IRoomUuid } from 'src/contracts';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ulid } from 'ulid';
import { secretNumberGenerator } from '../../helpers';

@Injectable()
export class RoomService {
  private readonly _rooms: Map<IRoomUuid, IRoom> = new Map();

  findAll(): IRoom[] {
    return Array.from(this._rooms.values());
  }

  findOneByUuid(roomUuid: IRoomUuid): IRoom | null {
    return this._rooms.get(roomUuid) || null;
  }

  findOneByUuidOrFail(roomUuid: IRoomUuid) {
    const room = this.findOneByUuid(roomUuid);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room;
  }

  create(name?: string) {
    const room: IRoom = {
      uuid: ulid() as IRoomUuid,
      name: name || `Room ${this._rooms.size + 1}`,
      secretNumber: secretNumberGenerator(),
      players: [],
    };

    this._rooms.set(room.uuid, room);

    return room;
  }

  delete(roomUuid: IRoomUuid) {
    this._rooms.delete(roomUuid);
  }
}
