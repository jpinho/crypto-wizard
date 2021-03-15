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
    min-width: 495px;
    box-sizing: border-box;
  }
  main {
    position: relative;
    max-width: 56em;
    background-color: white;
    padding: 2em;
    margin: 0 auto;
  }
</style>
