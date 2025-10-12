'use client';

import { Goal, GoalStatus } from '@/types/goal';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import ProgressBar from './ProgressBar';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

interface GoalCardProps {
    goal: Goal;
}

export default function GoalCard({ goal }: GoalCardProps) {

    const getStatusChipColor = (status: GoalStatus): 'success' | 'primary' | 'default' | 'error' => {
        switch (status) {
            case 'COMPLETED':
                return 'success';
            case 'ACTIVE':
                return 'primary';
            case 'ARCHIVED':
                return 'default';
            case 'DELETED':
                return 'error';
            default:
                return 'default';
        }
    };

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1, flexGrow: 1, pr: 1 }}>
                        {goal.title}
                    </Typography>
                    <Chip label={goal.status} color={getStatusChipColor(goal.status)} size="small" />
                </Box>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2, // ← camelCaseで記述
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}
                >
                    {goal.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                    <ProgressBar progress={goal.progress} />
                </Box>

                {goal.targetDate && (
                    <Typography variant="caption" color="text.secondary" display="block">
                        目標日: {formatDate(goal.targetDate)}
                    </Typography>
                )}
                {goal.category && (
                    <Typography variant="caption" color="text.secondary" display="block">
                        カテゴリー: {goal.category}
                    </Typography>
                )}
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
                <Button component={Link} href={`/goals/${goal.id}`} size="small">詳細を見る</Button>
            </CardActions>
        </Card>
    );
}
