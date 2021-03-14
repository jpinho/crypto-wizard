<script>
  import { getContext, onMount } from 'svelte';

  let user;
  let score = getContext('score');

  onMount(() => {
    user = localStorage.getItem('user');
  });

  function signout() {
    localStorage.clear();
    window.location = '/';
  }
</script>

<nav>
  <a class="app-name" href="/">Crypto Wizard</a>
  <ul>
    {#if user && $score}
      <li>
        <span class="label">welcome</span><strong>{user}</strong>
      </li>
      <li>|</li>
      <li>
        <strong>score</strong>
        {$score.score}
      </li>
      <li>|</li>
      <li><a on:click|preventDefault={signout} href="/">sign out</a></li>
    {/if}
  </ul>
</nav>

<style>
  .app-name {
    font-weight: 400;
    text-decoration: none;
  }

  nav {
    border-bottom: 1px solid rgba(255, 62, 0, 0.1);
    font-weight: 300;
    padding: 0.3rem 5px 0.3rem 10px;
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
    display: none;
  }

  a {
    text-decoration: none;
  }

  @media (min-width: 768px) {
    nav {
      padding: 0.2rem 1em;
    }
    .label {
      display: block;
    }
  }
</style>
