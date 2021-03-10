import { PriceReading } from './price';
import { getCurrentBpiPrice, BpiPrice } from '../client/coinDesk';
import { createBet, hasActiveBet, getActiveBet, updateBetScore, deleteBet } from './repositories/activeBets';
import { upsertScore } from './repositories/score';
import BetServiceException from './error/BetServiceException';

export interface UserBet {
  userId: string;
  betHigh: boolean;
  price: PriceReading;
  scored?: boolean;
}

export interface BetResult {
  betPrice: PriceReading;
  newPrice: BpiPrice;
  scored: boolean;
}

export async function placeBet(bet: UserBet): Promise<void> {
  if (await hasActiveBet(bet.userId)) throw new BetServiceException('User has active bet in play');

  return createBet(bet);
}

async function updateExpiredBetScore(userId: string) {
  const activeBet = await getActiveBet(userId);
  if (!activeBet) return;

  /**
   * Since we do not run jobs to backgrond process bets, a user may quit and close his browser.
   * If he returns later, the bet is expired and given we don't know if his guess was good or not,
   * to avoid penalizing the user, we fail in his favor.
   * Alternatives to this could be: implement a background job scheduler to ensure bets are always
   * verified, or integrate with CoinDesk's History API.
   */
  if (activeBet.scored !== undefined) {
    await upsertScore(userId, activeBet.scored);
  }

  await deleteBet(userId);
}

async function updateScore(activeBet: UserBet, userId: string): Promise<BetResult | null> {
  const currentPrice = await getCurrentBpiPrice();
  const priceRaised = currentPrice.rate > activeBet.price.rate;
  const priceDropped = currentPrice.rate <= activeBet.price.rate;
  const scored = (activeBet.betHigh && priceRaised) || (!activeBet.betHigh && priceDropped);

  await updateBetScore(activeBet, scored);
  await upsertScore(userId, scored);
  await deleteBet(userId);

  return {
    betPrice: activeBet.price,
    newPrice: currentPrice,
    scored,
  };
}

export async function evaluteActiveBet(userId: string): Promise<BetResult | null> {
  const activeBet = await getActiveBet(userId);

  if (!activeBet) {
    throw new BetServiceException(`No active bets in play for ${userId}`);
  }

  const readingElapsedTimeSecs = (Date.now() - new Date(activeBet.price.time).getTime()) / 1000;

  if (readingElapsedTimeSecs <= 60) {
    const checkBackInSecs = Math.round(60 - readingElapsedTimeSecs);
    throw new BetServiceException(`Bets can only be evaluated 60s after the bet price reading, check back in ${checkBackInSecs}s`);
  }

  if (readingElapsedTimeSecs > 120) {
    await updateExpiredBetScore(userId);
    throw new BetServiceException(`Your bet is expired! ${readingElapsedTimeSecs}s have passed since you placed your bet`);
  }

  return updateScore(activeBet, userId);
}
