const API_URL = 'http://localhost:3000';

export const getLists = async body => {
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

