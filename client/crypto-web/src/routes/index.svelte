<script lang="ts">
  import yoda from 'images/yoda-coin.jpg';
  import { onMount } from 'svelte';
  let user: string;

  onMount(() => {
    if (localStorage.getItem('user') !== null) {
      const currUser = localStorage.getItem('user');
      window.location = `/${currUser}`;
    }
  });

  function onSubmit() {
    window.localStorage.setItem('user', user);
    window.location = `/${user}`;
  }
</script>

<svelte:head>
  <title>Crypto Wizard</title>
</svelte:head>

<div class="splash">
  <h1>Welcome aboard the Crypto Roller Coaster!</h1>
  <div class="image">
    <img src={yoda} width="100%" alt="yoda" />
  </div>
</div>

<form on:submit|preventDefault={onSubmit}>
  <h1>Sign Up Form</h1>
  <span>Signup to start winning!</span>

  <div class="user">
    <label for="user">Nickname:</label>
    <input type="text" name="user" id="user" bind:value={user} />
    <button type="submit">Sign Up</button>
  </div>
</form>

<style>
  h1 {
    text-align: left;
    font-size: 1rem;
    text-transform: uppercase;
    font-weight: 700;
    margin: 0 0 0.5em 0;
  }

  form {
    background-color: whitesmoke;
    border-radius: 5px;
    padding: 2rem;
  }

  .splash {
    height: 242px;
    border: 1px solid whitesmoke;
    border-radius: 5px;
    padding: 1rem;
    margin-bottom: 10px;
    overflow: hidden;
  }

  .splash h1 {
    font-size: 1.5rem;
    position: relative;
    color: white;
    width: 50%;
    z-index: 100;
  }

  .splash .image {
    margin: -130px;
    z-index: 0;
    top: -35px;
    position: relative;
    left: 68px;
    opacity: 0.9;
  }

  form .user {
    margin-top: 20px;
  }
</style>
