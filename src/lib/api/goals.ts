import { Goal, GoalStatus, CreateGoalParams, UpdateGoalParams, UpdateProgressParams } from '@/types/goal';

// // ゴール関連のAPI機能
// export const goalApi = {
//     // ユーザーのゴール一覧を取得
//     getGoalsByUserId: async (userId: string): Promise<Goal[]> => {
//         try {
//             const response = await apiClient.get<Goal[]>(`/goals?userId=${userId}`);
//             return response.data.map(convertFromApiToGoal);
//         } catch (error) {
//             console.error('ゴール一覧取得エラー:', error);
//             throw error;
//         }
//     },

//     // ユーザーのゴール一覧をステータスでフィルタリング
//     getGoalsByUserIdAndStatus: async (userId: string, status: GoalStatus): Promise<Goal[]> => {
//         try {
//             const response = await apiClient.get<Goal[]>(`/goals?userId=${userId}&status=${status}`);
//             return response.data.map(convertFromApiToGoal);
//         } catch (error) {
//             console.error('ゴール一覧取得エラー:', error);
//             throw error;
//         }
//     },

//     // 特定のゴールを取得
//     getGoalById: async (id: string): Promise<Goal> => {
//         try {
//             const response = await apiClient.get<Goal>(`/goals/${id}`);
//             return convertFromApiToGoal(response.data);
//         } catch (error) {
//             console.error('ゴール取得エラー:', error);
//             throw error;
//         }
//     },

//     // 新規ゴールを作成
//     createGoal: async (goalData: CreateGoalParams): Promise<Goal> => {
//         try {
//             const response = await apiClient.post<Goal>('/goals', goalData);
//             return convertFromApiToGoal(response.data);
//         } catch (error) {
//             console.error('ゴール作成エラー:', error);
//             throw error;
//         }
//     },

//     // ゴールを更新
//     updateGoal: async (id: string, goalData: UpdateGoalParams): Promise<Goal> => {
//         try {
//             const response = await apiClient.put<Goal>(`/goals/${id}`, goalData);
//             return convertFromApiToGoal(response.data);
//         } catch (error) {
//             console.error('ゴール更新エラー:', error);
//             throw error;
//         }
//     },

//     // 進捗状況を更新
//     updateProgress: async (id: string, params: UpdateProgressParams): Promise<Goal> => {
//         try {
//             const response = await apiClient.patch<Goal>(`/goals/${id}/progress?progress=${params.progress}`);
//             return convertFromApiToGoal(response.data);
//         } catch (error) {
//             console.error('進捗更新エラー:', error);
//             throw error;
//         }
//     },

//     // ゴールをアーカイブ
//     archiveGoal: async (id: string): Promise<Goal> => {
//         try {
//             const response = await apiClient.patch<Goal>(`/goals/${id}/archive`);
//             return convertFromApiToGoal(response.data);
//         } catch (error) {
//             console.error('ゴールアーカイブエラー:', error);
//             throw error;
//         }
//     },

//     // ゴールを削除（論理削除）
//     deleteGoal: async (id: string): Promise<void> => {
//         try {
//             await apiClient.delete(`/goals/${id}`);
//         } catch (error) {
//             console.error('ゴール削除エラー:', error);
//             throw error;
//         }
//     },

//     // サブゴール一覧を取得
//     getSubGoals: async (parentGoalId: string): Promise<Goal[]> => {
//         try {
//             const response = await apiClient.get<Goal[]>(`/goals/parent/${parentGoalId}`);
//             return response.data.map(convertFromApiToGoal);
//         } catch (error) {
//             console.error('サブゴール一覧取得エラー:', error);
//             throw error;
//         }
//     },

//     // おすすめゴール一覧を取得
//     getRecommendedGoals: async (userId: string, limit: number = 5): Promise<Goal[]> => {
//         try {
//             const response = await apiClient.get<Goal[]>(`/goals/recommended?userId=${userId}&limit=${limit}`);
//             return response.data.map(convertFromApiToGoal);
//         } catch (error) {
//             console.error('おすすめゴール取得エラー:', error);
//             throw error;
//         }
//     },

//     // 期限が近いゴール一覧を取得
//     getUpcomingGoals: async (userId: string, daysAhead: number = 7): Promise<Goal[]> => {
//         try {
//             const response = await apiClient.get<Goal[]>(`/goals/upcoming?userId=${userId}&daysAhead=${daysAhead}`);
//             return response.data.map(convertFromApiToGoal);
//         } catch (error) {
//             console.error('期限が近いゴール取得エラー:', error);
//             throw error;
//         }
//     },
// };

