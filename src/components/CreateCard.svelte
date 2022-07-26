<script>
    import { tick } from 'svelte';
    import { lists } from '~/store/list';
    import { v4 as uuidv4 } from 'uuid';
    import { autoFocusout } from '~/actions/autoFocusout';
    import { DEFAULT_POS } from '~/app.value'

    export let listId;
    export let lastCardPos;
    let isEditMode = false;
    let title = '';
    let textareaEl;

    function addCard() {
        if (title.trim()) {
            lists.addCard({
                listId,
                title,
                id: uuidv4(),
                pos: (lastCardPos || 0) + DEFAULT_POS
            })
        }

        offEditMode();
    }

    async function onEditMode() {
        isEditMode = true;
        title = '';
        await tick();
        textareaEl && textareaEl.focus();
    }

    function offEditMode() {
        isEditMode = false;
    }
</script>

{#if isEditMode}
    <div use:autoFocusout={offEditMode} class="edit-mode">
        <textarea
            bind:value={title}
            bind:this={textareaEl}
            placeholder="Enter a title for this card..."
            on:keydown={event => {
                event.key === 'Enter' && addCard()
                event.key === 'Escape' && offEditMode()
                event.key === 'Esc' && offEditMode()
        }}></textarea>
        <div class="actions">
            <div class="btn" on:click={addCard}>
                Add card
            </div>
            <div class="btn" on:click={offEditMode}>
                Cancel
            </div>
        </div>
    </div>
{:else}
    <div class="add-another-card" on:click={onEditMode}>
        + Add another card
    </div>
{/if}

<style lang="scss">
    .add-another-card {
        padding: 4px 8px;
        font-size: 14px;
        color: #5e6c84;
        cursor: pointer;
        border-radius: 4px;
        &:hover {
            background: rgba(9, 30, 66, .08);
            color: #172b4d;
        }
    }
</style>