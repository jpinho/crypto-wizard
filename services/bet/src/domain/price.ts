import crypto from "crypto";
import { BpiPrice } from '../client/coinDesk';

const { READING_HMAC_SECRET = "neverinsecure" } = process.env;

export interface PriceReading {
  rate: number;
  currency: "EUR";
  sign: string;
  time: string;
}

export function signedReading({ rate, currency, time }: BpiPrice): PriceReading {
  const readingValue = `${rate}:${currency}:${time}`;
  const hmac = crypto.createHmac("sha256", READING_HMAC_SECRET).update(readingValue).digest("hex");

  return {
    currency,
    rate,
    sign: hmac,
    time,
  };
}

export function validateReading({ rate, currency, time, sign }: PriceReading): Boolean {
  const readingValue = `${rate}:${currency}:${time}`;
  const hmac = crypto.createHmac("sha256", READING_HMAC_SECRET).update(readingValue).digest("hex");
  return sign === hmac;
}
