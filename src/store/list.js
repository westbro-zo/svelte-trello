import { writable } from 'svelte/store';
import { getLists, addList } from '~/api';

function createLists() {
	const { subscribe, set, update } = writable([]);

	return {
        subscribe,
        add: async ({ title, id }) => {
            await addList(title, id).then(res => {
                update(lists => ([...lists, res]));
            });
        },
        reset: async () => {
            const res = await getLists();
        
            set(res);
        }
	};
}

export const lists = createLists();