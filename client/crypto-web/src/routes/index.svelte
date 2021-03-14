<script lang="ts">
  import { onMount } from 'svelte';
  let user: string;

  onMount(() => {
    if (localStorage.getItem('user') !== null) {
      const currUser = localStorage.getItem('user');
      window.location = `/bet`;
    }
  });

  function onSubmit() {
    window.localStorage.setItem('user', user);
    window.location = `/bet`;
  }
</script>

<svelte:head>
  <title>Crypto Wizard</title>
</svelte:head>

<div class="mobile-splash-text">
  <h1>Welcome aboard the Crypto Roller Coaster!</h1>
</div>

<div class="splash">
  <h1>Welcome aboard the Crypto Roller Coaster!</h1>
  <div class="image">
    <img src="yoda-coin.jpg" width="100%" alt="yoda" />
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
  .mobile-splash-text {
    background: #0080003b;
    padding: 15px 10px 15px 10px;
    margin-bottom: 10px;
  }
  .mobile-splash-text h1 {
    font-size: 1.5rem;
    color: #077749;
    margin: 0;
  }

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
    visibility: hidden;
  }

  .splash .image {
    margin: -130px;
    z-index: 0;
    top: -35px;
    position: relative;
    left: 0px;
    opacity: 0.9;
  }

  input[type='text'] {
    display: block;
    padding: 10px;
    box-sizing: border-box;
    width: 100%;
    margin-top: 5px;
  }

  button {
    background-color: #20bf553d;
    background-image: linear-gradient(315deg, #20bf55ab 0%, #01baefb5 74%);
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    border: 1px solid gray;
    border-radius: 3px;
    font-size: 1rem;
    color: #ffffff;
    text-transform: uppercase;
    text-shadow: 0px 0px 10px #000000ab;
  }

  form .user {
    margin-top: 20px;
  }

  @media (min-width: 768px) {
    .mobile-splash-text {
      display: none;
    }

    .splash h1 {
      visibility: visible;
    }

    .splash .image {
      left: 68px;
    }

    label {
      display: block;
    }

    button,
    input[type='text'] {
      display: inline;
      width: auto;
      margin-top: 0;
    }
  }
</style>
