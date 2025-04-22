'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Goal } from '@/types/goal';
import { goalApi } from '@/lib/api/goals';
import GoalList from '@/components/goals/GoalList';
import Link from 'next/link';

export default function Dashboard() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [recommendedGoals, setRecommendedGoals] = useState<Goal[]>([]);
  const [upcomingGoals, setUpcomingGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 認証されていない場合はログインページにリダイレクト
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    // ユーザーのゴール一覧を取得
    const fetchGoals = async () => {
      try {
        setLoading(true);

        if (user) {
          // ユーザーのゴール一覧を取得
          const userGoals = await goalApi.getGoalsByUserId(user.id);
          console.log('APIからのレスポンス:', JSON.stringify(userGoals, null, 2)); //TODO: 一時的なログ
          setGoals(userGoals);

          // おすすめゴールを取得
          const recommended = await goalApi.getRecommendedGoals(user.id, 3);
          setRecommendedGoals(recommended);

          // 期限が近いゴールを取得
          const upcoming = await goalApi.getUpcomingGoals(user.id, 7);
          setUpcomingGoals(upcoming);
        }
      } catch (err) {
        console.error('ゴール取得エラー:', err);
        setError('ゴールの取得中にエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [isAuthenticated, router, user]);

  // 認証されていない場合は何も表示しない（useEffectでリダイレクト）
  if (!isAuthenticated()) {
    return null;
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-center min-h-[50vh]">
            <p className="text-gray-500">ゴール情報を読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
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
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* ヘッダー部分 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
          <Link
            href="/goals/create"
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            新しいゴールを作成
          </Link>
        </div>

        {/* ステータスサマリー */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white shadow rounded-lg p-4 border-l-4 border-green-500">
            <p className="text-sm font-medium text-gray-500">進行中のゴール</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">
              {goals.filter(goal => goal.status === 'ACTIVE').length}
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-4 border-l-4 border-blue-500">
            <p className="text-sm font-medium text-gray-500">完了したゴール</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">
              {goals.filter(goal => goal.status === 'COMPLETED').length}
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-4 border-l-4 border-yellow-500">
            <p className="text-sm font-medium text-gray-500">平均進捗率</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">
              {goals.length > 0
                ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length)
                : 0}%
            </p>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="space-y-8">
          {/* すべてのゴール */}
          <GoalList goals={goals} title="あなたのゴール" />

          {/* 期限が近いゴール */}
          {upcomingGoals.length > 0 && (
            <GoalList goals={upcomingGoals} title="期限が近いゴール" />
          )}

          {/* おすすめゴール */}
          {recommendedGoals.length > 0 && (
            <GoalList goals={recommendedGoals} title="おすすめゴール" />
          )}
        </div>

        {/* ゴールが存在しない場合の表示 */}
        {goals.length === 0 && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">ゴールが登録されていません</h3>
            <p className="mt-1 text-gray-500">
              最初のゴールを作成して、目標達成への第一歩を踏み出しましょう！
            </p>
            <div className="mt-6">
              <Link
                href="/goals/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                最初のゴールを作成する
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}