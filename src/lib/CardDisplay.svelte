<script lang="ts">
  export let isDealerMessage: boolean = false;
  export let dealerAvatar: string = "";
  export let dealerCards: Array<CardType> = [];
  export let playerCards: Array<CardType> = [];

  let isHoveredMessage = false;

  function handleMouseEnterMessage() {
    isHoveredMessage = true;
  }
  function handleMouseLeaveMessage() {
    isHoveredMessage = false;
  }
</script>

<div>
  <p class="mb-2 flex justify-center">
    <img
      src={dealerAvatar}
      alt="Dealer's Avatar"
      class="h-48 transition-transform hover:scale-105"
    />
  </p>
  {#if isDealerMessage}
    <p
      on:mouseenter={handleMouseEnterMessage}
      on:mouseleave={handleMouseLeaveMessage}
      class="w-80 border-2 bg-zinc-900 p-4 text-center font-bold transition-transform hover:scale-105 md:w-96"
    >
      {#if isHoveredMessage}
        <span class="text-sm md:text-base">
          Ten years early to beat me 10 times in a row.
        </span>
      {:else}
        俺に十連勝するなんて十年早いんだよ。
      {/if}
    </p>
  {/if}
  <!-- Dealer Cards -->
  <div class="mb-8 flex justify-center gap-2">
    {#each dealerCards as card, i}
      <p>
        <img
          src={card.images.png}
          alt={`Dealer Card ${i}`}
          class="w-24 transition-transform hover:scale-105"
        />
      </p>
    {/each}
  </div>

  <!-- Player Cards -->
  <div class="mb-4 flex justify-center gap-2">
    {#each playerCards as card, i}
      <p>
        <img
          src={card.images.png}
          alt={`Player Card ${i}`}
          class="w-24 transition-transform hover:scale-105"
        />
      </p>
    {/each}
  </div>
</div>
