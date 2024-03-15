<script lang="ts">
  export let className: string = "";
  export let onClick = () => {};
  export let disabled = false;
</script>

<button
  on:click={onClick}
  {disabled}
  class={`rounded-sm p-3 text-lg font-bold transition-transform hover:scale-95 ${className}`}
>
  <slot />
</button>
