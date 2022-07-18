<script>
    import List from '~/components/List.svelte';
    import CreateList from '~/components/CreateList.svelte';
    import { lists } from '~/store/list';
    import { onMount } from 'svelte';

    let hovering;

    onMount(() => {
        lists.reset();
    })

    function dragStart(e, i) {
        // e.dataTransfer.effectAllowed = 'move';
        // e.dataTransfer.dropEffect = 'move';
        const start = i;
        e.dataTransfer.setData('text/plain', start);
    }

    function drop(e, i) {
        e.preventDefault();

        // e.dataTransfer.dropEffect = 'move';

        const start = parseInt(e.dataTransfer.getData("text/plain"));

        if (i === start) {
            return;
        }

        let newPos;

        if (start > i) {
            const prevListPos = i === 0 ? 0 : $lists[i-1].pos;

            newPos = ($lists[i].pos + prevListPos) / 2;
        } else {
            const nextListPos = i === $lists.length - 1 ? $lists[$lists.length - 1].pos + 100 : $lists[i+1].pos;

            newPos = ($lists[i].pos + nextListPos) / 2;
        }

        lists.reorder({id: $lists[start].id, pos: newPos});
        hovering = null;
    }

</script>

<div class="list-container">
    <div class="lists">
        {#each $lists as list, index (list.id)}
            <List
                {list}
                isActive = {hovering === index}
                on:dragStart={({detail: e}) => dragStart(e, index)}
                on:dragEnter={() => hovering = index}
                on:drop={({detail: e}) => drop(e, index)}
            />
        {/each}
    </div>
    <CreateList />
</div>

<style lang="scss">
    .list-container {
        width: 100vw;
        height: calc(100vh - 40px);
        // border: 1px solid rosybrown;
        padding: 30px;
        box-sizing: border-box;
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;

        .lists {
            display: inline-block;
            height: 100%;
            // border: 1px solid lightgoldenrodyellow;
            box-sizing: border-box;
            white-space: nowrap;
        }
    }
</style>