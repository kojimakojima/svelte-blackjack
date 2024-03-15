<script lang="ts">
  export let result: string = "";
  export let isPlayerBust: boolean = false;
  export let isDealerBust: boolean = false;
  export let isPlayerBlackjack: boolean = false;
  export let isDealerBlackjack: boolean = false;
</script>

<div class="fixed inset-0 z-20 flex items-center justify-center">
  <div
    class="bg-black-800 rounded-sm bg-zinc-800 bg-opacity-80 p-2 text-center font-bold hover:animate-spin"
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
