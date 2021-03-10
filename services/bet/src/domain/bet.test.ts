import { evaluteActiveBet, UserBet } from './bet';
import { mocked } from 'ts-jest/utils';
import { getActiveBet, deleteBet } from './repositories/activeBets';
import BetServiceError from './error/BetServiceException';
import { upsertScore } from './repositories/score';
import { getCurrentBpiPrice } from '../client/coinDesk';

jest.useFakeTimers('modern');
jest.mock('./repositories/activeBets');
jest.mock('./repositories/score');
jest.mock('../client/coinDesk');

describe('domain: bet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.setSystemTime(1615331381711);
  });

  describe('evaluteActiveBet', () => {
    it('should throw a domain exception when the user has no active bets', async () => {
      mocked(getActiveBet).mockResolvedValueOnce(null);
      await expect(evaluteActiveBet('johncena')).rejects.toStrictEqual(
        new BetServiceError('No active bets in play for johncena')
      );
    });

    it("should throw a domain exception when the user's current bet has been done less than 60s ago", async () => {
      const activeBet: UserBet = {
        userId: 'johncena',
        betHigh: true,
        price: {
          currency: 'EUR',
          rate: 45950.3607,
          sign:
            '49f410800f9d36f6aab02ac8bbf65f0ee512b209359050993319aa3855af4266',
          time: '2021-03-09T23:09:41.711Z',
        },
        betTime: '2021-03-09T23:09:41.711Z'
      };

      mocked(getActiveBet).mockResolvedValueOnce(activeBet);
      jest.advanceTimersByTime(30 * 1000);

      await expect(evaluteActiveBet('johncena')).rejects.toStrictEqual(
        new BetServiceError(
          'Bets can only be evaluated 60s after the bet price reading, check back in 30s'
        )
      );
    });

    it("should throw a domain exception and delete the user's bet when the user's bet has expired", async () => {
      const activeBet: UserBet = {
        userId: 'johncena',
        betHigh: true,
        price: {
          currency: 'EUR',
          rate: 45950.3607,
          sign:
            '49f410800f9d36f6aab02ac8bbf65f0ee512b209359050993319aa3855af4266',
          time: '2021-03-09T23:09:41.711Z',
        },
        betTime: '2021-03-09T23:09:41.711Z'
      };

      mocked(getActiveBet).mockResolvedValue(activeBet);
      jest.advanceTimersByTime(130 * 1000);

      await expect(evaluteActiveBet('johncena')).rejects.toStrictEqual(
        new BetServiceError(
          'Your bet is expired! 130s have passed since you placed your bet'
        )
      );
      expect(deleteBet).toHaveBeenCalledTimes(1);
      expect(deleteBet).toHaveBeenCalledWith('johncena');
    });

    it.each([true, false])(
      'should update the user score from an expired bet when the score has been computed previously',
      async (scored) => {
        const activeBet: UserBet = {
          userId: 'johncena',
          betHigh: true,
          price: {
            currency: 'EUR',
            rate: 45950.3607,
            sign:
              '49f410800f9d36f6aab02ac8bbf65f0ee512b209359050993319aa3855af4266',
            time: '2021-03-09T23:09:41.711Z',
          },
          betTime: '2021-03-09T23:09:41.711Z',
          scored,
        };

        mocked(getActiveBet).mockResolvedValue(activeBet);
        jest.advanceTimersByTime(130 * 1000);

        await expect(evaluteActiveBet('johncena')).rejects.toStrictEqual(
          new BetServiceError(
            'Your bet is expired! 130s have passed since you placed your bet'
          )
        );
        expect(upsertScore).toHaveBeenCalledTimes(1);
        expect(upsertScore).toHaveBeenCalledWith('johncena', scored);
        expect(deleteBet).toHaveBeenCalledTimes(1);
        expect(deleteBet).toHaveBeenCalledWith('johncena');
      }
    );

    it.each`
      newPrice      | betHigh  | scored
      ${40000}      | ${true}  | ${false}
      ${50000}      | ${true}  | ${true}
      ${45950.3607} | ${true}  | ${false}
      ${45950.3607} | ${false} | ${true}
    `(
      'should update the user score accordingly betPrice:45950.3607, newPrice:$newPrice, betHigh:$betHigh, scored:$scored',
      async ({ newPrice, betHigh, scored }) => {
        mocked(getCurrentBpiPrice).mockResolvedValueOnce({
          currency: 'EUR',
          rate: newPrice,
          time: '2021-03-09T23:09:41.711Z',
        });

        const activeBet: UserBet = {
          userId: 'johncena',
          betHigh,
          price: {
            currency: 'EUR',
            rate: 45950.3607,
            sign:
              '49f410800f9d36f6aab02ac8bbf65f0ee512b209359050993319aa3855af4266',
            time: '2021-03-09T23:09:41.711Z',
          },
          betTime: '2021-03-09T23:09:41.711Z'
        };

        mocked(getActiveBet).mockResolvedValue(activeBet);
        jest.advanceTimersByTime(61 * 1000);

        await expect(evaluteActiveBet('johncena')).resolves.toStrictEqual({
          betPrice: {
            currency: 'EUR',
            rate: 45950.3607,
            sign:
              '49f410800f9d36f6aab02ac8bbf65f0ee512b209359050993319aa3855af4266',
            time: '2021-03-09T23:09:41.711Z',
          },
          newPrice: {
            currency: 'EUR',
            rate: newPrice,
            time: '2021-03-09T23:09:41.711Z',
          },
          scored,
        });
      }
    );
  });
});
