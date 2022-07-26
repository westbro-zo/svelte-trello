import { writable } from 'svelte/store';
import { getLists, addList, deleteList, editList, editCard, addCard, deleteCard } from '~/api';


function createLists() {
	const { subscribe, set, update } = writable([]);

	return {
        subscribe,
        add: ({ title, id, pos }) => {
            addList(title, id, pos).then(res => {
                update($lists => {
                    $lists.push(res)

                    return $lists;
                })
            });
        },
        remove: ({ id }) => {
            deleteList(id).then(() => {
                update($lists => {
                    const index = $lists.findIndex(list => list.id === id);

                    if (index > -1) {
                        $lists.splice(index, 1);
                    }

                    return $lists;
                });
            });
        },
        edit: ({title, id}) => {
            editList(id, {title}).then((res) => {
                update($lists => {
                    const list = $lists.find(l => l.id === id);

                    list.title = res.title;

                    return $lists;
                });
            });
        },
        reorder: ({id, pos}) => {
            editList(id, {pos}).then((res) => {
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
        addCard: ({ title, id, listId, pos }) => {
            addCard(id, title, listId, pos).then(res => {
                update($lists => {
                    const list = $lists.find(l => l.id === listId);
        
                    list.cards.push(res);

                    return $lists;
                })
            });
        },
        removeCard: ({ id, listId }) => {
            deleteCard(id).then(() => {
                update($lists => {
                    const list = $lists.find(l => l.id === listId);
                    const index = list.cards.findIndex(card => card.id === id);
        
                    if (index > -1) {
                        list.cards.splice(index, 1);
                    }
    
                    return $lists;
                })
            });
        },
        editCard: ({ title, id, listId }) => {
            editCard(id, {title}).then((res) => {
                update($lists => {
                    const list = $lists.find(l => l.id === listId);
                    const card = list.cards.find(c => c.id === id);
        
                    card.title = res.title;
                
                    return $lists;
                })
            });
        },
        reorderCard: ({ id, pos, listId }) => {
            editCard(id, {pos}).then((res) => {
                update($lists => {
                    const list = $lists.find(l => l.id === listId);
                    const card = list.cards.find(c => c.id === id);
        
                    card.pos = res.pos;

                    return $lists;
                })
            });
        },
        reorderNewCard: ({ id, pos, listId, oldlistId }) => {
            editCard(id, {pos, listId}).then((res) => {
                update($lists => {
                    const oldlist = $lists.find(l => l.id === oldlistId);
                    const list = $lists.find(l => l.id === listId);
                    const index = oldlist.cards.findIndex(card => card.id === id);
        
                    if (index > -1) {
                        oldlist.cards.splice(index, 1);
                    }

                    list.cards.push(res);

                    return $lists;
                })
            });
        },
	};
}

export const lists = createLists();
