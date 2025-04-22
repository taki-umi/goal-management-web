'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '@/types/auth';

// 認証コンテキストの作成
const AuthContext = createContext<AuthContextType | null>(null);

// 認証プロバイダー
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // クライアントサイドでのみ実行
        if (typeof window !== 'undefined') {
            // ローカルストレージからユーザー情報を取得
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
            setLoading(false);
        }
    }, []);

    // 簡易的なログイン処理
    const login = (username: string): User => {
        // 開発用の簡易認証
        const userData: User = {
            id: '1', // 仮のユーザーID
            username,
            isAdmin: username.toLowerCase() === 'admin' // adminユーザーの場合、管理者権限を付与
        };

        // ユーザー情報をローカルストレージに保存
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return userData;
    };

    // ログアウト処理
    const logout = (): void => {
        localStorage.removeItem('user');
        setUser(null);
    };

    // 認証状態確認
    const isAuthenticated = (): boolean => {
        return !!user;
    };

    // 管理者権限確認
    const isAdmin = (): boolean => {
        return user?.isAdmin === true;
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
}

// 認証コンテキストを使用するためのフック
export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}