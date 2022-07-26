const API_URL = 'http://localhost:3000';

export const getLists = async () => {
    return await fetch(`${API_URL}/lists?_embed=cards&_sort=pos&_order=asc`)
        .then(response => response.json())
        .catch(error => {
            console.error(error);
            return [];
        });
};

export const addList = async (title, id, pos) => {
    return await fetch(`${API_URL}/lists`, {
            method: 'POST',
            body: JSON.stringify({id, title, cards: [], pos}),
            headers: {"content-type": "application/json"}
        })
        .then(response => response.json())
        .catch(error => {
            console.error(error);
            return [];
        });
};

export const deleteList = async (id) => {
    return await fetch(`${API_URL}/lists/${id}`, {
            method: 'DELETE',
            headers: {"content-type": "application/json"}
        })
        .then(response => response.json())
        .catch(error => {
            console.error(error);
            return [];
        });
};

export const editList = async (id, body) => {
    return await fetch(`${API_URL}/lists/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(body),
            headers: {"content-type": "application/json"}
        })
        .then(response => response.json())
        .catch(error => {
            console.error(error);
            return [];
        });
};

export const addCard = async (id, title, listId, pos) => {
    return await fetch(`${API_URL}/lists/${listId}/cards`, {
            method: 'POST',
            body: JSON.stringify({id, title, listId, pos}),
            headers: {"content-type": "application/json"}
        })
        .then(response => response.json())
        .catch(error => {
            console.error(error);
            return {};
        });
};

export const deleteCard = async (id) => {
    return await fetch(`${API_URL}/cards/${id}`, {
            method: 'DELETE',
            headers: {"content-type": "application/json"}
        })
        .then(response => response.json())
        .catch(error => {
            console.error(error);
            return {};
        });
};

export const editCard = async (id, body) => {
    return await fetch(`${API_URL}/cards/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(body),
            headers: {"content-type": "application/json"}
        })
        .then(response => response.json())
        .catch(error => {
            console.error(error);
            return [];
        });
};

export const setUnsplashRandomImage = async () => {
    const UNSPLASH_ACCESS_KEY = 'eJiOO7TA0NnypxNu0h4NwI_Q5fqTtEJeH-ZZD-2ergs';

    return await fetch(`https://api.unsplash.com/photos/random?client_id=${UNSPLASH_ACCESS_KEY}`)
    	.then(response => response.json())
    	.then(data => {
            Object.assign(document.body.style, {
                backgroundImage: `url(${data.urls.regular})`,
            })
        }).catch(error => {
        	console.error(error);
        	return [];
        });
}