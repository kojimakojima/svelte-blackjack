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
      {#if winCount === 0}
        <span class="text-lg"> BLACKJACK </span>
      {:else if winCount === 1}
        Currently: {winCount} Win
      {:else if winCount > 1 && winCount < 10}
        Currently: {winCount} Win Streak
      {:else if winCount > 9}
        🎉Congratulations! GAME CLEAR🎉 {winCount} Win Streak
      {/if}
    </span>
  {:else}
    <span class="text-base">
      {#if winCount === 0}
        <span class="text-lg"> ブラックジャック </span>
      {:else if winCount === 1}
        現在: {winCount}勝
      {:else if winCount > 1 && winCount < 10}
        現在: {winCount}連勝
      {:else if winCount > 9}
        🎉ゲームクリア🎉 {winCount} 連勝
      {/if}
    </span>
  {/if}
</h1>
