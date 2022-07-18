import { get } from 'svelte/store';
import { addCard, deleteCard, editCard } from '~/api';
import { lists } from '~/store/list'

export const cards = {
    add: ({ title, id, listId }) => {
        addCard(id, title, listId).then(res => {
            const list = get(lists).find(l => l.id === listId);

            list.cards.push(res);
            lists.update();
        });
    },
    remove: ({ id, listId }) => {
        deleteCard(id).then(() => {
            const list = get(lists).find(l => l.id === listId);
            const index = list.cards.findIndex(card => card.id === id);

            if (index > -1) {
                list.cards.splice(index, 1);
            }

            lists.update();
        });
    },
    edit: ({ title, id, listId }) => {
        editCard(id, {title}).then((res) => {
            const list = get(lists).find(l => l.id === listId);
            const card = list.cards.find(c => c.id === id);

            card.title = res.title;
            lists.update();
        });
    },
}