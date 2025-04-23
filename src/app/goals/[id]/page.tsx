'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Goal, UpdateGoalParams, UpdateProgressParams } from '@/types/goal';
import { goalApi } from '@/lib/api/goals';
import ProgressBar from '@/components/goals/ProgressBar';
import Link from 'next/link';
import GoalList from '@/components/goals/GoalList';
import { formatDate } from '@/lib/utils';
import { use } from 'react';

interface GoalDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function GoalDetailPage({ params }: GoalDetailPageProps) {
    const [goal, setGoal] = useState<Goal | null>(null);
    const [subGoals, setSubGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedGoal, setEditedGoal] = useState<UpdateGoalParams>({});
    const [progressValue, setProgressValue] = useState(0);
    const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);

    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const { id: goalId } = use(params);
    console.log("goalId: ", goalId);

    // 認証チェックとゴール情報の取得
    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }

        const fetchGoalDetails = async () => {
            try {
                setLoading(true);
                setError(null);

                // 選択したゴールの情報を取得
                const goalData = await goalApi.getGoalById(goalId);
                console.log("goalData: ", goalData);
                setGoal(goalData);
                setProgressValue(goalData.progress);

                // サブゴールの情報を取得
                const subGoalsData = await goalApi.getSubGoals(goalId);
                setSubGoals(subGoalsData);
            } catch (err) {
                console.error('ゴール詳細取得エラー:', err);
                setError('ゴール情報の取得中にエラーが発生しました。');
            } finally {
                setLoading(false);
            }
        };

        fetchGoalDetails();
    }, [isAuthenticated, router, goalId]);

    // 編集フォームの値を更新
    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditedGoal(prev => ({ ...prev, [name]: value }));
    };

    // 編集モードの切り替え
    const toggleEditMode = () => {
        if (isEditing) {
            // 編集モードを終了
            setIsEditing(false);
            setEditedGoal({});
        } else {
            // 編集モードを開始（現在の値をフォームに設定）
            setIsEditing(true);
            setEditedGoal({
                title: goal?.title,
                description: goal?.description,
                category: goal?.category,
                targetDate: goal?.targetDate ? goal.targetDate.split('T')[0] : '',
                status: goal?.status
            });
        }
    };

    // ゴール更新処理
    const handleUpdateGoal = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!goal) return;

        try {
            setLoading(true);
            setError(null);

            // ゴールを更新
            const updatedGoal = await goalApi.updateGoal(goalId, editedGoal);
            setGoal(updatedGoal);
            setIsEditing(false);
        } catch (err) {
            console.error('ゴール更新エラー:', err);
            setError('ゴールの更新中にエラーが発生しました。');
        } finally {
            setLoading(false);
        }
    };

    // 進捗更新処理
    const handleUpdateProgress = async () => {
        if (!goal) return;

        try {
            setIsUpdatingProgress(true);
            setError(null);

            // 進捗を更新
            const updatedGoal = await goalApi.updateProgress(goalId, { progress: progressValue });
            setGoal(updatedGoal);
        } catch (err) {
            console.error('進捗更新エラー:', err);
            setError('進捗の更新中にエラーが発生しました。');
        } finally {
            setIsUpdatingProgress(false);
        }
    };

    // ゴールアーカイブ処理
    const handleArchiveGoal = async () => {
        if (!goal) return;

        try {
            setLoading(true);
            setError(null);

            // ゴールをアーカイブ
            const archivedGoal = await goalApi.archiveGoal(goalId);
            setGoal(archivedGoal);
        } catch (err) {
            console.error('ゴールアーカイブエラー:', err);
            setError('ゴールのアーカイブ中にエラーが発生しました。');
        } finally {
            setLoading(false);
        }
    };

    // ゴール削除処理
    const handleDeleteGoal = async () => {
        if (!goal) return;

        try {
            setLoading(true);
            setError(null);

            // ゴールを削除
            await goalApi.deleteGoal(goalId);

            // ダッシュボードにリダイレクト
            router.push('/');
        } catch (err) {
            console.error('ゴール削除エラー:', err);
            setError('ゴールの削除中にエラーが発生しました。');
        } finally {
            setLoading(false);
        }
    };

    // ステータスバッジの色を決定
    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'bg-green-100 text-green-800';
            case 'COMPLETED':
                return 'bg-blue-100 text-blue-800';
            case 'ARCHIVED':
                return 'bg-gray-100 text-gray-800';
            case 'DELETED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // 認証されていない場合は何も表示しない
    if (!isAuthenticated()) {
        return null;
    }

    if (loading && !goal) {
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

    if (error && !goal) {
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

    if (!goal) {
        return (
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex items-center justify-center min-h-[50vh]">
                        <p className="text-gray-500">ゴールが見つかりませんでした。</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                {/* エラーメッセージ */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded mb-6">
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

                {/* ナビゲーション */}
                <div className="mb-6">
                    <Link href="/" className="text-sm text-indigo-600 hover:text-indigo-500">
                        ← ダッシュボードに戻る
                    </Link>
                </div>

                {/* ゴール詳細 */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    {/* ヘッダー */}
                    <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-900">{goal.title}</h2>
                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(goal.status)}`}>
                                {goal.status}
                            </span>
                        </div>
                    </div>

                    {/* 編集モード */}
                    {isEditing ? (
                        <div className="px-6 py-5">
                            <form onSubmit={handleUpdateGoal}>
                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                            タイトル <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            id="title"
                                            required
                                            value={editedGoal.title || ''}
                                            onChange={handleEditChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                            説明
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            rows={3}
                                            value={editedGoal.description || ''}
                                            onChange={handleEditChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                            カテゴリー
                                        </label>
                                        <input
                                            type="text"
                                            name="category"
                                            id="category"
                                            value={editedGoal.category || ''}
                                            onChange={handleEditChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700">
                                            目標日
                                        </label>
                                        <input
                                            type="date"
                                            name="targetDate"
                                            id="targetDate"
                                            value={editedGoal.targetDate || ''}
                                            onChange={handleEditChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                            ステータス
                                        </label>
                                        <select
                                            id="status"
                                            name="status"
                                            value={editedGoal.status || goal.status}
                                            onChange={handleEditChange}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        >
                                            <option value="ACTIVE">進行中</option>
                                            <option value="COMPLETED">完了</option>
                                            <option value="ARCHIVED">アーカイブ済み</option>
                                        </select>
                                    </div>

                                    <div className="flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={toggleEditMode}
                                            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            キャンセル
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            更新する
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <>
                            {/* 詳細表示モード */}
                            <div className="px-6 py-5">
                                {goal.description && (
                                    <div className="mb-4">
                                        <h3 className="text-sm font-medium text-gray-500">説明</h3>
                                        <p className="mt-1 text-base text-gray-900">{goal.description}</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    {goal.category && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">カテゴリー</h3>
                                            <p className="mt-1 text-base text-gray-900">{goal.category}</p>
                                        </div>
                                    )}

                                    {goal.targetDate && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">目標日</h3>
                                            <p className="mt-1 text-base text-gray-900">{formatDate(goal.targetDate)}</p>
                                        </div>
                                    )}

                                    {goal.parentGoalId && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">親ゴール</h3>
                                            <Link href={`/goals/${goal.parentGoalId}`} className="mt-1 text-base text-indigo-600 hover:text-indigo-500">
                                                親ゴールを表示
                                            </Link>
                                        </div>
                                    )}

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">作成日</h3>
                                        <p className="mt-1 text-base text-gray-900">{formatDate(goal.createdAt)}</p>
                                    </div>
                                </div>

                                {/* 進捗バー */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-sm font-medium text-gray-500">進捗状況</h3>
                                        <span className="text-sm font-medium text-gray-900">{goal.progress}%</span>
                                    </div>
                                    <ProgressBar progress={goal.progress} />
                                </div>

                                {/* 進捗更新フォーム */}
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-700 mb-3">進捗を更新</h3>
                                    <div className="flex items-center space-x-4">
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            step="5"
                                            value={progressValue}
                                            onChange={(e) => setProgressValue(parseInt(e.target.value))}
                                            className="flex-grow"
                                        />
                                        <span className="text-sm font-medium text-gray-900 w-12">{progressValue}%</span>
                                        <button
                                            onClick={handleUpdateProgress}
                                            disabled={isUpdatingProgress || goal.progress === progressValue}
                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                        >
                                            更新
                                        </button>
                                    </div>
                                </div>

                                {/* アクションボタン */}
                                <div className="flex justify-between mt-8">
                                    <div>
                                        <button
                                            onClick={toggleEditMode}
                                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            編集
                                        </button>
                                    </div>
                                    <div className="space-x-3">
                                        <button
                                            onClick={handleArchiveGoal}
                                            disabled={goal.status === 'ARCHIVED'}
                                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                        >
                                            アーカイブ
                                        </button>
                                        {deleteConfirmation ? (
                                            <>
                                                <span className="text-sm text-gray-500 mr-2">本当に削除しますか？</span>
                                                <button
                                                    onClick={() => setDeleteConfirmation(false)}
                                                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                >
                                                    キャンセル
                                                </button>
                                                <button
                                                    onClick={handleDeleteGoal}
                                                    className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                >
                                                    削除する
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => setDeleteConfirmation(true)}
                                                className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                            >
                                                削除
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* サブゴール一覧 */}
                {subGoals.length > 0 && (
                    <div className="mt-8">
                        <GoalList goals={subGoals} title="サブゴール" />
                    </div>
                )}

                {/* サブゴール追加ボタン */}
                <div className="mt-6 text-center">
                    <Link
                        href={`/goals/create?parentGoalId=${goalId}`}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        サブゴールを追加
                    </Link>
                </div>
            </div>
        </div>
    );
}