'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { CreateGoalParams } from '@/types/goal';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface GoalFormProps {
    userId: string;
    onSubmit: (goalData: CreateGoalParams) => Promise<void>;
    isLoading: boolean;
    error: string | null;
}

export default function GoalForm({ userId, onSubmit, isLoading, error }: GoalFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [parentGoalId, setParentGoalId] = useState('');

    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            return;
        }

        const goalData: CreateGoalParams = {
            userId,
            title: title.trim(),
            description: description.trim() || undefined,
            category: category.trim() || undefined,
            targetDate: targetDate || undefined,
            parentGoalId: parentGoalId.trim() || undefined
        };

        await onSubmit(goalData);
    };

    const handleCancel = () => {
        router.push('/');
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Stack spacing={3}>
                {error && (
                    <Alert severity="error">{error}</Alert>
                )}

                <TextField
                    required
                    fullWidth
                    id="title"
                    label="タイトル"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="ゴールのタイトル"
                />

                <TextField
                    fullWidth
                    id="description"
                    label="説明"
                    name="description"
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="ゴールの詳細な説明"
                />

                <TextField
                    fullWidth
                    id="category"
                    label="カテゴリー"
                    name="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="例: 仕事, 学習, 健康"
                />

                <TextField
                    fullWidth
                    id="targetDate"
                    label="目標日"
                    name="targetDate"
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

                <Box>
                    <TextField
                        fullWidth
                        id="parentGoalId"
                        label="親ゴールID"
                        name="parentGoalId"
                        value={parentGoalId}
                        onChange={(e) => setParentGoalId(e.target.value)}
                        placeholder="親ゴールのID (サブゴールとして作成する場合)"
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        ※サブゴールとして作成する場合は親ゴールのIDを入力してください
                    </Typography>
                </Box>

                <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ pt: 2 }}>
                    <Button variant="outlined" onClick={handleCancel} disabled={isLoading}>
                        キャンセル
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'ゴールを作成'}
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}
