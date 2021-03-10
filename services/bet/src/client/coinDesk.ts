import fetch from "cross-fetch";

const { COINDESK_API_URL } = process.env;

export interface BpiPrice {
  rate: number;
  currency: "EUR";
  time: string;
}

export async function getCurrentBpiPrice(): Promise<BpiPrice> {
  const {
    bpi: {
      EUR: { rate_float: rate },
    },
  } = await fetch(`${COINDESK_API_URL}/v1/bpi/currentprice/EUR.json`).then((res) => res.json());

  return {
    currency: "EUR",
    rate,
    time: new Date().toISOString(),
  };
}
