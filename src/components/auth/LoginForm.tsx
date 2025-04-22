'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!username.trim()) {
            setError('ユーザー名を入力してください');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            // 簡易認証を実行
            login(username);

            // ダッシュボードにリダイレクト
            router.push('/');
        } catch (err) {
            console.error('ログインエラー:', err);
            setError('ログイン処理中にエラーが発生しました');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                    Goal Achieve
                </h2>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        ユーザー名
                    </label>
                    <div className="mt-1">
                        <input
                            id="username"
                            name="username"
                            type="text"
                            autoComplete="username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="ユーザー名を入力（例: admin）"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {isLoading ? 'ログイン中...' : 'ログイン'}
                    </button>
                </div>

                <div className="text-sm text-center text-gray-500">
                    <p>※開発用の簡易ログイン機能です</p>
                    <p>「admin」でログインすると管理者権限が付与されます</p>
                </div>
            </form>
        </div>
    );
}