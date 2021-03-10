<script>
  import { onMount } from 'svelte';
  import { getScore } from '../services/BetService';

  let user;
  onMount(() => {
    user = localStorage.getItem('user');
  });

  function signout() {
    localStorage.clear();
    window.location = '/';
  }
</script>

<nav>
  <span class="app-name">Crypto Wizard</span>
  <ul>
    {#if user}
      {#await getScore(user) then { userId, score }}
        <li>
          <span class="label">welcome</span><strong>{userId}</strong>
        </li>
        <li>|</li>
        <li>
          <strong>score</strong>
          {score}
        </li>
      {/await}
    {/if}
    <li>|</li>
    <li><a on:click|preventDefault={signout} href="/">sign out</a></li>
  </ul>
</nav>

<style>
  .app-name {
    font-weight: 400;
  }

  nav {
    border-bottom: 1px solid rgba(255, 62, 0, 0.1);
    font-weight: 300;
    padding: 0.2rem 1em;
    display: flex;
    justify-content: space-between;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  /* clearfix */
  ul::after {
    content: '';
    display: block;
    clear: both;
  }

  li {
    display: block;
    float: left;
    padding: 0 10px;
  }

  li .label {
    margin-right: 10px;
  }
</style>
