<script>
    import { tick } from "svelte";
    import { lists } from '~/store/list';
    import { autoFocusout } from "~/actions/autoFocusout";
    import { dragAndDrop } from '~/actions/dragAndDrop';

    export let card;
    export let listId;
    export let cardIndex;
    let isEditMode = false;
    let title;
    let textareaEl;
    let hovering;

    function saveCard() {
        if (title.trim()) {
            lists.editCard({id: card.id, title, listId});
        }
        offEditMode();
    }

    function removeCard() {
        lists.removeCard({id: card.id, listId});
        offEditMode();
    }

    async function onEditMode() {
        isEditMode = true;
        title = card.title;
        await tick();
        textareaEl && textareaEl.focus();
    }

    function offEditMode() {
        isEditMode = false;

    }
</script>

<div 
    class="card"
    draggable="true"
    use:dragAndDrop={{type: 'card', cardIndex, listId, cardId: card.id}}
>
    {#if isEditMode}
        <div
            use:autoFocusout={offEditMode}
            class="edit-mode"
            class:is-active={hovering === cardIndex}
        >
            <textarea
                bind:value={title}
                bind:this={textareaEl}
                placeholder="Enter a title for this card..."
                on:keydown={event => {
                    event.key === 'Enter' && saveCard()
                    event.key === 'Escape' && offEditMode()
                    event.key === 'Esc' && offEditMode()
                }}></textarea>
            <div class="actions">
                <div
                    class="btn success"
                    on:click={saveCard}>
                    Save
                </div>
                <div
                    class="btn"
                    on:click={offEditMode}>
                    Cancel
                </div>
                <div
                    class="btn danger"
                    on:click={removeCard}>
                    Delete Card
                </div>
            </div>
        </div>
    {:else}
        <div class="title">
            {card.title}
            <div
                class="btn small"
                on:click={onEditMode}
            >
                Edit
            </div>
        </div>
    {/if}
</div>

<style lang="scss">
    .card {
        margin-bottom: 8px;
        &:last-child {
            margin-bottom: 1px;
        }

        .title {
            background: #fff;
            padding: 6px 8px;
            border-radius: 4px;
            box-shadow: 0 1px 0 rgba(9, 30, 66, .25);
            line-height: 20px;
            position: relative;
            &:hover {
                background: #f5f5f5;
            }
            .btn {
                position: absolute;
                top: 6px;
                right: 8px;
                display: none;
            }

            &:hover .btn {
                display: block;
            }
        }
        .is-active {
            background-color: darken(#f5f5f5, 10%);
        }
    }
</style>