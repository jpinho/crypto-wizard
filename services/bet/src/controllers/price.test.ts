import { mocked } from 'ts-jest/utils';
import request from 'supertest';
import { getCurrentBpiPrice } from '../client/coinDesk';
import { PriceReading, validateReading } from '../domain/price';
import express, { json } from 'express';
import price from './price';

jest.useFakeTimers('modern');
jest.setSystemTime(1615329755328);
jest.mock('../client/coinDesk');

const app = express();
app.use('/api/price', json(), price());

describe('/api/price', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('get /', () => {
    it('should return 200 with a signed BTC reading', async () => {
      mocked(getCurrentBpiPrice).mockResolvedValueOnce({
        currency: 'EUR',
        rate: 1000,
        time: new Date().toISOString(),
      });

      await request(app).get('/api/price').expect(200, {
        currency: 'EUR',
        rate: 1000,
        sign: 'e2821ef93006254cf456a2a3a6c752560b9eb199da9dee718ac7eda7348fca34',
        time: '2021-03-09T22:42:35.328Z',
      });
    });

    it('should return 200 with a valid BTC reading signature', async () => {
      mocked(getCurrentBpiPrice).mockResolvedValueOnce({
        currency: 'EUR',
        rate: 1000,
        time: new Date().toISOString(),
      });

      const { body: reading }: { body: PriceReading } = await request(app).get('/api/price');

      expect(validateReading(reading)).toBeTruthy();
    });

    it('should 500 when BTC reading fails', async () => {
      mocked(getCurrentBpiPrice).mockImplementationOnce(() => {
        throw { message: 'crypto bubble popped' };
      });

      await request(app).get('/api/price').expect(500, { message: 'crypto bubble popped' });
    });
  });
});
