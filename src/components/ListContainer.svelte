<script>
    import List from '~/components/List.svelte';
    import CreateList from '~/components/CreateList.svelte';
    import { lists } from '~/store/list';
    import { onMount } from 'svelte';
    import { addListWithDblClick } from '~/actions/addListWithDblClick';
    import { v4 as uuidv4 } from 'uuid';
    import { DEFAULT_POS } from '~/app.value'

    let showPopup = false;
    let title = "New List";
    let positionEl;

    $: popupClass = showPopup ? "popup show edit-mode" : "popup hide edit-mode"
    $: sortList = $lists.sort((x, y) => x.pos - y.pos);

    onMount(() => {
        lists.reset();
    })

    function addList() {
        const index = Number(positionEl.value) - 1;
        const pos = getNewPos(index, $lists);

        if (title.trim()) {
            lists.add({
                id: uuidv4(),
                title,
                pos
            })
        }

        hidePopup(true);
    }

    function hidePopup(flag = true) {
        showPopup = !flag;
        title = "New List";
    }

    function getNewPos(index, arr) {
        const prevPos = index === 0 ? 0 : arr[index-1].pos;
        const nextPos = index === arr.length ? arr[arr.length - 1].pos + DEFAULT_POS : arr[index].pos;

        return (prevPos + nextPos) / 2;
    }

</script>

<div class="list-container" use:addListWithDblClick={hidePopup}>
    <div class="lists">
        {#each sortList as list, index (list.id)}
            <List
                {list}
                listIndex={index}
            />
        {/each}
    </div>
    <CreateList />
    <div id="popup" class="{popupClass}">
        <div class="list__heading">Add List</div>
        <textarea class="popup_title" bind:value={title}></textarea>
        <div class="actions">
            <div class="btn success" on:click={addList}>
                Add card
            </div>
            <div class="btn" on:click={hidePopup}>
                Cancel
            </div>
            <div class="pos__text">
                position <input bind:this={positionEl} class="position"/>
            </div>
        </div>
    </div>
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
        position: relative;

        .lists {
            display: inline-block;
            // height: 100%;
            box-sizing: border-box;
            white-space: nowrap;
        }
    }

    :global(.popup) {
        position: absolute;
        width: 290px;
        height: 110px;
        display: flex;
        flex-direction: column;
        padding: 8px;
        background: #ebecf0;
        border-radius: 4px;

        .list__heading {
            font-weight: 700;
            padding: 4px 8px;
            margin-bottom: 4px;
        }

        .pos__text {
            display: inline-block;
            margin: 0 20px;
            line-height: 30px;
            font-size: 14px;
            font-weight: 400;
        }

        .position {
            width: 40px;
            height: 20px;
        }

        &.hide {
            display: none;
        }

        &.show {
            display: flex;
        }
    }
</style>