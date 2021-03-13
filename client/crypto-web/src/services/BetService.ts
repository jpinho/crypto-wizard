const API_HOST = process.env.API_HOST;

export interface UserScore {
  userId: string;
  score: number;
}

export interface PriceReading {
  rate: number;
  currency: 'EUR';
  sign: string;
  time: string;
}

export interface BetResult {
  betPrice: PriceReading;
  newPrice: BpiPrice;
  scored: boolean;
}

export interface BpiPrice {
  rate: number;
  currency: 'EUR';
  time: string;
}

const handleOrThrow = async (res: Response) => {
  if (res.status === 201) {
    return;
  }

  const result = await res.json();
  if (res.status >= 400) {
    return Promise.reject(result);
  }
  return result;
};

export function getScore(userId: string): Promise<UserScore> {
  return fetch(`${API_HOST}/api/user/${userId}/score`).then(handleOrThrow);
}

export function getPrice(): Promise<PriceReading> {
  return fetch('${API_HOST}/api/price').then(handleOrThrow);
}

export function placeBet(
  userId: string,
  betHigh: boolean,
  betPrice: PriceReading
): Promise<BetResult> {
  return fetch('${API_HOST}/api/bet', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      betHigh,
      price: betPrice,
      betTime: new Date().toISOString(),
    }),
  }).then(handleOrThrow);
}
export function evaluateBet(userId: string): Promise<BetResult> {
  return fetch(`${API_HOST}/api/bet/${userId}/evaluate`, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: '',
  }).then(handleOrThrow);
}
