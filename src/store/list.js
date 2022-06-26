import { writable } from 'svelte/store';

const repoLists = []; // 배열 데이터 가져오기
const _lists = writable(repoLists);

_lists.subscribe(($lists) => {
    // 배열 데이터 저장
});

// custom store
export const lists = {
    // 자동구독 만듬
    subscribe: _lists.subscribe,
    // 메소드 정의
    add: function(payload) {
        const { title } = payload;
        
        _lists.update(($lists) => {
            $lists.push({
                id: '',
                title,
                cards: []
            });

            return $lists;
        })
    }
}