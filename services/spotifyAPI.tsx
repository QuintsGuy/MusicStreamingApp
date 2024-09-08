import axios from 'axios';

const BASE_URL = 'https://api.spotify.com/v1';

export const fetchAlbums = async() => {
    try {
        const response = await axios.get(`${BASE_URL}/albums`, {
            headers: {
                Authorization: `Bearer ${process.env.SPOTIFY_API_KEY}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching albums:', error);
        throw error;
    }
};