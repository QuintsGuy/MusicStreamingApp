import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://yaeyzphuybekcvrbpycj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhZXl6cGh1eWJla2N2cmJweWNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU3NjUyNzEsImV4cCI6MjA0MTM0MTI3MX0.FBzWqd-ljEb38IHNwL1SPiZ8KQ4S-2IQd4jx2qxdKhk'

export const supabase = createClient(supabaseUrl, supabaseKey);

export const addPlaylist = async (playlistName: string) => {
    const { data, error } = await supabase
        .from('playlists')
        .insert({ name: playlistName });
    if (error) {
        console.error('Error adding playlist:', error);
        throw error;
    }
    return data;
}