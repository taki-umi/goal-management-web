'use client';

import { useState, useEffect } from 'react';
import { goalApi } from '@/lib/api/goals';
import { Goal, GoalStatus } from '@/types/goal';
import { useAuth } from '@/lib/auth';
import GoalCard from '@/components/goals/GoalCard';
import Header from '@/components/layout/Header';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export default function DashboardPage() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<GoalStatus>('ACTIVE');
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            const fetchGoals = async () => {
                try {
                    setIsLoading(true);
                    setError(null);
                    const fetchedGoals = await goalApi.getGoalsByUserIdAndStatus(user.id, statusFilter);
                    setGoals(fetchedGoals);
                } catch (err) {
                    setError('ゴールの取得に失敗しました。');
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchGoals();
        }
    }, [user, statusFilter]);

    const handleStatusChange = (event: React.SyntheticEvent, newValue: GoalStatus) => {
        setStatusFilter(newValue);
    };

    return (
        <Box>
            <Header />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    ダッシュボード
                </Typography>

                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs value={statusFilter} onChange={handleStatusChange} aria-label="goal status filter">
                        <Tab label="進行中" value="ACTIVE" />
                        <Tab label="完了" value="COMPLETED" />
                        <Tab label="アーカイブ" value="ARCHIVED" />
                    </Tabs>
                </Box>

                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
                ) : (
                    <Grid container spacing={3}>
                        {goals.length > 0 ? (
                            goals.map((goal) => (
                                <Grid key={goal.id} size={{ xs: 12, sm: 6, md: 4 }}>
                                    <GoalCard goal={goal} />
                                </Grid>
                            ))
                        ) : (
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 8 }}>
                                    このステータスのゴールはありません。
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                )}
            </Container>
        </Box>
    );
}
