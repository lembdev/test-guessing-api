import { IGuessNumber } from '../../contracts';

export const secretNumberGenerator = (length = 100) => {
  return (Math.floor(Math.random() * length) + 1) as IGuessNumber;
};
