'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { goalApi } from '@/lib/api/goals';
import { CreateGoalParams } from '@/types/goal';
import GoalForm from '@/components/goals/GoalForm';
import Header from '@/components/layout/Header';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';

export default function CreateGoalPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const router = useRouter();

    const handleSubmit = async (goalData: CreateGoalParams) => {
        try {
            setIsLoading(true);
            setError(null);
            await goalApi.createGoal(goalData);
            router.push('/'); // 成功したらダッシュボードにリダイレクト
        } catch (err) {
            console.error('ゴール作成エラー:', err);
            setError('ゴールの作成に失敗しました。');
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        // ユーザーがいない場合はログインページにリダイレクトするなどの処理も考えられる
        return (
            <Box>
                <Header />
                <Container maxWidth="sm" sx={{ mt: 4 }}>
                    <Typography variant="h5" align="center">アクセスするにはログインが必要です。</Typography>
                </Container>
            </Box>
        );
    }

    return (
        <Box>
            <Header />
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    新しいゴールを作成
                </Typography>
                <Card sx={{ mt: 3 }}>
                    <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                        <GoalForm
                            userId={user.id}
                            onSubmit={handleSubmit}
                            isLoading={isLoading}
                            error={error}
                        />
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}
