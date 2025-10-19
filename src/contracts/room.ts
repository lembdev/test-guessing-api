import { z } from 'zod';
import { Guess } from './guess';
import { Player, PlayerUuid } from './player';

export type IRoomUuid = z.infer<typeof RoomUuid>;
export const RoomUuid = z.ulid().brand<'RoomUuid'>();

export type IRoom = z.infer<typeof Room>;
export const Room = z.object({
  uuid: RoomUuid,
  name: z.string().min(1).max(64),
  secretNumber: Guess,
  players: z.map(
    PlayerUuid,
    z.object({ player: Player, guess: Guess.nullable() }),
  ),
});
