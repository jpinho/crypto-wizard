<script lang="ts">
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import Nav from '../components/Nav.svelte';

  setContext('score', writable(null));
</script>

<Nav />

<main>
  <slot />
</main>

<style>
  main {
    position: relative;
    max-width: 56em;
    background-color: white;
    padding: 2em;
    margin: 0 auto;
    box-sizing: border-box;
  }
</style>
