'use client';

interface ProgressBarProps {
    progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
    // 進捗に応じた色を決定
    const getProgressColor = () => {
        if (progress < 30) return 'bg-red-500';
        if (progress < 70) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
                className={`h-2.5 rounded-full ${getProgressColor()}`}
                style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
        </div>
    );
}