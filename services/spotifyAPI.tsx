import supabase from './supabase';
import { Buffer } from 'buffer';
import { Track } from '../types/spotify';

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_URL = 'https://api.spotify.com/v1/';

export async function getSpotifyCredentials() {
    const { data, error } = await supabase
        .from('spotify_credentials')
        .select('client_id, client_secret')
        .single();  // Fetches a single row (you should only store one row of credentials)

    if (error) {
        throw new Error('Error fetching Spotify credentials');
    }

    return data;  // Return the client ID and client secret
}

async function getSpotifyToken() {
    const credentials = await getSpotifyCredentials();
    const { client_id, client_secret } = credentials;

    const authOptions = {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            grant_type: 'client_credentials'
        }).toString()
    };

    const response = await fetch(SPOTIFY_AUTH_URL, authOptions);
    const data = await response.json();

    if(response.ok) {
        return data.access_token;
    } else {
        throw new Error('Failed to fetch Spotify token');
    };
};

export async function getFeaturedPlaylists() {
    const accessToken = await getSpotifyToken();
    const response = await fetch(`${SPOTIFY_API_URL}browse/featured-playlists`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch featured playlists');
    }
    
    const data = await response.json();
    return data.playlists.items;
}

export async function getNewReleases() {
    const accessToken = await getSpotifyToken();
    const response = await fetch(`${SPOTIFY_API_URL}browse/new-releases`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch new releases');
    }

    const data = await response.json();
    return data.albums.items;
}

export async function getFeaturedPodcasts() {
    const accessToken = await getSpotifyToken();
    const response = await fetch(`${SPOTIFY_API_URL}recommendations`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch featured podcasts');
    }

    const data = await response.json();
    return data.albums.items; // Return the podcast categories
}

export async function getAlbumTracks(albumId: string) {
    const accessToken = await getSpotifyToken();
    const response = await fetch(`${SPOTIFY_API_URL}albums/${albumId}/tracks`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch album tracks');
    }

    const data = await response.json();
    return data.items; // Return the array of tracks from the album
}

export async function getArtistTracks(artistId: string) {
    const accessToken = await getSpotifyToken();
    const response = await fetch(`${SPOTIFY_API_URL}artists/${artistId}/top-tracks?market=US`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch artist top tracks');
    }

    const data = await response.json();
    return data.tracks; // Return the array of the artist's top tracks
}

export async function getShowEpisodes(showId: string) {
    const accessToken = await getSpotifyToken();
    const response = await fetch(`${SPOTIFY_API_URL}shows/${showId}/episodes`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch show episodes');
    }

    const data = await response.json();
    return data.items;
}

export async function getPlaylistTracks(playlistId: string) {
    const accessToken = await getSpotifyToken();
    const response = await fetch(`${SPOTIFY_API_URL}playlists/${playlistId}/tracks`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch playlist tracks');
    }

    const data = await response.json();
    return data.items; // Return the tracks in the playlist
};

export async function fetchSpotifySearch(query: string) {
    const accessToken = await getSpotifyToken();
    const response = await fetch(`${SPOTIFY_API_URL}search?q=${query}&type=track,artist,album,playlist,show,episode&market=US`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const data = await response.json();
    
    const tracks = data.tracks.items.map((item: any) => ({ ...item, type: 'track' }));
    const albums = data.albums.items.map((item: any) => ({ ...item, type: 'album' }));
    const artists = data.artists.items.map((item: any) => ({ ...item, type: 'artist' }));
    const playlists = data.playlists.items.map((item: any) => ({ ...item, type: 'playlist' }));
    const shows = data.shows.items.map((item: any) => ({ ...item, type: 'show' }));
    const episodes = data.episodes.items.map((item: any) => ({ ...item, type: 'episode' }));

    return [...tracks, ...albums, ...artists, ...playlists, ...shows, ...episodes]; 
};