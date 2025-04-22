export type GoalStatus = 'ACTIVE' | 'COMPLETED' | 'ARCHIVED' | 'DELETED';

export interface Goal {
    id: string;
    userId: string;
    title: string;
    description?: string;
    category?: string;
    targetDate?: string; // ISO形式の日付文字列
    status: GoalStatus;
    progress: number; // 0-100の進捗度
    parentGoalId?: string;
    createdAt: string; // ISO形式の日付文字列
    updatedAt: string; // ISO形式の日付文字列
}

export interface CreateGoalParams {
    userId: string;
    title: string;
    description?: string;
    category?: string;
    targetDate?: string;
    parentGoalId?: string;
}

export interface UpdateGoalParams {
    title?: string;
    description?: string;
    category?: string;
    targetDate?: string;
    status?: GoalStatus;
}

export interface UpdateProgressParams {
    progress: number;
}