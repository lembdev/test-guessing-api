import { z } from 'zod';

export type PlayerUuid = z.infer<typeof PlayerUuid>;
export const PlayerUuid = z.ulid().brand<'PlayerUuid'>();

export type IPlayer = z.infer<typeof Player>;
export const Player = z.object({
  uuid: PlayerUuid,
  name: z.string().min(1).max(32),
});
