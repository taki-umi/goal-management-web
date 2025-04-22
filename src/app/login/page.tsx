'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    // すでに認証されている場合はダッシュボードにリダイレクト
    useEffect(() => {
        if (isAuthenticated()) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h1 className="text-3xl font-extrabold text-center text-indigo-600">
                    Goal Achieve
                </h1>
                <h2 className="mt-3 text-center text-xl text-gray-600">
                    目標達成管理アプリケーション
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <LoginForm />
            </div>
        </div>
    );
}