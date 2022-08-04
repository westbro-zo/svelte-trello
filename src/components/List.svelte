<script>
    import CreateCard from '~/components/CreateCard.svelte';
    import ListTitle from '~/components/ListTitle.svelte';
    import Card from '~/components/Card.svelte';
    import { dragAndDrop } from '~/actions/dragAndDrop';
    import { dndType } from '~/app.value'

    export let list = [];
    export let listIndex;

    $: sortCard = list.cards.sort((x, y) => x.pos - y.pos);
</script>

<div
    class="list"
    draggable="true"
    use:dragAndDrop={{listIndex, listId: list.id, type: dndType.LIST }}
    on:dblclick={(e) => e.stopPropagation()}
>
    <div class="list__inner">
        <div class="list__heading">
            <ListTitle id={list.id} title={list.title} />
            <p>{list.cards.length} cards</p>
        </div>
        <div class="list__cards">
            {#each sortCard as card, index (card.id)}
                <Card
                    {card}
                    cardIndex={index}
                    listId={list.id}
                />
            {/each}
        </div>
        <CreateCard listId={list.id} lastCardPos={list.cards[list.cards.length-1]?.pos}/>
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

            &:hover {
                background-color: darken(#ebecf0, 2%);

            }
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
            background-color: darken(#ebecf0, 10%);
        }
    }
</style>