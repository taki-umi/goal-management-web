import axios, { AxiosError } from 'axios';

/**
 * APIエラー情報を整形して返す
 */
export const getApiErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string; error?: { message?: string }; details?: string }>;

        // レスポンスがある場合
        if (axiosError.response) {
            // バックエンドからのエラーメッセージがある場合
            const data = axiosError.response.data;

            if (typeof data === 'object' && data !== null) {
                if (data.message) return data.message;
                if (data.error && data.error.message) return data.error.message;
                if (data.details) return data.details;
            }

            // ステータスコードに基づいたメッセージ
            switch (axiosError.response.status) {
                case 400: return '不正なリクエストです。入力内容を確認してください。';
                case 401: return '認証エラーが発生しました。再ログインしてください。';
                case 403: return 'このアクションを実行する権限がありません。';
                case 404: return '指定されたリソースが見つかりませんでした。';
                case 422: return 'データの検証エラーが発生しました。入力内容を確認してください。';
                case 429: return 'リクエストの頻度が高すぎます。しばらく待ってから再試行してください。';
                case 500: return 'サーバーエラーが発生しました。時間をおいて再試行してください。';
                default: return `エラーが発生しました（ステータス: ${axiosError.response.status}）`;
            }
        }

        // リクエストは送信されたがレスポンスがない場合
        if (axiosError.request) {
            return 'サーバーに接続できません。インターネット接続を確認してください。';
        }

        // リクエスト設定時のエラー
        return `リクエストエラー: ${axiosError.message}`;
    }

    // Axiosエラー以外の場合
    if (error instanceof Error) {
        return error.message;
    }

    return '予期しないエラーが発生しました。';
};

/**
 * APIリクエストを3回までリトライする
 */
export const withRetry = async <T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
): Promise<T> => {
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;

            // 特定のエラーはリトライしない
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                // 400系エラーはリトライしない（認証エラーと429だけ例外）
                if (axiosError.response && axiosError.response.status >= 400 && axiosError.response.status < 500) {
                    if (axiosError.response.status !== 401 && axiosError.response.status !== 429) {
                        throw error;
                    }
                }
            }

            // 最後の試行ならエラーをスロー
            if (attempt === maxRetries) {
                throw error;
            }

            // 待機時間を計算（指数バックオフ）
            const waitTime = delayMs * Math.pow(2, attempt - 1);
            console.log(`リトライ ${attempt}/${maxRetries} (${waitTime}ms後)...`);

            // 指定時間待機
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }

    // ここには到達しないはずだが、念のため
    throw lastError;
};

/**
 * エラートースト表示用のインターフェース
 */
export interface ErrorToast {
    message: string;
    type: 'error' | 'warning' | 'info' | 'success';
    duration?: number;
}

/**
 * エラーメッセージからトースト表示用オブジェクトを作成
 */
export const createErrorToast = (error: unknown): ErrorToast => {
    return {
        message: getApiErrorMessage(error),
        type: 'error',
        duration: 5000
    };
};