'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '@/lib/auth';
import { User } from '@/types/auth';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, name?: string) => Promise<void>;
    signOut: () => Promise<void>;
    logout: () => Promise<void>;
    login: (username: string) => void;
    isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 初期ユーザー取得
        authService
            .getCurrentUser()
            .then((user) => setUser(user))
            .catch((error) => console.error('ユーザー取得エラー:', error))
            .finally(() => setLoading(false));

        // セッション変更監視
        const { data: { subscription } } = authService.onAuthStateChange((user) => {
            setUser(user);
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signIn = async (email: string, password: string) => {
        try {
            await authService.signIn(email, password);
            const user = await authService.getCurrentUser();
            setUser(user);
        } catch (error) {
            console.error('ログインエラー:', error);
            throw error;
        }
    };

    const signUp = async (email: string, password: string, name?: string) => {
        try {
            await authService.signUp(email, password, name);
            const user = await authService.getCurrentUser();
            setUser(user);
        } catch (error) {
            console.error('サインアップエラー:', error);
            throw error;
        }
    };

    const signOut = async () => {
        try {
            await authService.signOut();
            setUser(null);
        } catch (error) {
            console.error('ログアウトエラー:', error);
            throw error;
        }
    };

    const logout = signOut; // エイリアス

    const login = (username: string) => {
        // 開発用の簡易ログイン機能（後方互換性のため）
        const mockUser: User = {
            id: username === 'admin' ? 'admin-id' : 'user-id',
            email: `${username}@example.com`,
            username: username,
            isAdmin: username === 'admin',
        };
        setUser(mockUser);
    };

    const isAuthenticated = () => {
        return user !== null;
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, logout, login, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};