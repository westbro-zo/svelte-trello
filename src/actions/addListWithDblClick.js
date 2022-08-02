
import { get } from 'svelte/store';
import { lists } from '~/store/list';

export function addListWithDblClick(el, hidePopup) {
    const handleDblClick = (e) => {
        e.stopPropagation();

        const HEADER_HEIGHT = 40;
        const cursorX = e.clientX + el.scrollLeft;
        const cursorY = e.clientY - HEADER_HEIGHT;

        hidePopup(false);
        addElement(el, cursorX, cursorY);
    }

    el.addEventListener('dblclick', handleDblClick);

    return {
        destroy() {
            el.removeEventListener('dblclick', handleDblClick);
        }
    }
}

function addElement(el, x, y) {
    const popupEl = el.querySelector('.popup');
    const positionEl = popupEl.querySelector('.position');
    const popupTitleEl = popupEl.querySelector('.popup_title');
    const position = getPosition(x);

    popupEl.style.cssText = `top:${y}px; left:${x}px;`

    positionEl.value = `${position}`;
    positionEl.setAttribute('value', position);
    popupTitleEl.focus();
}

function getPosition(x) {
    let pos;

    const LIST_WIDTH = 290;
    const LIST_LEFT_MARGIN = 4;
    const CONTAINER_LEFT_PADDING = 30;
    const maxIndex = get(lists).length + 1;

    if (x < CONTAINER_LEFT_PADDING + LIST_LEFT_MARGIN) { // 34
        pos = 0;
    } else {
        let tmp = x - CONTAINER_LEFT_PADDING - LIST_LEFT_MARGIN;

        pos = tmp / (LIST_LEFT_MARGIN * 2 + LIST_WIDTH);
    }

    pos = Math.floor(pos) + 1;

    return pos > maxIndex ? maxIndex : pos;
}