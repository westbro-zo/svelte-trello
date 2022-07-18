<script>
    import CreateCard from '~/components/CreateCard.svelte';
    import ListTitle from '~/components/ListTitle.svelte';
    import Card from '~/components/Card.svelte';
    import { createEventDispatcher } from 'svelte';

    export let list = [];
    export let isActive = null;
    const dispatch = createEventDispatcher();

    function dragStart(e) {
        dispatch('dragStart', e);
    }

    function dragEnter(e) {
        dispatch('dragEnter', e);
    }

    function drop(e) {
        dispatch('drop', e);
    }
</script>

<div
    class="list"
    draggable="true"
    on:dragstart={dragStart}
    on:dragenter={dragEnter}
    on:drop={drop}
    ondragover="return false"
>
    <div class="list__inner" class:is-active={isActive}>
        <div class="list__heading">
            <ListTitle id={list.id} title={list.title} />
            <p>{list.cards.length} cards</p>
        </div>
        <div class="list__cards">
            {#each list.cards as card (card.id)}
                <Card {card}/>
            {/each}
        </div>
        <CreateCard listId={list.id}/>
    </div>
</div>

<style lang="scss">
    .list {
        display: inline-block;
        width: 290px;
        height: 100%;
        box-sizing: border-box;
        margin: 0 4px;
        line-height: 20px;

        .list__inner {
            display: flex;
            flex-direction: column;
            max-height: 100%;
            padding: 10px 8px;
            box-sizing: border-box;
            background: #ebecf0;
            border-radius: 4px;
            .list__heading {
                margin-bottom: 10px;
                p {
                    color: #5e6c84;
                    padding: 0 8px;
                }
                .list__cards {
                    overflow-x: hidden;
                    overflow-y: auto;
                    margin-bottom: 10px;
                }
            }
        }
        .is-active {
            background-color: #3273dc;
            color: #fff;
        }
    }
</style>