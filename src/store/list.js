import { writable } from 'svelte/store';
import { getLists, addList } from '~/api';

function createLists() {
	const { subscribe, set } = writable([]);
    const reset = async () => {
        const res = await getLists();
    
        set(res);
    }

    reset();

	return {
        subscribe,
        add: async ({ title, id }) => {
            await addList(title, id).then(lists.reset());
        },
        reset
	};
}

export const lists = createLists();