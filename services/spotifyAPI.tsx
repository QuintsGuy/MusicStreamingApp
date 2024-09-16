import supabase from './supabase';

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
