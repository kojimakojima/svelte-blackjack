<script lang="ts">
  import dealerAvatarNormal from "./assets/dealerAvatarNormal.png";
  import dealerAvatarLost from "./assets/dealerAvatarLost.png";
  import dealerAvatarWon from "./assets/dealerAvatarWon.png";
  import dealerAvatarTie from "./assets/dealerAvatarTie.png";

  //Helpers
  import parseNum from "./helper/parseNum";
  import checkBust from "./helper/checkBust";
  import checkBlackjack from "./helper/checkBlackjack";

  // Components
  import Button from "./lib/Button.svelte";
  import Title from "./lib/Title.svelte";
  import CardDisplay from "./lib/CardDisplay.svelte";
  import ResultDisplay from "./lib/ResultDisplay.svelte";
  import GameControl from "./lib/GameControl.svelte";

  //　#region Game State
  let isLoading: boolean = false;
  let isStarted: boolean = false;
  let isHitting: boolean = false;
  let isEnded: boolean = false;
  let winCount: number = 0;
  let state: number = 0;
  let result: string = "";
  // #endregion

  // #region Deck
  let deckId: string = "";
  // #endregion

  // #region Player
  let playerCards: Array<CardType> = [];
  let playerTotalNum: number = 0;
  let isPlayerBust: boolean = false;
  let isPlayerBlackjack: boolean = false;
  let isStand: boolean = false;
  let is21: boolean = false;
  // #endregion

  // #region Dealer
  let dealerAvatar: string = dealerAvatarNormal;
  let dealerCards: Array<CardType> = [];
  let dealerTotalNum: number = 0;
  let isDealerBust: boolean = false;
  let isDealerBlackjack: boolean = false;
  // #endregion

  // #region Functions
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
        result = "Tie!";
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
      playerCards = [...playerCards, ...data.cards];

      // Reset to calculate current total
      playerTotalNum = 0;
      let aceCount = 0; // Keep track of the number of ACEs

      // Calculate total num considering ACE as 11 initially
      playerCards.forEach((card: CardType) => {
        if (card.value === "ACE") {
          playerTotalNum += 11;
          aceCount++;
        } else {
          playerTotalNum += parseNum(card.value);
        }
      });

      // Adjusting for ACEs if total is over 21
      while (playerTotalNum > 21 && aceCount > 0) {
        playerTotalNum -= 10; // Adjusting each ACE from 11 to 1
        aceCount--; // Decrement ACE count after adjustment
      }

      console.log(
        "PlayerTotalNum: " + playerTotalNum + ", ACENum: " + aceCount,
      );
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
      dealerCards = [...dealerCards, ...data.cards];

      // Reset to calculate current total
      dealerTotalNum = 0;

      // Firstly Add values for all cards
      dealerCards.forEach((card: CardType) => {
        const cardValue = card.value === "ACE" ? 11 : parseNum(card.value);
        dealerTotalNum += cardValue;
      });

      // Adjust for ACEs after initial total calculation if over 21
      let aceCount = dealerCards.filter(
        (card: CardType) => card.value === "ACE",
      ).length;
      while (dealerTotalNum > 21 && aceCount > 0) {
        dealerTotalNum -= 10; // Adjust an ACE from 11 to 1
        aceCount--;
      }

      console.log(
        "DealerTotalNum: " + dealerTotalNum + ", ACENum: " + aceCount,
      );
      isDealerBlackjack = checkBlackjack(dealerCards);
      isDealerBust = checkBust(dealerTotalNum);
    } catch (e) {
      console.log(e);
    }
  };
  // #endregion
</script>

<main class="mx-auto flex max-w-7xl flex-col items-center px-2">
  <Title {winCount} />
  <!-- CARD DISPLAY -->
  <CardDisplay {dealerAvatar} {dealerCards} {playerCards} />
  <!-- STATUS DISPLAY -->
  {#if result}
    <ResultDisplay
      {result}
      {isPlayerBust}
      {isDealerBust}
      {isPlayerBlackjack}
      {isDealerBlackjack}
    />
  {/if}
  <div>
    {#if !isStarted}
      <Button onClick={start} className="bg-purple-600" disabled={isLoading}>
        {#if isLoading}
          Shuffling...
        {:else}
          START
        {/if}
      </Button>
    {/if}
  </div>
  <!-- GAME CONTROL -->
  <GameControl
    {isStarted}
    {isPlayerBust}
    {isEnded}
    {isStand}
    {is21}
    {state}
    {nextRound}
    {restart}
    {hit}
    {stand}
  />
</main>
