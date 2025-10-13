import { supabase } from '@/lib/supabase/client';
import { Goal, CreateGoalParams, UpdateGoalParams, GoalStatus } from '@/types/goal';

export const goalApi = {
  /**
   * ゴール一覧取得
   * @param userId - ユーザーID
   * @param status - フィルタ用ステータス（オプション）
   */
  getGoals: async (userId: string, status?: GoalStatus): Promise<Goal[]> => {
    try {
      let query = supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Goal[];
    } catch (error) {
      console.error('ゴール一覧取得エラー:', error);
      throw error;
    }
  },

  /**
   * 特定のゴール取得
   * @param id - ゴールID

  */
  getGoalById: async (id: string): Promise<Goal> => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Goal;
    } catch (error) {
      console.error('ゴール取得エラー:', error);
      throw error;
    }
  },

  /**
   * ゴール作成
   * @param goalData - ゴール作成データ
   */
  createGoal: async (goalData: CreateGoalParams): Promise<Goal> => {
    try {
      // 現在のユーザー取得
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error('認証が必要です。ログインしてください。');
      }

      const { data, error } = await supabase
        .from('goals')
        .insert([
          {
            user_id: user.id,
            title: goalData.title,
            description: goalData.description || null,
            category: goalData.category || null,
            target_date: goalData.targetDate || null,
            parent_goal_id: goalData.parentGoalId || null,
            status: 'ACTIVE',
            progress: 0,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data as Goal;
    } catch (error) {
      console.error('ゴール作成エラー:', error);
      throw error;
    }
  },

  /**
   * ゴール更新
   * @param id - ゴールID
   * @param goalData - 更新データ
   */
  updateGoal: async (id: string, goalData: UpdateGoalParams): Promise<Goal> => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .update(goalData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Goal;
    } catch (error) {
      console.error('ゴール更新エラー:', error);
      throw error;
    }
  },

  /**
   * 進捗更新
   * @param id - ゴールID
   * @param progress - 進捗率 (0-100)
   */
  updateProgress: async (id: string, progress: number): Promise<Goal> => {
    try {
      // 進捗が100%になったらステータスをCOMPLETEDに変更
      const status: GoalStatus = progress >= 100 ? 'COMPLETED' : 'ACTIVE';

      const { data, error } = await supabase
        .from('goals')
        .update({ progress, status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Goal;
    } catch (error) {
      console.error('進捗更新エラー:', error);
      throw error;
    }
  },

  /**
   * ゴールアーカイブ
   * @param id - ゴールID
   */
  archiveGoal: async (id: string): Promise<Goal> => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .update({ status: 'ARCHIVED' })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Goal;
    } catch (error) {
      console.error('ゴールアーカイブエラー:', error);
      throw error;
    }
  },

  /**
   * ゴール削除（論理削除）
   * @param id - ゴールID
   */
  deleteGoal: async (id: string): Promise<void> => {
    try {
      // 論理削除: statusをDELETEDに変更
      const { error } = await supabase
        .from('goals')
        .update({ status: 'DELETED' })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('ゴール削除エラー:', error);
      throw error;
    }
  },

  /**
   * 物理削除（完全削除）
   * @param id - ゴールID
   */
  permanentDeleteGoal: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase.from('goals').delete().eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('ゴール物理削除エラー:', error);
      throw error;
    }
  },

  /**
   * サブゴール一覧取得
   * @param parentGoalId - 親ゴールID
   */
  getSubGoals: async (parentGoalId: string): Promise<Goal[]> => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('parent_goal_id', parentGoalId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Goal[];
    } catch (error) {
      console.error('サブゴール取得エラー:', error);
      throw error;
    }
  },

  /**
   * おすすめゴール取得（仮実装）
   * 実際には推薦アルゴリズムを実装
   */
  getRecommendedGoals: async (userId: string, limit: number = 5): Promise<Goal[]> => {
    try {
      // 仮実装: ステータスがACTIVEで進捗が低いゴールを推薦
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'ACTIVE')
        .order('progress', { ascending: true })
        .limit(limit);

      if (error) throw error;
      return data as Goal[];
    } catch (error) {
      console.error('おすすめゴール取得エラー:', error);
      throw error;
    }
  },
};