import { mocked } from 'ts-jest/utils';
import request from 'supertest';
import express, { json } from 'express';
import user from './user';
import { getScore } from '../domain/repositories/score';
import BetServiceError from '../domain/error/BetServiceException';

jest.useFakeTimers('modern');
jest.setSystemTime(1615329755328);
jest.mock('../domain/repositories/score.ts');

const app = express();
app.use('/api/user', json(), user());

describe('/api/user', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('get /:userId/score', () => {
    it('shoudl return 200 with the user score when the user exists', async () => {
      mocked(getScore).mockResolvedValue({
        score: 1000,
        userId: 'johncena',
      });
      await request(app)
        .get('/api/user/johncena/score')
        .expect(200, { score: 1000, userId: 'johncena' });
    });

    it('shoudl return 200 with a score of zero when the user does not exists', async () => {
      mocked(getScore).mockResolvedValue(null);
      await request(app)
        .get('/api/user/johncena/score')
        .expect(200, { score: 0, userId: 'johncena' });
    });

    it('shoudl return 400 when score fetch results on a domain exception', async () => {
      mocked(getScore).mockImplementationOnce(() => {
        throw new BetServiceError('bad score');
      });
      await request(app)
        .get('/api/user/johncena/score')
        .expect(400, { message: 'bad score' });
    });

    it('shoudl return 500 when score fetch results on a non domain exception', async () => {
      mocked(getScore).mockImplementationOnce(() => {
        throw { message: 'score database is down, bad credentials' };
      });
      await request(app)
        .get('/api/user/johncena/score')
        .expect(500, {
          message:
            "Internal failure while evaluating bet results for user johncena",
        });
    });
  });
});
