<script lang="ts">
  import { onMount } from 'svelte';

  /**
   * Source: https://codepen.io/ninjascribble/pen/rHwkK
   * Disclaimer: this chronograph was ported and converted to svelte from the code sample available on the source above.
   * I've done quite a few changes, but still, this work is not originally mine.
   */
  export let timeLeftForNextBet: number;
  let resize;

  onMount(() => {
    const wrapper = document.getElementById('timeWrapper');
    const margin = window.innerWidth > 500 ? 200 : 400;
    const minScale = 0.8;

    resize = () => {
      const containerWidthSpace = wrapper.clientWidth + margin;

      wrapper.style.transform = `scale(${Math.min(
        minScale,
        window.innerWidth / containerWidthSpace
      )})`;
    };

    setupResize();
  });

  function setupResize() {
    window.addEventListener('resize', resize);
    resize();
  }
</script>

<svelte:head>
  <link
    href="https://fonts.googleapis.com/css?family=Yanone+Kaffeesatz:200,300,400"
    rel="stylesheet"
  />
</svelte:head>

<div id="timeWrapper" class="timer-group">
  <div class="timer hour">
    <div class="hand"><span /></div>
    <div class="hand"><span /></div>
  </div>
  <div class="timer minute">
    <div class="hand"><span /></div>
    <div class="hand"><span /></div>
  </div>
  <div class="timer second">
    <div class="hand"><span /></div>
    <div class="hand"><span /></div>
  </div>
  <div class="face">
    <p id="lazy">{timeLeftForNextBet || '0'}</p>
  </div>
</div>

<style>
  * {
    box-sizing: border-box;
  }

  @media (max-width: 500px) {
    .timer-group {
      position: absolute;
      left: 0;
    }
  }

  .timer-group {
    transform: scale(0.8);
    color: #fff;
    font-family: 'Yanone Kaffeesatz', sans-serif;
    height: 400px;
    margin: 0 auto;
    width: 400px;
  }

  .timer {
    border-radius: 50%;
    height: 100px;
    overflow: hidden;
    position: absolute;
    width: 100px;
  }

  .timer:after {
    background: #111;
    border-radius: 50%;
    content: '';
    display: block;
    height: 80px;
    left: 10px;
    position: absolute;
    width: 80px;
    top: 10px;
  }

  .timer .hand {
    float: left;
    height: 100%;
    overflow: hidden;
    position: relative;
    width: 50%;
  }

  .timer .hand span {
    border: 50px solid rgba(0, 255, 255, 0.4);
    border-bottom-color: transparent;
    border-left-color: transparent;
    border-radius: 50%;
    display: block;
    height: 0;
    position: absolute;
    right: 0;
    top: 0;
    transform: rotate(225deg);
    width: 0;
  }

  .timer .hand:first-child {
    transform: rotate(180deg);
  }

  .timer .hand span {
    animation-duration: 4s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }

  .timer .hand:first-child span {
    animation-name: spin1;
  }

  .timer .hand:last-child span {
    animation-name: spin2;
  }

  .timer.hour {
    background: rgba(0, 0, 0, 0.3);
    height: 400px;
    left: 0;
    width: 400px;
    top: 0;
  }

  .timer.hour .hand span {
    animation-duration: 3600s;
    border-top-color: rgba(255, 0, 255, 0.4);
    border-right-color: rgba(255, 0, 255, 0.4);
    border-width: 200px;
  }

  .timer.hour:after {
    height: 360px;
    left: 20px;
    width: 360px;
    top: 20px;
  }

  .timer.minute {
    background: rgba(0, 0, 0, 0.2);
    height: 350px;
    left: 25px;
    width: 350px;
    top: 25px;
  }

  .timer.minute .hand span {
    animation-duration: 60s;
    border-top-color: rgba(0, 255, 255, 0.4);
    border-right-color: rgba(0, 255, 255, 0.4);
    border-width: 175px;
  }

  .timer.minute:after {
    height: 310px;
    left: 20px;
    width: 310px;
    top: 20px;
  }

  .timer.second {
    background: rgba(0, 0, 0, 0.2);
    height: 300px;
    left: 50px;
    width: 300px;
    top: 50px;
  }

  .timer.second .hand span {
    animation-duration: 1s;
    border-top-color: rgba(255, 255, 255, 0.15);
    border-right-color: rgba(255, 255, 255, 0.15);
    border-width: 150px;
  }

  .timer.second:after {
    height: 296px;
    left: 2px;
    width: 296px;
    top: 2px;
  }

  .face {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    height: 296px;
    left: 52px;
    padding: 165px 40px 0;
    position: absolute;
    width: 296px;
    text-align: center;
    top: 52px;
  }

  .face p {
    border-radius: 20px;
    font-size: 76px;
    font-weight: 400;
    position: absolute;
    top: 17px;
    width: 260px;
    left: 20px;
  }

  @keyframes spin1 {
    0% {
      transform: rotate(225deg);
    }
    50% {
      transform: rotate(225deg);
    }
    100% {
      transform: rotate(405deg);
    }
  }

  @keyframes spin2 {
    0% {
      transform: rotate(225deg);
    }
    50% {
      transform: rotate(405deg);
    }
    100% {
      transform: rotate(405deg);
    }
  }
</style>
