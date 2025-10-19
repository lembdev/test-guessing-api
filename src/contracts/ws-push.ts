import { z } from 'zod';
import { GuessNumber } from './guess-number';
import { Player, PlayerUuid } from './player';
import { Room, RoomUuid } from './room';

export type PUSH = (typeof PUSH)[keyof typeof PUSH];
export const PUSH = {
  ROOM_CREATED: 'room-created',
  ROOM_LIST_UPDATED: 'room-list-updated',
} as const;

export type IEventRoomCreated = z.infer<typeof EventRoomCreated>;
export const EventRoomCreated = z.object({
  event: z.literal(PUSH.ROOM_CREATED),
  data: z.object({
    roomUuid: RoomUuid,
  }),
});

export type IEventRoomListUpdated = z.infer<typeof EventRoomListUpdated>;
export const EventRoomListUpdated = z.object({
  event: z.literal(PUSH.ROOM_LIST_UPDATED),
  data: z.object({
    roomList: z.array(
      z.object({
        roomUuid: RoomUuid,
        roomName: Room.shape.name,
        players: z.array(
          z.object({
            playerUuid: PlayerUuid,
            playerName: Player.shape.name,
          }),
        ),
      }),
    ),
  }),
});

export type IPushEvent = z.infer<typeof PushEvent>;
export const PushEvent = z.discriminatedUnion('event', [
  EventRoomCreated,
  EventRoomListUpdated,
]);
