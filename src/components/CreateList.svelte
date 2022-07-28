<script>
    import { tick } from 'svelte';
    import { lists } from '~/store/list';
    import { v4 as uuidv4 } from 'uuid';
    import { autoFocusout } from '~/actions/autoFocusout';
    import { DEFAULT_POS, dndAction } from '~/app.value'
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

<div class="cr-buttons">
    <div class="cr-list">
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
                on:click={onEditMode}
                use:dragAndDrop={{type: dndAction.CREATE}}
            >
                + Add another list
            </div>
        {/if}
    </div>
    <div
        class="cr-list"
        use:dragAndDrop={{type: dndAction.DELETE}}
    >
        - <span class="r-list">Drop here to</span> Remove
    </div>
</div>

<style lang="scss">
    .cr-buttons {
        display: inline-block;
        vertical-align: top;
    }
    .cr-list {
        white-space: normal;
        width: 290px;
        padding: 10px 8px;
        background: rgba(#ebecf0, .6);
        border-radius: 4px;
        margin: 0 4px 10px 4px;
        line-height: 20px;
        cursor: pointer;
        transition: .2s;

        &:hover {
            background: #ebecf0;
            & .r-list {
                display: inline-block;
            }
        }
    }

    .r-list {
        display: none;
    }
</style>