import { z } from 'zod';
import { GuessNumber } from './guess-number';
import { Player } from './player';

export type IRoomUuid = z.infer<typeof RoomUuid>;
export const RoomUuid = z.ulid().brand<'RoomUuid'>();

export type IRoom = z.infer<typeof Room>;
export const Room = z.object({
  uuid: RoomUuid,
  name: z.string().min(1).max(64),
  secretNumber: GuessNumber,
  players: z.array(
    z.object({
      player: Player,
      guess: GuessNumber,
    }),
  ),
});
