### Architecture Diagrams

![fetch price](/doc/arch/fetch-price.jpg)

**Notes**

- By adding a signature to the reading that came from CoinDesk we avoid a more skilled user to send us a BTC reading that could have been manipulated in some way. Example, sending a BTC price of €10 and always voting up!

- Another observation is that, we send the price from the client to ensure the system is fair, the client bets on what he sees, we could have simplefied the signature and validation by fetching the price on the server when the user places a bet, but then the comparison value could have changed by then.

![placing bet](/doc/arch/placingbet.jpg)
