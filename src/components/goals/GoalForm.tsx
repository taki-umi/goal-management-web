'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { CreateGoalParams } from '@/types/goal';

interface GoalFormProps {
    userId: string;
    onSubmit: (goalData: CreateGoalParams) => Promise<void>;
    isLoading: boolean;
    error: string | null;
}

export default function GoalForm({ userId, onSubmit, isLoading, error }: GoalFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [parentGoalId, setParentGoalId] = useState('');

    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // バリデーション
        if (!title.trim()) {
            return; // フォームのrequired属性でハンドリング
        }

        // ゴールデータを作成
        const goalData: CreateGoalParams = {
            userId,
            title: title.trim(),
            description: description.trim() || undefined,
            category: category.trim() || undefined,
            targetDate: targetDate || undefined,
            parentGoalId: parentGoalId.trim() || undefined
        };

        // 親コンポーネントに送信処理を委任
        await onSubmit(goalData);
    };

    const handleCancel = () => {
        router.push('/');
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
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
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    タイトル <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                    <input
                        id="title"
                        name="title"
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="ゴールのタイトル"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    説明
                </label>
                <div className="mt-1">
                    <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="ゴールの詳細な説明"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    カテゴリー
                </label>
                <div className="mt-1">
                    <input
                        id="category"
                        name="category"
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="例: 仕事, 学習, 健康"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700">
                    目標日
                </label>
                <div className="mt-1">
                    <input
                        id="targetDate"
                        name="targetDate"
                        type="date"
                        value={targetDate}
                        onChange={(e) => setTargetDate(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="parentGoalId" className="block text-sm font-medium text-gray-700">
                    親ゴールID
                </label>
                <div className="mt-1">
                    <input
                        id="parentGoalId"
                        name="parentGoalId"
                        type="text"
                        value={parentGoalId}
                        onChange={(e) => setParentGoalId(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="親ゴールのID (サブゴールとして作成する場合)"
                    />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                    ※サブゴールとして作成する場合は親ゴールのIDを入力してください
                </p>
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                    キャンセル
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {isLoading ? '作成中...' : 'ゴールを作成'}
                </button>
            </div>
        </form>
    );
}