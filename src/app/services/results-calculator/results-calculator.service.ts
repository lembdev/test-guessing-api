import { Injectable } from '@nestjs/common';
import { GUESS_RESULTS, IPlayer, IPlayerUuid } from '../../../contracts';

@Injectable()
export class ResultsCalculatorService {
  calculate(
    secret: number,
    players: Map<IPlayerUuid, { player: IPlayer; guess: number | null }>,
  ) {
    return [...players.values()].flatMap(({ player, guess }) => ({
      playerUuid: player.uuid,
      result: this._guessMapping(secret, guess),
    }));
  }

  private _guessMapping(secret: number, guess: number | null) {
    switch (true) {
      case guess === secret:
        return GUESS_RESULTS.CORRECT;
      case guess !== null && guess < secret:
        return GUESS_RESULTS.HIGHER;
      case guess !== null && guess > secret:
        return GUESS_RESULTS.LOWER;
      default:
        return GUESS_RESULTS.NOT_GUESSED;
    }
  }
}
