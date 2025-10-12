'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { Goal, UpdateGoalParams } from '@/types/goal';
import { goalApi } from '@/lib/api/goals';
import ProgressBar from '@/components/goals/ProgressBar';
import GoalList from '@/components/goals/GoalList';
import { formatDate } from '@/lib/utils';
import {
    Container,
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    TextField,
    Select,
    MenuItem,
    CircularProgress,
    Alert,
    Link as MuiLink,
    Chip,
    Slider,
    FormControl,
    InputLabel,
    SelectChangeEvent,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';


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

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }

        const fetchGoalDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                const goalData = await goalApi.getGoalById(goalId);
                setGoal(goalData);
                setProgressValue(goalData.progress);
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

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedGoal(prev => ({ ...prev, [name]: value }));
    };

    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        setEditedGoal(prev => ({ ...prev, status: event.target.value }));
    };


    const toggleEditMode = () => {
        if (isEditing) {
            setIsEditing(false);
            setEditedGoal({});
        } else {
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

    const handleUpdateGoal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!goal) return;
        try {
            setLoading(true);
            setError(null);
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

    const handleUpdateProgress = async () => {
        if (!goal) return;
        try {
            setIsUpdatingProgress(true);
            setError(null);
            const updatedGoal = await goalApi.updateProgress(goalId, { progress: progressValue });
            setGoal(updatedGoal);
        } catch (err) {
            console.error('進捗更新エラー:', err);
            setError('進捗の更新中にエラーが発生しました。');
        } finally {
            setIsUpdatingProgress(false);
        }
    };

    const handleArchiveGoal = async () => {
        if (!goal) return;
        try {
            setLoading(true);
            setError(null);
            const archivedGoal = await goalApi.archiveGoal(goalId);
            setGoal(archivedGoal);
        } catch (err) {
            console.error('ゴールアーカイブエラー:', err);
            setError('ゴールのアーカイブ中にエラーが発生しました。');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteGoal = async () => {
        if (!goal) return;
        try {
            setLoading(true);
            setError(null);
            await goalApi.deleteGoal(goalId);
            router.push('/');
        } catch (err) {
            console.error('ゴール削除エラー:', err);
            setError('ゴールの削除中にエラーが発生しました。');
        } finally {
            setLoading(false);
        }
    };

    const getStatusChipColor = (status: string): "success" | "primary" | "default" | "error" => {
        switch (status) {
            case 'ACTIVE': return 'success';
            case 'COMPLETED': return 'primary';
            case 'ARCHIVED': return 'default';
            case 'DELETED': return 'error';
            default: return 'default';
        }
    };

    if (!isAuthenticated()) {
        return null;
    }

    if (loading && !goal) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>ゴール情報を読み込み中...</Typography>
                </Box>
            </Container>
        );
    }

    if (error && !goal) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (!goal) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="info">ゴールが見つかりませんでした。</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Box sx={{ mb: 3 }}>
                <MuiLink component={Link} href="/" underline="hover" sx={{ display: 'flex', alignItems: 'center' }}>
                    <ArrowBackIcon sx={{ mr: 0.5 }} />
                    ダッシュボードに戻る
                </MuiLink>
            </Box>

            <Paper elevation={3} sx={{ overflow: 'hidden' }}>
                <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            {goal.title}
                        </Typography>
                        <Chip label={goal.status} color={getStatusChipColor(goal.status)} size="small" />
                    </Box>
                </Box>

                {isEditing ? (
                    <Box component="form" onSubmit={handleUpdateGoal} sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    label="タイトル"
                                    name="title"
                                    value={editedGoal.title || ''}
                                    onChange={handleEditChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="説明"
                                    name="description"
                                    value={editedGoal.description || ''}
                                    onChange={handleEditChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="カテゴリー"
                                    name="category"
                                    value={editedGoal.category || ''}
                                    onChange={handleEditChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="目標日"
                                    name="targetDate"
                                    value={editedGoal.targetDate || ''}
                                    onChange={handleEditChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>ステータス</InputLabel>
                                    <Select
                                        name="status"
                                        value={editedGoal.status || goal.status}
                                        label="ステータス"
                                        onChange={handleStatusChange}
                                    >
                                        <MenuItem value="ACTIVE">進行中</MenuItem>
                                        <MenuItem value="COMPLETED">完了</MenuItem>
                                        <MenuItem value="ARCHIVED">アーカイブ済み</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                <Button variant="outlined" onClick={toggleEditMode}>キャンセル</Button>
                                <Button type="submit" variant="contained" disabled={loading}>
                                    {loading ? <CircularProgress size={24} /> : '更新する'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                ) : (
                    <>
                        <Box sx={{ p: 3 }}>
                            {goal.description && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" color="text.secondary">説明</Typography>
                                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{goal.description}</Typography>
                                </Box>
                            )}

                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                {goal.category && (
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">カテゴリー</Typography>
                                        <Typography variant="body1">{goal.category}</Typography>
                                    </Grid>
                                )}
                                {goal.targetDate && (
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">目標日</Typography>
                                        <Typography variant="body1">{formatDate(goal.targetDate)}</Typography>
                                    </Grid>
                                )}
                                {goal.parentGoalId && (
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">親ゴール</Typography>
                                        <MuiLink component={Link} href={`/goals/${goal.parentGoalId}`} underline="hover">
                                            親ゴールを表示
                                        </MuiLink>
                                    </Grid>
                                )}
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">作成日</Typography>
                                    <Typography variant="body1">{formatDate(goal.createdAt)}</Typography>
                                </Grid>
                            </Grid>

                            <Box sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="subtitle2" color="text.secondary">進捗状況</Typography>
                                    <Typography variant="body2" color="text.secondary">{goal.progress}%</Typography>
                                </Box>
                                <ProgressBar progress={goal.progress} />
                            </Box>

                            <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'action.hover' }}>
                                <Typography variant="subtitle2" sx={{ mb: 2 }}>進捗を更新</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Slider
                                        value={progressValue}
                                        onChange={(_, newValue) => setProgressValue(newValue as number)}
                                        aria-labelledby="progress-slider"
                                        valueLabelDisplay="auto"
                                        step={5}
                                        marks
                                        min={0}
                                        max={100}
                                        sx={{ flexGrow: 1 }}
                                    />
                                    <Typography variant="body1" sx={{ minWidth: '40px', textAlign: 'right' }}>{progressValue}%</Typography>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={handleUpdateProgress}
                                        disabled={isUpdatingProgress || goal.progress === progressValue}
                                    >
                                        {isUpdatingProgress ? <CircularProgress size={20} /> : '更新'}
                                    </Button>
                                </Box>
                            </Paper>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                                <Button variant="outlined" onClick={toggleEditMode}>編集</Button>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        onClick={handleArchiveGoal}
                                        disabled={goal.status === 'ARCHIVED'}
                                    >
                                        アーカイブ
                                    </Button>
                                    {deleteConfirmation ? (
                                        <>
                                            <Typography sx={{ alignSelf: 'center', mr: 1 }}>本当に削除しますか？</Typography>
                                            <Button variant="outlined" size="small" onClick={() => setDeleteConfirmation(false)}>キャンセル</Button>
                                            <Button variant="contained" color="error" size="small" onClick={handleDeleteGoal}>削除する</Button>
                                        </>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => setDeleteConfirmation(true)}
                                        >
                                            削除
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    </>
                )}
            </Paper>

            {subGoals.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <GoalList goals={subGoals} title="サブゴール" />
                </Box>
            )}

            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button
                    component={Link}
                    href={`/goals/create?parentGoalId=${goalId}`}
                    variant="contained"
                >
                    サブゴールを追加
                </Button>
            </Box>
        </Container>
    );
}
