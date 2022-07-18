<script>
    import { tick } from 'svelte';
    import { lists } from '~/store/list';
    import { autoFocusout } from '~/actions/autoFocusout';

    export let id;
    export let title;
    let isEditMode = false;
    let textareaEl;

    function saveTitle() {
        if (title.trim()) {
            lists.edit({id: id, title});
        }
        offEditMode();
    }
    function removeList() {
        lists.remove({id});
        offEditMode();
    }
    async function onEditMode() {
        isEditMode = true;
        title = title;
        await tick();
        textareaEl && textareaEl.focus();
    }
    function offEditMode() {
        isEditMode = false;
    }
</script>

{#if isEditMode}
    <div
        use:autoFocusout={offEditMode}
        class="edit-mode"
    >
        <textarea
            bind:value={title}
            bind:this={textareaEl}
            placeholder="Enter a title for this list..."
            on:keydown={event => {
                event.key === 'Enter' && saveTitle()
                event.key === 'Escape' && offEditMode()
                event.key === 'Esc' && offEditMode()
        }}></textarea>
        <div class="actions">
            <div class="btn success" on:click={saveTitle}>Save</div>
            <div class="btn" on:click={offEditMode}>Cancel</div>
            <div class="btn danger" on:click={removeList}>Delete List</div>
        </div>
    </div>

{:else}
    <h2 class="title">
        {title}
        <div class="btn small edit-btn-for-list" on:click={onEditMode}>
            Edit
        </div>
    </h2>
{/if}

<style lang="scss">
    h2.title {
        position: relative;
        font-weight: 700;
        padding: 4px 8px;
        cursor: pointer;

        .btn {
            position: absolute;
            top: 0;
            right: 0;
            display: none;
        }
    }
    :global(.list__inner:hover .edit-btn-for-list) {
        display: block !important;
    }
</style>