'use client';

import { useState, useEffect } from 'react';

export default function ThemeToggle() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    // 初期化時に現在のテーマを取得
    useEffect(() => {
        // ローカルストレージから設定を取得
        const savedTheme = localStorage.getItem('theme');

        // システム設定を確認
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        // 設定に基づいてダークモードを設定
        const shouldUseDarkMode = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);

        setIsDarkMode(shouldUseDarkMode);

        if (shouldUseDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    // テーマの切り替え
    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);

        if (!isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="rounded-full p-1 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label={isDarkMode ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
        >
            {isDarkMode ? (
                // 太陽アイコン（ライトモードへの切り替え）
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ) : (
                // 月アイコン（ダークモードへの切り替え）
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            )}
        </button>
    );
}