// // APIレスポンスのデータをGoal型に変換
// const convertFromApiToGoal = (goal: any): Goal => {
//     return {
//         id: goal.id.value,
//         userId: goal.userId.value,
//         title: goal.title,
//         description: goal.description,
//         category: goal.category === null ? undefined : goal.category.value,
//         targetDate: goal.targetDate === null ? undefined : new Date(goal.targetDate[0], goal.targetDate[1] - 1, goal.targetDate[2]).toISOString(),
//         status: goal.status,
//         progress: goal.progress === null ? undefined : goal.progress.value,
//         parentGoalId: goal.parentGoalId === null ? undefined : goal.parentGoalId.value,
//         createdAt: new Date(goal.createdAt[0], goal.createdAt[1] - 1, goal.createdAt[2], goal.createdAt[3], goal.createdAt[4], goal.createdAt[5], goal.createdAt[6]).toISOString(),
//         updatedAt: new Date(goal.updatedAt[0], goal.updatedAt[1] - 1, goal.updatedAt[2], goal.updatedAt[3], goal.updatedAt[4], goal.updatedAt[5], goal.updatedAt[6]).toISOString()
//     };
// };

// --- モックデータ ---
const now = new Date();

const mockGoals: Goal[] = [
  {
    id: '1',
    userId: 'user1',
    title: 'Next.jsをマスターする',
    description: 'フロントエンドのスキルを向上させるため、Next.jsのApp Routerを完全に理解する。',
    category: '学習',
    targetDate: new Date(now.getFullYear(), now.getMonth() + 2, 1).toISOString(),
    status: 'ACTIVE',
    progress: 30,
    parentGoalId: undefined,
    createdAt: new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString(),
    updatedAt: now.toISOString(),
  },
  {
    id: '2',
    userId: 'user1',
    title: '週に3回ジムに行く',
    description: '健康維持と体力向上のため。',
    category: '健康',
    targetDate: new Date(now.getFullYear() + 1, 0, 1).toISOString(),
    status: 'ACTIVE',
    progress: 60,
    parentGoalId: undefined,
    createdAt: new Date(now.getFullYear(), 0, 10).toISOString(),
    updatedAt: now.toISOString(),
  },
  {
    id: '3',
    userId: 'user1',
    title: 'TypeScriptのチュートリアルを完了する',
    description: 'Next.jsプロジェクトのために。',
    category: '学習',
    targetDate: new Date(now.getFullYear(), now.getMonth(), 15).toISOString(),
    status: 'COMPLETED',
    progress: 100,
    parentGoalId: '1',
    createdAt: new Date(now.getFullYear(), now.getMonth() - 1, 5).toISOString(),
    updatedAt: new Date(now.getFullYear(), now.getMonth(), 10).toISOString(),
  },
  {
    id: '4',
    userId: 'user1',
    title: '新しいPCを購入する',
    description: '開発環境のアップグレード。',
    category: '自己投資',
    targetDate: undefined,
    status: 'ARCHIVED',
    progress: 100,
    parentGoalId: undefined,
    createdAt: new Date(now.getFullYear() - 1, 6, 20).toISOString(),
    updatedAt: new Date(now.getFullYear() - 1, 8, 1).toISOString(),
  },
  {
    id: '5',
    userId: 'user1',
    title: '状態管理ライブラリを調査する',
    description: 'Zustand, Jotai, Recoilなど',
    category: '学習',
    targetDate: new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString(),
    status: 'ACTIVE',
    progress: 10,
    parentGoalId: '1',
    createdAt: new Date(now.getFullYear(), now.getMonth(), 20).toISOString(),
    updatedAt: now.toISOString(),
  },
];

// --- モックAPI関数 ---

// 非同期処理をシミュレートするためのヘルパー
const simulateApiCall = <T>(data: T, delay = 500): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), delay));
};

