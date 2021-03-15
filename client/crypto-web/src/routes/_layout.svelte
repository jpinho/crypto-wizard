<script lang="ts">
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import Nav from '../components/Nav.svelte';

  setContext('score', writable(null));
</script>

<header>
  <Nav />
</header>
<main>
  <slot />
</main>

<style>
  header,
  main {
    min-width: 375px;
    box-sizing: border-box;
  }

  @media (max-width: 500px) {
    header,
    main {
      max-width: 375px;
      width: 375px;
    }
  }

  main {
    position: relative;
    max-width: 56em;
    background-color: white;
    padding: 2em;
    margin: 0 auto;
  }
</style>
