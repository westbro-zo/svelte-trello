
import { get } from 'svelte/store';
import { lists } from '~/store/list';
import { DEFAULT_POS, dndType, dndAction } from '~/app.value'
import { v4 as uuidv4 } from 'uuid';

export function dragAndDrop(el, params) {
    let listIndex = params.listIndex;
    let cardIndex = params.cardIndex;

    const dragStart = (e) => {
        e.stopPropagation();

        const start = listIndex === undefined ? cardIndex : listIndex;
        const data = {start, ...params};

        e.dataTransfer.setData('text/plain', JSON.stringify(data));
    }

    const drop = (e) => {
        e.stopPropagation();

        // 시작(드래그 대상) 데이터
        const {start, type, listId: startListId, cardId} = JSON.parse(e.dataTransfer.getData("text/plain"));

        // 시작 타입: 리스트
        if (type === dndType.LIST) {
            if (params.type === dndAction.CREATE) {
                return;
            }

            if (params.type === dndAction.DELETE) {
                lists.remove({id: startListId});

                return;
            }

            // 도착 타입 card 와 list일 때
            const index = listIndex !== undefined ? listIndex : get(lists).findIndex(list => list.id === params.listId);

            listToListDrop(parseInt(start), index);

            return;
        }

        // 시작 타입: 카드
        if (type === dndType.CARD) {
            if (params.type === dndAction.CREATE) {
                lists.addListAndCard({
                    id: uuidv4(),
                    oldId: startListId,
                    title: 'undefined',
                    pos: getNewPos(0, get(lists).length - 1, get(lists)),
                    cardId,

                })

                return;
            }

            if (params.type === dndAction.DELETE) {
                lists.removeCard({id: cardId, listId: startListId});

                return;
            }

            const index = cardIndex !== undefined ? cardIndex : get(lists)[params.listIndex].cards.length - 1;

            // 같은 리스트로 카드 옮기기
            if (startListId === params.listId) {
                cardToCardDrop(start, index, startListId);

                return;
            }

            // 다른 리스트로 카드 옮기기
            cardToListDrop(cardId, index, params.listId, startListId);

            return;
        }

    }

    const dragOver = e => e.preventDefault();

    setTimeout(() => {    
        el.addEventListener('dragstart', dragStart);
        el.addEventListener('drop', drop);
        el.addEventListener('dragover', dragOver);
    });

    return {
        update(params) {
            listIndex = params.listIndex;
            cardIndex = params.cardIndex;
        },
        destroy() {
            el.removeEventListener('dragstart', dragStart);
            el.removeEventListener('drop', drop);
            el.removeEventListener('dragover', dragOver);
        }
    }
}


function listToListDrop(start, index) {
    if (index === start) {
        return;
    }

    const _lists = get(lists);
    const newPos = getNewPos(start, index, _lists);

    lists.reorder({id: _lists[start].id, pos: newPos});
}

function cardToCardDrop(start, index, listId) {
    if (index === start) {
        return;
    }

    const _cards = get(lists).find(list => list.id === listId).cards;
    const newPos = getNewPos(start, index, _cards);

    lists.reorderCard({id: _cards[start].id, pos: newPos, listId});
}

function cardToListDrop(id, index, listId, oldlistId) {
    let newPos;
    const _cards = get(lists).find(l => l.id === listId).cards;

    if (_cards.length === 0) {
        newPos = DEFAULT_POS;
    } else {
        const nextPos = index === _cards.length - 1 ? _cards[_cards.length - 1].pos + DEFAULT_POS : _cards[index+1].pos;

        newPos = (_cards[index].pos + nextPos) / 2;
    }

    lists.reorderNewCard({id, pos: newPos, listId, oldlistId});
}

function getNewPos(start, index, arr) {
    if (start > index) {
        const prevPos = index === 0 ? 0 : arr[index-1].pos;

        return (arr[index].pos + prevPos) / 2;
    }

    const nextPos = index === arr.length - 1 ? arr[arr.length - 1].pos + DEFAULT_POS : arr[index + 1].pos;

    return (arr[index].pos + nextPos) / 2;
}