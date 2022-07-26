<script>
    import { tick } from 'svelte';
    import { lists } from '~/store/list';
    import { v4 as uuidv4 } from 'uuid';
    import { autoFocusout } from '~/actions/autoFocusout';
    import { DEFAULT_POS } from '~/app.value'
    import { dragAndDrop } from '~/actions/dragAndDrop';

    let isEditMode = false;
    let title = "";
    let textareaEl;

    function addList() {
        if (title.trim()) {
            lists.add({
                id: uuidv4(),
                title,
                pos: ($lists[$lists.length-1]?.pos || 0) + DEFAULT_POS
            })
        }
        offEditMode();
    }

    async function onEditMode() {
        isEditMode = true;
        await tick(); // 화면이 바뀔때까지 기다린다.
        textareaEl && textareaEl.focus();
    }
    
    function offEditMode() {
        isEditMode = false;
        title = "";
    }
</script>

<div class="create-list">
    {#if isEditMode}
    <div use:autoFocusout={offEditMode} class="edit-mode">
        <textarea
            bind:value={title}
            bind:this={textareaEl}
            placeholder="Enter a title for this list..."    
            on:keydown={event => {
                event.key === 'Enter' && addList()
                event.key === 'Escape' && offEditMode()
                event.key === 'Esc' && offEditMode() // MS 브라우저들 엣지, IE
            }}
        ></textarea>
        <div class="actions">
            <div class="btn success" on:click={addList}>
                Add List
            </div>
            <div class="btn" on:click={offEditMode}>
                Cancel
            </div>
        </div>
    </div>
    {:else}
        <div
            class="add-another-list"
            on:click={onEditMode}
            use:dragAndDrop={{type: 'create'}}
        >
            + Add another list
        </div>
    {/if}
</div>

<style lang="scss">
    .create-list {
        white-space: normal;
        width: 290px;
        display: inline-block;
        padding: 10px 8px;
        vertical-align: top;
        background: rgba(#ebecf0, .6);
        border-radius: 4px;
        margin: 0 4px;
        line-height: 20px;
        cursor: pointer;
        transition: .2s;

        &:hover {
            background: #ebecf0;
        }
    }

</style>