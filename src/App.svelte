<script lang="ts">
  let deckId: string = "";
  let cards: Array<CardType> = [];
  let isLoading: boolean = false;

  const shuffle = async () => {
    const url = `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`;

    try {
      isLoading = true;
      const res = await fetch(url);
      const data: DeckType = await res.json();
      console.log(data);
      deckId = data.deck_id;
      isLoading = false;
    } catch (e) {
      console.log(e);
    }
  };
  const draw = async () => {
    const url = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`;

    try {
      const res = await fetch(url);
      const data: DeckType = await res.json();
      console.log(data);
      cards = [...cards, ...data.cards];
      console.log(cards);
    } catch (e) {
      console.log(e);
    }
  };
</script>

<main>
  <p>Your cards:</p>
  {#each cards as card, i}
    <p>{card.code}</p>
  {/each}
  <button
    on:click={shuffle}
    class="rounded-sm bg-purple-600 p-1"
    disabled={isLoading}
  >
    {#if isLoading}
      shuffling...
    {:else}
      shuffle cards
    {/if}
  </button>
  <button on:click={draw} class="rounded-sm bg-sky-600 p-1">draw cards</button>
</main>
