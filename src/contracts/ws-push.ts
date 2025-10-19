import { z } from 'zod';
import { GUESS_RESULTS } from './guess';
import { Player, PlayerUuid } from './player';
import { Room, RoomUuid } from './room';
import { COMMAND } from './ws-commands';

export type PUSH = (typeof PUSH)[keyof typeof PUSH];
export const PUSH = {
  ERROR: 'error',
  ROOM_CREATED: 'room-created',
  ROOM_NUMBER_RESET: 'room-number-reset',
  ROOM_LIST_UPDATED: 'room-list-updated',
  ROOM_USER_MADE_GUESS: 'room-user-made-guess',
  ROOM_PLAYER_JOINED: 'room-player-joined',
  ROOM_PLAYER_LEFT: 'room-player-left',
  ROOM_RESULTS: 'room-results',
} as const;

export type IEventError = z.infer<typeof EventError>;
export const EventError = z.object({
  event: z.literal(PUSH.ERROR),
  data: z.object({
    command: z.enum(COMMAND).optional(),
    error: z.any(),
  }),
});

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

export type IEventRoomNumberReset = z.infer<typeof EventRoomNumberReset>;
export const EventRoomNumberReset = z.object({
  event: z.literal(PUSH.ROOM_NUMBER_RESET),
  data: z.object({
    resetBy: PlayerUuid,
  }),
});

export type IEventRoomPlayerMadeGuess = z.infer<typeof EventRoomPlayerGuess>;
export const EventRoomPlayerGuess = z.object({
  event: z.literal(PUSH.ROOM_USER_MADE_GUESS),
  data: z.object({
    playerUuid: PlayerUuid,
  }),
});

export type IEventRoomPlayerJoined = z.infer<typeof EventRoomPlayerJoined>;
export const EventRoomPlayerJoined = z.object({
  event: z.literal(PUSH.ROOM_PLAYER_JOINED),
  data: z.object({
    playerUuid: PlayerUuid,
    playerName: Player.shape.name,
  }),
});

export type IEventRoomPlayerLeft = z.infer<typeof EventRoomPlayerLeft>;
export const EventRoomPlayerLeft = z.object({
  event: z.literal(PUSH.ROOM_PLAYER_LEFT),
  data: z.object({
    playerUuid: PlayerUuid,
  }),
});

export type IEventRoomResults = z.infer<typeof EventRoomResults>;
export const EventRoomResults = z.object({
  event: z.literal(PUSH.ROOM_RESULTS),
  data: z.array(
    z.object({
      playerUuid: PlayerUuid,
      result: z.enum(GUESS_RESULTS),
    }),
  ),
});

export type IPushEvent = z.infer<typeof PushEvent>;
export const PushEvent = z.discriminatedUnion('event', [
  EventError,
  EventRoomCreated,
  EventRoomListUpdated,
  EventRoomNumberReset,
  EventRoomPlayerGuess,
  EventRoomPlayerJoined,
  EventRoomPlayerLeft,
  EventRoomResults,
]);
