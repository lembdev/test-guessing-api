import type {
  ICommand,
  ICommandMakeGuess,
  ICommandResetSecret,
  ICommandRoomCreate,
  ICommandRoomGetList,
  ICommandRoomJoin,
  ICommandRoomLeave,
  ICommandShowResults,
  IRoom,
  ISocketId,
} from '../../../contracts';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { COMMAND, PUSH } from '../../../contracts';
import { PlayerService } from '../player/player.service';
import { PushHandlerService } from '../push-handler/push-handler.service';
import { ResultsCalculatorService } from '../results-calculator/results-calculator.service';
import { RoomService } from '../room/room.service';

@Injectable()
export class CommandHandlerService {
  private readonly _logger = new Logger(this.constructor.name);

  constructor(
    private readonly _playerService: PlayerService,
    private readonly _roomService: RoomService,
    private readonly _pushHandlerService: PushHandlerService,
    private readonly _resultsCalculatorService: ResultsCalculatorService,
  ) {}

  handle(socketId: ISocketId, command: ICommand) {
    switch (command.command) {
      case COMMAND.MAKE_GUESS:
        return this._commandMakeGuess(socketId, command);
      case COMMAND.RESET_SECRET:
        return this._commandResetSecret(socketId, command);
      case COMMAND.ROOM_CREATE:
        return this._commandRoomCreate(socketId, command);
      case COMMAND.ROOM_GET_LIST:
        return this._commandRoomGetList(socketId, command);
      case COMMAND.ROOM_JOIN:
        return this._commandRoomJoin(socketId, command);
      case COMMAND.ROOM_LEAVE:
        return this._commandRoomLeave(socketId, command);
      case COMMAND.SHOW_RESULTS:
        return this._commandShowResults(socketId, command);
      default:
        throw new BadRequestException('Unknown command');
    }
  }

  private _commandMakeGuess(
    socketId: ISocketId,
    { command, data }: ICommandMakeGuess,
  ) {
    try {
      const player = this._playerService.findOneBySocketIdOrFail(socketId);

      if (!player.roomUuid) {
        throw new BadRequestException('Player not in room');
      }

      const room = this._roomService.findOneByUuidOrFail(player.roomUuid);

      this._roomService.setPlayerGuess(room, player, data.guess);

      const socketIds = this._getRoomPlayerSocketIds(room);

      this._pushHandlerService.push(socketIds, {
        event: PUSH.ROOM_USER_MADE_GUESS,
        payload: { playerUuid: player.uuid },
      });
    } catch (error) {
      this._catchError(socketId, command, error);
    }
  }

  private _commandResetSecret(
    socketId: ISocketId,
    { command }: ICommandResetSecret,
  ) {
    try {
      const player = this._playerService.findOneBySocketIdOrFail(socketId);

      if (!player.roomUuid) {
        throw new BadRequestException('Player not in room');
      }

      const room = this._roomService.findOneByUuidOrFail(player.roomUuid);

      this._roomService.resetSecretNumber(room);

      const socketIds = this._getRoomPlayerSocketIds(room);

      this._pushHandlerService.push(socketIds, {
        event: PUSH.ROOM_NUMBER_RESET,
        payload: { resetBy: player.uuid },
      });
    } catch (error) {
      this._catchError(socketId, command, error);
    }
  }

  private _commandRoomCreate(
    socketId: ISocketId,
    { command, data }: ICommandRoomCreate,
  ) {
    try {
      const room = this._roomService.create(data.roomName);

      this._pushHandlerService.push(socketId, {
        event: PUSH.ROOM_CREATED,
        payload: { roomUuid: room.uuid },
      });
    } catch (error) {
      this._catchError(socketId, command, error);
    }
  }

  private _commandRoomGetList(
    socketId: ISocketId,
    { command }: ICommandRoomGetList,
  ) {
    try {
      const rooms = this._roomService.findAll();

      const roomList = rooms.map((room) => ({
        roomUuid: room.uuid,
        roomName: room.name,
        players: [...room.players.values()].map(({ player }) => ({
          playerUuid: player.uuid,
          playerName: player.name,
        })),
      }));

      this._pushHandlerService.push(socketId, {
        event: PUSH.ROOM_LIST_UPDATED,
        payload: { roomList },
      });
    } catch (error) {
      this._catchError(socketId, command, error);
    }
  }

  private _commandRoomJoin(
    socketId: ISocketId,
    { command, data }: ICommandRoomJoin,
  ) {
    try {
      const player = this._playerService.findOneBySocketIdOrFail(socketId);
      const room = this._roomService.findOneByUuidOrFail(data.roomUuid);

      this._roomService.addPlayerToRoom(room, player);

      const socketIds = this._getRoomPlayerSocketIds(room);

      this._pushHandlerService.push(socketIds, {
        event: PUSH.ROOM_PLAYER_JOINED,
        payload: {
          playerUuid: player.uuid,
          playerName: player.name,
        },
      });
    } catch (error) {
      this._catchError(socketId, command, error);
    }
  }

  private _commandRoomLeave(
    socketId: ISocketId,
    { command }: ICommandRoomLeave,
  ) {
    try {
      const player = this._playerService.findOneBySocketIdOrFail(socketId);

      if (!player.roomUuid) {
        throw new BadRequestException('Player not in room');
      }

      const room = this._roomService.findOneByUuidOrFail(player.roomUuid);

      this._roomService.removePlayerFromRoom(room, player);

      const playersInRoom = this._roomService.getAllPlayers(room);

      if (playersInRoom.length === 0) {
        return this._roomService.delete(room.uuid);
      }

      const socketIds = this._getRoomPlayerSocketIds(room);

      this._pushHandlerService.push(socketIds, {
        event: PUSH.ROOM_PLAYER_LEFT,
        payload: {
          playerUuid: player.uuid,
        },
      });
    } catch (error) {
      this._catchError(socketId, command, error);
    }
  }

  private _commandShowResults(
    socketId: ISocketId,
    { command }: ICommandShowResults,
  ) {
    try {
      const player = this._playerService.findOneBySocketIdOrFail(socketId);

      if (!player.roomUuid) {
        throw new BadRequestException('Player not in room');
      }

      const room = this._roomService.findOneByUuidOrFail(player.roomUuid);

      const results = this._resultsCalculatorService.calculate(
        room.secretNumber,
        room.players,
      );

      const socketIds = this._getRoomPlayerSocketIds(room);

      this._pushHandlerService.push(socketIds, {
        event: PUSH.ROOM_RESULTS,
        payload: results,
      });
    } catch (error) {
      this._catchError(socketId, command, error);
    }
  }

  private _catchError(socketId: ISocketId, command: COMMAND, error: unknown) {
    this._logger.error(`Command '${command}' error:`);
    this._logger.error(error);
    this._pushHandlerService.push(socketId, {
      event: PUSH.ERROR,
      payload: { command, error },
    });
  }

  private _getRoomPlayerSocketIds(room: IRoom) {
    const roomPlayersUuids = [...room.players.keys()];
    const roomPlayers = this._playerService.findManyByUuids(roomPlayersUuids);

    return roomPlayers.map((player) => player.socketId);
  }
}
