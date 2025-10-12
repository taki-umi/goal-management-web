'use client';

import LoginForm from '@/components/auth/LoginForm';
import Header from '@/components/layout/Header';
import Box from '@mui/material/Box';

export default function LoginPage() {
  return (
    <Box>
      <Header /> 
      <LoginForm />
    </Box>
  );
}
