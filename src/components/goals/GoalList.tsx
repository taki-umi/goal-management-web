'use client';

import { Goal, GoalStatus } from '@/types/goal';
import GoalCard from './GoalCard';
import React, { useState } from 'react';

interface GoalListProps {
    goals: Goal[];
    title?: string;
}

export default function GoalList({ goals, title = 'ゴール一覧' }: GoalListProps) {
    const [statusFilter, setStatusFilter] = useState<GoalStatus | 'ALL'>('ALL');

    const filteredGoals = statusFilter === 'ALL'
        ? goals
        : goals.filter(goal => goal.status === statusFilter);

    const statusOptions: { value: GoalStatus | 'ALL', label: string }[] = [
        { value: 'ALL', label: 'すべて' },
        { value: 'ACTIVE', label: '進行中' },
        { value: 'COMPLETED', label: '完了' },
        { value: 'ARCHIVED', label: 'アーカイブ済み' },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                <div className="flex items-center space-x-2">
                    <label htmlFor="status-filter" className="text-sm text-gray-600">
                        ステータス:
                    </label>
                    <select
                        id="status-filter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as GoalStatus | 'ALL')}
                        className="text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredGoals.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg shadow">
                    <p className="text-gray-500">表示するゴールがありません</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredGoals.map(goal => (
                        <GoalCard key={goal.id} goal={goal} />
                    ))}
                </div>
            )}
        </div>
    );
}