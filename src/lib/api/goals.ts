import apiClient from './client';
import {
    Goal,
    GoalStatus,
    CreateGoalParams,
    UpdateGoalParams,
    UpdateProgressParams
} from '@/types/goal';

// ゴール関連のAPI機能
export const goalApi = {
    // ユーザーのゴール一覧を取得
    getGoalsByUserId: async (userId: string): Promise<Goal[]> => {
        try {
            const response = await apiClient.get<Goal[]>(`/goals?userId=${userId}`);
            return response.data.map(convertFromApiToGoal);
        } catch (error) {
            console.error('ゴール一覧取得エラー:', error);
            throw error;
        }
    },

    // ユーザーのゴール一覧をステータスでフィルタリング
    getGoalsByUserIdAndStatus: async (userId: string, status: GoalStatus): Promise<Goal[]> => {
        try {
            const response = await apiClient.get<Goal[]>(`/goals?userId=${userId}&status=${status}`);
            return response.data.map(convertFromApiToGoal);
        } catch (error) {
            console.error('ゴール一覧取得エラー:', error);
            throw error;
        }
    },

    // 特定のゴールを取得
    getGoalById: async (id: string): Promise<Goal> => {
        try {
            const response = await apiClient.get<Goal>(`/goals/${id}`);
            return convertFromApiToGoal(response.data);
        } catch (error) {
            console.error('ゴール取得エラー:', error);
            throw error;
        }
    },

    // 新規ゴールを作成
    createGoal: async (goalData: CreateGoalParams): Promise<Goal> => {
        try {
            const response = await apiClient.post<Goal>('/goals', goalData);
            return convertFromApiToGoal(response.data);
        } catch (error) {
            console.error('ゴール作成エラー:', error);
            throw error;
        }
    },

    // ゴールを更新
    updateGoal: async (id: string, goalData: UpdateGoalParams): Promise<Goal> => {
        try {
            const response = await apiClient.put<Goal>(`/goals/${id}`, goalData);
            return convertFromApiToGoal(response.data);
        } catch (error) {
            console.error('ゴール更新エラー:', error);
            throw error;
        }
    },

    // 進捗状況を更新
    updateProgress: async (id: string, params: UpdateProgressParams): Promise<Goal> => {
        try {
            const response = await apiClient.patch<Goal>(`/goals/${id}/progress?progress=${params.progress}`);
            return convertFromApiToGoal(response.data);
        } catch (error) {
            console.error('進捗更新エラー:', error);
            throw error;
        }
    },

    // ゴールをアーカイブ
    archiveGoal: async (id: string): Promise<Goal> => {
        try {
            const response = await apiClient.patch<Goal>(`/goals/${id}/archive`);
            return convertFromApiToGoal(response.data);
        } catch (error) {
            console.error('ゴールアーカイブエラー:', error);
            throw error;
        }
    },

    // ゴールを削除（論理削除）
    deleteGoal: async (id: string): Promise<void> => {
        try {
            await apiClient.delete(`/goals/${id}`);
        } catch (error) {
            console.error('ゴール削除エラー:', error);
            throw error;
        }
    },

    // サブゴール一覧を取得
    getSubGoals: async (parentGoalId: string): Promise<Goal[]> => {
        try {
            const response = await apiClient.get<Goal[]>(`/goals/parent/${parentGoalId}`);
            return response.data.map(convertFromApiToGoal);
        } catch (error) {
            console.error('サブゴール一覧取得エラー:', error);
            throw error;
        }
    },

    // おすすめゴール一覧を取得
    getRecommendedGoals: async (userId: string, limit: number = 5): Promise<Goal[]> => {
        try {
            const response = await apiClient.get<Goal[]>(`/goals/recommended?userId=${userId}&limit=${limit}`);
            return response.data.map(convertFromApiToGoal);
        } catch (error) {
            console.error('おすすめゴール取得エラー:', error);
            throw error;
        }
    },

    // 期限が近いゴール一覧を取得
    getUpcomingGoals: async (userId: string, daysAhead: number = 7): Promise<Goal[]> => {
        try {
            const response = await apiClient.get<Goal[]>(`/goals/upcoming?userId=${userId}&daysAhead=${daysAhead}`);
            return response.data.map(convertFromApiToGoal);
        } catch (error) {
            console.error('期限が近いゴール取得エラー:', error);
            throw error;
        }
    },
};

// APIレスポンスのデータをGoal型に変換
const convertFromApiToGoal = (goal: any): Goal => {
    return {
        id: goal.id.value,
        userId: goal.userId.value,
        title: goal.title,
        description: goal.description,
        category: goal.category === null ? undefined : goal.category.value,
        targetDate: goal.targetDate === null ? undefined : new Date(goal.targetDate[0], goal.targetDate[1] - 1, goal.targetDate[2]).toISOString(),
        status: goal.status,
        progress: goal.progress === null ? undefined : goal.progress.value,
        parentGoalId: goal.parentGoalId === null ? undefined : goal.parentGoalId.value,
        createdAt: new Date(goal.createdAt[0], goal.createdAt[1] - 1, goal.createdAt[2], goal.createdAt[3], goal.createdAt[4], goal.createdAt[5], goal.createdAt[6]).toISOString(),
        updatedAt: new Date(goal.updatedAt[0], goal.updatedAt[1] - 1, goal.updatedAt[2], goal.updatedAt[3], goal.updatedAt[4], goal.updatedAt[5], goal.updatedAt[6]).toISOString()
    };
};