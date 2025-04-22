import axios from 'axios';
import { User } from '@/types/auth';
import { log } from 'console';

// APIのベースURL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9090/api';

// Axiosクライアントの作成
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ユーザー情報取得
const getUserFromStorage = (): User | null => {
    if (typeof window === 'undefined') return null;

    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

// リクエストインターセプター
apiClient.interceptors.request.use(
    (config) => {
        const user = getUserFromStorage();

        // 開発用の簡易認証ヘッダー
        if (user) {
            config.headers['X-User-ID'] = user.id;
            config.headers['X-Username'] = user.username;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// レスポンスインターセプター
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.log(error);
        if (error.response) {
            // レスポンスありのエラー
            switch (error.response.status) {
                case 401: // 認証エラー
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('user');
                        window.location.href = '/login';
                    }
                    break;
                case 403: // 権限エラー
                    console.error('アクセス権限がありません');
                    break;
                default:
                    console.error('APIエラー:', error.response.data);
            }
        } else if (error.request) {
            // レスポンスなしのエラー
            console.error('サーバーに接続できません');
        } else {
            // リクエスト設定時のエラー
            console.error('リクエストエラー:', error.message);
        }
        return Promise.reject(error);
    }
);

export default apiClient;