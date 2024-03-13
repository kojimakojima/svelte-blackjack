<script lang="ts">
  import parseNum from "./helper/parseNum";
  import checkBust from "./helper/checkBust";
  import checkBlackjack from "./helper/checkBlackjack";
  // Game State
  let isLoading: boolean = false;
  let isStarted: boolean = false;

  // Deck
  let deckId: string = "";

  // Player
  let playerCards: Array<CardType> = [];
  let playerTotalNum: number = 0;
  let isPlayerBust: boolean = false;
  let isPlayerBlackjack: boolean = false;

  // Dealer
  let dealerCards: Array<CardType> = [];
  let dealerTotalNum: number = 0;
  let isDealerBust: boolean = false;
  let isDealerBlackjack: boolean = false;

  const start = async () => {
    await shuffle();
    await dealerDraw(1);
    await playerDraw(2);
    isStarted = true;
  };
  const end = async () => {
    location.reload();
  };
  const shuffle = async () => {
    const url = `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`;

    try {
      isLoading = true;
      const res = await fetch(url);
      const data: DeckType = await res.json();
      deckId = data.deck_id;
      isLoading = false;
    } catch (e) {
      console.log(e);
    }
  };
  const playerDraw = async (num: number) => {
    const url = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${num}`;

    try {
      const res = await fetch(url);
      const data: DeckType = await res.json();
      console.log(data);
      playerCards = [...playerCards, ...data.cards];

      playerTotalNum = 0; //Reset to calculate current total
      // Calculate total num
      playerCards.map((card: CardType) => {
        if (card.value === "ACE") {
          if (playerTotalNum + 11 > 21) {
            playerTotalNum++;
          } else {
            playerTotalNum += 11;
          }
        } else {
          playerTotalNum += parseNum(card.value);
        }
      });

      isPlayerBlackjack = checkBlackjack(playerCards);
      isPlayerBust = checkBust(playerTotalNum);
      console.log(playerTotalNum);
    } catch (e) {
      console.log(e);
    }
  };
  const dealerDraw = async (num: number) => {
    const url = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${num}`;

    try {
      const res = await fetch(url);
      const data: DeckType = await res.json();
      console.log(data);
      dealerCards = [...dealerCards, ...data.cards];

      dealerTotalNum = 0; //Reset to calculate current total
      // Calculate total num
      dealerCards.map((card: CardType) => {
        if (card.value === "ACE") {
          if (dealerTotalNum + 11 > 21) {
            dealerTotalNum++;
          } else {
            dealerTotalNum += 11;
          }
        } else {
          dealerTotalNum += parseNum(card.value);
        }
      });

      isDealerBlackjack = checkBlackjack(dealerCards);
      isDealerBust = checkBust(dealerTotalNum);
      console.log(dealerTotalNum);
    } catch (e) {
      console.log(e);
    }
  };
</script>

<main>
  <div>
    <p>Your cards:</p>
    {#each playerCards as card, i}
      <p>{card.value}</p>
    {/each}
    <p>Your total number: {playerTotalNum}</p>

    <p>Dealer cards:</p>
    {#each dealerCards as card, i}
      <p>{card.value}</p>
    {/each}
    <p>Dealer total number: {dealerTotalNum}</p>
  </div>
  {#if isStarted}
    <button on:click={end} class="rounded-sm bg-purple-600 p-1"> END </button>
  {:else}
    <button
      on:click={start}
      class="rounded-sm bg-purple-600 p-1"
      disabled={isLoading}
    >
      {#if isLoading}
        Shuffling...
      {:else}
        START
      {/if}
    </button>
  {/if}
  {#if isStarted}
    <button on:click={() => playerDraw(1)} class="rounded-sm bg-sky-600 p-1"
      >HIT</button
    >
    <button on:click={() => dealerDraw(1)} class="rounded-sm bg-red-600 p-1"
      >STAND</button
    >
    <button on:click={() => dealerDraw(1)} class="rounded-sm bg-sky-600 p-1"
      >DEALER HIT</button
    >
    {#if isPlayerBust}
      <p>Player BUST</p>
    {/if}
    {#if isDealerBust}
      <p>Dealer BUST</p>
    {/if}
    {#if isPlayerBlackjack}
      <p>Player BLACKJACK</p>
    {/if}
    {#if isDealerBlackjack}
      <p>Dealer BLACKJACK</p>
    {/if}
  {/if}
</main>
