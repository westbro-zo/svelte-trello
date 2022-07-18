import { get } from 'svelte/store';
import { addCard } from '~/api';
import { lists } from '~/store/list'

export const cards = {
    add: ({ title, id, listId }) => {
        addCard(id, title, listId).then(res => {
            const list = get(lists).find(l => l.id === listId);

            list.cards.push(res);
            lists.update();
        });
    }
}