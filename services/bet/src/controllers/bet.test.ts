import { mocked } from 'ts-jest/utils';
import request from 'supertest';
import express, { json, Express } from 'express';
import bet from './bet';
import { UserBet, placeBet } from '../domain/bet';
import BetServiceError from '../domain/error/BetServiceException';

jest.useFakeTimers('modern');
jest.setSystemTime(1615329755328);
jest.mock('../client/coinDesk');
jest.mock('../domain/bet');

const goodBet: UserBet = {
  userId: 'johncena',
  betHigh: true,
  price: {
    currency: 'EUR',
    rate: 45950.3607,
    sign: '49f410800f9d36f6aab02ac8bbf65f0ee512b209359050993319aa3855af4266',
    time: '2021-03-09T23:09:41.711Z',
  },
  betTime: '2021-03-09T23:09:41.711Z',
};

describe('/api/bet', () => {
  let app: Express;

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use('/api/bet', json(), bet());
  });

  describe('post /', () => {
    it("should return 201 and place the user's bet", async () => {
      await request(app).post('/api/bet').send(goodBet).expect(201);
    });

    it('should return 400 when the bet price signature is invalid', async () => {
      const bet: UserBet = {
        userId: 'user',
        betHigh: true,
        price: {
          currency: 'EUR',
          rate: 45950.3607,
          sign: 'badsignature',
          time: '2021-03-09T23:09:41.711Z',
        },
        betTime: '2021-03-09T23:09:41.711Z',
      };
      await request(app)
        .post('/api/bet')
        .send(bet)
        .expect(400, { message: 'Invalid bet (lets be ethical please)!' });
    });

    it('should return 400 when placing the bet results on a domain exception', async () => {
      mocked(placeBet).mockImplementationOnce(() => {
        throw new BetServiceError('ghosts in the machine went ludacris');
      });
      await request(app)
        .post('/api/bet')
        .send(goodBet)
        .expect(400, { message: 'ghosts in the machine went ludacris' });
    });

    it('should return 500 when placing the bet results on a non domain exception', async () => {
      mocked(placeBet).mockImplementationOnce(() => {
        throw { message: 'computer says no, infrastructure exception' };
      });
      await request(app).post('/api/bet').send(goodBet).expect(500, {
        message: 'Internal failure while placing bet for user johncena',
      });
    });
  });
});
