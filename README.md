# Crypto Wizard

This repo contains:

- **/client** – directory containing a web client that allows users to make guesses on whether the market price of Bitcoin (BTC/USD) will be higher or lower after one minute
- **/services** – a directory of micro-services containing the bet service currently

## Architecture

![architecture](/doc/arch/architecture-highlevel.jpg)

Check other API Flow Diagrams [here](/doc/architecture.md)
## Getting started

### Game Rules

- The player can at all times see their current score and the latest available BTC price in USD
- The player can choose to enter a guess of either “up” or “down“
- After a guess is entered the player cannot make new guesses until the existing guess is resolved
- The guess is resolved when the price changes and at least 60 seconds have passed since the guess was made
  - If the guess is correct (up = price went higher, down = price went lower), the user gets 1 point added to their score.
  - If the guess is incorrect, the user loses 1 point.
- Players can only make one guess at a time
- New players start with a score of 0

### Running the entire project

```bash
docker compose up
open http://localhost:5000
```

### API Docs

- [Bet Service Postman Collection](CryptoWizard.postman_collection.json)

### Constraints & Assumptions

- It is assumed that BTC will change with 100% certainty after 60s. This is important, because it means that any given bet has 3 possible states:
  - `Awaiting Validation` when the time between the bet and the current server time is <= 60secs
  - `Ready for Evaluation` when the time between the bet and the current server time is > 60secs
  - `Expired` when the time between the bet and the current server time is > 120secs

- Expired Bets, can be the result of:
  - The user closed the browser and never waited for the result. In such case, next time the user opens the web app the bet will be dropped without affecting his score. This is a known limitation, since the current solution does not feature a background job scheduler to ensure the computation of the bet evaluation after the 60s window/price change.
  - The user waited for the bet result, but while updating the user's score an error occurred. In such scenario, the application tries to recover by always storing the information about whether or not the user bet was right. And by trying to update the user score with +1 or -1 before leting the user play again. Otherwise the system would not be fair among users.

- Background Job Scheduler/Async Executor, the trade-off not having such a system is that:
  - Cons:
    - There maybe edge cases where the system tries to compensate by reapplying a score from an expired bet
    - And client is a bit more sensitive than it should
  - Pros:
    - The solution is simpler and less complex
    - The implementation is scalable for further iterations and feature development, where a JobScheduler could be a new feature
    - Given the saved complexity the application is able to go live sooner, letting us gather early feedback to shape the future _defacto_ solution

### Tech Stack

- Bet Service
  - **NodeJS with Express using Typescript**, as way to provide a robust, fast and scalable applications with a good type safety runtime
  - **AWS DynamoDB**, a NoSQL solution that provides seamless integration between services and their persistence medium
  - **CoinDesk**, a public API that makes BTC market prices updates available for free

- Crypto Web App
  - **Svelte and Sapper**, the fastest and best performance toolset these days to bootstrap a micro-frontend with ease

- Unit Testing
  - **Jest & Testing Library**, both dismiss any introductions

### Look & Feel

#### Signup
![signup](doc/signup.png)

#### Bet UI
![bet-ui](doc/bet-ui.png)
