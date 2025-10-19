import { z } from 'zod';

export type IGuess = z.infer<typeof Guess>;
export const Guess = z.number().min(1).max(100).brand<'Guess'>();

export type GUESS_RESULTS = (typeof GUESS_RESULTS)[keyof typeof GUESS_RESULTS];
export const GUESS_RESULTS = {
  CORRECT: 'correct',
  HIGHER: 'higher',
  LOWER: 'lower',
  NOT_GUESSED: 'not guessed',
};
