import { Router, Request, Response } from 'express';
import { evaluteActiveBet, UserBet } from '../domain/bet';
import { validateReading } from '../domain/price';
import { placeBet } from '../domain/bet';
import BetServiceError from '../domain/error/BetServiceException';

export default function buildRouter(): Router {
  const router = Router();

  router.post('/', async (req: Request, res: Response) => {
    const userBet = req.body as UserBet;
    if (!validateReading(userBet.price)) {
      res.status(400).send({
        message: 'Invalid bet (lets be ethical please)!',
      });
      return;
    }

    try {
      await placeBet(userBet);
    } catch (err) {
      if (err instanceof BetServiceError) {
        res.status(400).send(err);
      } else {
        console.log('Service exception: ', err);
        res.status(500).send({
          message: `Internal failure while placing bet for user ${userBet.userId}`,
        });
      }
      return;
    }

    res.sendStatus(201);
  });

  router.patch('/:userId/evaluate', async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
      const betResult = await evaluteActiveBet(userId);
      res.status(200).send(betResult);
    } catch (err) {
      if (err instanceof BetServiceError) {
        res.status(400).send(err);
      } else {
        console.log('Service exception: ', err);
        res.status(500).send({
          message: `Internal failure while evaluating bet results for user ${userId}`,
        });
      }
      return;
    }
  });

  return router;
}
