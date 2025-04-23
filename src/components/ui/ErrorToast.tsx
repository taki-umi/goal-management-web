'use client';

import { useEffect, useState, useCallback } from 'react';
import { ErrorToast as ErrorToastType } from '@/lib/errorUtils';

interface ErrorToastProps {
    toast: ErrorToastType | null;
    onClose: () => void;
}

export default function ErrorToast({ toast, onClose }: ErrorToastProps) {
    const [isVisible, setIsVisible] = useState(false);

    // トーストを表示
    useEffect(() => {
        if (toast) {
            setIsVisible(true);

            // 指定時間後に自動で閉じる
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(onClose, 300); // フェードアウト後にonClose実行
            }, toast.duration || 5000);

            return () => clearTimeout(timer);
        }
    }, [toast, onClose]);

    // トーストを手動で閉じる
    const handleClose = useCallback(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // フェードアウト後にonClose実行
    }, [onClose]);

    if (!toast) return null;

    // トーストの種類に応じたスタイルを決定
    const getToastStyles = () => {
        switch (toast.type) {
            case 'error':
                return 'bg-red-500 text-white';
            case 'warning':
                return 'bg-yellow-500 text-white';
            case 'success':
                return 'bg-green-500 text-white';
            case 'info':
                return 'bg-blue-500 text-white';
            default:
                return 'bg-gray-700 text-white';
        }
    };

    return (
        <div
            className={`fixed bottom-4 right-4 z-50 max-w-md transform transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
        >
            <div className={`rounded-lg shadow-lg p-4 flex items-start ${getToastStyles()}`}>
                <div className="flex-1">
                    <p className="font-medium">{toast.message}</p>
                </div>
                <button
                    onClick={handleClose}
                    className="ml-4 text-white hover:text-gray-200 focus:outline-none"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

// エラートースト管理用のコンテキストを作成するユーティリティ
export function useErrorToast() {
    const [toast, setToast] = useState<ErrorToastType | null>(null);

    const showToast = (newToast: ErrorToastType) => {
        setToast(newToast);
    };

    const hideToast = () => {
        setToast(null);
    };

    return { toast, showToast, hideToast };
}