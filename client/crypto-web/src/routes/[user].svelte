<script lang="ts">
  import { onMount } from 'svelte';
  import { getPrice, placeBet, evaluateBet } from '../services/BetService';
  import type { PriceReading, BetResult } from '../services/BetService';
  import Chronograph from '../components/Chronograph.svelte';

  const UPDATE_INTERVAL_SECS = 30;

  let user: string;
  let price: PriceReading;
  let lastBetResult: BetResult;
  let timeLeftForNextBet: number = null;
  let countDownTimerId: number = null;
  let placeBetError: { message: string } = null;
  let evaluateBetError: { message: string } = null;
  let boardUpdateTimeout: number;

  onMount(async () => {
    user = localStorage.getItem('user');
    await updateCoinBoard();

    try {
      await evaluateBet(user);
    } catch (err) {
      console.log('evaluateBet', err);
    }
  });

  async function updateCoinBoard() {
    boardUpdateTimeout && clearTimeout(boardUpdateTimeout);
    price = await getPrice();
    boardUpdateTimeout = setTimeout(
      updateCoinBoard,
      UPDATE_INTERVAL_SECS * 1000
    );
  }

  async function submitBet(betHigh) {
    try {
      await placeBet(user, betHigh, price);
      countDownTimer(60);
      setTimeout(checkBetResult, 60 * 1000);
    } catch (err) {
      clearCountDownTimer();
      placeBetError = err;
    }
  }

  async function checkBetResult() {
    clearCountDownTimer();

    try {
      lastBetResult = await evaluateBet(user);
      showResultsFor(10);
    } catch (err) {
      evaluateBetError = err;
    }
  }

  function showResultsFor(timeSecs: number) {
    setTimeout(() => {
      lastBetResult = null;
    }, timeSecs * 1000);
  }

  function countDownTimer(interval) {
    timeLeftForNextBet = interval;
    countDownTimerId = setInterval(() => timeLeftForNextBet--, 1000);
  }

  function clearCountDownTimer() {
    clearInterval(countDownTimerId);
    countDownTimerId = null;
    timeLeftForNextBet = null;
  }
</script>

<svelte:head>
  <title>Crypto Wizard{price ? ` | € ${price.rate.toFixed(2)}` : ''}</title>
</svelte:head>

<div class="coin-board">
  {#if price}
    <h2>BTC Market Price</h2>
    <div class="price">
      {new Intl.NumberFormat('en-EN', {
        style: 'currency',
        currency: 'EUR',
      }).format(price.rate)}
    </div>
    <div class="meta">
      <div>
        updated: {new Date(price.time).toLocaleString()} |
        <a href="/" on:click|preventDefault={updateCoinBoard}>force refresh</a>
      </div>
      <div>
        (Powered by <a
          href="https://www.coindesk.com/price/bitcoin"
          target="_blank"><strong>CoinDesk</strong></a
        >)
      </div>
    </div>
  {/if}
</div>

<form on:submit|preventDefault={() => null}>
  {#if timeLeftForNextBet === null}
    <div class="info">
      Use the "up" and "down" vote buttons below to place your bet. You get a
      chance to bet every 60s, good luck!
    </div>
    <div class="actions">
      <button
        disabled={timeLeftForNextBet !== null}
        type="submit"
        on:click={() => submitBet(true)}
      >
        👍
      </button>
      <button
        disabled={timeLeftForNextBet !== null}
        type="submit"
        on:click={() => submitBet(false)}
      >
        👎
      </button>
    </div>
  {:else if timeLeftForNextBet >= 0}
    <Chronograph {timeLeftForNextBet} />
  {/if}

  {#if lastBetResult}
    <div
      class="results"
      class:scored={lastBetResult.scored}
      class:lost={!lastBetResult.scored}
    >
      {#if lastBetResult.scored}
        <span>🎉</span>
        <div class="msg">You won!</div>
      {:else}
        <span>😟</span>
        <div class="msg">Oh no... You lost!</div>
      {/if}
    </div>
  {/if}

  {#if placeBetError}
    <div class="error">
      {placeBetError.message}
    </div>
  {/if}

  {#if evaluateBetError}
    <div class="error">
      {evaluateBetError.message}
    </div>
  {/if}
</form>

<style>
  .coin-board {
    width: 100%;
    padding: 1rem;
    border-radius: 5px;
    text-align: center;
    background-image: linear-gradient(
      to right top,
      #0519377a,
      #004d7a9f,
      #008793,
      #00bf72,
      #a8eb12
    );
    color: white;
  }

  .coin-board h2 {
    font-size: 1.3rem;
  }

  .coin-board .price {
    font-size: 3rem;
    margin: 2rem 0;
    background-color: #f1f1b738;
    border-radius: 5px;
    color: #9df59d;
  }

  .coin-board .meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    font-style: italic;
    color: #fff;
  }

  form {
    border-radius: 5px;
    background-color: whitesmoke;
    padding: 1rem;
    margin-top: 20px;
    width: 100%;
  }

  .info {
    font-size: 0.9rem;
    text-align: center;
  }

  .actions {
    display: flex;
    justify-content: center;
    margin: 30px 0;
  }

  .actions button {
    margin: 0 3rem;
    padding: 1rem 1.5rem;
    cursor: pointer;
    cursor: hand;
    font-size: 3rem;
    border: 1px solid gray;
    border-radius: 5px;
  }

  .actions button:hover {
    background-color: #eaff0021;
  }

  .error {
    background: #ff31311f;
    border-radius: 5px;
    padding: 1rem;
    text-align: center;
    color: #d61717;
  }

  .results {
    display: flex;
    justify-content: center;
    background: white;
    border-radius: 5px;
    padding: 1rem;
    width: 260px;
    margin: 0 auto;
  }

  .results.scored {
    background-image: linear-gradient(315deg, #20bf55 0%, #01baef 74%);
    color: white;
  }
  .results.lost {
    background-image: linear-gradient(315deg, #fc9842 0%, #fe5f75 74%);
    color: white;
  }

  .results span {
    margin-right: 1rem;
    font-size: 2rem;
  }

  .results .msg {
    padding: 10px;
  }
</style>
