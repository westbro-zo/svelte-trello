import { writable } from 'svelte/store';
import { getLists, addList, deleteList, editList } from '~/api';


function createLists() {
	const { subscribe, set, update } = writable([]);

	return {
        subscribe,
        add: async ({ title, id, pos }) => {
            await addList(title, id, pos).then(res => {
                update($lists => {
                    $lists.push(res)

                    return $lists
                })
            });
        },
        remove: async ({ id }) => {
            await deleteList(id).then(() => {
                update($lists => {
                    const index = $lists.findIndex(list => list.id === id);

                    if (index > -1) {
                        $lists.splice(index, 1);
                    }

                    return $lists;
                });
            });
        },
        edit: async ({title, id}) => {
            await editList(id, {title}).then((res) => {
                update($lists => {
                    const list = $lists.find(l => l.id === id);

                    list.title = res.title;

                    return $lists;
                });
            });
        },
        reorder: async ({id, pos}) => {
            await editList(id, {pos}).then((res) => {
                update($lists => {
                    const list = $lists.find(l => l.id === id);

                    list.pos = res.pos;
                    $lists.sort((x, y) => x.pos - y.pos);

                    return $lists;
                });
            });
        },
        reset: async () => {
            const res = await getLists();
        
            set(res);
        },
        update: () => update($lists => $lists)
	};
}

export const lists = createLists();