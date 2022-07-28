<script>
    import List from '~/components/List.svelte';
    import CreateList from '~/components/CreateList.svelte';
    import { lists } from '~/store/list';
    import { onMount } from 'svelte';

    onMount(() => {
        lists.reset();
    })

</script>

<div class="list-container">
    <div class="lists">
        {#each $lists as list, index (list.id)}
            <List
                {list}
                listIndex={index}
            />
        {/each}
    </div>
    <CreateList />
</div>

<style lang="scss">
    .list-container {
        width: 100vw;
        height: calc(100vh - 40px);
        padding: 30px;
        box-sizing: border-box;
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;

        .lists {
            display: inline-block;
            height: 100%;
            box-sizing: border-box;
            white-space: nowrap;
        }
    }
</style>