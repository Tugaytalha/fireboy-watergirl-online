import { Rank, RANK_A_TIME_MULTIPLIER, RANK_B_TIME_MULTIPLIER } from '@fbwg/shared';
import type { LevelPar } from '@fbwg/shared';

export function calculateRank(
  par: LevelPar,
  timeTaken: number,
  redCollected: number,
  blueCollected: number,
): Rank {
  const allDiamonds =
    redCollected >= par.diamonds.red && blueCollected >= par.diamonds.blue;
  const fastTime = timeTaken <= par.time * RANK_A_TIME_MULTIPLIER;
  const decentTime = timeTaken <= par.time * RANK_B_TIME_MULTIPLIER;

  if (allDiamonds && fastTime) return Rank.A;
  if (allDiamonds || decentTime) return Rank.B;
  return Rank.C;
}
