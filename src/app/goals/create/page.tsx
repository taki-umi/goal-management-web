'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { CreateGoalParams } from '@/types/goal';
import { goalApi } from '@/lib/api/goals';
import GoalForm from '@/components/goals/GoalForm';

export default function CreateGoalPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    // 認証チェック
    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    // ゴール作成処理
    const handleCreateGoal = async (goalData: CreateGoalParams) => {
        try {
            setIsLoading(true);
            setError(null);

            // ゴールを作成
            await goalApi.createGoal(goalData);

            // 成功したらダッシュボードに戻る
            router.push('/');
        } catch (err) {
            console.error('ゴール作成エラー:', err);
            setError('ゴールの作成中にエラーが発生しました。');
        } finally {
            setIsLoading(false);
        }
    };

    // 未認証の場合は何も表示しない（useEffectでリダイレクト）
    if (!isAuthenticated() || !user) {
        return null;
    }

    return (
        <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">新しいゴールを作成</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        あなたが達成したい目標を設定しましょう
                    </p>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <GoalForm
                        userId={user.id}
                        onSubmit={handleCreateGoal}
                        isLoading={isLoading}
                        error={error}
                    />
                </div>
            </div>
        </div>
    );
}