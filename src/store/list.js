import { writable } from 'svelte/store';
import { getLists, addList, deleteList } from '~/api';

function createLists() {
	const { subscribe, set, update } = writable([]);

	return {
        subscribe,
        add: async ({ title, id }) => {
            await addList(title, id).then(res => {
                update(lists => ([...lists, res]));
            });
        },
        remove: async ({ id }) => {
            await deleteList(id).then(() => {
                update(lists => {
                    const index = lists.findIndex(list => list.id === id);

                    if (index > -1) {
                        lists.splice(index, 1);
                    }

                    return lists;
                });
            });
        },
        reset: async () => {
            const res = await getLists();
        
            set(res);
        }
	};
}

export const lists = createLists();