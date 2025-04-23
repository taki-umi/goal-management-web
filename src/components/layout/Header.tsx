'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { usePathname } from 'next/navigation';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useState } from 'react';

export default function Header() {
    const { user, isAuthenticated, logout } = useAuth();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // モバイルメニューの切り替え
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // ログインページではヘッダーを表示しない
    if (pathname === '/login') {
        return null;
    }

    return (
        <header className="bg-background-light dark:bg-background-light shadow transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="text-xl font-bold text-primary-600 dark:text-primary-400">
                                Goal Achieve
                            </Link>
                        </div>
                        {isAuthenticated() && (
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <Link
                                    href="/"
                                    className={`${pathname === '/'
                                            ? 'border-primary-500 text-text-primary'
                                            : 'border-transparent text-text-secondary hover:border-gray-300 hover:text-text-primary'
                                        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
                                >
                                    ダッシュボード
                                </Link>
                                <Link
                                    href="/goals/create"
                                    className={`${pathname === '/goals/create'
                                            ? 'border-primary-500 text-text-primary'
                                            : 'border-transparent text-text-secondary hover:border-gray-300 hover:text-text-primary'
                                        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
                                >
                                    ゴール作成
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center">
                        {/* ダークモードトグル */}
                        <div className="mr-4">
                            <ThemeToggle />
                        </div>

                        {/* デスクトップ用ユーザーメニュー */}
                        <div className="hidden sm:ml-6 sm:flex sm:items-center">
                            {isAuthenticated() ? (
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm font-medium text-text-primary">
                                        {user?.username}
                                    </span>
                                    <button
                                        onClick={logout}
                                        className="btn-secondary"
                                    >
                                        ログアウト
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="btn-primary"
                                >
                                    ログイン
                                </Link>
                            )}
                        </div>

                        {/* モバイル用メニューボタン */}
                        <div className="flex items-center sm:hidden">
                            <button
                                onClick={toggleMenu}
                                className="inline-flex items-center justify-center p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-background-dark focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                                aria-expanded="false"
                            >
                                <span className="sr-only">メニューを開く</span>
                                {isMenuOpen ? (
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* モバイル用メニュー */}
            <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden transition-all duration-200 ease-in-out`}>
                <div className="pt-2 pb-3 space-y-1">
                    {isAuthenticated() && (
                        <>
                            <Link
                                href="/"
                                className={`${pathname === '/'
                                        ? 'bg-primary-50 dark:bg-primary-900 border-primary-500 text-primary-700 dark:text-primary-100'
                                        : 'border-transparent text-text-secondary hover:bg-background-dark hover:border-gray-300 hover:text-text-primary'
                                    } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                ダッシュボード
                            </Link>
                            <Link
                                href="/goals/create"
                                className={`${pathname === '/goals/create'
                                        ? 'bg-primary-50 dark:bg-primary-900 border-primary-500 text-primary-700 dark:text-primary-100'
                                        : 'border-transparent text-text-secondary hover:bg-background-dark hover:border-gray-300 hover:text-text-primary'
                                    } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                ゴール作成
                            </Link>
                        </>
                    )}
                </div>

                <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                    {isAuthenticated() ? (
                        <>
                            <div className="flex items-center px-4">
                                <div className="flex-shrink-0">
                                    <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center">
                                        <span className="text-primary-600 dark:text-primary-200 font-medium">
                                            {user?.username.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-text-primary">{user?.username}</div>
                                </div>
                            </div>
                            <div className="mt-3 space-y-1">
                                <button
                                    onClick={() => {
                                        logout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-base font-medium text-text-secondary hover:text-text-primary hover:bg-background-dark"
                                >
                                    ログアウト
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="px-4">
                            <Link
                                href="/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="block text-center w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                            >
                                ログイン
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}