import { z } from 'zod';

export type IRoomUuid = z.infer<typeof RoomUuid>;
export const RoomUuid = z.ulid().brand<'RoomUuid'>();

export type IRoom = z.infer<typeof Room>;
export const Room = z.object({
  uuid: RoomUuid,
  name: z.string().min(1).max(64),
});
