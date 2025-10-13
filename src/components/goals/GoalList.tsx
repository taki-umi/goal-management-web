'use client';

import { Goal, GoalStatus } from '@/types/goal';
import GoalCard from './GoalCard';
import React, { useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    SelectChangeEvent
} from '@mui/material';

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

    const handleStatusChange = (event: SelectChangeEvent<GoalStatus | 'ALL'>) => {
        setStatusFilter(event.target.value as GoalStatus | 'ALL');
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h2" fontWeight="bold">
                    {title}
                </Typography>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel id="status-filter-label">ステータス</InputLabel>
                    <Select
                        labelId="status-filter-label"
                        id="status-filter"
                        value={statusFilter}
                        label="ステータス"
                        onChange={handleStatusChange}
                    >
                        {statusOptions.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {filteredGoals.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
                    <Typography color="text.secondary">表示するゴールがありません</Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {filteredGoals.map(goal => (
                        <Grid key={goal.id} size={{ xs: 12, sm: 6, md: 4 }}>
                            <GoalCard goal={goal} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}
