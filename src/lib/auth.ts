import { supabase } from '@/lib/supabase/client';
import { User } from '@/types/auth';

export const authService = {
    /**
     * ユーザー登録
     */
    signUp: async (email: string, password: string, name?: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name || email.split('@')[0], // 名前が指定されていない場合はメールアドレスの@より前を使用
                },
            },
        });

        if (error) throw error;
        return data;
    },

    /**
     * ログイン
     */
    signIn: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        return data;
    },

    /**
     * ログアウト
     */
    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    /**
     * 現在のユーザー取得
     */
    getCurrentUser: async (): Promise<User | null> => {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) return null;

        return {
            id: user.id,
            email: user.email || '',
            username: user.user_metadata?.name || user.email || 'ユーザー',
            isAdmin: true, // TODO: 今は仮でtrueにしているが、将来的に管理者判定を実装する
        };
    },

    /**
     * セッション取得
     */
    getSession: async () => {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        return session;
    },

    /**
     * 認証状態変更監視
     */
    onAuthStateChange: (callback: (user: User | null) => void) => {
        return supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                callback({
                    id: session.user.id,
                    email: session.user.email || '',
                    username: session.user.user_metadata?.name || session.user.email || 'ユーザー',
                    isAdmin: true, // TODO: 今は仮でtrueにしているが、将来的に管理者判定を実装する
                });
            } else {
                callback(null);
            }
        });
    },
};