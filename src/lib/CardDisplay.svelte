<script lang="ts">
  export let dealerAvatar: string = "";
  export let dealerCards: Array<CardType> = [];
  export let playerCards: Array<CardType> = [];
</script>

<div>
  <p class="mb-2 flex justify-center">
    <img
      src={dealerAvatar}
      alt="Dealer's Avatar"
      class="w-36 transition-transform hover:scale-105"
    />
  </p>
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
