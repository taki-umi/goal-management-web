import axios, { AxiosError } from 'axios';
import { User } from '@/types/auth';
import { getApiErrorMessage } from '@/lib/errorUtils';

// APIのベースURL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9090/api';

// Axiosクライアントの作成
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10秒でタイムアウト
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

        // 開発用にリクエスト内容をログ出力
        if (process.env.NODE_ENV === 'development') {
            console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
                headers: config.headers,
                data: config.data,
                params: config.params
            });
        }

        return config;
    },
    (error) => {
        console.error('APIリクエストエラー:', error);
        return Promise.reject(error);
    }
);

// レスポンスインターセプター
apiClient.interceptors.response.use(
    (response) => {
        // 開発用にレスポンス内容をログ出力
        if (process.env.NODE_ENV === 'development') {
            console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
                status: response.status,
                data: response.data
            });
        }

        return response;
    },
    (error: AxiosError) => {
        // エラー内容をログ出力
        if (process.env.NODE_ENV === 'development') {
            console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
                status: error.response?.status,
                data: error.response?.data,
                error: getApiErrorMessage(error)
            });
        }

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
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;