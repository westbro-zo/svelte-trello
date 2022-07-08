const API_URL = 'http://localhost:3000';

export const getLists = async () => {
    return await fetch(`${API_URL}/lists`)
        .then(response => response.json())
        .catch(error => {
            console.error(error);
            return [];
        });
};

export const addList = async (title, id) => {
    return await fetch(`${API_URL}/lists`, {
            method: 'POST',
            body: JSON.stringify({
                id,
                title,
                cards: [],
            }),
            headers: {
                "content-type": "application/json"
            }
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