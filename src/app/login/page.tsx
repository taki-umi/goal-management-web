'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0); // 0: ログイン, 1: サインアップ

  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (tabValue === 0) {
        // ログイン
        await signIn(email, password);
      } else {
        // サインアップ
        await signUp(email, password, name);
      }
      router.push('/');
    } catch (err: unknown) {
      console.error('認証エラー:', err);
      setError(err instanceof Error ? err.message : '認証に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 450 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
              Goal Management
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
              目標管理アプリケーション
            </Typography>

            <Tabs
              value={tabValue}
              onChange={(_, newValue) => setTabValue(newValue)}
              variant="fullWidth"
              sx={{ mb: 3 }}
            >
              <Tab label="ログイン" />
              <Tab label="新規登録" />
            </Tabs>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              {tabValue === 1 && (
                <TextField
                  fullWidth
                  label="名前"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  margin="normal"
                  required
                  disabled={loading}
                />
              )}

              <TextField
                fullWidth
                label="メールアドレス"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                disabled={loading}
                autoComplete="email"
              />

              <TextField
                fullWidth
                label="パスワード"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                disabled={loading}
                autoComplete={tabValue === 0 ? 'current-password' : 'new-password'}
                helperText={tabValue === 1 ? '6文字以上' : ''}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? '処理中...' : tabValue === 0 ? 'ログイン' : '新規登録'}
              </Button>
            </form>

            {tabValue === 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" align="center">
                  テストアカウント
                </Typography>
                <Typography variant="caption" color="text.secondary" align="center" display="block">
                  Email: test@example.com
                </Typography>
                <Typography variant="caption" color="text.secondary" align="center" display="block">
                  Password: test1234
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}