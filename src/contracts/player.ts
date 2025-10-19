import { z } from 'zod';
import { RoomUuid } from './room';
import { SocketId } from './socket';

export type IPlayerUuid = z.infer<typeof PlayerUuid>;
export const PlayerUuid = z.ulid().brand<'PlayerUuid'>();

export type IPlayer = z.infer<typeof Player>;
export const Player = z.object({
  uuid: PlayerUuid,
  name: z.string().min(1).max(32),
  roomUuid: RoomUuid.nullable(),
  socketId: SocketId,
});
