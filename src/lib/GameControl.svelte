<script lang="ts">
  import Button from "./Button.svelte";

  export let isStarted: boolean = false;
  export let isPlayerBust: boolean = false;
  export let isEnded: boolean = false;
  export let isStand: boolean = false;
  export let is21: boolean = false;
  export let state: number = 0;

  export let nextRound = () => {};
  export let restart = () => {};
  export let hit = () => {};
  export let stand = () => {};
</script>

<div class="z-50">
  {#if isStarted}
    {#if isEnded || isPlayerBust}
      {#if (state === 1 || state === 3) && !isPlayerBust}
        <Button onClick={nextRound} className=" bg-indigo-600">
          NEXT ROUND
        </Button>
      {/if}
      <Button onClick={restart} className=" bg-purple-600">
        GO BACK TO MENU
      </Button>
    {/if}
    {#if !isStand && !isPlayerBust}
      {#if !is21}
        <Button onClick={hit} className="bg-red-600">HIT</Button>
      {/if}
      <Button onClick={stand} className="bg-sky-600">STAND</Button>
    {/if}
  {/if}
</div>