export const goalApi = {
  getGoalsByUserId: async (userId: string): Promise<Goal[]> => {
    console.log(`[MOCK] getGoalsByUserId called for userId: ${userId}`);
    return simulateApiCall(mockGoals.filter(g => g.status !== 'DELETED'));
  },

  getGoalsByUserIdAndStatus: async (userId: string, status: GoalStatus): Promise<Goal[]> => {
    console.log(`[MOCK] getGoalsByUserIdAndStatus called for userId: ${userId}, status: ${status}`);
    return simulateApiCall(mockGoals.filter(g => g.status === status));
  },

  getGoalById: async (id: string): Promise<Goal> => {
    console.log(`[MOCK] getGoalById called for id: ${id}`);
    const goal = mockGoals.find(g => g.id === id);
    if (goal) {
      return simulateApiCall(goal);
    }
    return Promise.reject(new Error('Goal not found'));
  },

  createGoal: async (goalData: CreateGoalParams): Promise<Goal> => {
    console.log(`[MOCK] createGoal called with:`, goalData);
    const newGoal: Goal = {
      id: String(mockGoals.length + 1),
      userId: goalData.userId,
      title: goalData.title,
      description: goalData.description,
      category: goalData.category,
      targetDate: goalData.targetDate,
      status: 'ACTIVE',
      progress: 0,
      parentGoalId: goalData.parentGoalId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockGoals.push(newGoal);
    return simulateApiCall(newGoal);
  },

  updateGoal: async (id: string, goalData: UpdateGoalParams): Promise<Goal> => {
    console.log(`[MOCK] updateGoal called for id: ${id} with:`, goalData);
    const goalIndex = mockGoals.findIndex(g => g.id === id);
    if (goalIndex !== -1) {
      const updatedGoal = { ...mockGoals[goalIndex], ...goalData, updatedAt: new Date().toISOString() };
      mockGoals[goalIndex] = updatedGoal;
      return simulateApiCall(updatedGoal);
    }
    return Promise.reject(new Error('Goal not found'));
  },

  updateProgress: async (id: string, params: UpdateProgressParams): Promise<Goal> => {
    console.log(`[MOCK] updateProgress called for id: ${id} with:`, params);
    const goalIndex = mockGoals.findIndex(g => g.id === id);
    if (goalIndex !== -1) {
      mockGoals[goalIndex].progress = params.progress;
      mockGoals[goalIndex].updatedAt = new Date().toISOString();
      if (params.progress === 100) {
        mockGoals[goalIndex].status = 'COMPLETED';
      }
      return simulateApiCall(mockGoals[goalIndex]);
    }
    return Promise.reject(new Error('Goal not found'));
  },

  archiveGoal: async (id: string): Promise<Goal> => {
    console.log(`[MOCK] archiveGoal called for id: ${id}`);
    const goalIndex = mockGoals.findIndex(g => g.id === id);
    if (goalIndex !== -1) {
      mockGoals[goalIndex].status = 'ARCHIVED';
      mockGoals[goalIndex].updatedAt = new Date().toISOString();
      return simulateApiCall(mockGoals[goalIndex]);
    }
    return Promise.reject(new Error('Goal not found'));
  },

  deleteGoal: async (id: string): Promise<void> => {
    console.log(`[MOCK] deleteGoal called for id: ${id}`);
    const goalIndex = mockGoals.findIndex(g => g.id === id);
    if (goalIndex !== -1) {
      mockGoals[goalIndex].status = 'DELETED';
      return simulateApiCall(undefined);
    }
    return Promise.reject(new Error('Goal not found'));
  },

  getSubGoals: async (parentGoalId: string): Promise<Goal[]> => {
    console.log(`[MOCK] getSubGoals called for parentGoalId: ${parentGoalId}`);
    return simulateApiCall(mockGoals.filter(g => g.parentGoalId === parentGoalId));
  },

  getRecommendedGoals: async (userId: string, limit: number = 5): Promise<Goal[]> => {
    console.log(`[MOCK] getRecommendedGoals called for userId: ${userId}`);
    // 簡単なロジック：未完了のゴールをいくつか返す
    const recommended = mockGoals.filter(g => g.status === 'ACTIVE').slice(0, limit);
    return simulateApiCall(recommended);
  },

  getUpcomingGoals: async (userId: string, daysAhead: number = 7): Promise<Goal[]> => {
    console.log(`[MOCK] getUpcomingGoals called for userId: ${userId}`);
    const upcomingDate = new Date();
    upcomingDate.setDate(upcomingDate.getDate() + daysAhead);
    const upcoming = mockGoals.filter(g =>
      g.status === 'ACTIVE' &&
      g.targetDate &&
      new Date(g.targetDate) <= upcomingDate
    );
    return simulateApiCall(upcoming);
  },
};