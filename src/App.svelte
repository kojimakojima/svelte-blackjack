<script lang="ts">
  import parseNum from "./helper/parseNum";
  import checkBust from "./helper/checkBust";
  import checkBlackjack from "./helper/checkBlackjack";
  // Game State
  let isLoading: boolean = false;
  let isStarted: boolean = false;
  let isEnded: boolean = false;
  let winCount: number = 0;

  // Deck
  let deckId: string = "";

  // Player
  let playerCards: Array<CardType> = [];
  let playerTotalNum: number = 0;
  let isPlayerBust: boolean = false;
  let isPlayerBlackjack: boolean = false;
  let isStand: boolean = false;
  let is21: boolean = false;

  // Dealer
  let dealerCards: Array<CardType> = [];
  let dealerTotalNum: number = 0;
  let isDealerBust: boolean = false;
  let isDealerBlackjack: boolean = false;

  const start = async () => {
    await shuffle();
    await dealerDraw(1);
    await playerDraw(1);
    await new Promise((resolve) => setTimeout(resolve, 500));
    await playerDraw(1);
    isStarted = true;
  };
  const restart = async () => {
    location.reload();
  };
  const checkResult = () => {};
  const stand = async () => {
    isStand = true;
    while (dealerTotalNum <= 17) {
      await dealerDraw(1);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    isEnded = true;
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
      if (playerTotalNum === 21) is21 = true;
      console.log(playerTotalNum);
    } catch (e) {
      console.log(e);
    }
  };
  const dealerDraw = async (num: number) => {
    const url = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${num}`;

    try {
      // Cannot draw when over 17
      if (dealerTotalNum > 17) return;
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

<main class="flex flex-col items-center">
  <h1 class="p-4 text-2xl font-bold">ブラックジャック</h1>
  <!-- CARD DISPLAY -->
  <div>
    <p>Dealer cards:</p>
    <div class="flex justify-center">
      {#each dealerCards as card, i}
        <p><img src={card.images.png} alt="" class="w-24" /></p>
      {/each}
    </div>
    <p>Dealer total number: {dealerTotalNum}</p>

    <p>Your cards:</p>
    <div class="flex justify-center">
      {#each playerCards as card, i}
        <p><img src={card.images.png} alt="" class="w-24" /></p>
      {/each}
    </div>
    <p>Your total number: {playerTotalNum}</p>
  </div>
  <!-- STATUS DISPLAY -->
  <div>
    {#if !isStarted}
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
  </div>
  <!-- GAME CONTROL -->
  <div>
    {#if isStarted}
      {#if isEnded || isPlayerBust}
        <button on:click={restart} class="rounded-sm bg-purple-600 p-1">
          RESTART
        </button>
      {/if}
      {#if !isStand && !isPlayerBust}
        {#if !is21}
          <button
            on:click={() => playerDraw(1)}
            class="rounded-sm bg-sky-600 p-1">HIT</button
          >
        {/if}
        <button on:click={stand} class="rounded-sm bg-red-600 p-1">STAND</button
        >
      {/if}
    {/if}
  </div>
</main>
