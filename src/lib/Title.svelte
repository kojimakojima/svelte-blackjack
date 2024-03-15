<script>
  export let winCount = 0;

  let isHoveredH1 = false;

  function handleMouseEnterH1() {
    isHoveredH1 = true;
  }
  function handleMouseLeaveH1() {
    isHoveredH1 = false;
  }
</script>

<h1
  on:mouseenter={handleMouseEnterH1}
  on:mouseleave={handleMouseLeaveH1}
  class="z-50 my-2 w-full rounded bg-neutral-700 p-2 text-center text-xl font-bold tracking-tighter transition-transform hover:skew-y-3"
>
  {#if isHoveredH1}
    <span class="text-base">
      {#if winCount === 1}
        Currently: {winCount} Win
      {:else if winCount > 1}
        Currently: {winCount} Win Streak
      {/if}
    </span>
    BLACKJACK
  {:else}
    <span class="text-base">
      {#if winCount === 1}
        現在: {winCount}勝
      {:else if winCount > 1}
        現在: {winCount}連勝
      {/if}
    </span>
    ブラックジャック
  {/if}
</h1>
