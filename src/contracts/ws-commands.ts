import { z } from 'zod';
import { Guess } from './guess';
import { RoomUuid } from './room';

export type COMMAND = (typeof COMMAND)[keyof typeof COMMAND];
export const COMMAND = {
  MAKE_GUESS: 'make-guess',
  RESET_SECRET: 'reset-secret',
  ROOM_CREATE: 'room-create',
  ROOM_GET_LIST: 'room-get-list',
  ROOM_JOIN: 'room-join',
  ROOM_LEAVE: 'room-leave',
  SHOW_RESULTS: 'show-results',
} as const;

export type ICommandMakeGuess = z.infer<typeof CommandMakeGuess>;
export const CommandMakeGuess = z.object({
  command: z.literal(COMMAND.MAKE_GUESS),
  data: z.object({
    guess: Guess,
  }),
});

export type ICommandResetSecret = z.infer<typeof CommandResetSecret>;
export const CommandResetSecret = z.object({
  command: z.literal(COMMAND.RESET_SECRET),
});

export type ICommandRoomCreate = z.infer<typeof CommandRoomCreate>;
export const CommandRoomCreate = z.object({
  command: z.literal(COMMAND.ROOM_CREATE),
  data: z.object({
    roomName: z.string().min(1).max(64).optional(),
  }),
});

export type ICommandRoomGetList = z.infer<typeof CommandRoomGetList>;
export const CommandRoomGetList = z.object({
  command: z.literal(COMMAND.ROOM_GET_LIST),
});

export type ICommandRoomJoin = z.infer<typeof CommandRoomJoin>;
export const CommandRoomJoin = z.object({
  command: z.literal(COMMAND.ROOM_JOIN),
  data: z.object({
    roomUuid: RoomUuid,
  }),
});

export type ICommandRoomLeave = z.infer<typeof CommandRoomLeave>;
export const CommandRoomLeave = z.object({
  command: z.literal(COMMAND.ROOM_LEAVE),
});
export type ICommandShowResults = z.infer<typeof CommandShowResults>;
export const CommandShowResults = z.object({
  command: z.literal(COMMAND.SHOW_RESULTS),
});

export type ICommand = z.infer<typeof Command>;
export const Command = z.discriminatedUnion('command', [
  CommandMakeGuess,
  CommandResetSecret,
  CommandRoomCreate,
  CommandRoomGetList,
  CommandRoomJoin,
  CommandRoomLeave,
  CommandShowResults,
]);
