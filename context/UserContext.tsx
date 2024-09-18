import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../services/supabase'; // Adjust the path to match your project

interface User {
    id: string;
    email: string | undefined;
    display_name: string | null;
    avatar_url: string | null;
    bio: string | null;
    phone: string | null;
    last_sign_in_at: string | null;
}

interface UserContextType {
    user: User | null;
    fetchUserSession: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const fetchUserSession = async () => {
        const { data: session, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session?.session) {
            setUser(null);
            return;
        }

        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
            console.error('Error fetching user session:', error);
            setUser(null);
            return;
        }

        setUser({
            id: user.id,
            email: user.email,
            display_name: user.user_metadata?.display_name || 'No display name',
            avatar_url: user.user_metadata?.avatar_url || null,
            bio: user.user_metadata?.bio || null,
            phone: user.user_metadata?.phone || null,
            last_sign_in_at: user.last_sign_in_at || null,
        });
    };

    useEffect(() => {
        fetchUserSession();
    }, []);

    return (
        <UserContext.Provider value={{ user, fetchUserSession }}>
            {children}
        </UserContext.Provider>
    );
};