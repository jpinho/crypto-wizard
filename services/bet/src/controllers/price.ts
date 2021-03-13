import { Request, Response, Router } from "express";
import { getCurrentBpiPrice } from "../client/coinDesk";
import { signedReading } from '../domain/price';

export default function buildRouter(): Router {
  const router = Router();

  router.get("/", async (req: Request, res: Response) => {
    try {
      const reading = await getCurrentBpiPrice();
      res.send(signedReading(reading));
    } catch(err) {
      console.log('Service exception: ', err);
      res.status(500).send(err);
    }
  });

  return router;
}
