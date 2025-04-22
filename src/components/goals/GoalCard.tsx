'use client';

import { Goal } from '@/types/goal';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import ProgressBar from './ProgressBar';

interface GoalCardProps {
    goal: Goal;
}

export default function GoalCard({ goal }: GoalCardProps) {
    // ステータスに応じたバッジの色を決定
    const getBadgeColor = () => {
        switch (goal.status) {
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

    return (
        <div className="bg-white shadow rounded-lg p-4 border-l-4 border-indigo-500">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-gray-900">{goal.title}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBadgeColor()}`}>
                    {goal.status}
                </span>
            </div>

            {goal.description && (
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{goal.description}</p>
            )}

            <div className="mt-3">
                <ProgressBar progress={goal.progress} />
                <p className="text-sm text-right mt-1 text-gray-500">{goal.progress}% 完了</p>
            </div>

            <div className="flex items-center justify-between mt-4 text-sm">
                <div>
                    {goal.targetDate && (
                        <p className="text-gray-500">
                            目標日: {formatDate(goal.targetDate)}
                        </p>
                    )}
                    {goal.category && (
                        <p className="text-gray-500 mt-1">
                            カテゴリー: {goal.category}
                        </p>
                    )}
                </div>

                <Link
                    href={`/goals/${goal.id}`}
                    className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    詳細を見る
                </Link>
            </div>
        </div>
    );
}