import { Router, Request, Response } from 'express';
import { getScore } from '../domain/repositories/score';
import BetServiceError from '../domain/error/BetServiceException';

export default function buildRouter(): Router {
  const router = Router();

  router.get('/:userId/score', async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
      const score = await getScore(userId);
      res.send(score || { score: 0, userId });
    } catch (err) {
      if (err instanceof BetServiceError) {
        res.status(400).send(err);
      } else {
        console.log('Service exception: ', err);
        res.status(500).send({
          message: `Internal failure while evaluating bet results for user ${userId}`,
        });
      }
    }
  });

  return router;
}
