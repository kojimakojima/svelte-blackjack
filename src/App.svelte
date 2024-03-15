<script lang="ts">
  import parseNum from "./helper/parseNum";
  import checkBust from "./helper/checkBust";
  import checkBlackjack from "./helper/checkBlackjack";

  import dealerAvatarNormal from "./assets/dealerAvatarNormal.png";
  import dealerAvatarLost from "./assets/dealerAvatarLost.png";
  import dealerAvatarWon from "./assets/dealerAvatarWon.png";
  import dealerAvatarTie from "./assets/dealerAvatarTie.png";

  // Game State
  let isLoading: boolean = false;
  let isStarted: boolean = false;
  let isHitting: boolean = false;
  let isEnded: boolean = false;
  let winCount: number = 0;
  let state: number = 0;
  let result: string = "";

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
  let dealerAvatar: string = dealerAvatarNormal;
  let dealerCards: Array<CardType> = [];
  let dealerTotalNum: number = 0;
  let isDealerBust: boolean = false;
  let isDealerBlackjack: boolean = false;

  // Graphics Related
  let isHoveredH1 = false;

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
  const nextRound = async () => {
    reset();
    await shuffle();
    await dealerDraw(1);
    await playerDraw(1);
    await new Promise((resolve) => setTimeout(resolve, 500));
    await playerDraw(1);
  };
  const checkResult = () => {
    if (isDealerBust) {
      state = 1;
    } else if (isPlayerBust) {
      state = 2;
    } else if (playerTotalNum > dealerTotalNum) {
      state = 1;
    } else if (dealerTotalNum > playerTotalNum) {
      state = 2;
    } else if (playerTotalNum === playerTotalNum) {
      state = 3;
    } else {
      state = 0;
    }
    switch (state) {
      // Player Won
      case 1:
        result = "You Won!";
        winCount++;
        dealerAvatar = dealerAvatarLost;
        break;
      // Dealer Won
      case 2:
        result = "You LOST...";
        winCount = 0;
        dealerAvatar = dealerAvatarWon;
        break;
      // Tie
      case 3:
        "Tie!";
        dealerAvatar = dealerAvatarTie;
        break;
      default:
        break;
    }
  };
  const reset = () => {
    // reset EXPECT isStarted, isHitting winCount
    isEnded = false;
    state = 0;
    result = "";
    deckId = "";
    playerCards = [];
    playerTotalNum = 0;
    isPlayerBust = false;
    isPlayerBlackjack = false;
    isStand = false;
    is21 = false;
    dealerAvatar = dealerAvatarNormal;
    dealerCards = [];
    dealerTotalNum = 0;
    isDealerBust = false;
    isDealerBlackjack = false;
  };
  const hit = async () => {
    if (!isHitting) {
      isHitting = true;
      await playerDraw(1);
      if (isPlayerBust) checkResult();
      isHitting = false;
    }
  };
  const stand = async () => {
    isStand = true;
    while (dealerTotalNum <= 17) {
      await dealerDraw(1);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    isEnded = true;
    checkResult();
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
    } catch (e) {
      console.log(e);
    }
  };

  function handleMouseEnterH1() {
    isHoveredH1 = true;
  }
  function handleMouseLeaveH1() {
    isHoveredH1 = false;
  }
</script>

<main class="mx-auto flex max-w-7xl flex-col items-center px-2">
  <h1
    on:mouseenter={handleMouseEnterH1}
    on:mouseleave={handleMouseLeaveH1}
    class="my-2 w-full rounded bg-neutral-700 p-2 text-center text-xl font-bold tracking-tighter transition-transform hover:skew-y-3"
  >
    <span class="text-base">
      {#if winCount === 1}
        現在: {winCount}勝
      {:else if winCount > 1}
        現在: {winCount}連勝
      {/if}
    </span>
    {#if isHoveredH1}
      BLACKJACK
    {:else}
      ブラックジャック
    {/if}
  </h1>
  <!-- <p>state: {state}</p> -->

  <!-- CARD DISPLAY -->
  <div>
    <p class="mb-2 flex justify-center">
      <img
        src={dealerAvatar}
        alt=""
        class="w-36 transition-transform hover:scale-105"
      />
    </p>
    <!-- Dealer Cards -->
    <div class="mb-8 flex justify-center gap-2">
      {#each dealerCards as card, i}
        <p>
          <img
            src={card.images.png}
            alt=""
            class="w-24 transition-transform hover:scale-105"
          />
        </p>
      {/each}
    </div>
    <!-- <p>Dealer total number: {dealerTotalNum}</p> -->

    <!-- Player Cards -->
    <div class="mb-4 flex justify-center gap-2">
      {#each playerCards as card, i}
        <p>
          <img
            src={card.images.png}
            alt=""
            class="w-24 transition-transform hover:scale-105"
          />
        </p>
      {/each}
    </div>
    <!-- <p>Your total number: {playerTotalNum}</p> -->
  </div>
  <!-- STATUS DISPLAY -->
  {#if result}
    <div class="fixed inset-0 z-20 flex items-center justify-center">
      <div
        class="bg-black-800 rounded-sm bg-zinc-800 bg-opacity-80 p-2 text-center font-bold"
      >
        <p class="text-3xl">
          {result}
        </p>
        {#if isPlayerBust}
          <p class="text-xl">Player BUST</p>
        {/if}
        {#if isDealerBust}
          <p class="text-xl">Dealer BUST</p>
        {/if}
        {#if isPlayerBlackjack}
          <p class="text-xl">Player BLACKJACK</p>
        {/if}
        {#if isDealerBlackjack}
          <p class="text-xl">Dealer BLACKJACK</p>
        {/if}
      </div>
    </div>
  {/if}
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
  </div>
  <!-- GAME CONTROL -->
  <div class="z-50">
    {#if isStarted}
      {#if isEnded || isPlayerBust}
        {#if (state === 1 || state === 3) && !isPlayerBust}
          <button on:click={nextRound} class="rounded-sm bg-indigo-600 p-1">
            NEXT ROUND
          </button>
        {/if}
        <button on:click={restart} class="rounded-sm bg-purple-600 p-1">
          GO BACK TO MENU
        </button>
      {/if}
      {#if !isStand && !isPlayerBust}
        {#if !is21}
          <button on:click={hit} class="rounded-sm bg-sky-600 p-1">HIT</button>
        {/if}
        <button on:click={stand} class="rounded-sm bg-red-600 p-1">STAND</button
        >
      {/if}
    {/if}
  </div>
</main>
